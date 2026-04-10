/**
 * DevQuest Mascot
 * Handles the interactive cat (or panther for Infernus) mascot.
 *
 * Optional config — set before including this file:
 *   window.MASCOT_CONFIG = {
 *     audioIds: ['meow1','meow2','meow3','meow4','meow5'],  // audio element IDs
 *     bubbleText: 'MIAU://',
 *     bubbleId: 'cat-bubble',
 *     svgId:    'cat-svg',
 *     clickFn:  'handleCatClick'   // global function name to expose
 *   };
 */
(function () {
  'use strict';

  const defaults = {
    audioIds:   ['meow1','meow2','meow3','meow4','meow5'],
    bubbleId:   'cat-bubble',
    svgId:      'cat-svg',
    clickFn:    'handleCatClick'
  };

  const cfg = Object.assign({}, defaults, window.MASCOT_CONFIG || {});

  function playRandom() {
    const ids    = cfg.audioIds;
    const picked = ids[Math.floor(Math.random() * ids.length)];
    const audio  = document.getElementById(picked);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function handleClick() {
    playRandom();

    const bubble = document.getElementById(cfg.bubbleId);
    const svg    = document.getElementById(cfg.svgId);

    if (bubble) {
      bubble.classList.add('visible');
      setTimeout(() => bubble.classList.remove('visible'), 1300);
    }
    if (svg) {
      svg.style.transform = 'translateY(5px)';
      setTimeout(() => { svg.style.transform = ''; }, 450);
    }
  }

  // Expose under the configured global name
  window[cfg.clickFn] = handleClick;

  // Infernus uses 'handlePantherClick' — alias if needed
  if (cfg.clickFn !== 'handlePantherClick') {
    window.handlePantherClick = handleClick;
  }
})();
