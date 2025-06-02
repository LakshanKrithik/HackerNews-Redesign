document.addEventListener("DOMContentLoaded", function () {
    console.log("Popup loaded");

    // Increase Font Size (unchanged)
    document.getElementById("increaseFont").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    document.querySelectorAll("*").forEach(el => {
                        let currentSize = window.getComputedStyle(el).fontSize;
                        el.style.fontSize = (parseFloat(currentSize) + 2) + "px";
                    });
                }
            });
        });
    });

    // Decrease Font Size (unchanged)
    document.getElementById("decreaseFont").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    document.querySelectorAll("*").forEach(el => {
                        let currentSize = window.getComputedStyle(el).fontSize;
                        el.style.fontSize = (parseFloat(currentSize) - 2) + "px";
                    });
                }
            });
        });
    });

    // Enable Text-to-Speech (unchanged)
    document.getElementById("enableTTS").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    speechSynthesis.cancel();
                    let selectedText = window.getSelection().toString().trim();
                    if (selectedText.length === 0) {
                        alert("Please select text to read.");
                        return;
                    }
                    let utterance = new SpeechSynthesisUtterance(selectedText);
                    speechSynthesis.speak(utterance);
                }
            });
        });
    });

    // Stop Text-to-Speech (unchanged)
    document.getElementById("stopTTS").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    speechSynthesis.cancel();
                }
            });
        });
    });

    // Enable High Contrast (unchanged)
    document.getElementById("highContrast").addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: enableHighContrast
            });
        });
    });

    // Reset Contrast (unchanged)
    document.getElementById("resetContrast").addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: resetContrast
            });
        });
    });

    // Adaptive Layout with Prompt
    const adaptButton = document.getElementById("adaptivelayout");
    if (adaptButton) {
        console.log("Adaptive layout button found");
        adaptButton.addEventListener("click", () => {
            console.log("Simplify Layout clicked");
            const mode = window.prompt("Choose layout style: 'light' or 'dark'", "light");
            console.log("Mode selected:", mode);
            if (mode === null) {
                console.log("Prompt canceled");
                return;
            }

            const normalizedMode = mode.toLowerCase().trim();
            if (normalizedMode !== "light" && normalizedMode !== "dark") {
                alert("Invalid choice! Using 'light' mode.");
            }

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                console.log("Executing script on tab:", tabs[0].id);
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: adaptLayout,
                    args: [normalizedMode === "dark" ? "dark" : "light"]
                }, (results) => {
                    if (chrome.runtime.lastError) {
                        console.error("Script execution error:", chrome.runtime.lastError);
                    } else {
                        console.log("Script executed successfully");
                    }
                });
            });
        });
    } else {
        console.error("Button #adaptivelayout not found");
    }
});

// Function to enable high contrast (unchanged)
function enableHighContrast() {
    document.body.style.filter = "contrast(200%) brightness(90%)";
    document.body.style.backgroundColor = "black";
    document.body.style.color = "yellow";
}

// Function to reset contrast settings (unchanged)
function resetContrast() {
    document.body.style.filter = "none";
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
}

// Function to adapt layout with mode selection
function adaptLayout(mode) {
    console.log("adaptLayout called with mode:", mode);
    const existingStyle = document.getElementById("adaptive-style");
    if (existingStyle) existingStyle.remove();

    let baseStyles = `
        body {
            margin: 0 !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        }
        #content, #mw-content-text {
            width: 90% !important;
            max-width: 1200px !important;
            margin: 0 auto 20px auto !important;
            padding: 20px !important;
            display: block !important;
            float: none !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
        }
        #mw-head, #mw-head-base {
            width: 100% !important;
            position: sticky !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 10px !important;
            z-index: 1000 !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        #mw-panel {
            width: 90% !important;
            max-width: 1200px !important;
            margin: 20px auto !important;
            padding: 15px !important;
            display: block !important;
            float: none !important;
            border-radius: 8px !important;
        }
        #bodyContent, #mw-content-text p, #mw-content-text li {
            font-size: 18px !important;
            line-height: 1.8 !important;
            margin: 0 0 20px 0 !important;
        }
        h1, h2, h3, h4, h5, h6 {
            width: 100% !important;
            display: block !important;
            margin: 30px 0 15px 0 !important;
            padding: 5px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        .infobox, table {
            width: 100% !important;
            max-width: 100% !important;
            float: none !important;
            margin: 20px 0 !important;
            padding: 10px !important;
            display: block !important;
            border: 1px solid #ddd !important;
            border-radius: 5px !important;
            box-sizing: border-box !important;
        }
        img, .thumbinner {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin: 20px auto !important;
        }
        * {
            overflow-wrap: break-word !important;
            box-sizing: border-box !important;
        }
    `;

    let modeStyles = "";
    if (mode === "dark") {
        modeStyles = `
            body {
                background-color: #2b303b !important; /* Soft dark blue-gray */
                border: 3px solid #5e81ac !important; /* Nordic blue border */
                color: #d8dee9 !important; /* Light gray text */
            }
            #content, #mw-content-text {
                background-color: #3b4252 !important; /* Slightly lighter dark */
                color: #d8dee9 !important;
                border: 1px solid #4c566a !important; /* Subtle border */
            }
            #mw-head, #mw-head-base {
                background-color: #343c4b !important; /* Darker header */
                color: #d8dee9 !important;
            }
            #mw-panel {
                background-color: #3b4252 !important;
                color: #d8dee9 !important;
                border: 1px solid #4c566a !important;
            }
            h1, h2, h3, h4, h5, h6 {
                color: #eceff4 !important; /* Bright headings */
                border-bottom: 1px solid #5e81ac !important; /* Matching divider */
            }
            .infobox, table {
                background-color: #434c5e !important; /* Distinct but dark */
                color: #d8dee9 !important;
                border: 1px solid #5e81ac !important;
            }
            a:link, a:visited { /* Links for contrast */
                color: #88c0d0 !important; /* Light cyan links */
            }
            a:hover {
                color: #8fbcbb !important; /* Softer hover */
            }
        `;
    } else {
        modeStyles = `
            body {
                background-color: #f5f5f5 !important;
                border: 3px solid blue !important;
                color: #333333 !important;
            }
            #content, #mw-content-text {
                background-color: #ffffff !important;
                color: #333333 !important;
            }
            #mw-head, #mw-head-base {
                background-color: #f8f8f8 !important;
            }
            #mw-panel {
                background-color: #fafafa !important;
            }
            h1, h2, h3, h4, h5, h6 {
                color: #222222 !important;
            }
            .infobox, table {
                background-color: #fff !important;
                color: #333333 !important;
            }
        `;
    }

    const style = document.createElement("style");
    style.id = "adaptive-style";
    style.textContent = baseStyles + modeStyles;
    document.head.appendChild(style);

    alert(`Wikipedia layout simplified—${mode} mode applied!`);
}