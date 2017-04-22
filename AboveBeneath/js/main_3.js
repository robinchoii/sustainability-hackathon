/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	// some helper functions
	/**
	 * from https://davidwalsh.name/javascript-debounce-function
	 */
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
	/**
	 * from http://stackoverflow.com/a/6700
	 */
	Object.size = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};

	var mainContainer = document.querySelector('.landing-layout'),
		triggerCtrl = mainContainer.querySelector('.button--trigger'),
		landingWrapper = mainContainer.querySelector('.landing-wrap'),
		winsize = {width : window.innerWidth, height : window.innerHeight},

		// from http://stackoverflow.com/q/31184533 - original work: http://www.kaiserapps.com/lab/#ubb
		audio = {
			sounds : {},
			sources : [{
				lake : 'sounds/Whales Spouting Out Water-SoundBible.com-966355632.mp3',
				splash : 'sounds/Depth Charge 2-SoundBible.com-338644910.mp3',
				splash2 : 'sounds/Water Splash-SoundBible.com-800223477.mp3',
				underwater : 'sounds/156011__hdvideoguy__scubadiving-01.mp3'
			}],
			load : function(callback) {
				this.totalFiles = Object.size(this.sources[0]);
				
				for(var key in this.sources[0]) {
					var sound = new Howl({ src: [this.sources[0][key]] }), self = this;
					sound.once('load', function(key) {
						return function() {
							self.sounds[key] = this;
							if( Object.size(self.sounds) === self.totalFiles ) {
								if( typeof callback === 'function' ) {
									callback();
								}
							}
						};
					}(key));
				}
			},
			loop : function(name) {
				this.sounds[name].loop(true);
			},
			volume : function(name, val) {
				this.sounds[name].volume(val);
			},
			play : function(name, time) {
				this.sounds[name].stop();
				var self = this;
				setTimeout(function() {
					self.sounds[name].play();
				}, time || 0);
			},
			stop : function(name) {
				this.sounds[name].stop();
			},
			fadeIn : function(name, time) {
				var self = this;
				setTimeout(function() {
					self.sounds[name].fade(0,1,1500);
				}, time || 0);
			},
			fadeOut : function(name, time) {
				var self = this;
				setTimeout(function() {
					self.sounds[name].fade(1,0,1500);
				}, time || 0);
			},
			toggleMuteAll : function(state) {
				for(var key in this.sounds) {
					this.sounds[key].mute(state);
				}
			}
		};

	function init() {
		var loadedMediaItems = 0,
			checkloaded = function() {
				++loadedMediaItems;
				if(loadedMediaItems === 2) {
					mainContainer.classList.add('landing-layout--loaded');
					// Play lake sound.
					audio.loop('lake');
					audio.play('lake');
					// Init/Bind Events
					initEvents();
				}
			};

		// Preload images..
		imagesLoaded(landingWrapper, { background: true }, checkloaded);
		// Preload sounds..
		audio.load(checkloaded);
	}

	function initEvents() {
		// Trigger the main animation.
		triggerCtrl.addEventListener('click', function() {
			toggleMenu();
		});
		// Mute sounds.
		soundCtrl.addEventListener('click', function() {
			if( !isAudioOn ) {
				audio.toggleMuteAll(false);
				soundCtrl.classList.remove('button--sound-off');
			}
			else {
				audio.toggleMuteAll(true);
				soundCtrl.classList.add('button--sound-off');
			}
			isAudioOn = !isAudioOn;
		});
	}

	function toggleMenu() {
		var isOpen = mainContainer.classList.contains('landing-layout--open');
		// Toggle class on the main container.
		mainContainer.classList.toggle('landing-layout--open');
	}

	init();

})(window);