chrome.storage.sync.get({
    baseUrl: 'https://freection.com'
}, function(options) {
    var url = options.baseUrl + '/chrome.js'
    InboxSDK.loadScript(url);
});
