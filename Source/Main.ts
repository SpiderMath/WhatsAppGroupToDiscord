import { config } from 'dotenv';
config();

import Eris from 'eris';
import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { MessageEmbed, Preset, presets } from './MessageEmbed';
import sharp from 'sharp';
import { writeFileSync } from 'fs';

const bot = Eris(process.env.DISCORD_TOKEN as string, {
	intents: [
		'guilds',
	],
});
const colourMap: Map<string, Preset> = new Map();

function getRandomElement(arr: any[]) {
	return arr[Math.floor(arr.length * Math.random())];
}

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`);
	const postChannel = bot.getChannel(process.env.DISCORD_CHANNEL_ID as string) as Eris.TextChannel;

	const client = new Client({});

	client.on('qr', (qr) => qrcode.generate(qr, { small: true }));

	client.on('ready', () => console.log('Connected to WhatsApp successfully!'));

	client.on('message_create', async (message) => {
		const chat = await message.getChat();

		if(chat.id.server !== 'g.us' || chat.id.user !== (process.env.GROUP_ID as string)) return;

		const contact = await message.getContact();

		if(!colourMap.has(contact.id._serialized)) colourMap.set(contact.id._serialized, getRandomElement(Object.keys(presets)));
		const colour: Preset = colourMap.get(contact.id._serialized) as Preset;

		const baseEmbed = new MessageEmbed()
			.setColour(colour)
			.setTimestamp()
			.setAuthor({
				name: `${contact.pushname} (+${await contact.getCountryCode()} ${contact.number.slice(2)})`,
				icon_url: await contact.getProfilePicUrl(),
			});

		// Display the message contents as required
		if(message.body.length > 0) baseEmbed.setDescription(message.body);
		if(message.isForwarded) baseEmbed.setFooter({ text: 'Forwarded Message' });

		// Sending the embed off
		postChannel.createMessage({
			embeds: [ baseEmbed.data ],
		});
	});

	client.initialize();
});

bot.on('error', console.log);
bot.connect();
