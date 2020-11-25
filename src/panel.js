chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
      if (request &&
          request.request &&
          request.request.url &&
          request.request.url.startsWith('https://events.api.godaddy.com/pageEvents.aspx')) {
          const trafficData = request.request.url.replace('https://events.api.godaddy.com/pageEvents.aspx?', '');
          const trafficObject = JSON.parse('{"' + decodeURI(trafficData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
          console.log('trafficObject', trafficObject);
          // const trafficObjectUSRIN = JSON.parse('{"' + decodeURI(trafficObject.usrin).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
          // console.log('trafficObjectUSRIN', trafficObjectUSRIN);
          let eidTableBody = document.getElementById('eidTableBody');
          const timestamp = new Date(parseInt(trafficObject.timestamp));
          eidTableBody.innerHTML += '<tr>' + 
                                      '<td>' + trafficObject.e_id + '</td>' + 
                                      '<td>' + timestamp.toDateString() + ' ' + timestamp.toLocaleTimeString('en-US', { hour12: false }) + '</td>' + 
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

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('sort-0-asc');
  // onClick's logic below:
  link.addEventListener('click', function() {
    sortTable(0, true);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('sort-0-des');
  // onClick's logic below:
  link.addEventListener('click', function() {
    sortTable(0, false);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('sort-1-asc');
  // onClick's logic below:
  link.addEventListener('click', function() {
    sortTable(1, true);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('sort-1-des');
  // onClick's logic below:
  link.addEventListener('click', function() {
    sortTable(1, false);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('sort-2-asc');
  // onClick's logic below:
  link.addEventListener('click', function() {
    sortTable(2, true);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('sort-2-des');
  // onClick's logic below:
  link.addEventListener('click', function() {
    sortTable(2, false);
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
