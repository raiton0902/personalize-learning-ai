(() => {
  const mount = () => {
  const scene = document.getElementById("home-scene");
  if (!scene || !window.gsap || !window.Lenis) return false;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const main = document.querySelector('[data-testid="stMain"]');
  const panel = document.querySelector(".st-key-home_details");
  const detail = panel?.querySelector("details");
  const trigger = document.getElementById("tailor-learning");
  if (!main || !panel || !detail || !trigger) return false;
  window.personalLearningHome?.destroy();
  const controller = new AbortController();
  const options = { signal: controller.signal };

  let destroyed = false;
  let writing = false;
  let phase = 0;
  let tone = 1;
  let scrollPending = false;
  const blue = scene.querySelector(".current-blue");
  const red = scene.querySelector(".current-red");
  const setBlueX = gsap.quickSetter(blue, "x", "px");
  const setBlueY = gsap.quickSetter(blue, "y", "px");
  const setRedX = gsap.quickSetter(red, "x", "px");
  const setRedY = gsap.quickSetter(red, "y", "px");
  const setOpacity = gsap.quickSetter(scene, "opacity");
  const lenis = new Lenis({
    wrapper: main,
    content: main.firstElementChild,
    autoRaf: false,
    smoothWheel: false,
    syncTouch: false,
  });

  const renderMotion = () => {
    scene.dataset.motion = reduced.matches ? "reduced" : writing ? "writing" : "playing";
  };
  const syncDisclosure = () => {
    trigger.setAttribute("aria-expanded", String(detail.open));
    if (!detail.open && document.activeElement === detail.querySelector("summary")) trigger.focus();
  };
  const lockChoiceInputs = () => {
    // Streamlit disables filtering but still renders an input. Keep selection
    // and arrow-key navigation while removing its editable-text affordance.
    for (const input of panel.querySelectorAll('[data-testid="stSelectbox"] input[role="combobox"]')) {
      if (!input.readOnly) input.readOnly = true;
      if (input.getAttribute("aria-autocomplete") !== "none") input.setAttribute("aria-autocomplete", "none");
    }
  };
  const choicesObserver = new MutationObserver(lockChoiceInputs);
  choicesObserver.observe(panel, {childList: true, subtree: true, attributes: true, attributeFilter: ["readonly"]});
  lockChoiceInputs();
  const jumpToPattern = () => {
    if (!scrollPending || !detail.open) return;
    panel.scrollIntoView({behavior:"instant", block:"start"});
    const lastField = panel.querySelector('input[aria-label="Course or exam context"]');
    const preview = panel.querySelector(".setup-preview");
    const top = panel.getBoundingClientRect().top;
    if (lastField?.offsetHeight && preview?.offsetHeight && top >= 0 && top < 96) scrollPending = false;
  };
  const panelObserver = new ResizeObserver(jumpToPattern);
  panelObserver.observe(panel);
  panelObserver.observe(main.firstElementChild);

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const summary = detail.querySelector("summary");
    if (!detail.open) summary?.click();
    syncDisclosure();
    if (event.detail > 0) summary?.setAttribute("data-pointer-focus", "true");
    else summary?.removeAttribute("data-pointer-focus");
    summary?.focus({ preventScroll: true });
    // Jump immediately; correct the target when Streamlit mounts the fields.
    scrollPending = true;
    jumpToPattern();
  }, options);
  detail.addEventListener("toggle", syncDisclosure, options);

  const interrupt = () => { scrollPending = false; lenis.stop(); lenis.start(); };
  main.addEventListener("wheel", interrupt, { passive: true, signal: controller.signal });
  main.addEventListener("touchstart", interrupt, { passive: true, signal: controller.signal });
  document.addEventListener("keydown", (event) => {
    detail.querySelector("summary")?.removeAttribute("data-pointer-focus");
    if (["Escape", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) interrupt();
  }, options);
  document.addEventListener("focusin", (event) => {
    writing = event.target.matches("textarea, input");
    renderMotion();
  }, options);
  document.addEventListener("focusout", () => {
    writing = false;
    renderMotion();
  }, options);
  reduced.addEventListener("change", () => { interrupt(); renderMotion(); }, options);

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    gsap.ticker.remove(tick);
    controller.abort();
    choicesObserver.disconnect();
    panelObserver.disconnect();
    lenis.destroy();
    gsap.set([blue, red], { clearProps: "transform" });
    scene.style.removeProperty("opacity");
  };
  const tick = (time, delta) => {
    if (!scene.isConnected) { destroy(); return; }
    lenis.raf(time * 1000);
    const active = !reduced.matches && !writing && !document.hidden;
    if (active) phase += Math.min(delta, 50) / 1000;
    tone += ((writing ? 0.55 : 1) - tone) * 0.06;
    setOpacity(tone);
    if (reduced.matches || document.hidden) return;
    const wave = phase * (Math.PI * 2 / 16);
    setBlueX(Math.sin(wave) * 85);
    setBlueY(Math.cos(wave * 0.7) * 40);
    setRedX(-Math.sin(wave + 0.7) * 85);
    setRedY(Math.cos(wave * 0.7 + 1.1) * 40);
  };
  syncDisclosure();
  renderMotion();
  gsap.ticker.add(tick);
  window.personalLearningHome = { destroy };
  return true;
  };
  if (!mount()) {
    // Streamlit commits sibling widgets in separate batches on a fresh load.
    const pending = new MutationObserver(() => {
      if (mount()) { pending.disconnect(); clearTimeout(deadline); }
    });
    pending.observe(document.body, {childList:true, subtree:true});
    const deadline = setTimeout(() => pending.disconnect(), 10000);
  }
})();
