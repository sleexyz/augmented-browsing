// ==UserScript==
// @name           Text Tornado
// @namespace      Text Tornado
// @description    Jumbles up all the words on the page.
// @grant          none
// @include        *
// ==/UserScript==

var updateDelay = 500; //Delay to re-jumble text after page updates

var ajaxSuperHeavy= ['www.facebook.com'];
if (ajaxSuperHeavy.indexOf(window.location.host) >= 0){
	updateDelay = 1500;
}

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

function jumble(){
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

document.addEventListener("DOMContentLoaded",function(){
	jumble(); //initial jumble

	var updating = false;
	function update(){ //Switch mechanism
		if (updating == false){
			updating = true;
			setTimeout(function(){
				jumble();
				updating = false;
			},updateDelay);
		}
	}

	//C'mon, we gotta keep jumbling if page updates!
	var mutationobserver = new MutationObserver(function(mutations){
		for( var i = 0; i< mutations.length; i++){
			if(mutations[i].type === 'childList') update();
		}
	});

	mutationobserver.observe(document, {
		childList: true,
		attributes: true,
		characterData: true,
		subtree: true,
	});
}, false);
