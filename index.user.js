// ==UserScript==
// @name            UtilsTV
// @namespace       utilstv
// @version         1.1.0
// @description     Twitch utilities
// @author          Pepijn98
// @match           https://www.twitch.tv/*
// @grant           none

// @homepageURL     https://github.com/Pepijn98/twitch-utilities
// @supportURL      https://github.com/Pepijn98/twitch-utilities/issues
// @updateURL       https://github.com/Pepijn98/twitch-utilities/raw/master/index.user.js
// @downloadURL     https://github.com/Pepijn98/twitch-utilities/raw/master/index.user.js

// @run-at document-idle
// ==/UserScript==

(function () {
    // const homePage = /^(http(s)?:\/\/)?(www\.)?twitch.tv(\/)?$/giu;
    // const followingPage = /^(http(s)?:\/\/)?(www\.)?twitch.tv\/directory\/following$/giu;
    const maxIterations = 10;
    const extensions = ["Stream Closed Captioner", "Ctrl+ Stream Kit"];

    let iterations = 0;
    let oldHref = document.location.href;

    /* These functions have been done better by bttv, keeping in here just in case it stops working. */
    //
    // function redirectToLive() {
    //     if (followingPage.test(document.location.href)) {
    //         document.location.href = document.location.href + "/live";
    //     }
    // }

    // function pauseHomePlayer() {
    //     const pauseBtn = document.querySelector("button[data-a-target='player-play-pause-button']");
    //     if (homePage.test(document.location.href) && pauseBtn) {
    //         pauseBtn.click();
    //     }
    // }

    // function registerPlayerClick() {
    //     const hasVideo = document.querySelector("video");
    //     const pauseBtn = document.querySelector("button[data-a-target='player-play-pause-button']");
    //     let playerArea = document.querySelector("div[data-a-target='player-overlay-click-handler']");
    //     if (hasVideo && playerArea && pauseBtn) {
    //         const videoState = pauseBtn.getAttribute("data-a-player-state");
    //         if (videoState && videoState === "playing") {
    //             playerArea.addEventListener("click", function () {
    //                 pauseBtn.click();
    //             });
    //             console.log("%c[UTV] %c[INFO]: %cPlayer onclick registered", "color: #00d1b2", "color: #209cee", "");
    //         }
    //     } else {
    //         console.log("%c[UTV] %c[WARN]: %cCouldn't find video player", "color: #00d1b2", "color: #ffdd57", "");
    //     }
    // }
    //
    /* END */

    function disableExtension() {
        const extension = document.querySelector("div[class='extensions-dock-card__image extensions-dock-card__image__visible']");
        if (extension) {
            extension.click();
            const extName = document.querySelector("div[aria-labelledby='popover-extensions-header'] h6");
            const extBtn = document.querySelector("div[aria-labelledby='popover-extensions-header'] input[data-a-target='tw-toggle']");
            if (extName && extensions.includes(extName.title) && extBtn) {
                extBtn.click();
                extension.click();
                console.log(`%c[UTV] %c[INFO]: %cDisabled %c[${extName.title}] %cextension`, "color: #00d1b2", "color: #209cee", "", "font-weight: bold", "");
            } else {
                // Close ext if it's not stream kit
                extension.click();
                console.log(
                    `%c[UTV] %c[WARN]: %cCouldn't find %c[${extensions.join(", ")}] %cextension`,
                    "color: #00d1b2",
                    "color: #ffdd57",
                    "",
                    "font-weight: bold",
                    ""
                );
            }
        } else {
            console.log(
                `%c[UTV] %c[WARN]: %cCouldn't find %c[${extensions.join(", ")}] %cextension`,
                "color: #00d1b2",
                "color: #ffdd57",
                "",
                "font-weight: bold",
                ""
            );
        }
    }

    window.addEventListener("load", function () {
        // pauseHomePlayer()
        // registerPlayerClick();
        disableExtension();

        new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    console.log("%c[UTV] %c[INFO]: %cChanged page", "color: #00d1b2", "color: #209cee", "");
                    const timer = setInterval(function () {
                        if (iterations >= maxIterations) {
                            clearInterval(timer);
                            return;
                        }

                        // console.log("%c[UTV] %c[INFO]: %cLooking for player and extension", "color: #00d1b2", "color: #209cee", "");
                        console.log("%c[UTV] %c[INFO]: %cLooking for extensions", "color: #00d1b2", "color: #209cee", "");
                        const extension = document.querySelector("div[class='extensions-dock-card__image extensions-dock-card__image__visible']");
                        if (extension) {
                            // registerPlayerClick();
                            disableExtension();
                            clearInterval(timer);
                        }

                        iterations++;
                    }, 1000);
                }
            });
        }).observe(document, { childList: true, subtree: true });
    });
})();
