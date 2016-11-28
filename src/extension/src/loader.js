chrome.storage.sync.get({
    baseUrl: 'https://app.freection.com'
}, function(options) {
    var url = options.baseUrl + '/chrome.js'

    markExtensionInstalled(url)
    InboxSDK.loadScript(url);
});

function markExtensionInstalled(url) {
    if (url && url.startsWith(window.location.origin)) {
        window.postMessage('FreectionChromeExtension', url);
    }
}
