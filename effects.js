// =========================================================
// PROFILE EFFECTS
// Efeitos de partículas em Canvas 2D puro (sem libs).
// Usado tanto na prévia do Dashboard quanto no perfil público.
// =========================================================

(function () {

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // ===================
  // DEFINIÇÃO DOS EFEITOS
  // ===================

  const EFFECTS = {

    snow: {

      density: 9000,
      minCount: 40,
      maxCount: 160,

      create() {
        return {
          size: rand(1.5, 3.5),
          speedY: rand(0.4, 1.3),
          drift: rand(-0.3, 0.3),
          wobble: rand(0, Math.PI * 2),
          wobbleSpeed: rand(0.008, 0.025),
          opacity: rand(0.45, 0.9)
        };
      },

      update(p) {
        p.wobble += p.wobbleSpeed;
        p.x += p.drift + Math.sin(p.wobble) * 0.6;
        p.y += p.speedY;
      },

      draw(ctx, p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      }

    },

    rain: {

      density: 6000,
      minCount: 60,
      maxCount: 220,

      create() {
        return {
          length: rand(10, 22),
          speedY: rand(7, 13),
          drift: rand(-1.6, -0.9),
          opacity: rand(0.15, 0.4)
        };
      },

      update(p) {
        p.y += p.speedY;
        p.x += p.drift;
      },

      draw(ctx, p) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.drift * 4, p.y - p.length);
        ctx.strokeStyle = `rgba(210,225,255,${p.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

    },

    bubbles: {

      density: 14000,
      minCount: 22,
      maxCount: 90,

      create() {
        return {
          size: rand(3, 8),
          speedY: rand(0.3, 0.9),
          drift: rand(-0.25, 0.25),
          opacity: rand(0.12, 0.3)
        };
      },

      update(p) {
        p.x += p.drift;
        p.y += p.speedY;
      },

      draw(ctx, p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255,255,255,${p.opacity + 0.18})`;
        ctx.stroke();
      }

    }

  };

  // ===================
  // CONTROLADOR
  // ===================

  function startEffect(canvas, type) {

    if (!canvas) return null;

    const ctx = canvas.getContext("2d");

    // "none"/"nenhum"/valor vazio ou desconhecido -> não desenha nada
    if (!type || type === "none" || !EFFECTS[type]) {

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return null;

    }

    const config = EFFECTS[type];

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let particles = [];
    let rafId = null;
    let destroyed = false;

    function spawnAt(topEntry) {

      const p = config.create();

      p.x = rand(0, width);
      p.y = topEntry
        ? rand(-40, 0)
        : rand(0, height);

      return p;

    }

    // Todas as partículas são pré-alocadas aqui e só reutilizadas depois —
    // nunca criamos partículas novas durante a animação.
    function resize() {

      dpr = window.devicePixelRatio || 1;

      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = clamp(
        Math.floor((width * height) / config.density),
        config.minCount,
        config.maxCount
      );

      if (particles.length === 0) {

        for (let i = 0; i < targetCount; i++) {
          particles.push(spawnAt(false));
        }

      } else if (particles.length < targetCount) {

        while (particles.length < targetCount) {
          particles.push(spawnAt(true));
        }

      } else if (particles.length > targetCount) {

        particles.length = targetCount;

      }

    }

    function frame() {

      if (destroyed) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {

        const p = particles[i];

        config.update(p);

        // Saiu da tela -> reaparece no topo em posição aleatória (reutilizada, não recriada)
        if (
          p.y - 40 > height ||
          p.x < -60 ||
          p.x > width + 60
        ) {

          p.x = rand(0, width);
          p.y = rand(-40, 0);

        }

        config.draw(ctx, p);

      }

      rafId = requestAnimationFrame(frame);

    }

    resize();
    frame();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return {

      destroy() {

        destroyed = true;

        if (rafId) cancelAnimationFrame(rafId);

        window.removeEventListener("resize", onResize);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = [];

      }

    };

  }

  window.ProfileEffects = { start: startEffect };

})();
