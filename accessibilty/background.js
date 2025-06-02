chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background script active, but no features currently use it.");
    // No functionality needed now that image descriptions are removed
});