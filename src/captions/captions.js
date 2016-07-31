chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	sendResponse(true);
    document.getElementById('wrapper').innerHTML = request.captions;
  }
);