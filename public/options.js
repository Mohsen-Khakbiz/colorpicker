let custom = {};

const basicOpts = {
	type: "default", // default,circle,ring,mini,none
	color: "--e-global-color-secondary",
	format: "hex", // hex,rgb,hsl
	// outputFormat: 'rgb',
	// paletteWidth: 200,
	// paletteHeight: 200,
	// paletteThickness: undefined,
	swatchTitle: undefined,
	swatchColors: [ "--e-global-color-primary", "--e-global-color-secondary", "--e-global-color-ca88ef" ],
	onInit: ( self ) => {
		custom = {
			$color: document.querySelector( "#colorSample > i" ),
			$code: document.querySelector( "#colorSample > em" ),
		};
		custom.$color.style.setProperty( "--color", self.getColor() );
		custom.$code.innerText = self.getColor();
	},
	onChange: ( color ) => {
		custom.$color.style.setProperty( "--color", color );
		custom.$code.innerText = color;
	},
	onChanged: ( color ) => {
		custom.$color.style.setProperty( "--color", color );
		custom.$code.innerText = color;
	},
	onChangeFormat: ( format ) => {
		// console.log('user onChangeFormat()', format);
	},
	onDestroy: () => {
		custom = {};
	},
};

const gradientOpts = {
	// gradient: "linear-gradient(to right, red 0%, green 100%)",
	colorpicker: {
		color: '--e-global-color-secondary',
		swatchColors: [ "--e-global-color-primary", "--e-global-color-secondary", "--e-global-color-ca88ef" ],
	},
	onInit: ( self ) => {
		custom = {
			$color: document.querySelector( "#gradientSample > i" ),
			$code: document.querySelector( "#gradientSample > em" ),
		};
	},
	onChange: ( gradient ) => {
		custom.$color.style.setProperty( "--color", gradient );
		custom.$code.textContent = gradient;
	},
};

export default {
	// basic
	basic: {
		...basicOpts,
	},
	// gradient picker
	gradientPicker: {
		...gradientOpts,
	},
	// themes
	themes: {
		default: {
			type: "default",
			color: "#44D7B6C4",
		},
		circle: {
			type: "circle",
			color: "#44D7B6C4",
		},
		ring: {
			type: "ring",
			color: "#44D7B6C4",
		},
		mini: {
			type: "mini",
			color: "#44D7B6C4",
		},
		none: {
			type: "none",
			swatchTitle: "Color palette",
			swatchColors: [
				"#E02020",
				"#FA6400",
				"#F7B500",
				"#6DD400",
				"#44D7B6",
				"#32C5FF",
				"#0091FF",
				"#6236FF",
				"#B620E0",
				"#6D7278",
				"rgba(0,0,0,.1)",
				"rgba(0,0,0,.25)",
				"rgba(0,0,0,.5)",
				"rgba(0,0,0,.85)",
				"#ffffff",
			],
		},
	},
};
