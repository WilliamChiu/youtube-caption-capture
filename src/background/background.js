var foundCaptions = false;
var captions = "";

chrome.webRequest.onCompleted.addListener(
	function(details) {
		if (details.url.indexOf('timedtext') != -1 && !foundCaptions) {
			foundCaptions = true;
			getCaptions(details.url);
		}

	},
	{urls: ["*://*.youtube.com/*"]}
);

chrome.browserAction.onClicked.addListener(function (tab) {
	if (captions !== "") {
		chrome.tabs.create({url: chrome.extension.getURL("src/captions/captions.html")}, function(tab) {
			injectCaptions(tab);
		}); 
	}
});

function getCaptions(url) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			captions = xmlHttp.responseText;
			foundCaptions = false;
		}
	}
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function injectCaptions(tab) {
	chrome.tabs.sendMessage(tab.id, {"captions" : captions}, function(response) {
		if (response == null) setTimeout(injectCaptions.bind(null, tab), 100);
		else {
			console.log("Captions injected! Clearing captions...");
			captions = "";
		}
	});
}

