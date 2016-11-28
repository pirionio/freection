const ThreadsStore = require('./threads-store')
const FreectionApi = require('./freection-api')
const {threadRowToDto, threadViewToDto} = require('./transformers')

let emailThingsTimeout = null
const threadsStore = new ThreadsStore()

InboxSDK.load('1', 'sdk_freection_ccfa62bcce').then(go)

function go(sdk) {
	getOptions().then(options => {
		FreectionApi.getUser(options).then(freectionUser => {
			const gmailUser = getGmailUser(sdk)
			if (freectionUser.email === gmailUser) {
				addCss(sdk)
				addDoButtonToEmailRows(sdk, options)
				addDoButtonToEmailPage(sdk, options)
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
			baseUrl: 'https://app.freection.com'
		}, function(options) {
			resolve(options)
		})
	})
}

function addCss() {
	var cssFile = chrome.extension.getURL('styles/style.css')

	var css = $('<link rel="stylesheet" type="text/css">')
	css.attr('href', cssFile)
	$('head').first().append(css)
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
						FreectionApi.doEmail(options, threadRowToDto(threadRowView)).then(() => syncEmailThings(options))
					}
				}
			})
		)
	})
}

function addDoButtonToEmailPage(sdk, options) {
	sdk.Toolbars.registerToolbarButtonForThreadView({
		title: 'Do in Freection',
		iconUrl: chrome.runtime.getURL('images/do.png'),
		iconClass: 'freection-toolbar-do',
		section: sdk.Toolbars.SectionNames.METADATA_STATE,
		onClick: function(event) {
			sdk.Router.goto(sdk.Router.NativeRouteIDs.INBOX)
			FreectionApi.doEmail(options, threadViewToDto(event.threadView, {sdk})).then(() => syncEmailThings(options))
		}
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


