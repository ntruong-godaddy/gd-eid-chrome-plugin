(function () {
  const tabStorage = {};
  const networkFilters = {
    urls: [
      'https://events.api.godaddy.com/pageEvents.aspx*'
    ]
  };

  // add a new EID entry when a request is completed successfully
  chrome.webRequest.onCompleted.addListener((details) => {
    const { tabId, requestId } = details;
    if (!tabStorage.hasOwnProperty(tabId) ) { // || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
      return;
    }
    console.log('details: ', details)

    const trafficData = details?.url.replace('https://events.api.godaddy.com/pageEvents.aspx?', '');
    const trafficObject = JSON.parse('{"' + decodeURI(trafficData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    tabStorage[tabId].requests[requestId] = {
      eidName: trafficObject.e_id,
      timestamp: trafficObject.timestamp,
      eventType: trafficObject.eventtype,
      extraData: ''
    }

    console.log(tabStorage[tabId].requests[details.requestId]);
  }, networkFilters);

  // Log error in the plug-in
  chrome.webRequest.onErrorOccurred.addListener((details) => {
    const { tabId, requestId } = details;
    if (!tabStorage.hasOwnProperty(tabId)) { // || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
      return;
    }

    const trafficData = details?.url.replace('https://events.api.godaddy.com/pageEvents.aspx?', '');
    const trafficObject = JSON.parse('{"' + decodeURI(trafficData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    tabStorage[tabId].requests[requestId] = {
      eidName: trafficObject.e_id,
      timestamp: trafficObject.timestamp,
      eventType: trafficObject.eventtype,
      extraData: 'ERROR'
    }

    console.log(tabStorage[tabId].requests[requestId]);
  }, networkFilters);

  // When a new tab is created, add it to tab storage (start tracking it)
  chrome.tabs.onActivated.addListener((tab) => {
    const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
    if (!tabStorage.hasOwnProperty(tabId)) {
      tabStorage[tabId] = {
        id: tabId,
        requests: {},
        registerTime: new Date().getTime()
      };
    }
  });

  // when a tab is closed, remove it from the tab storage (stop tracking it)
  chrome.tabs.onRemoved.addListener((tab) => {
    const tabId = tab.tabId;
    if (!tabStorage.hasOwnProperty(tabId)) {
      return;
    }
    tabStorage[tabId] = null;
  });

  // if the tab is refreshed, erase EID data
  // chrome.webNavigation.onCommitted.addListener((details) => {
  //   console.log('details', details);
  //   if (details.transitionType == 'reload') {
  //     const { tabId } = details;
  //     if (!tabStorage.hasOwnProperty(tabId)) {
  //       return;
  //     }
  //     tabStorage[tabId].requests = null;
  //   }
  // })

  // when the popup is opened, send that tab a message with all eids for the tab
  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log('in onMessage');
    switch (msg.type) {
        case 'popupInit':
            console.log('in popupInit');
            response(tabStorage[msg.tabId]);
            break;
        case 'pageReload':
            
        default:
            response('unknown request');
            break;
    }
});
}());
