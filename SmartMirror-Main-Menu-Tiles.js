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
			},
			camera: {
				image: { title: "Toggle Camera Image", icon: "fa fa-eye" },
				//distance: { title: "Toggle short distance", icon: "fa fa-compress" },
				face: { title: "Show / Hide Face Detec.", icon: "fa fa-user-circle" },
				objects: { title: "Show / Hide Object Detec.", icon: "fa fa-coffee" },
				gesture: { title: "Show / Hide Gesture Rec.", icon: "fa fa-thumbs-up" },
				SHOWALL: { title: "Show all Detections", icon: "fa fa-eye" },
				person: { title: "Show Person Recognition", icon: "fa fa-users" },
				HIDEALL: { title: "Hide All / Remove All", icon: "fa fa-eye-slash" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			/*augmentations: {
				aiartmiror: { title: "Ai-Art-Mirror", icon: "fa fa-image" },
				randomsytle: { title: "Toggle Styles Automatically", icon: "fa fa-toggle-on" },
				nextsytle: { title: "Next Style", icon: "fa fa-arrow-right" },
				prevsytle: { title: "Previous Style", icon: "fa fa-arrow-left" },
				sourcesytle: { title: "Display Sources", icon: "fa fa-exchange" },
				back: { title: "Back", icon: "fa fa-undo" },
			},*/
			messevideo: {
				corlab: { title: "Corlab video", icon: "" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			utilities: {
				clock: { title: "Clock", icon: "fa fa-clock-o" },
				calendar: { title: "Calendar", icon: "fa fa-calendar" },
				weather: { title: "Current Weather", icon: "fa fa-cloud" },
				//wforecast: { title: "Weather Forecast", icon: "fa fa-line-chart" },
				bivital: { title: "Vital Data", icon: "fa fa-heartbeat" },
				speech: { title: "Speech Recogn. Output", icon: "fa fa-comment" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			campus: {
				mensa: { title: "Mensa Offer", icon: "fa fa-cutlery" },
				canteen: { title: "Westend Canteen", icon: "fa fa-apple" },
				transportation: { title: "Public Transportation", icon: "fa fa-bus" },
				traffic: { title: "Traffic Load", icon: "fa fa-car" },
				fuel: { title: "Fuel Prices", icon: "fa fa-tint" },
				back: { title: "Back", icon: "fa fa-undo" },
			},
			entertainment: {
				crypto: { title: "Crypto Stock Values", icon: "fa fa-bitcoin" },
				newsfeed: { title: "Heise Newsfeed", icon: "fa fa-rss-square" },
				news: { title: "News", icon: "fa fa-newspaper-o" },
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
		tileHoverColor: 'rgba(250, 250, 250, 0.25)', // Color of hovered tile
		tileHoverDistanceColor: 'rgba(250, 250, 250, 0.9)', // Color of distance feedback
		tileBlinkColor: 'rgba(250, 250, 250, 0.9)', // Color of selected tile blink feedback
	},
	menuObjPointer: 0, // Pointer to the current menu object
	selectedEntryKey: undefined, // Selected menu entry string
	hoveredEntryKey: undefined, // Current selected menu entry as string (undefined for no selection)
	hoveredEntryKeyLast: undefined, // Last selected menu entry as string (undefined for no selection)
	cursorDistance: -1, // Current cursor distance in mm
	cursorDistancePushStart: -1, // Push starting distance in mm
	hoveredTile: undefined, // Hovered tile HTML div element
	animationInProgress: false, // Bool for preventing cursor update if tile animation is still in progress

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

		function makeOnClickHandler(a) {
			return function () {
				self.doMenuAction(a);
			};
		}

		if (this.config.tiles) {
			// Create main menu tiles
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
						this.hoveredTile = td;
					}
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}
			table.appendChild(tbody);
			wrapper.appendChild(table);
		} else {
			// Create main menu list (deprecated)
			var self = this;
			wrapper.className = "xLargeMenu";

			var table = document.createElement("table");
			var tbody = document.createElement("tbody");

			table.className = "table";
			table.className = "tbody";

			Object.keys(this.menuObjPointer).forEach((k) => {
				var row = document.createElement("tr");
				var namecell = document.createElement("namecellMainMenu");
				var cellText = document.createTextNode(this.menuObjPointer[k].title + " ");
				namecell.appendChild(cellText);
				namecell.className = "valuecellMainMenu";
				namecell.classList.add("menuItem");
				namecell.id = k;
				namecell.onclick = makeOnClickHandler(k);
				row.appendChild(namecell);

				var span = document.createElement("span");
				span.innerHTML = `<i class="${this.menuObjPointer[k].icon}" aria-hidden="true"></i>`;

				if (k == hoveredObject) {
					span.classList.add("pulse");
					namecell.classList.add("pulse");
				}

				span.onclick = makeOnClickHandler(k);
				span.classList.add("menuItem");
				span.id = k;

				row.appendChild(span);
				row.className = "tablerow";
				tbody.appendChild(row);
			});

			table.appendChild(tbody);
			wrapper.appendChild(table);
		}
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
			if (elements[i].classList.contains("menuItem")) {
				// Set selected menu entry object
				var entryKey = elements[i].id;
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
		const remainingPushDistancePercent = 100 - Math.floor((remainingPushDistance / this.config.distanceButtonPush) * 100);
		var background;
		if (this.config.tileHoverDistanceFeedback === 'bar') {
			background = `linear-gradient(0deg, ${this.config.tileHoverDistanceColor} 0 0%, ${this.config.tileHoverColor} ${remainingPushDistancePercent}% 100%)`;
		} else if (this.config.tileHoverDistanceFeedback === 'radial') {
			background = `radial-gradient(circle, ${this.config.tileHoverDistanceColor} 0%, ${this.config.tileHoverColor} ${remainingPushDistancePercent}%)`;
		}
		htmlElement.style.background = background;
	},

	/**
	 * Blink a menu element.
	 * @param {HTMLDivElement} htmlElement  HTML div element to let blink.
	 */
	blinkMenuElement: function(htmlElement) {
		this.animationInProgress = true;
		const blinkIntervalDuration = 150; // ms
		const blinkDuration = 600; // ms
		// Blink interval
		const blinkInterval = setInterval(() => {
			if (htmlElement.style.background == this.config.tileBlinkColor) {
				htmlElement.style.background = this.config.tileHoverColor;
			} else {
				htmlElement.style.background = this.config.tileBlinkColor;
			}
		}, blinkIntervalDuration);
		// Stop blinking after timeout
		setTimeout(() => {
			clearInterval(blinkInterval);
			htmlElement.style.background = this.config.tileHoverColor;
			this.animationInProgress = false;
			this.updateDom();
		}, blinkDuration);
	},

	/**
	 * Select a menu entry by the string key identifier.
	 * @param {String} entryKey Menu entry key string.
	 */
	selectMenuEntry: function (entryKey) {
	if (entryKey == 'back') {
			this.menuObjPointer = this.config.menuObj.main;
			this.selectedEntryKey = 'main';
		} else if (this.selectedEntryKey == 'main') {
			this.menuObjPointer = this.config.menuObj[entryKey];
			this.selectedEntryKey = entryKey;
		} else {
			// Publish menu interaction
			this.sendNotification("MENU_SELECTED", entryKey);
			console.debug("MENU_SELECTED: " + entryKey);
		}
		// Flash hovered menu tile
		this.blinkMenuElement(this.hoveredTile);

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
		if (this.animationInProgress) return;
		// Set last menu entry
		this.hoveredEntryKeyLast = this.hoveredEntryKey;
		// Get menu entry for position
		this.hoveredEntryKey = this.getMenuEntryForPosition(posx, posy);
		// Set cursor distance
		this.cursorDistance = distance;

		// Hovering over entry
		if (this.hoveredEntryKey) {
			// Hovering over new entry
			if (this.hoveredEntryKey != this.hoveredEntryKeyLast) {
				// console.debug("New hover: " + this.hoveredEntryKey);
				// Set starting distance for virtual button push
				this.cursorDistancePushStart = distance;
				this.updateDom();
				this.hoverMenuElement(this.hoveredTile);
			}
			// Hovering over same valid entry as before
			else {
				// Reset starting distance for virtual button push if distance increases
				if (this.cursorDistance >= (this.cursorDistancePushStart + this.config.distanceButtonPushReset)) {
						this.cursorDistancePushStart = this.cursorDistance;
						console.debug("Reset cursorDistancePushStart: " + this.cursorDistancePushStart);
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
				this.hoverMenuElement(this.hoveredTile);
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
		if (notification === "MAIN_MENU") {
			var entryKey = payload;
			if (this.menuObjPointer.hasOwnProperty(entryKey)) {
				console.debug("MAIN_MENU: " + payload);
			}
		}
	},
});
