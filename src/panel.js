chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
      if (request &&
          request.request &&
          request.request.url &&
          request.request.url.startsWith('https://events.api.godaddy.com/pageEvents.aspx')) {
          const trafficData = request.request.url.replace('https://events.api.godaddy.com/pageEvents.aspx?', '');
          const trafficObject = JSON.parse('{"' + decodeURI(trafficData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
          // console.log('trafficObject', trafficObject);
          let trafficObjectUSRIN = 'empty';
          if (trafficObject.usrin) {
            const toBeParsed = `{"${trafficObject.usrin.replaceAll('%2C', '":"').replaceAll('^', '", "')} "}`
            try {
              // console.log('attempt to parse ', toBeParsed);
              trafficObjectUSRIN = JSON.parse(toBeParsed);
            } catch (e) {
              // console.error(`failed to parse the usrin for ${trafficObject.e_id}, will use unparsed usrin for extra data column! got this error ${e}`);
              trafficObjectUSRIN = toBeParsed;
            }
          }
          let eidTableBody = document.getElementById('eidTableBody');
          const timestamp = new Date(parseInt(trafficObject.timestamp));

          // adding it to the table
          eidTableBody.innerHTML += '<tr>' +
                                      '<td>' + trafficObject.e_id + '</td>' +
                                      '<td>' + timestamp.toDateString() + ' ' + timestamp.toLocaleTimeString('en-US', { hour12: false }) + '</td>' +
                                      '<td>' + trafficObject.eventtype + '</td>' +
                                      '<td>' + JSON.stringify(trafficObjectUSRIN)+ '</td>' + // right now I'm just stringifying it, but we can pull specific things out maybe?
                                    '</tr>';
      }
  }
);

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

// chrome.tabs.onUpdated.addListener(function (tabId , info) {
//   if (info.status === 'complete') {
//     let eidTableBody = document.getElementById('eidTableBody');
//     eidTableBody.innerHTML = '';
//   }
// });

document.addEventListener('DOMContentLoaded', function() {
  console.log('adding EventListener to DOM for searchNames');
  var searchNamesInput = document.getElementById('searchNames');
  // onkeyup's logic below:
  searchNamesInput.addEventListener('keyup', function() {
    searchNames();
  });
});
