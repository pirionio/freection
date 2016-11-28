function isDevMode() {
    return !('update_url' in chrome.runtime.getManifest());
}

function save() {
    var options = {};

    $(".option-value").each(function() {
        options[this.name] = this.value;
    });
    
    chrome.storage.sync.set(options, updateSaveStatus);
}

function updateSaveStatus() {
    var statusElement = $(".save-status")[0];
    statusElement.textContent = 'Options saved.';
    setTimeout(function() {
        statusElement.textContent = '';
    }, 750);
}

function restoreBaseUrl() {
    // Determining the default values.
    chrome.storage.sync.get({
        baseUrl: 'https://app.freection.com'
    }, function(options) {
        for (var field in options) {
            if (options.hasOwnProperty(field)) {
                var element = $("input[name='" + field + "']")[0];
                if (element) {
                    element.value = options[field];
                }
            }
        }
    });
}

function main() {
    if (!isDevMode()) {
        $(".dev-only").remove();

        if (!$(".option").length) {
            $(".properties").remove();
            $(".save-div").remove();
        }
    }

    $(document).on('DOMContentLoaded', restoreBaseUrl);
    $(".save-button").on('click', save);
}

main();