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

    },

    flowers: {

      density: 16000,
      minCount: 18,
      maxCount: 70,

      create() {
        return {
          size: rand(6, 12),
          speedY: rand(0.5, 1.1),
          drift: rand(-0.4, 0.4),
          wobble: rand(0, Math.PI * 2),
          wobbleSpeed: rand(0.01, 0.02),
          rotation: rand(0, Math.PI * 2),
          rotationSpeed: rand(-0.012, 0.012),
          opacity: rand(0.55, 0.9),
          petalHue: rand(320, 350)
        };
      },

      update(p) {
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;
        p.x += p.drift + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
      },

      draw(ctx, p) {

        const r = p.size * 0.42;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.fillStyle = `hsla(${p.petalHue},85%,78%,${p.opacity})`;

        for (let i = 0; i < 5; i++) {

          const a = (i / 5) * Math.PI * 2;

          ctx.beginPath();
          ctx.arc(Math.cos(a) * r, Math.sin(a) * r, r * 0.85, 0, Math.PI * 2);
          ctx.fill();

        }

        ctx.fillStyle = `hsla(48,95%,75%,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

      }

    },

    leaves: {

      density: 15000,
      minCount: 20,
      maxCount: 80,

      create() {

        const hue =
          Math.random() < 0.5 ? rand(90, 140) : rand(20, 45);

        return {
          size: rand(6, 11),
          speedY: rand(0.6, 1.4),
          drift: rand(-0.6, 0.6),
          wobble: rand(0, Math.PI * 2),
          wobbleSpeed: rand(0.02, 0.05),
          rotation: rand(0, Math.PI * 2),
          rotationSpeed: rand(-0.05, 0.05),
          opacity: rand(0.5, 0.85),
          hue
        };

      },

      update(p) {
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;
        p.x += p.drift + Math.sin(p.wobble) * 0.8;
        p.y += p.speedY;
      },

      draw(ctx, p) {

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.75, 0, 0, p.size);
        ctx.quadraticCurveTo(-p.size * 0.75, 0, 0, -p.size);

        ctx.fillStyle = `hsla(${p.hue},55%,55%,${p.opacity})`;
        ctx.fill();

        ctx.restore();

      }

    },

    hearts: {

      density: 15000,
      minCount: 18,
      maxCount: 70,

      create() {
        return {
          size: rand(5, 10),
          speedY: rand(0.4, 1.0),
          drift: rand(-0.3, 0.3),
          wobble: rand(0, Math.PI * 2),
          wobbleSpeed: rand(0.01, 0.025),
          opacity: rand(0.5, 0.85)
        };
      },

      update(p) {
        p.wobble += p.wobbleSpeed;
        p.x += p.drift + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
      },

      draw(ctx, p) {

        const s = p.size;

        ctx.save();
        ctx.translate(p.x, p.y);

        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.quadraticCurveTo(0, 0, -s * 0.5, 0);
        ctx.quadraticCurveTo(-s, 0, -s, s * 0.3);
        ctx.quadraticCurveTo(-s, s * 0.65, 0, s);
        ctx.quadraticCurveTo(s, s * 0.65, s, s * 0.3);
        ctx.quadraticCurveTo(s, 0, s * 0.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 0.3);

        ctx.fillStyle = `rgba(255,110,145,${p.opacity})`;
        ctx.fill();

        ctx.restore();

      }

    },

    crystals: {

      density: 13000,
      minCount: 25,
      maxCount: 90,

      create() {
        return {
          size: rand(4, 8),
          speedY: rand(0.5, 1.1),
          drift: rand(-0.2, 0.2),
          rotation: rand(0, Math.PI * 2),
          rotationSpeed: rand(-0.02, 0.02),
          shimmer: rand(0, Math.PI * 2),
          shimmerSpeed: rand(0.03, 0.06),
          baseOpacity: rand(0.35, 0.6)
        };
      },

      update(p) {
        p.rotation += p.rotationSpeed;
        p.shimmer += p.shimmerSpeed;
        p.x += p.drift;
        p.y += p.speedY;
      },

      draw(ctx, p) {

        const opacity =
          clamp(p.baseOpacity + Math.sin(p.shimmer) * 0.25, 0, 1);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.6, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.6, 0);
        ctx.closePath();

        ctx.fillStyle = `rgba(200,235,255,${opacity})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(255,255,255,${clamp(opacity + 0.2, 0, 1)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();

      }

    },

    meteors: {

      density: 40000,
      minCount: 6,
      maxCount: 18,

      create() {

        const angle = rand(0.9, 1.3);
        const speed = rand(9, 15);

        return {
          size: rand(1.5, 2.5),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          tailLength: rand(40, 90),
          opacity: rand(0.5, 0.9)
        };

      },

      update(p) {
        p.x += p.vx;
        p.y += p.vy;
      },

      draw(ctx, p) {

        const mag =
          Math.hypot(p.vx, p.vy) || 1;

        const tailX = p.x - (p.vx / mag) * p.tailLength;
        const tailY = p.y - (p.vy / mag) * p.tailLength;

        const gradient =
          ctx.createLinearGradient(p.x, p.y, tailX, tailY);

        gradient.addColorStop(0, `rgba(255,255,255,${p.opacity})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tailX, tailY);
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
