import { config } from 'dotenv';
config();

import Eris from 'eris';
import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

const bot = Eris(process.env.DISCORD_TOKEN as string, {
	intents: [
		'guilds',
	],
});

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`);
	const postChannel = bot.getChannel(process.env.DISCORD_CHANNEL_ID as string) as Eris.TextChannel;

	const client = new Client({});

	client.on('qr', (qr) => qrcode.generate(qr, { small: true }));

	client.on('ready', () => console.log('Connected to WhatsApp successfully!'));

	client.on('message_create', async (message) => {
		postChannel.createMessage({
			content: message.body !== '' ? message.body : 'No text',
		});
	});

	client.initialize();
});

bot.on('error', console.log);
bot.connect();
