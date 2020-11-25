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
  const link0Asc = document.getElementById('sort-0-asc');
  link0Asc.addEventListener('click', function() {
    sortTable(0, true);
  });
  const link0Desc = document.getElementById('sort-0-des');
  link0Desc.addEventListener('click', function() {
    sortTable(0, false);
  });
  const link1Asc = document.getElementById('sort-1-asc');
  link1Asc.addEventListener('click', function() {
    sortTable(1, true);
  });
  const link1Desc = document.getElementById('sort-1-des');
  link1Desc.addEventListener('click', function() {
    sortTable(1, false);
  });
  const link2Asc = document.getElementById('sort-2-asc');
  link2Asc.addEventListener('click', function() {
    sortTable(2, true);
  });
  const link2Desc = document.getElementById('sort-2-des');
  link2Desc.addEventListener('click', function() {
    sortTable(2, false);
  });
  const reset = document.getElementById('reset');
  reset.addEventListener('click', function() {
    let eidTableBody = document.getElementById('eidTableBody');
    eidTableBody.innerHTML = '';
  });
});

function sortTable(index, direction) {
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
    for (i = 0; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[index];
      y = rows[i + 1].getElementsByTagName("TD")[index];
      // Check if the two rows should switch place:
      if(direction) {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
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

document.addEventListener('DOMContentLoaded', function() {
  console.log('adding EventListener to DOM for searchNames');
  var searchNamesInput = document.getElementById('searchNames');
  // onkeyup's logic below:
  searchNamesInput.addEventListener('keyup', function() {
    searchNames();
  });
});

function searchNames() {
  console.log('searchNames');
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchNames");
  filter = input.value.toUpperCase();
  table = document.getElementById("eidTableBody");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
