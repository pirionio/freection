InboxSDK.load('1', 'sdk_Freection_cc8823491c').then(go);

function go(sdk) {
	getOptions().then(function (options) {
		getFreectionUser(options).then(function (freectionUser) {
			const gmailUser = getGmailUser(sdk)
			if (freectionUser.email === gmailUser) {
				addDoButtonToEmailRows(sdk, options)
			}
		})
	});
}

function getOptions() {
	return new Promise((resolve) => {
		chrome.storage.sync.get({
			baseUrl: 'https://freection.com'
		}, function(options) {
			resolve(options);
		});
	})
}

function addDoButtonToEmailRows(sdk, options) {
	sdk.Lists.registerThreadRowViewHandler((threadRowView) => {
		threadRowView.addButton({
			iconUrl: chrome.runtime.getURL('images/do.png'),
			onClick: function() {
				createThing(options, threadRowView)
			}
		});
	});
}

function getGmailUser(sdk) {
	return sdk.User.getEmailAddress()
}

function getFreectionUser(options) {
	return fetch(options.baseUrl + '/api/general/user', {
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	}).then(response => {
		return response.json()
	});
}

function createThing(options, threadRowView) {
	const threadId = threadRowView.getThreadID()
	const subject = threadRowView.getSubject()
	const contacts = threadRowView.getContacts()

	// Notice that the threadId here is in hex.
	// The API of Freection needs to be notified about it, because it essentially works with IMAP which expects decimal values.
	var url = options.baseUrl + '/emails/api/do';

	return fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			isHex: true,
			emailData: {
				threadId: threadId,
				subject: subject,
				recipients: contacts
			}
		}),
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
}
