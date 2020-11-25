function getCurrentTab(callback) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tabs => {
      callback(tabs[0]);
    }
  );
}

getCurrentTab(tab => {
  chrome.runtime.sendMessage({ type: 'popupInit', tabId: tab.id }, response => {
    if (response) {
      console.log('response: ', response);
      let eidTableBody = document.getElementById('eidTableBody');
      for (const row in response.requests) {
        console.log('row: ', row);
        eidTableBody.innerHTML += '<tr>' + 
                                    '<td>' + response.requests[row].eidName + '</td>' + 
                                    '<td>' + new Date(parseInt(response.requests[row].timestamp)) + '</td>' + 
                                    '<td>' + response.requests[row].eventType + '</td>'
                                  '</tr>';
      }
    }
  });
});

