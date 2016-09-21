// Saves options to chrome.storage
function saveBaseUrl() {
    var baseUrl = document.getElementById('baseUrl').value;
    chrome.storage.sync.set({
        baseUrl: baseUrl
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreBaseUrl() {
    // Determining the default value.
    chrome.storage.sync.get({
        baseUrl: 'https://freection.com'
    }, function(options) {
        document.getElementById('baseUrl').value = options.baseUrl;
    });
}

document.addEventListener('DOMContentLoaded', restoreBaseUrl);
document.getElementById('saveBaseUrl').addEventListener('click', saveBaseUrl);