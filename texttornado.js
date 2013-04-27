var globalwords = []; 

function shuffle(words){ //Knuth-Yates-Fisher shuffle, or picking out of a hat :)
	var t,j;
	for( var i = words.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i+1));
		t = words[i];
		words[i] = words[j];
		words[j] = t;
	}
}

var unwantedNodeTypes = ['script', 'style', 'noscript'];

var jumble = new function(){
	globalwords = []; //reset words,

	//collect words,
       	var walker = document.createTreeWalker(
		document,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);
	var type, node, matches;
	while(node = walker.nextNode()) {
		type = node.parentNode.nodeName.toLowerCase();
		if (unwantedNodeTypes.indexOf(type) >= 0) continue;
		matches = node.nodeValue.match(/[a-zA-Z0-9'_-]+/g);
		if (matches == null) continue;
		globalwords = globalwords.concat(matches);
	}

	shuffle(globalwords); //TORNADO!!

	//repopulate words.
	walker = document.createTreeWalker(
		document,
		NodeFilter.SHOW_TEXT,
		{acceptNode: function(node){
			var type = node.parentNode.nodeName.toLowerCase();
			if (unwantedNodeTypes.indexOf(type) >= 0){
				return NodeFilter.FILTER_ACCEPT;
			}
			node.nodeValue = node.nodeValue.replace(/[a-zA-Z0-9'_-]+/g, function(match){
				return globalwords.pop();
			});
			return NodeFilter.FILTER_ACCEPT;
		}},
		false
	);
	while(walker.nextNode()) {continue};
}
