// chrome.devtools.network.onRequestFinished.addListener(
//     function(request) {
//         if(request &&
//             request.request &&
//             request.request.url &&
//             request.request.url.startsWith('https://events.api.godaddy.com/pageEvents.aspx')) {
//             const trafficData = request.request.url.replace('https://events.api.godaddy.com/pageEvents.aspx?', '');
//             const trafficObject = JSON.parse('{"' + decodeURI(trafficData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
//             console.log('timestamp', trafficObject.timestamp);
//             console.log('e_id', trafficObject.e_id);
//         }
//     }
// );

chrome.devtools.panels.create("EID Panel",
    null,
    "./../html/EIDPanel.html",
    function(panel) {
      // code invoked on panel creation
      console.log("EID Panel created");
    }
);
