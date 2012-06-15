// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
								   || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());


vortext = (function () {
	var domPrefix = '';

	function vortext(elt, radius, multiply, letters) {
		domPrefix = getDomPrefix();
		elt = $(elt);
		radius = radius || 100;
		multiply = multiply || 2;
		
		
		
		var reg = /(\S+)/g,
			outside = false,
			width = elt.width(),
			height = elt.height(),
			texts = getTextNodesIn(elt),
			wordData = [],
			pt, lastPt;
		
		// wrap words (or letters) with span tags
		if (letters) {
			reg = /(\S)/g;
		}
		texts.each(function (i, text) {
			$(text).replaceWith(text.textContent.replace(reg, '<span>$1</span>'));
		});
		
		elt.css({
			position: 'relative'
		});
		
		elt.find('span').css({
			position: 'relative',
			display: 'inline-block'
		}).each(function (i, word) {
			word = $(word);
			var pos = word.position(),
				w = word.width(), 
				h = word.height(),
				x = pos.left + w/2, 
				y = pos.top + h/2;
			wordData.push({
				elt: word,
				y: y, x: x,
				off: {
					x: 0, y: 0, a: 0, s: 0
				}
			});
		});
		
		$(window).mousemove(function (e) {
			pt = getCoord(e);
			if (isNaN(pt.x) || isNaN(pt.y)) {
				pt = lastPt;
			}
			if (pt && inBounds(pt)) {
				outside = false;
			} else if (!outside) {
				outside = true;
				loop();
			}
		});
		
		function inBounds(pt) {
			return !(pt.x+radius < 0 || pt.x-radius > width ||
				pt.y+radius < 0 || pt.y-radius > height);
		}
		
		function loop() {
			if (pt && (!lastPt || (lastPt.x !== pt.x || lastPt.y !== pt.y))) {
				lastPt = pt;
				var len = wordData.length,
					data, dir, dist, mult, 
					newX, newY, newA, newS;
				for (var i = 0, l = len; i < l; ++i) {
					data = wordData[i];
					dir	 = direction(pt, data),
					dist = distance(pt, data),
					mult = multiply * clamp(radius - dist, 0, radius),
					newX = (Math.cos(dir) - Math.sin(dir)) * mult,
					newY = (Math.sin(dir) + Math.cos(dir)) * mult,
					newA = mult === 0 ? 0 : clamp(mult, 0, 1)*(dir+Math.PI/2),
					newS = clamp(2*(1 + mult)/radius, 1, radius/2);
					
					if (newX === data.off.x && newY === data.off.y && 
						newA === data.off.a && newS === data.off.s)
					{
						continue;
					}
					
					setTransform(data.elt.get(0), newX, newY, newA, newS);
					
					data.off = {
						x: newX,
						y: newY,
						a: newA, 
						s: newS
					};
				}
			}
		}
		
		function getCoord(e) {
			var off = elt.offset(),
				pageX = e.pageX || e.touches && e.touches[0].pageX,
				pageY = e.pageY || e.touches && e.touches[0].pageY;
	
			return {
				x: Math.floor(pageX - off.left),
				y: Math.floor(pageY - off.top)
			};
		}
		
		!function runLoop() {
			loop();
			requestAnimationFrame(runLoop);
		}();
	}
	
	function clamp(c, a, b) {
		return (c < a ? a : c > b ? b : c);
	}
	
	function distance(a, b) {
		return Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2));
	}
	
	// direction from a TO b
	function direction(a, b) {
		return Math.atan2((b.y - a.y), (b.x - a.x));
	}
	
	function getDomPrefix() {
		var domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
			prefix = '', 
			elt = document.body;
		for (var i = 0; i < domPrefixes.length; i++) {
			if (elt.style[domPrefixes[i] + 'Transform'] !== undefined) {
				prefix = domPrefixes[i];
				break;
			}
		}
		return prefix;
	}
	
	function setTransform(element, x, y, a, s) {
		x = x || 0; y = y || 0; a = a || 0; s = s || 0;
		a *= 180/Math.PI;
		element.style[domPrefix+'Transform'] = // hack for stupid firefox
			element.style['-' + domPrefix.toLowerCase() + '-transform'] = 
				'translate('+x+'px, '+y+'px) rotate('+a+'deg) scale('+s+')';
		
	}
	
	function getTextNodesIn(el) {
		return $(el).find(":not(iframe)").andSelf().contents().filter(function() {
			return this.nodeType == 3;
		});
	};
	
	return vortext;	
})();