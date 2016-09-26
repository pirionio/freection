chrome.storage.sync.get({
    baseUrl: 'https://freection.com'
}, function(options) {
    var url = options.baseUrl + '/chrome.js'

    markExtensionInstalled(url)
    InboxSDK.loadScript(url);
});

function markExtensionInstalled(url) {
    window.postMessage('FreectionChromeExtension', url);
}
