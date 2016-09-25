const ThreadsStore = require('./threads-store')
const FreectionApi = require('./freection-api')

let emailThingsTimeout = null
const threadsStore = new ThreadsStore()

InboxSDK.load('1', 'sdk_Freection_cc8823491c').then(go)

function go(sdk) {
	getOptions().then(options => {
		FreectionApi.getUser(options).then(freectionUser => {
			const gmailUser = getGmailUser(sdk)
			if (freectionUser.email === gmailUser) {
				addDoButtonToEmailRows(sdk, options)
				syncEmailThings(options)
			}
		})
	})
}

function getGmailUser(sdk) {
	return sdk.User.getEmailAddress()
}

function getOptions() {
	return new Promise(resolve => {
		chrome.storage.sync.get({
			baseUrl: 'https://freection.com'
		}, function(options) {
			resolve(options)
		})
	})
}

function addDoButtonToEmailRows(sdk, options) {
	sdk.Lists.registerThreadRowViewHandler(threadRowView => {
		const threadId = threadRowView.getThreadID()

		if (!threadsStore.hasThreadData(threadId)) {
			threadsStore.initThreadData(threadId)
		}

		threadRowView.addButton(threadsStore.getStream()
			.toProperty(() => threadsStore.getThreadData(threadId))
			.map(() => {
				const threadData = threadsStore.getThreadData(threadId)

				if (threadData && threadData.isEmailThing) {
					return {
						iconUrl: chrome.runtime.getURL('images/do-disabled.png'),
						onClick: function() {
						}
					}
				}

				return {
					iconUrl: chrome.runtime.getURL('images/do.png'),
					onClick: function() {
						FreectionApi.doEmail(options, threadRowView).then(() => syncEmailThings(options))
					}
				}
			})
		)
	})
}

function syncEmailThings(options) {
	function fetchEmailThings() {
		FreectionApi.getEmailThings(options).then(emailThings => {
			threadsStore.initThreadsData()
			threadsStore.markAsThing(emailThings.map(thing => thing.payload.threadIdHex))
		})
	}

	fetchEmailThings()
	clearInterval(emailThingsTimeout)
	emailThingsTimeout = setInterval(fetchEmailThings, 1000 * 60)
}


