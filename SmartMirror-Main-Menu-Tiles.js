/**
 * @file SmartMirror-Main-Menu-Tiles.js
 *
 * @author cstollen
 * @license MIT
 *
 * @see
 */

Module.register("SmartMirror-Main-Menu-Tiles", {
	defaults: {
		menuObj: {
			main: {
				camera: { title: "Camera Detections", icon: "fa fa-television" },
				//augmentations: { title: "AI Art Mirror", icon: "fa fa-file" },
				utilities: { title: "Utilities", icon: "fa fa-clone" },
				campus: { title: "Campus Area", icon: "fa fa-university" },
				entertainment: { title: "Entertainment", icon: "fa fa-star" },
				smarthome: { title: "Smart Home", icon: "fa fa-home" },
				preferences: { title: "Preferences", icon: "fa fa-cogs" },
				// Example of a menu entry which shows a radial menu for integer user input and sends result as string to the given topic
				// integerinput: { title: "Integer Input", icon: "fa fa-dot-circle", input: { type: "integer", topic: "SHOW_ALERT", value: 10, min: 0, max: 100, steps: 8 } },
				// Example of a menu entry which uses a screen keyboard for string user input and sends the resulting string to the given topic
				// stringinput: { title: "String Input", icon: "fa fa-keyboard", input: { type: "string", topic: "SHOW_ALERT" } },
			},
			camera: {
				//image: { title: "Toggle Camera Image", icon: "fa fa-eye" },
				distance: {	title: "Toggle short distance", icon: "fa fa-compress", topic: "/websocket/sel", message: "TOGGLE" },
				face: { title: "Show / Hide Face Detec.", icon: "fa fa-user-circle", topic: "LABEL_DISPLAY", message: "FACE" },
				objects: { title: "Show / Hide Object Detec.", icon: "fa fa-coffee", topic: "LABEL_DISPLAY", message: "OBJECT" },
				gesture: { title: "Show / Hide Gesture Rec.", icon: "fa fa-thumbs-up", topic: "LABEL_DISPLAY", message: "GESTURE" },
				SHOWALL: { title: "Show all Detections", icon: "fa fa-eye", topic: "LABEL_DISPLAY", message: "SHOWALL" },
				//person: { title: "Show Person Recognition", icon: "fa fa-users" },
				HIDEALL: { title: "Hide All / Remove All", icon: "fa fa-eye-slash" , topic: "LABEL_DISPLAY", message: "HIDEALL" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			utilities: {
				clock: { title: "Clock", icon: "fa fa-clock-o" },
				calendar: { title: "Calendar", icon: "fa fa-calendar" },
				weather: { title: "Current Weather", icon: "fa fa-cloud" },
				bivital: { title: "Vital Data", icon: "fa fa-heartbeat" },
				speech: { title: "Speech Recogn. Output", icon: "fa fa-comment" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			campus: {
				//mensa: { title: "Mensa Offer", icon: "fa fa-cutlery" },
				//canteen: { title: "Westend Canteen", icon: "fa fa-apple" },
				mensa: { title: "Mensa Offer", icon: "fa fa-cutlery" },
				transportation: { title: "Public Transportation", icon: "fa fa-bus" },
				traffic: { title: "Traffic Load", icon: "fa fa-car" },
				fuel: { title: "Fuel Prices", icon: "fa fa-tint" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			entertainment: {
				crypto: { title: "Crypto Stock Values", icon: "fa fa-bitcoin" },
				newsfeed: { title: "Heise Newsfeed", icon: "fa fa-rss-square" },
				//news: { title: "News", icon: "fa fa-newspaper-o" },
				comic: { title: "Daily Comic", icon: "fa fa-columns" },
				soccer: { title: "Soccer Results", icon: "fa fa-circle" },
				dota2: { title: "Dota2 Esports", icon: "fa fa-trophy" },
				games: { title: "ITCH-IO Games", icon: "fa fa-gamepad" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			smarthome: {
				coffee: { title: "Coffee Machine", icon: "fa fa-coffee" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			coffee: {
				stats: { title: "Show/Hide Statistic", icon: "fa fa-chart-bar" },
				singlecoffee: { title: "Make Single Coffee", icon: "fa fa-coffee" },
				doublecoffee: { title: "Make Double Coffee", icon: "fa fa-coffee" },
				espresso: { title: "Make Single Espresso", icon: "fa fa-coffee" },
				doubleespresso: { title: "Make Double Espresso", icon: "fa fa-coffee" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			preferences: {
				user: { title: "Addjust user settings", icon: "fa fa-user" },
				face: { title: "Face recognition settings", icon: "fa fa-user-circle" },
				Decision_maker:{title: "Show debug Info", icon: "fa fa-list" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			user_settings: {
				language: { title: "language:", icon: "fa fa-globe" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
		},

		columns: 3, // Number of tile columns
		image_width: 1920, // Width of the underlying image
		image_height: 1080, // Height of the underlying image
		tile_width: 300, // Width of tiles
		tile_height: 200, // Height of tiles
		font_size: 40, // Font size for tiles

		distanceButtonPush: 100, // Push distance in mm for virtual button menu selection
		distanceButtonPushReset: 20, // Hand retracting distance in mm for resetting button push distance

		tileHoverDistanceFeedback: 'bar', // Type of hover distance feedback: 'bar' or 'radial'
	},

	// Colors
	menuColor: 'rgb(0, 0, 0)', // Menu element color
	menuBorderColor: 'rgb(255, 255, 255)', // Menu element border color
	hoverColor: 'rgb(63, 63, 63)', // Color of hovered element
	hoverDistanceColor: 'rgb(230, 230, 230)', // Color of distance feedback
	blinkColor: 'rgb(230, 230, 230)', // Color of selected element blink feedback
	// Constants
	keyboardBorderWidth: 4, // Screen keyboard border width
	gradientWidth: 10, // Width of background gradient transition
	radialMenuInnerRadius: 30, // Inner radius of radial menu
	radialMenuRadius: 150, // Outer radius of radial menu
	radialMenuLineWidth: 4, // Radial menu stroke width
	radialMenuNumEntries: 8, // Number of radial menu items
	radialMenuValueMin: 10, // Minimum value of radial menu input
	radialMenuValueMax: 100, // Maximum value of radial menu input
	// Global variables
	menuObjPointer: 0, // Pointer to the current menu object
	selectedEntryKey: undefined, // Selected menu entry string
	hoveredEntryKey: undefined, // Current selected menu entry as string (undefined for no selection)
	hoveredEntryKeyLast: undefined, // Last selected menu entry as string (undefined for no selection)
	cursorDistance: -1, // Current cursor distance in mm
	cursorDistancePushStart: -1, // Push starting distance in mm
	hoveredEntry: undefined, // Hovered menu HTML element
	animationInProgress: false, // Bool for preventing cursor update if tile animation is still in progress
	wrapper: undefined, // Handle for HTML wrapper object
	cursorPosX: undefined, // Current X coordinate of cursor
	cursorPosY: undefined, // Current Y coordinate of cursor
	radialMenuShown: false, // Show radial input menu
	radialMenuPosX: undefined, // Current X coordinate of radial menu
	radialMenuPosY: undefined, // Current Y coordinate of radial menu
	radialMenuIndex: undefined, // Current radial menu item index
	radialMenuValue: undefined, // Current radial menu item value
	radialMenuCenterValue: undefined, // Current radial menu center value
	radialMenuParent: undefined, // Parent element which called radial menu
	keyboardShown: false, // Show screen keyboard
	keyboardString: '', // Current keyboard input string
	keyboardStringFinal: undefined, // Final keyboard input string
	keyboardShifted: true, // Flag indicating keyboard shift key press
	keyboardCapsLocked: false, // Flag indicating keyboard caps lock
	// Keyboard layout
	keyboardLayout: {
		default: [
			"{escape} q w e r t y u i o p",
			"{capslock} a s d f g h j k l {enter}",
			"{shift} z x c v b n m {space} {backspace}"
		],
		shifted: [
			"{escape} Q W E R T Y U I O P",
			"{capslock} A S D F G H J K L {enter}",
			"{shift} Z X C V B N M {space} {backspace}"
		],
		extended: [
			"{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
			"` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
			"{tab} q w e r t y u i o p [ ] \\",
			"{capslock} a s d f g h j k l ; ' {enter}",
			"{shiftleft} z x c v b n m , . / {shiftright}",
			"{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
		],
		extendedShifted: [
			"{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
			"~ ! @ # $ % ^ & * ( ) _ + {backspace}",
			"{tab} Q W E R T Y U I O P { } |",
			'{capslock} A S D F G H J K L : " {enter}',
			"{shiftleft} Z X C V B N M < > ? {shiftright}",
			"{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
		]
	},
	keyboardIcons: {
		"{escape}": "escape ⎋",
		"{tab}": "tab ⇥",
		"{backspace}": "backspace ⌫",
		"{enter}": "enter ↵",
		"{capslock}": "capslock ⇪",
		"{shift}": "shift ⇧",
		"{shiftleft}": "shift ⇧",
		"{shiftright}": "shift ⇧",
		"{controlleft}": "ctrl ⌃",
		"{controlright}": "ctrl ⌃",
		"{altleft}": "alt ⌥",
		"{altright}": "alt ⌥",
		"{metaleft}": "cmd ⌘",
		"{metaright}": "cmd ⌘",
		"{space}": "space ␣"
	},

	/**
	 * Requests any additional scripts that need to be loaded.
	 * @returns {Array} Additional script filenames as array of strings.
	 */
	getScripts: function() {
		return [
			// 'Screen-Keyboard.js', // On screen keyboard script
			// this.file('anotherfile.js'), // This file will be loaded straight from the module folder
		]
	},	
	
	/**
	 * Requests any additional stylesheets that need to be loaded.
	 * @return {Array} Additional style sheet filenames as array of strings.
	 */
	getStyles() {
		return [
			"font-awesome.css",
			"SmartMirror-Main-Menu-Tiles.css",
			// "Screen-Keyboard.css",
		];
	},

	/**
	 * Called when all modules are loaded and the system is ready to boot up.
	 */
	start: function () {
		Log.info(this.name + " started!");
		this.menuObjPointer = this.config.menuObj.main;
		this.selectedEntryKey = "main";
		this.config.menuObj.user_settings.language.title = "language: " + config.language;
	},

	/**
	 * Updates UI on screen by returning a current DOM object.
	 * @return {Element} The current DOM object in form of a div element.
	 */
	getDom() {
		var wrapper = document.createElement("div");
		wrapper.id = 'wrapper';

		function makeOnClickHandler(a) {
			return function () {
				self.doMenuAction(a);
			};
		}

		var table = document.createElement("table");
		table.style.borderSpacing = "10px";
		var tbody = document.createElement("tbody");

		const entries = Object.keys(this.menuObjPointer);

		const numCols = this.config.columns;
		const numRows = Math.ceil(entries.length / numCols);

		for (var row = 0; row < numRows; row++) {
			var tr = document.createElement("tr");
			for (var col = 0; col < numCols; col++) {
				const idx = row * numCols + col;
				if (idx >= entries.length) break;
				const entry = entries[idx];

				// Create tile
				var td = document.createElement("td");
				td.id = entry;
				td.classList.add("tile");
				td.classList.add("menuItem");
				td.onclick = makeOnClickHandler(entry);
				td.style.width = this.config.tile_width + "px";
				td.style.minWidth = this.config.tile_width + "px";
				td.style.height = this.config.tile_height + "px";
				td.style.fontSize = this.config.font_size + "px";

				// Add icon
				var icon = document.createElement("span");
				icon.className = this.menuObjPointer[entry].icon;
				td.appendChild(icon);
				td.appendChild(document.createElement("br"));

				// Add text
				var text = document.createTextNode(this.menuObjPointer[entry].title);
				td.appendChild(text);

				// Hovered tile element handle
				if (entry == this.hoveredEntryKey) {
					this.hoveredEntry = td;
				}
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		wrapper.appendChild(table);

		// Radial input menu
		if (this.radialMenuShown) {
			var radialMenu = document.createElement("div");
			const radialMenuDiameter = this.radialMenuRadius * 2;
			const radialMenuWidth = radialMenuDiameter + this.radialMenuLineWidth;
			const radialMenuHeight = radialMenuWidth;
			const radialMenuTop = this.radialMenuPosY - this.radialMenuRadius - (this.radialMenuLineWidth / 2);
			const radialMenuLeft = this.radialMenuPosX - this.radialMenuRadius - (this.radialMenuLineWidth / 2);
			radialMenu.style.position = 'absolute';
			radialMenu.style.zIndex = '10';
			radialMenu.style.top = `${radialMenuTop}px`;
			radialMenu.style.left = `${radialMenuLeft}px`;
			radialMenu.style.width = `${radialMenuWidth}px`;
			radialMenu.style.height = `${radialMenuHeight}px`;
			radialMenu.id = "radialMenuCenter";
			radialMenu.classList.add('menuItem');
			const svgns = "http://www.w3.org/2000/svg";
			var radialSvg = document.createElementNS(svgns, 'svg');
			radialSvg.id = "radialSvg";
			radialSvg.classList.add('radialMenuCenter');
			radialSvg.style.width = `${radialMenuWidth}px`;
			radialSvg.style.height = `${radialMenuHeight}px`;
			// Make SVG element circle shaped
			radialSvg.style.borderRadius = '50%';
			// Make SVG element circle opaque in the middle
			// radialSvg.style.background = `radial-gradient(circle, black ${this.radialMenuInnerRadius}px, ${this.hoverDistanceColor} ${this.radialMenuInnerRadius}px, ${this.hoverDistanceColor} ${pushDistancePixel}px, ${this.hoverColor} ${pushDistancePixel + this.gradientWidth}px)`;
			radialSvg.style.background = this.menuColor;
			// radialSvg.viewBox = "0 0 200 200";

			const numSectors = this.radialMenuNumEntries; // Number of circle sectors
			const cx = this.radialMenuRadius + this.radialMenuLineWidth / 2; // Center point x coordinate of the circle sector
			const cy = cx; // Center point y coordinate of the circle sector
			const innerRadius = this.radialMenuInnerRadius; // Inner radius of the circle sector
			const outerRadius = this.radialMenuRadius; // Outer radius of the circle sector
			const sectorAngle = 360 / numSectors;
			for (var secIdx = 0; secIdx < numSectors; secIdx++) {
				const startAngle = (sectorAngle * secIdx + 270) % 360;
				const endAngle = startAngle + sectorAngle;
				const secId = `radialMenuItem-${secIdx}`; // HTML element id
				// Draw circle sector path
				var path = this.drawCircleSectorPath(secId, cx, cy, innerRadius, outerRadius, startAngle, endAngle);
				// Set the other attributes of the path element, such as the stroke and fill colors
				path.setAttribute('stroke', 'white');
				path.setAttribute('stroke-width', `${this.radialMenuLineWidth}`);
				// path.setAttribute('fill', 'yellow');
				path.classList.add('menuItem');
				path.classList.add('radialMenuItem');
				// Append circle sector path to svg element
				radialSvg.appendChild(path);
				// Sector label
				const labelValue = Math.floor(this.radialMenuValueMin + (secIdx * (this.radialMenuValueMax - this.radialMenuValueMin) / (this.radialMenuNumEntries - 1)));
				const labelOuterMargin = Math.floor((outerRadius - innerRadius) / 3);
				const labelX = cx + (outerRadius - labelOuterMargin) * Math.cos((startAngle + (endAngle - startAngle) / 2) * Math.PI / 180);
				const labelY = cy + (outerRadius - labelOuterMargin) * Math.sin((startAngle + (endAngle - startAngle) / 2) * Math.PI / 180);
				const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				labelText.setAttribute('x', labelX);
				labelText.setAttribute('y', labelY);
				labelText.setAttribute('text-anchor', 'middle');
				labelText.setAttribute('dominant-baseline', 'central');
				labelText.setAttribute('font-size', (this.config.font_size - 10).toString());
				labelText.setAttribute('fill', 'white');
				labelText.textContent = labelValue.toString();
				radialSvg.appendChild(labelText);
				// Hovered element handle
				if (path.id == this.hoveredEntryKey) {
					this.hoveredEntry = path;
				}
			}
			// Print text at center of the circle
			// Create a new text element for the number
			const radialCenterText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			// Set the attributes of the text element
			radialCenterText.setAttribute('x', cx);
			radialCenterText.setAttribute('y', cy);
			radialCenterText.setAttribute('text-anchor', 'middle');
			radialCenterText.setAttribute('dominant-baseline', 'central');
			radialCenterText.setAttribute('font-size', '20');
			radialCenterText.setAttribute('fill', 'white');
			// Set the text content of the text element to the number you want to display
			if (this.radialMenuValue != undefined) {
				// const radialMenuCenterValue = this.radialMenuValue;
				const radialMenuCenterValue = this.radialMenuCenterValue;
				radialCenterText.textContent = radialMenuCenterValue.toString();
			}
			// Add the text element to the SVG element
			radialSvg.appendChild(radialCenterText);

			radialMenu.appendChild(radialSvg);
			wrapper.appendChild(radialMenu);
		}

		// Screen keyboard
		if (this.keyboardShown) {
			var keyboard = document.createElement("div");
			const boundingRect = document.body.getBoundingClientRect();
			const keySize = 70;
			const keyMargin = 4;
			const keyboardWidth = 1000;
			const keyboardHeight = 310;
			const keyboardLeft = Math.floor((boundingRect.left + boundingRect.width / 2) - (keyboardWidth / 2));
			const keyboardTop = Math.floor((boundingRect.top + boundingRect.height / 2) - (keyboardHeight / 2));
			keyboard.style.position = 'absolute';
			keyboard.style.zIndex = '20';
			keyboard.style.left = `${keyboardLeft}px`;
			keyboard.style.top = `${keyboardTop}px`;
			keyboard.style.width = `${keyboardWidth}px`;
			keyboard.style.height = `${keyboardHeight}px`;
			keyboard.id = "keyboard";
			keyboard.classList.add('menuItem');
			keyboard.classList.add('keyboard');
			keyboard.style.border = 'solid';
			keyboard.style.borderColor = this.menuBorderColor;
			keyboard.style.borderWidth = `${this.keyboardBorderWidth}px`;
			keyboard.style.borderRadius = '20px';
			keyboard.style.background = this.menuColor;
			keyboard.style.align = 'center';
			var keyTable = document.createElement("table");
			keyTable.style.borderSpacing = `${keyMargin}px`;
			keyTable.style.marginLeft = 'auto';
			keyTable.style.marginRight = 'auto';
			keyTable.style.marginTop = 'auto';
			keyTable.style.marginBottom = 'auto';
			var keyBody = document.createElement('tbody');
			var keyboardLayout = this.keyboardLayout['default'];
			if (this.keyboardShifted || this.keyboardCapsLocked) {
				keyboardLayout = this.keyboardLayout['shifted'];
			}
			// Current input string
			var stringLabel = document.createElement('label');
			stringLabel.style.fontSize = 40 + "px";
			if (this.keyboardString === '') {
				stringLabel.textContent = 'Enter name';
			} else {
				stringLabel.textContent = this.keyboardString;
			}
			keyboard.appendChild(stringLabel);
			// Key layout
			for (var row = 0; row < keyboardLayout.length; row++) {
				var tr = document.createElement('tr');
				const rowKeys = keyboardLayout[row].split(' ');
				for (var col = 0; col < rowKeys.length; col++) {
					var td = document.createElement('td');
					var key = rowKeys[col];
					if (key.startsWith('{')) {
						if (key === '{enter}') {
							td.rowSpan = '2';
						}
						const keyboardIcons = this.keyboardIcons[key].split(' ');
						td.id = 'key-' + keyboardIcons.at(0);
						key = keyboardIcons.at(-1);
					} else {
						td.id = 'key-' + key;
					}
					var text = document.createTextNode(key);
					td.style.width = keySize + "px";
					td.style.minWidth = keySize + "px";
					td.style.height = keySize + "px";
					td.style.fontSize = 40 + "px";
					td.style.border = 'solid';
					td.style.borderColor = this.menuBorderColor;
					td.style.borderWidth = '2px';
					td.classList.add('key');
					td.classList.add('menuItem');
					// Hovered key element handle
					if (td.id == this.hoveredEntryKey) {
						this.hoveredEntry = td;
					}
					td.appendChild(text);
					tr.appendChild(td);
				}
				keyBody.appendChild(tr);
			}
			keyTable.appendChild(keyBody);
			keyboard.appendChild(keyTable);	
			wrapper.appendChild(keyboard);	
		}

		this.wrapper = wrapper;
		return wrapper;
	},

	/**
	 * Called when menu gets hidden.
	 */
	suspend: function () {
		// Close radial menu when widget gets hidden
		this.radialMenuShown = false;
		this.updateDom();
	},

	/**
	 * Called when menu gets shown.
	 */
	resume: function () {
	},

	/**
	 * Handles mouse clicks on menu items.
	 * @param {String} action The clicked menu item key.
	 */
	doMenuAction: function (action) {
		var actionDetail = {};
		if (typeof action === "object") {
			actionDetail = action;
			actionName = actionDetail.actionName;
		} else {
			actionName = action;
			actionDetail = this.menuObjPointer[action]["title"];
		}
		this.sendNotification("MENU_CLICKED", actionName);
	},

	/**
	 * Returns the current menu item index for a given position relative to the camera image size.
	 * @param {Number} posx X coordinate in fraction of camera image width.
	 * @param {Number} posy Y coordinate in fraction of camera image height.
	 * @returns {Number} Current menu item index.
	 */
	getSelectionIndexForPosition: function (posx, posy) {
		// Fetch camera image dimensions from element with id camera_image
		// Possible CORS violation if image_handler uses iframe
		// const imageWidth = document.getElementById("camera_image").width;
		// const imageHeight = document.getElementById("camera_image").height;
		// Use camera image dimensions from module config
		const imageWidth = this.config.image_width;
		const imageHeight = this.config.image_height;
		// Get first element with class menuItem relative to the viewport and return its menu index
		const elements = document.elementsFromPoint(Math.round(posx * imageWidth), Math.round(posy * imageHeight));
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].classList.contains("menuItem")) {
				const index = Object.keys(this.menuObjPointer).indexOf(elements[i].id);
				return index;
			}
		}
	},

	/**
	 * Returns the current menu item key string for a given position relative to the camera image size.
	 * @param {Number} posx X coordinate in fraction of camera image width.
	 * @param {Number} posy Y coordinate in fraction of camera image height.
	 * @returns {String} Menu entry key string.
	 */
	getMenuEntryForPosition: function (posx, posy) {
		// Use camera image dimensions from module config
		const imageWidth = this.config.image_width;
		const imageHeight = this.config.image_height;
		// Get first element with class menuItem relative to the viewport and return its menu index
		const elements = document.elementsFromPoint(Math.round(posx * imageWidth), Math.round(posy * imageHeight));
		for (var i = 0; i < elements.length; i++) {
			// console.debug("html elements: ", i)
			// console.debug("html element id: ", elements[i].id)
			if (elements[i].classList.contains('menuItem')) {
				// Set selected menu entry object
				var entryKey = elements[i].id;
				// console.debug("entryKey = ", entryKey)
				return entryKey;
			}
		}
	},

	/**
	 * Mark HTML div element as hovered by the cursor.
	 * @param {HTMLDivElement} htmlElement HTML div element to mark as hovered.
	 */
	hoverMenuElement: function (htmlElement) {
		if (this.animationInProgress) return;
		const remainingPushDistance = this.cursorDistance - (this.cursorDistancePushStart - this.config.distanceButtonPush);
		const gradientWidth = this.gradientWidth;
		const pushDistancePercent = 100 - Math.floor((remainingPushDistance / this.config.distanceButtonPush) * (100 + gradientWidth));
		var background;

		if (htmlElement.nodeName === 'path') {
			pushDistancePixel = Math.floor(this.radialMenuInnerRadius + (this.radialMenuRadius - this.radialMenuInnerRadius) * (pushDistancePercent / 100));
			background = `radial-gradient(circle, ${this.menuColor} ${this.radialMenuInnerRadius}px, ${this.hoverDistanceColor} ${this.radialMenuInnerRadius}px, ${this.hoverDistanceColor} ${pushDistancePixel}px, ${this.hoverColor} ${pushDistancePixel + this.gradientWidth}px)`;
			// htmlElement.parentElement.style.borderRadius = '50%'; // Make SVG element circle shaped
			htmlElement.parentElement.style.background = background;
			htmlElement.setAttribute('fill', 'transparent');
			return;
		}

		if (this.config.tileHoverDistanceFeedback === 'bar') {
			// background = `linear-gradient(0deg, ${this.hoverDistanceColor} 0 0%, ${this.hoverColor} ${pushDistancePercent}% 100%)`;
			background = `linear-gradient(to top, ${this.hoverDistanceColor} ${pushDistancePercent}%, ${this.hoverColor} ${pushDistancePercent + gradientWidth}%)`;
		} else if (this.config.tileHoverDistanceFeedback === 'raidal') {
			// background = `radial-gradient(circle, ${this.hoverDistanceColor} 0%, ${this.hoverColor} ${pushDistancePercent}%)`;
			background = `radial-gradient(circle, ${this.hoverDistanceColor} ${pushDistancePercent}%, ${this.hoverColor} ${pushDistancePercent + 10}%)`;
		}

		htmlElement.style.background = background;
	},

	/**
	 * Blink a menu element.
	 * @param {HTMLDivElement} htmlElement  HTML div element to let blink.
	 */
	blinkMenuElement: function(htmlElement) {
		// Use SVG element for radial menu blink
		if (htmlElement.classList.contains('radialMenuItem')) {
			htmlElement = htmlElement.parentElement;
		}

		this.animationInProgress = true;
		const blinkIntervalDuration = 150; // ms
		const blinkDuration = 600; // ms
		// Blink interval
		const blinkInterval = setInterval(() => {
			if (htmlElement.style.background === this.blinkColor) {
				htmlElement.style.background = this.hoverColor;
			} else {
				htmlElement.style.background = this.blinkColor;
			}
		}, blinkIntervalDuration);
		// Stop blinking after timeout
		setTimeout(() => {
			clearInterval(blinkInterval);
			htmlElement.style.background = this.hoverColor;
			this.animationInProgress = false;
			this.updateDom();
		}, blinkDuration);
	},

	/**
	 * Select a menu entry by the string key identifier.
	 * @param {String} entryKey Menu entry key string.
	 */
	selectMenuEntry: function (entryKey) {
		// console.debug("this.menuObjPointer.id = ", this.menuObjPointer.id);
		if (this.menuObjPointer.hasOwnProperty(entryKey)) {
			// Input menu element selected
			if (this.menuObjPointer[entryKey].hasOwnProperty('input')) {
				if (this.menuObjPointer[entryKey]['input'].hasOwnProperty('type')) {
					if (this.menuObjPointer[entryKey]['input']['type'] === 'integer') {
						// Show radial input menu
						if ((!this.radialMenuShown) && (!this.radialMenuPoxX) && (!this.radialMenuPoxY)) {
							// Set radial menu parent which called for the input menu
							this.radialMenuParent = this.menuObjPointer[entryKey];
							// Set radial menu min, max values and number of items
							this.radialMenuValueMin = this.radialMenuParent['input']['min'];
							this.radialMenuValueMax = this.radialMenuParent['input']['max'];
							this.radialMenuNumEntries = this.radialMenuParent['input']['steps'];
							const wrapperRect = this.wrapper.getBoundingClientRect();
							// console.debug("wrapperRect: top: ", wrapperRect.top, " left: ", wrapperRect.left);
							this.radialMenuPosX = this.cursorPosX - wrapperRect.left;
							this.radialMenuPosY = this.cursorPosY - wrapperRect.top;
							this.radialMenuCenterValue = this.radialMenuParent['input']['value'];
							this.radialMenuShown = true;
						}
						this.blinkMenuElement(this.hoveredEntry);
						return;
					} else if (this.menuObjPointer[entryKey]['input']['type'] === 'string') {
						// Show screen keyboard
						if (!this.keyboardShown) {
							// console.debug("Show screen keyboard");
							this.keyboardMenuParent = this.menuObjPointer[entryKey];
							this.keyboardShown = true;
						}
						// Flash hovered menu entry
						this.blinkMenuElement(this.hoveredEntry);
						// Remove menu hover
						this.hoveredEntryKey = undefined;
						this.hoveredEntryKeyLast = undefined;
						return;
					}
				}
			}
		} else {
			// console.debug("Unknown selection entry key: ", entryKey);
		}

		// Radial menu entry selected
		if (entryKey.startsWith('radialMenuItem')) {
			// console.debug("Selected radial entry: ", entryKey, " value: ", this.radialMenuValue);
			const inputTopic = this.radialMenuParent['input']['topic'];
			const inputValue = this.radialMenuValue.toString();
			// console.debug("send input: topic: ", inputTopic, " value:", inputValue);
			this.radialMenuParent['input']['value'] = this.radialMenuValue;
			this.radialMenuCenterValue = this.radialMenuValue;
			this.updateDom();
			if (inputTopic === 'SHOW_ALERT') {
				this.sendNotification(inputTopic, {type: "notification", title: "Input value: ", message: inputValue});
			} else {
				this.sendNotification(inputTopic, inputValue);
			}
			// Flash hovered menu item
			this.blinkMenuElement(this.hoveredEntry);
			// Remove menu hover
			this.hoveredEntryKey = undefined;
			this.hoveredEntryKeyLast = undefined;
			this.radialMenuShown = false;
			return;
		}

		// Screen keyboard key selected
		if (entryKey.startsWith('key-')) {
			// console.debug("Key selected: ", entryKey);
			if (entryKey === 'key-enter') {
				this.keyboardString.trim();
				this.keyboardStringFinal = this.keyboardString;
				this.keyboardShown = false;
				// console.debug("String input: ", this.keyboardStringFinal);
				const inputTopic = this.keyboardMenuParent['input']['topic'];
				const inputString = this.keyboardStringFinal;
				if (inputTopic === 'SHOW_ALERT') {
					this.sendNotification(inputTopic, {type: "notification", title: "Input string: ", message: inputString});
				} else {
					this.sendNotification(inputTopic, inputString);
				}
				// Flash hovered menu item
				this.blinkMenuElement(this.hoveredEntry);
				// Remove menu hover
				this.hoveredEntryKey = undefined;
				this.hoveredEntryKeyLast = undefined;
				this.keyboardString = '';
				return;
			} else if (entryKey === 'key-shift') {
				this.keyboardShifted = !this.keyboardShifted;
			} else if (entryKey === 'key-capslock') {
				this.keyboardCapsLocked = !this.keyboardCapsLocked;
			} else if (entryKey === 'key-backspace') {
				this.keyboardString = this.keyboardString.slice(0, -1);
			}	else if (entryKey === 'key-space') {
				this.keyboardString += ' ';
			}	else if (entryKey === 'key-escape') {
				this.keyboardString = '';
				this.keyboardShifted = false;
				this.keyboardShown = false;
			} else {
				this.keyboardString += entryKey.at(-1);
				this.keyboardShifted = false;
			}
			// Remove menu hover
			this.hoveredEntryKey = undefined;
			this.hoveredEntryKeyLast = undefined;
			this.updateDom();
			return;
		}

		if (entryKey == 'back') {
			this.menuObjPointer = this.config.menuObj.main;
			this.selectedEntryKey = 'main';
		} else if (this.selectedEntryKey == 'main') {
			this.menuObjPointer = this.config.menuObj[entryKey];
			this.selectedEntryKey = entryKey;
		} else {
			if (this.menuObjPointer[entryKey].hasOwnProperty("topic") && this.menuObjPointer[entryKey].hasOwnProperty("message")) {
				this.sendNotification(this.menuObjPointer[entryKey]["topic"], this.menuObjPointer[entryKey]["message"]);
			}
			// Publish menu interaction
			this.sendNotification("MENU_SELECTED", entryKey);
			//console.debug("MENU_SELECTED: " + entryKey);
		}
		// Flash hovered menu entry
		this.blinkMenuElement(this.hoveredEntry);

		// Remove menu hover
		this.hoveredEntryKey = undefined;
		this.hoveredEntryKeyLast = undefined;
	},

	/**
	 * Update menu by giving new cursor position and distance.
	 * @param {Float} posx X coordinate in fraction of camera image width.
	 * @param {Float} posy Y coordinate in fraction of camera image height.
	 * @param {Int16} distance Distance from the camera in mm.
	 */
	updateCursor: function (posx, posy, distance) {
		this.cursorPosX = Math.round(posx * this.config.image_width);
		this.cursorPosY = Math.round(posy * this.config.image_height);
		// console.debug("cursor: X: ", this.cursorPosX, " Y: ", this.cursorPosY)
		if (this.animationInProgress) return;
		// Set last menu entry
		this.hoveredEntryKeyLast = this.hoveredEntryKey;
		// Get menu entry for position
		this.hoveredEntryKey = this.getMenuEntryForPosition(posx, posy);
		// Set cursor distance
		this.cursorDistance = distance;

		// Hovering over menu entry
		if (this.hoveredEntry && this.hoveredEntryKey) {
			// Hovering over new entry
			if (this.hoveredEntryKey != this.hoveredEntryKeyLast) {
				// console.debug("New hover: " + this.hoveredEntryKey);
				// Set starting distance for virtual button push
				this.cursorDistancePushStart = distance;

				// Update radial menu value
				if (this.radialMenuShown) {
					// Set selected radial menu index from element id string
					const hoveredEntryTokens = this.hoveredEntryKey.split('-');
					if (hoveredEntryTokens.length > 1) {
						this.radialMenuIndex = hoveredEntryTokens.at(-1);
					} else {
						if (this.radialMenuIndex == undefined) {
							this.radialMenuIndex = 0;
						}
					}
					// Set radial menu value
					this.radialMenuValue = Math.floor(this.radialMenuValueMin + (this.radialMenuIndex * (this.radialMenuValueMax - this.radialMenuValueMin) / (this.radialMenuNumEntries - 1)));
				}

				this.updateDom();
				this.hoverMenuElement(this.hoveredEntry);
			}
			// Hovering over same valid entry as before
			else {
				// Reset starting distance for virtual button push if distance increases
				if (this.cursorDistance >= (this.cursorDistancePushStart + this.config.distanceButtonPushReset)) {
						this.cursorDistancePushStart = this.cursorDistance;
						// console.debug("Reset cursorDistancePushStart: " + this.cursorDistancePushStart);
				}
				// Check if menu entry is clicked with virtual button
				var remainingPushDistance = this.cursorDistance - (this.cursorDistancePushStart - this.config.distanceButtonPush);
				// Selected entry
				if (this.cursorDistance <= this.cursorDistancePushStart - this.config.distanceButtonPush) {
					// console.debug("Selected entry key: " + this.hoveredEntryKey);
					this.selectMenuEntry(this.hoveredEntryKey);
				}
				// Still hovering over entry
				else {
					// console.debug("Remaining distance: " + remainingPushDistance);
				}
				this.hoverMenuElement(this.hoveredEntry);
			}
		}
		// Not hovering over entry
		else {
			// Newly hovering over no entry
			if (this.hoveredEntryKey != this.hoveredEntryKeyLast) {
				// console.debug("No hover");
				this.updateDom();
			}
			// Hovering over no menu entry as before
			else {
			}
		}
	},

	/**
	 * MagicMirror notification handler.
	 * @param {String} notification The notification identifier as a string.
	 * @param {AnyType} payload The notification payload.
	 * @param {Module} sender The identification of the notification sender.
	 */
	notificationReceived: function (notification, payload, sender) {	
		if ((notification === "MAIN_MENU") && (payload === "reset")) {
			this.menuObjPointer = this.config.menuObj.main;
			this.selectedEntryKey = 'main';
			// Remove menu hover
			this.hoveredEntryKey = undefined;
			this.hoveredEntryKeyLast = undefined;
			this.updateDom();
		}
	},

	/**
	 * Draw circle sector as HTML SVG path element.
	 * @param {*} id Id of the HTML element
	 * @param {*} cx Circle center X coordinate
	 * @param {*} cy Circle center Y coordinate
	 * @param {*} innerRadius Inner radius of circle sector
	 * @param {*} outerRadius Outer radius of circle sector
	 * @param {*} startAngle Start angle in degrees
	 * @param {*} endAngle End angle in degrees
	 * @returns Sector as HTML SVG path element 
	 */
	drawCircleSectorPath: function (id, cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
		// Calculate the starting and ending points of the arc on the inner and outer circles
		const x1Inner = cx + innerRadius * Math.cos(startAngle * Math.PI / 180);
		const y1Inner = cy + innerRadius * Math.sin(startAngle * Math.PI / 180);
		const x1Outer = cx + outerRadius * Math.cos(startAngle * Math.PI / 180);
		const y1Outer = cy + outerRadius * Math.sin(startAngle * Math.PI / 180);
		const x2Inner = cx + innerRadius * Math.cos(endAngle * Math.PI / 180);
		const y2Inner = cy + innerRadius * Math.sin(endAngle * Math.PI / 180);
		const x2Outer = cx + outerRadius * Math.cos(endAngle * Math.PI / 180);
		const y2Outer = cy + outerRadius * Math.sin(endAngle * Math.PI / 180);

		// Define the path for the circle sector
		const pathData = `M ${x1Inner},${y1Inner}
						A ${innerRadius},${innerRadius} 0 0,1 ${x2Inner},${y2Inner}
						L ${x2Outer},${y2Outer}
						A ${outerRadius},${outerRadius} 0 0,0 ${x1Outer},${y1Outer}
						Z`;
		
		// Create a new path element for the circle sector
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		// Set html element id
		path.id = id;

		// Set the "d" attribute of the path element to create the circle sector
		path.setAttribute('d', pathData);

		return path;
	},
});
