InboxSDK.load('1', 'sdk_Freection_cc8823491c').then(function(sdk) {
	sdk.Lists.registerThreadRowViewHandler(function(threadRowView) {
		threadRowView.addButton({
			iconUrl: chrome.runtime.getURL('images/do.png'),
			onClick: function() {
				var threadId = threadRowView.getThreadID()
				createThing(threadId)
			}
		});
	});
});

function createThing(threadId) {
	chrome.storage.sync.get({
		baseUrl: 'https://freection.com'
	}, function(options) {
		// Notice that the threadId here is in hex.
		// The API of Freection needs to be notified about it, because it essentially works with IMAP which expects decimal values.
		var url = options.baseUrl + '/emails/api/' + threadId + '/do';
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				isHex: true
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	});
}
