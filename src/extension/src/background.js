// Show the extension only on a gmail tab.
chrome.tabs.onUpdated.addListener(function(tabId, data, tab) {
    if (tab && tab.url && tab.url.indexOf('https://mail.google.com') > -1) {
        chrome.pageAction.show(tabId);
    }
});

// Upon clicking the Do button, access Freection with the relevant Thread ID.
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message && message.type === 'DO_EMAIL') {
        // Notice that the threadId here is in hex.
        // The API of Freection needs to be notified about it, because it essentially works with IMAP which expects decimal values.
        jQuery.post({
            url: 'http://freection.com/emails/api/' + message.threadId + '/do',
            data: {
                isHex: true
            },
            dataType: 'json',
            success: function(data, status) {
                sendResponse({data: data, status: status})
            }
        });
    }
});
