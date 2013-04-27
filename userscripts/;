// ==UserScript==
// @name           Text Transmogrifier
// @namespace      Text Transmogrifier
// @description    Transmogrify your text on any page!
// @grant          none
// @include        *
// ==/UserScript==

/*
 * Pick a transformation out of the transformations
 */

var transmogrification = 'rot13';

var transmogrifications = {
	'strip_vowels': function(text){ //strips all vowels. Surprisingly readable!
		return text.replace(/[aeiou]+/gi, '');	
	},

	'strip_consonants': function(text){ //strips all consonants. Don't even try reading this one.
		return text.replace(/[bcdfghjklmnpqrstvwxyz]+/gi, '');	
	},
	'cambridge_scramble': function(text){ //Keeps the first and last character of every word, scrambles the rest. Readable but fun!
		return text.replace(/\B[a-zA-Z]+\B/g, function(match){
			var letters = match.split('');
			shuffle(letters);
			return letters.join('');
		});
	},
	'reverse_words': function(text){
		return text.replace(/([a-zA-Z]+)/g, function(match){
				   return match.split('').reverse().join('')
		});
	},
	'engrish': function(text){ //HAHA check out http://en.wikipedia.org/wiki/Loneliness
		return text.replace(/l/g, 'r').replace(/L/g, 'R').
			replace(/\b(the|an|a|my)\b/g, '').
			replace(/([^aeiou][aeiou][^aeiou])ing/g, '$1e').
			replace(/ies\b/g, 'y');
	},
	'japanese': function(text){
		return text.replace(/[aeiou]\b/g, 'eru').replace(/([sr])\b/g, '$1u').replace(/st\b/g, 'steru');
	},
	'censored': function(text){
		return text.replace(/[^\s]/g, '\u2588');
	},
	'face': function(text){
		return text.replace(/[^\s]+/g, '( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)');
	},
	'obscene': function(text){ //NSFW
		return text.replace(/\b(the|a|my|our|your|their)\b ([a-z]+)/gi, function(match, p1, p2){
			var roots = [
				'\u0066\u0075\u0063\u006bing',
			];
			var index = Math.floor(Math.random() * 6);
			if (index >= roots.length){
				return(p1 + ' ' + p2);
			}
			return (p1 + ' ' + roots[index] + ' ' + p2);
		}).
			replace(/, and [\w]+([.,])/g , ', and shit$1').
			replace(/\b(new|ugly)\b [\w]+/g, '$1-ass').
			replace(/([a-zA-Z]+)\./g, function(match,p1){
			var ends = [
				'you know what I\'m saying?',
				'bro.'
			];
			var index = Math.floor(Math.random()*4);
			var output = p1;
			if ( index >= ends.length){
				output += '.';
			}else{
				output += ', ' + ends[index];
			}
			return output;

		});
	},
	'illiterate': function(text){
		return text;
	},
	'scramble_words': function(text){
		return text.replace(/([^\r.":;@,!?]+)/g, new Scrambler(/[a-zA-Z0-9'-]+/g));
	},
	'rot13': function(text){
		return text.replace(/[a-zA-Z]/g, function(match){
			return rot13[alphabet.indexOf(match)];
		});
	}
};

/*
 * Helper Functions:
 */

function Scrambler(regex){
	return function(text){
		var words = text.match(regex);
		if (words === null) return text;
		shuffle(words);
		return text.replace(regex, function(match){
				   return words.pop();
		});
	};
}

var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var rot13 =    "nopqrstuvwxyzabcdefghijklmNOPQRSTUVWXYZABCDEFGHIJKLM";

function shuffle(arr){ //Knuth-Fisher-Yates shuffle, or picking out of hat :)
	var temp,rand;
	for(var i = arr.length -1; i > 0; i--){
		rand = Math.floor(Math.random()*(i+1));
		temp = arr[i];
		arr[i] = arr[rand];
		arr[rand] = temp;
	}
}

/*
 * Magic happens here:
 */

document.addEventListener("DOMContentLoaded",function(){
	function replace(root){
		var walker = document.createTreeWalker(
			root,
			NodeFilter.SHOW_TEXT,
			{acceptNode: function(node){
				var type = node.parentNode.nodeName.toLowerCase();
				if (['script', 'style','noscript'].indexOf(type) >= 0){
					return NodeFilter.FILTER_ACCEPT;
				}
				node.nodeValue = transmogrifications[transmogrification](node.nodeValue);
				return NodeFilter.FILTER_ACCEPT;
			}},
			false
		);
		while(walker.nextNode()) {continue};
	}
	//First, replace document on load
	replace(document);

	//C'mon, nowadays DOM gets mutated all the time...
	var mutationobserver = new MutationObserver(function(mutations){
		mutations.forEach(function(mutation){
			if(mutation.type === 'childList'){
				var nodelist = mutation.addedNodes;
				for (var i = 0; i< nodelist.length; i++){
					var node = nodelist[i];
					replace(node);
				}
			}
		});
	});

	mutationobserver.observe(document, {
		childList: true,
		attributes: true,
		characterData: true,
		subtree: true,
	});
}, false);
