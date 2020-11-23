chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete' && tab.active) {
        if (/^https:\/\/account\.godaddy\.com/.test(tab.url)) {
            chrome.tabs.executeScript(null, { file: './foreground.js' }, () => {
                console.log('foreground script injected');
            });
        }
    }
    // chrome.tabs.get(tab.tabId, current_tab_info => {
    // });
});
