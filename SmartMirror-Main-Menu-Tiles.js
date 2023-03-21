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
				// inputexample: { title: "Input Example", icon: "fa fa-wrench", input: { topic: "SHOW_ALERT", min: 0, max: 100, steps: 8 } },
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

		tiles: true, // Menu as tiles or as list
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
	menuObjPointer: 0, // Pointer to the current menu object
	selectedEntryKey: undefined, // Selected menu entry string
	hoveredEntryKey: undefined, // Current selected menu entry as string (undefined for no selection)
	hoveredEntryKeyLast: undefined, // Last selected menu entry as string (undefined for no selection)
	cursorDistance: -1, // Current cursor distance in mm
	cursorDistancePushStart: -1, // Push starting distance in mm
	hoveredEntry: undefined, // Hovered menu HTML element
	animationInProgress: false, // Bool for preventing cursor update if tile animation is still in progress

	// Colors
	menuColor: 'rgb(0, 0, 0)', // Menu element color
	hoverColor: 'rgb(63, 63, 63)', // Color of hovered element
	hoverDistanceColor: 'rgb(230, 230, 230)', // Color of distance feedback
	blinkColor: 'rgb(230, 230, 230)', // Color of selected element blink feedback
	// Constants
	gradientWidth: 10, // Width of background gradient transition
	radialMenuInnerRadius: 30, // Inner radius of radial menu
	radialMenuRadius: 150, // Outer radius of radial menu
	radialMenuLineWidth: 4, // Radial menu stroke width
	radialMenuNumEntries: 8, // Number of radial menu items
	radialMenuValueMin: 10, // Minimum value of radial menu input
	radialMenuValueMax: 100, // Maximum value of radial menu input
	// Global variables
	wrapper: undefined, // Handle for HTML wrapper object
	radialMenuShown: false, // Bool for usage of the radial menu
	cursorPosX: undefined, // Current X coordinate of cursor
	cursorPosY: undefined, // Current Y coordinate of cursor
	radialMenuPosX: undefined, // Current X coordinate of radial menu
	radialMenuPosY: undefined, // Current Y coordinate of radial menu
	radialMenuIndex: undefined, // Current radial menu item index
	radialMenuValue: undefined, // Current radial menu item value
	radialMenuParent: undefined, // Parent element which called radial menu

	/**
	 * Requests any additional stylesheets that need to be loaded.
	 * @return {Array} Additional style sheet filenames as array of strings.
	 */
	getStyles() {
		return ["font-awesome.css", "SmartMirror-Main-Menu-Tiles.css"];
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

		if (this.radialMenuShown) {
			// Develop radial context menu
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
			// radialMenu.style.borderStyle = "dashed";
			// radialMenu.style.borderWidth = `${this.radialMenuLineWidth}px`;
			// radialMenu.style.borderColor = "lightgray";
			radialMenu.id = "radialMenuCenter";
			radialMenu.classList.add('menuItem');
			const svgns = "http://www.w3.org/2000/svg";
			var radialSvg = document.createElementNS(svgns, 'svg');
			radialSvg.id = "radialSvg";
			radialSvg.classList.add('radialMenuCenter');
			// radialSvg.style.borderStyle = "dashed";
			// radialSvg.style.borderWidth = `${this.radialMenuLineWidth}px`;
			// radialSvg.style.borderColor = "blue";
			// radialSvg.style.background = "blue"
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

				// Hovered element handle
				if (path.id == this.hoveredEntryKey) {
					this.hoveredEntry = path;
				}
			}
			// Print text at center of the circle
			// Create a new text element for the number
			const radialText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			// Set the attributes of the text element
			radialText.setAttribute('x', cx);
			radialText.setAttribute('y', cy);
			radialText.setAttribute('text-anchor', 'middle');
			radialText.setAttribute('dominant-baseline', 'central');
			radialText.setAttribute('font-size', '20');
			radialText.setAttribute('fill', 'white');
			// Set the text content of the text element to the number you want to display
			if (this.radialMenuValue != undefined) {
				// const number = 42;
				const number = this.radialMenuValue;
				radialText.textContent = number.toString();
			}
			// Add the text element to the SVG element
			radialSvg.appendChild(radialText);

			radialMenu.appendChild(radialSvg);
			wrapper.appendChild(radialMenu);
		}

		this.wrapper = wrapper;
		return wrapper;
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
			if (elements[i].classList.contains("menuItem")) {
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

		// console.debug("blinkMenuElement");
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
			if (this.menuObjPointer[entryKey].hasOwnProperty("input")) {
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
					this.radialMenuShown = true;
				}
				this.blinkMenuElement(this.hoveredEntry);
				return;
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

		if (entryKey == 'back') {
			this.menuObjPointer = this.config.menuObj.main;
			this.selectedEntryKey = 'main';
		} else if (this.selectedEntryKey == 'main') {
			this.menuObjPointer = this.config.menuObj[entryKey];
			this.selectedEntryKey = entryKey;
		} else {
			//console.debug(entryKey)
			//console.debug(this.menuObjPointer[entryKey])
			if (this.menuObjPointer[entryKey].hasOwnProperty("topic") && this.menuObjPointer[entryKey].hasOwnProperty("message")) {
				this.sendNotification(this.menuObjPointer[entryKey]["topic"], this.menuObjPointer[entryKey]["message"]);
				//console.debug(this.menuObjPointer[entryKey]["topic"], this.menuObjPointer[entryKey]["message"]);
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
