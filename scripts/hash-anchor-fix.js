(function () {
  var packageIds = new Set(["performance", "sorglos", "bigstage"]);
  var settleTimerA = null;
  var settleTimerB = null;

  function getHeaderOffset() {
    var header = document.querySelector(".site-header");
    if (!header) return 0;
    return Math.ceil(header.getBoundingClientRect().height) + 22;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function getHashTarget() {
    if (!window.location.hash) return null;
    var id = window.location.hash.slice(1);
    if (!packageIds.has(id)) return null;
    return document.getElementById(id);
  }

  function alignHashTarget(options) {
    var config = options || {};
    var minDelta = typeof config.minDelta === "number" ? config.minDelta : 4;
    var target = getHashTarget();
    if (!target) return;

    var targetTop = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    var clampedTop = Math.max(0, Math.floor(targetTop));
    var delta = clampedTop - window.pageYOffset;

    if (Math.abs(delta) < minDelta) return;

    var shouldSmooth = Boolean(config.smooth) && !prefersReducedMotion();
    window.scrollTo({ top: clampedTop, behavior: shouldSmooth ? "smooth" : "auto" });
  }

  function runWithSettling() {
    if (settleTimerA) window.clearTimeout(settleTimerA);
    if (settleTimerB) window.clearTimeout(settleTimerB);

    settleTimerA = window.setTimeout(function () {
      alignHashTarget({ smooth: true, minDelta: 4 });
    }, 180);

    settleTimerB = window.setTimeout(function () {
      alignHashTarget({ smooth: false, minDelta: 20 });
    }, 900);
  }

  document.addEventListener("DOMContentLoaded", runWithSettling);
  window.addEventListener("load", runWithSettling);
  window.addEventListener("hashchange", runWithSettling);
})();
