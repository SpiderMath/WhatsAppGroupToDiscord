// Registering the environment variables
import { config } from 'dotenv';
config();

// Importing required libraries
import Eris from 'eris';
import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { MessageEmbed, Preset, presets } from './MessageEmbed';
import { getRandomElement } from './Utils';

// Constants
const bot = Eris(process.env.DISCORD_TOKEN as string, {
	intents: [
		'guilds',
	],
});
// Stores the colour allotted to a particular user in the group
// trying to emulate how a particular user has a random colour throughout the chat
// in a WhatsApp group
const colourMap: Map<string, Preset> = new Map();

// Discord/WhatsApp client code
bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`);
	const postChannel = bot.getChannel(process.env.DISCORD_CHANNEL_ID as string) as Eris.TextChannel;

	// WhatsApp client stuff
	const client = new Client({});

	client.on('qr', (qr) => qrcode.generate(qr, { small: true }));
	client.on('ready', () => console.log('Connected to WhatsApp successfully!'));

	client.on('message_create', async (message) => {
		const chat = await message.getChat();

		if(chat.id.server !== 'g.us' || chat.id.user !== (process.env.GROUP_ID as string)) return;

		const contact = await message.getContact();

		if(!colourMap.has(contact.id._serialized)) colourMap.set(contact.id._serialized, getRandomElement(Object.keys(presets)));

		const baseEmbed = new MessageEmbed()
			.setColour(colourMap.get(contact.id._serialized) as Preset)
			.setTimestamp()
			.setAuthor({
				name: `${contact.pushname} (+${await contact.getCountryCode()} ${contact.number.slice(2)})`,
				icon_url: await contact.getProfilePicUrl(),
			});

		// Display the message contents as required
		if(message.body.length > 0) baseEmbed.setDescription(message.body);
		if(message.isForwarded) baseEmbed.setFooter({ text: '𝘍𝘰𝘳𝘸𝘢𝘳𝘥𝘦𝘥 𝘔𝘦𝘴𝘴𝘢𝘨𝘦' });

		const media = await message.downloadMedia()
			.catch(err => null);
		let bufSize: number = Number.MAX_SAFE_INTEGER, fName: string = '', buf: Buffer = Buffer.from('');

		if(media) {
			buf = Buffer.from(media.data, 'base64');
			bufSize = Buffer.byteLength(buf) / (1024 * 1024);
			fName = media.filename ?? `unnamed.${media.mimetype.split('/')[1]}`;

			if(bufSize > 8) baseEmbed.addField({
				name: 'Attachments', 
				value: `*Has an attachment **${fName}** larger than 8MB*`,
			});
		}

		// Sending the embed off
		await postChannel.createMessage({
			embeds: [ baseEmbed.data ],
		});

		if(bufSize <= 8) await postChannel.createMessage({}, {
			name: fName,
			file: buf,
		}).catch(err => console.log(`----- Error (time: ${new Date().toUTCString()}): ${err} \n\n${message}`));
	});

	client.initialize();
});

bot.on('error', console.log);
bot.connect();
