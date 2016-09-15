// TODO Load the extension files from our server:
// The ID of the extension is currently hard-coded.
// The recommendation of InboxSDK is to load the files of the extension from our server.
// In order to do that, we need to bundle the files of the extension and serve them.
// This could be done later.
InboxSDK.load('1', 'sdk_Freection_cc8823491c').then(function(sdk) {
	sdk.Lists.registerThreadRowViewHandler(function(threadRowView) {
		threadRowView.addButton({
			iconUrl: chrome.runtime.getURL('images/do.png'),
			onClick: function() {
				var threadId = threadRowView.getThreadID()
				chrome.runtime.sendMessage({type: 'DO_EMAIL', threadId: threadId})
			}
		});
	});
});
