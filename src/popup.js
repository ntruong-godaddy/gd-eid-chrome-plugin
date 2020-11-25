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
        // get extraData
        let trafficObjectUSRIN = 'empty';
          if (response.requests[row].usrin) {
            const toBeParsed = `{"${response.requests[row].usrin.replaceAll('%2C', '":"').replaceAll('^', '", "')} "}`
            try {
              // console.log('attempt to parse ', toBeParsed);
              trafficObjectUSRIN = JSON.parse(toBeParsed);
            } catch (e) {
              // console.error(`failed to parse the usrin for ${trafficObject.e_id}, will use unparsed usrin for extra data column! got this error ${e}`);
              trafficObjectUSRIN = toBeParsed;
            }
          }
        const timestamp = new Date(parseInt(response.requests[row].timestamp));
        eidTableBody.innerHTML += '<tr>' + 
                                    '<td>' + response.requests[row].eidName + '</td>' + 
                                    '<td>' + timestamp.toDateString() + ' ' + timestamp.toLocaleTimeString('en-US', { hour12: false }) + '</td>' + 
                                    '<td>' + response.requests[row].eventType + '</td>' +
                                    '<td>' + JSON.stringify(trafficObjectUSRIN)+ '</td>' +
                                  '</tr>';
      }
    }
  });
});

