// ==UserScript==
// @name         Plurk.click_with_mute
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @author       FlandreDaisuki
// @match        https://www.plurk.com/flandrekawaii
// @grant        none
// ==/UserScript==

const $ = jQuery;

function isFourLittleButton($target) {
    return ['mute', 'replurk', 'like', 'gift'].some(elem => $target.hasClass(elem));
}

$('.block_cnt').on('click', function($event) {
    const $target = $($event.target);
    if(!isFourLittleButton($target)) {
        const $thread = $target.parentsUntil($event.currentTarget, '.plurk');
        if($thread.length) {
            const plurk = $thread.get(0);
            $(plurk).find('.mute-off').click();
        }
    }
});
