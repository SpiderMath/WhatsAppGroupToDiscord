import {
	EmbedFooterOptions,
	EmbedAuthorOptions,
	EmbedField,
	EmbedImageOptions,
} from "eris";

// Types and interfaces
type RGBTuple = [red: number, green: number, blue: number];
type Preset = 'AQUA' | 'GREEN' | 'BLUE' | 'YELLOW' | 'PURPLE' | 'LUMINOUS_VIVID_PINK' | 'GOLD' | 'ORANGE' | 'RED' | 'GREY' | 'NAVY' | 'DARK_AQUA' | 'DARK_GREEN' | 'DARK_BLUE' | 'DARK_PURPLE' | 'DARK_VIVID_PINK' | 'DARK_GOLD' | 'DARK_ORANGE' | 'DARK_RED' | 'DARK_GREY' | 'DARKER_GREY' | 'LIGHT_GREY' | 'DARK_NAVY' | 'BLURPLE' | 'GREYPLE' | 'DARK_BUT_NOT_BLACK' | 'NOT_QUITE_BLACK';
type HexCode = `#${string}`;

// Constants
const presets = {
	WHITE: 0xffffff,
	AQUA: 0x1abc9c,
	GREEN: 0x2ecc71,
	BLUE: 0x3498db,
	YELLOW: 0xffff00,
	PURPLE: 0x9b59b6,
	LUMINOUS_VIVID_PINK: 0xe91e63,
	GOLD: 0xf1c40f,
	ORANGE: 0xe67e22,
	RED: 0xe74c3c,
	GREY: 0x95a5a6,
	NAVY: 0x34495e,
	DARK_AQUA: 0x11806a,
	DARK_GREEN: 0x1f8b4c,
	DARK_BLUE: 0x206694,
	DARK_PURPLE: 0x71368a,
	DARK_VIVID_PINK: 0xad1457,
	DARK_GOLD: 0xc27c0e,
	DARK_ORANGE: 0xa84300,
	DARK_RED: 0x992d22,
	DARK_GREY: 0x979c9f,
	DARKER_GREY: 0x7f8c8d,
	LIGHT_GREY: 0xbcc0c0,
	DARK_NAVY: 0x2c3e50,
	BLURPLE: 0x7289da,
	GREYPLE: 0x99aab5,
	DARK_BUT_NOT_BLACK: 0x2c2f33,
	NOT_QUITE_BLACK: 0x23272a,
};

// Message Embed class
export class MessageEmbed {
	public readonly data: any = {};

	public setAuthor(authorDetails: EmbedAuthorOptions) {
		this.data.author = authorDetails;

		return this;
	}

	public setColour(colour: number | RGBTuple | Preset | HexCode) {
		// if the colour provided is a tuple of RGB values
		if(Array.isArray(colour)) {
			const [red, green, blue] = colour;
			if(red > 255 || green > 255 || blue > 255 || red < 0 || green < 0 || blue < 0) throw new Error('RGB value out of bounds');
			this.data.color = (red << 16) + (green << 8) + blue;
		}

		// if the colour provided was an integer
		else if(typeof colour === 'number') {
			if(colour < 0 || colour > 0xffffff) throw new Error('Colour value out of bounds');
			this.data.color = colour;
		}

		// if the colour provided was one of the Presets
		// @ts-ignore
		else if(Object.keys(presets).includes(colour as string)) this.data.color = presets[colour];

		// if a HEX CODE was passed in
		else if((colour as string).startsWith('#')) this.data.color = parseInt((colour as string).replace('#', ''), 16);

		return this;
	}

	public setTimestamp(timestamp: number | Date | null = Date.now()) {
		this.data.timestamp = timestamp ? new Date(timestamp).toISOString() : null;

		return this;
	}

	public setTitle(title: string) {
		this.data.title = title;

		return this;
	}

	public setURL(url: string) {
		this.data.url = url;

		return this;
	}

	public addField(field: EmbedField) {
		if(!this.data.fields) this.data.fields = [];
		this.data.fields.push(field);

		return this;
	}

	public setDescription(description: string) {
		this.data.description = description;

		return this;
	}

	public setThumbnail(url: string) {
		this.data.thumbnail = { url };

		return this;
	}

	public setFooter(footerData: EmbedFooterOptions) {
		this.data.footer = footerData;

		return this;
	}

	public setImage(image: EmbedImageOptions) {
		this.data.image = image;

		return this;
	}
}

export { presets, Preset };