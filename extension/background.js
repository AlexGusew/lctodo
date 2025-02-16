chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.executeScript(tab.id, { file: "content.js" }, () => {
    chrome.tabs.sendMessage(tab.id, { action: 'postUrl' });
  });
});