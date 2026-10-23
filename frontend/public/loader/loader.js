// Hides the wease loader once the page has loaded. If the crane is close to
// setting its block into the W, it waits for that landing before fading out.
(function () {
  var loader = document.getElementById('wease-loader');
  if (!loader) return;

  var LAND_AT = 0.44; // fraction of the cycle where the block has settled into the W
  var MAX_WAIT = 1800; // ms; never hold the page longer than this just for the animation

  function finish() {
    loader.classList.add('is-done');
    loader.setAttribute('aria-busy', 'false');
    loader.addEventListener('transitionend', function () { loader.remove(); }, { once: true });
  }

  function hide() {
    var hook = loader.querySelector('.wl-hook');
    var anim = hook && hook.getAnimations && hook.getAnimations()[0];
    if (!anim || anim.currentTime == null) return finish();

    var cycle = anim.effect.getComputedTiming().duration;
    var pos = (anim.currentTime % cycle) / cycle;
    var wait = ((LAND_AT - pos + 1) % 1) * cycle;
    setTimeout(finish, wait <= MAX_WAIT ? wait : 0);
  }

  // For single-page apps: add data-manual to the loader and call weaseLoader.hide() yourself.
  window.weaseLoader = { hide: hide };
  if (loader.hasAttribute('data-manual')) return;

  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide);
})();
