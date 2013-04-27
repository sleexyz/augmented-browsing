/*
 * Pick a transformation out of the transformations
 */

var transmogrification = 'cambridge_scramble';

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
		return text.replace(/l/g, 'r').
			replace(/L/g, 'R').
			replace(/\bmy[^a-zA-Z]|\bthe[^a-zA-Z]|\ba[^a-zA-Z]|\ban[^a-zA-Z]/g, '').
			replace(/([^aeiou])es\b|([^aeiou])ed\b|[^aeiou][aeiou][^aeiou]ing\b/g, '$1$2e').
			replace(/([^aeiosu])s\b|([^aeiou])ed\b|([^aeiouh])ing\b/g, '$1$2$3').
			replace(/ies\b/g,'y');
	},
	'japanese': function(text){
		return text.replace(/[aeiou]\b/g, 'eru').replace(/([sr])\b/g, '$1u').replace(/st\b/g, 'steru');
	},
	'bricks': function(text){
		return text.replace(/[^\s]/g, '\u2588');
	},
	'obscene': function(text){ //NSFW
		return text.replace(/\b(the|a)\b [a-zA-Z]+/g, '$1 \u0066\u0075\u0063\u006bing');

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
replace(document);
