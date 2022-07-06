// ==UserScript==
// @name            UtilsTV
// @namespace       utilstv
// @version         1.2.0
// @description     Twitch utilities
// @author          Pepijn98
// @match           https://www.twitch.tv/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant           none

// @homepageURL     https://github.com/Pepijn98/twitch-utilities
// @supportURL      https://github.com/Pepijn98/twitch-utilities/issues
// @updateURL       https://github.com/Pepijn98/twitch-utilities/raw/master/index.user.js
// @downloadURL     https://github.com/Pepijn98/twitch-utilities/raw/master/index.user.js

// @run-at document-idle
// ==/UserScript==

(function() {
    const maxIterations = 10;

    let iterations = 0;
    let oldHref = document.location.href;

    function disableExtension() {
        const extension = document.querySelector("div[class='extensions-dock-card__image extensions-dock-card__image__visible']");
        if (extension) {
            extension.click();
            const extName = document.querySelector("div[aria-labelledby='popover-extensions-header'] h6");
            const extBtn = document.querySelector("div[aria-labelledby='popover-extensions-header'] input[data-a-target='tw-toggle']");
            if (extBtn) {
                extBtn.click();
                extension.click();
                console.log(
                    `%c[UTV] %c[INFO]: %cDisabled %c[${extName.title}] %cextension`,
                    "color: #00d1b2",
                    "color: #209cee",
                    "",
                    "font-weight: bold",
                    ""
                );
            } else {
                // Close ext if it doesn't have a visible switch
                extension.click();
                console.log(
                    `%c[UTV] %c[WARN]: %cCouldn't find any extensions`,
                    "color: #00d1b2",
                    "color: #ffdd57",
                    ""
                );
            }
        } else {
            console.log(
                `%c[UTV] %c[WARN]: %cCouldn't find any extensions`,
                "color: #00d1b2",
                "color: #ffdd57",
                ""
            );
        }
    }

    function pausePlayer() {
        //! Stop player on channel home page when streamer is offline
        const isOffline = Array.from(document.getElementsByTagName("p")).filter((e) => e.innerText.toLowerCase() === "offline")[0];
        if (isOffline) {
            const isChannelHome = document.querySelector("[data-a-page-loaded-name=\"ChannelHomePage\"]");
            if (isChannelHome) {
                const btn = document.querySelector("button[data-a-target=\"player-play-pause-button\"]");
                if (btn) {
                    btn.click();
                }
            }
        }
    }

    window.addEventListener("load", function() {
        pausePlayer();
        disableExtension();

        new MutationObserver(function() {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                console.log(`%c[UTV] %c[INFO]: %cChanged page to %c${document.location.href}`, "color: #00d1b2", "color: #209cee", "", "font-weight: bold");

                pausePlayer();

                //! Disable extension
                const isChannelWatch = document.querySelector("[data-a-page-loaded-name=\"ChannelWatchPage\"]");
                if (isChannelWatch) {
                    const timer = setInterval(function() {
                        if (iterations >= maxIterations) {
                            clearInterval(timer);
                            return;
                        }

                        console.log("%c[UTV] %c[INFO]: %cLooking for extensions", "color: #00d1b2", "color: #209cee", "");
                        const extension = document.querySelector("div[class='extensions-dock-card__image extensions-dock-card__image__visible']");
                        if (extension) {
                            disableExtension();
                            clearInterval(timer);
                        }

                        iterations++;
                    }, 1000);
                }
            }
        }).observe(document, { childList: true, subtree: true });
    });
})();
