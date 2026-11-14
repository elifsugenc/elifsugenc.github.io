(() => {
    'use strict';

    // Clearly labeled development-only placeholders. Replace with verified names
    // before publishing this as a historical memorial archive.
    const EXAMPLE_NAMES = Array.from(
        { length: 80 },
        (_, index) => `Örnek İsim ${String(index + 1).padStart(3, '0')}`
    );

    const list = document.getElementById('name-list');
    if (!list) return;

    list.innerHTML = EXAMPLE_NAMES.map((name) => `<li>${name}</li>`).join('');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const speed = 5; // pixels per second
    const resumeAfter = 2500;
    let pausedUntil = reducedMotion.matches ? Infinity : 0;
    let lastFrame = 0;

    function pauseTemporarily() {
        if (reducedMotion.matches) return;
        pausedUntil = performance.now() + resumeAfter;
    }

    window.addEventListener('wheel', pauseTemporarily, { passive: true });
    window.addEventListener('touchstart', pauseTemporarily, { passive: true });
    window.addEventListener('pointerdown', pauseTemporarily, { passive: true });
    window.addEventListener('keydown', (event) => {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
            pauseTemporarily();
        }
    });
    reducedMotion.addEventListener('change', (event) => {
        if (event.matches) pausedUntil = Infinity;
        else pausedUntil = performance.now() + resumeAfter;
    });

    function drift(timestamp) {
        if (!lastFrame) lastFrame = timestamp;
        const elapsed = Math.min((timestamp - lastFrame) / 1000, 0.05);
        lastFrame = timestamp;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) {
            requestAnimationFrame(drift);
            return;
        }

        if (timestamp >= pausedUntil && window.scrollY < maxScroll) {
            window.scrollBy(0, speed * elapsed);
        }

        requestAnimationFrame(drift);
    }

    requestAnimationFrame(drift);
})();
