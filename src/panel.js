chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
      if (request &&
          request.request &&
          request.request.url &&
          request.request.url.startsWith('https://events.api.godaddy.com/pageEvents.aspx')) {
          const trafficData = request.request.url.replace('https://events.api.godaddy.com/pageEvents.aspx?', '');
          const trafficObject = JSON.parse('{"' + decodeURI(trafficData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
          console.log('trafficObject', trafficObject.timestamp);
          let eidTableBody = document.getElementById('eidTableBody');
          eidTableBody.innerHTML += '<tr>' + 
                                      '<td>' + trafficObject.e_id + '</td>' + 
                                      '<td>' + new Date(parseInt(trafficObject.timestamp)) + '</td>' + 
                                      '<td>' + trafficObject.event_type + '</td>' + 
                                    '</tr>';
      }
  }
);
