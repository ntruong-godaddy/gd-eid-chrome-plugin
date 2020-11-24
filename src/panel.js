chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
      if (request &&
          request.request &&
          request.request.url &&
          request.request.url.startsWith('https://events.api.godaddy.com/pageEvents.aspx')) {
          const trafficData = request.request.url.replace('https://events.api.godaddy.com/pageEvents.aspx?', '');
          const trafficObject = JSON.parse('{"' + decodeURI(trafficData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
          // console.log('trafficObject', trafficObject);
          let eidTableBody = document.getElementById('eidTableBody');
          eidTableBody.innerHTML += '<tr>' + 
                                      '<td>' + trafficObject.e_id + '</td>' + 
                                      '<td>' + new Date(parseInt(trafficObject.timestamp)) + '</td>' + 
                                      '<td>' + trafficObject.eventtype + '</td>' + 
                                    '</tr>';
      }
  }
);

chrome.tabs.onUpdated.addListener(function (tabId , info) {
  if (info.status === 'complete') {
    let eidTableBody = document.getElementById('eidTableBody');
    eidTableBody.innerHTML = '';
  }
});

function sortTable() {
  console.log('sortTable');
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("eidTableBody");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      // Check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
