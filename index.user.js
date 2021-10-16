// ==UserScript==
// @name            Twitch Utilities
// @namespace       twitch-utilities
// @version         1.0.0
// @description     Redirect to live channels, pause player on homescreen, click player to pause stream
// @author          Pepijn98
// @match           https://www.twitch.tv/*
// @grant           none

// @homepageURL https://github.com/Pepijn98/twitch-utilities
// @supportURL https://github.com/Pepijn98/twitch-utilities/issues
// @updateURL https://raw.githubusercontent.com/Pepijn98/twitch-utilities/master/index.meta.js
// @downloadURL https://raw.githubusercontent.com/Pepijn98/twitch-utilities/master/index.user.js

// @run-at document-idle
// ==/UserScript==

function redirectToLive() {
    var followingPage = /^(http(s)?:\/\/)?(www\.)?twitch.tv\/directory\/following$/gui;
    if (followingPage.test(document.location.href)) {
        document.location.href = document.location.href + "/live";
    }
}

(function() {
    var homePage = /^(http(s)?:\/\/)?(www\.)?twitch.tv(\/)?$/gui;

    // Initial href check
    redirectToLive();

    // Observe document.location.href
    var oldHref = document.location.href;
    var bodyList = document.querySelector("body");
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                redirectToLive();
            }
        });
    });

    observer.observe(bodyList, {
        childList: true,
        subtree: true
    });

    window.onload = function() {
        var hasVideo = document.querySelector("video");
        if (hasVideo) {
            var playerArea = document.querySelector("div[data-a-target='player-overlay-click-handler']");
            var pauseBtn = document.querySelector("button[data-a-target='player-play-pause-button']");

            // Pause player on home page
            if (homePage.test(document.location.href) && pauseBtn) {
                pauseBtn.click();
            }

            // Click player to pause
            if (playerArea && pauseBtn) {
                var videoState = pauseBtn.getAttribute("data-a-player-state");
                playerArea.onclick = function() {
                    if (videoState = "playing") {
                        pauseBtn.click();
                    }
                };
            }
        }
    };
})();
