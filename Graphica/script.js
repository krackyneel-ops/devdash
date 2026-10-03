/* ============================================================
   KHETCONNECT INTERACTIVE ENGINE (Vanilla JS - 60 FPS Physics)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------- 1. AMBIENT CURSOR GLOW TORCH ----------------
  const glowTorch = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    glowTorch.style.left = `${e.clientX}px`;
    glowTorch.style.top = `${e.clientY}px`;
  });

  // ---------------- 2. GOLDEN FIREFLIES & POLLEN CANVAS ----------------
  const canvas = document.getElementById('firefliesCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 55;
  const mouse = { x: -1000, y: -1000 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Firefly {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1.2;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.alpha = Math.random() * 0.7 + 0.3;
      this.alphaSpeed = (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
      // Agricultural Golden-Green hues
      this.hue = Math.random() > 0.4 ? 142 : 45; // Green or Warm Gold
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Soft mouse dispersal interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x -= (dx / dist) * 2;
        this.y -= (dy / dist) * 2;
      }

      // Breathing glow pulse
      this.alpha += this.alphaSpeed;
      if (this.alpha > 0.95 || this.alpha < 0.2) this.alphaSpeed *= -1;

      // Wrap around edges
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.8)`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Firefly());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ---------------- 3. ANIMATED NUMBER COUNT-UP ----------------
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  function runCounters() {
    if (animated) return;
    animated = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth acceleration & deceleration
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        count = Math.floor(easeOutQuad * target);

        // Format Indian Comma Numbers
        let formatted = count.toLocaleString('en-IN');
        if (target === 100000) formatted = "1"; // "1 Lakh+"
        if (target === 10000) formatted = "10,000";

        counter.innerText = prefix + formatted + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          if (target === 100000) counter.innerText = "1 Lakh+ Farmers";
          if (target === 10000) counter.innerText = "10,000+ Tractors";
          if (target === 20) counter.innerText = "₹20 Cr+";
        }
      }
      requestAnimationFrame(updateNumber);
    });
  }
  // Trigger counters right on load
  setTimeout(runCounters, 300);

  // ---------------- 4. 3D TILT PHYSICS ON CARDS & BUTTONS ----------------
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
      const rotateY = ((x - centerX) / centerX) * 10;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });

  // ---------------- 5. WATER RIPPLE ON BUTTON CLICKS ----------------
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('click-ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ---------------- 6. REAL-TIME CLOCK FOR TICKER ----------------
  function updateLiveClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString('en-US', { hour12: true });
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // ---------------- 7. DYNAMIC SLOGAN TEXT ROTATION ----------------
  const slogans = [
    { prefix: "Smart Kheti, Behtar Munafa", suffix: "बीज से बाज़ार तक" },
    { prefix: "Aadhunik Upkaran, Kam Kharcha", suffix: "किराए पर मशीनें" },
    { prefix: "Sahi Mandi Bhav, Seedha Munafa", suffix: "दलाल मुक्त व्यापार" },
    { prefix: "Beemar Pashu Ka Sahi Ilaaj", suffix: "डॉक्टर विशेषज्ञ परामर्श" }
  ];
  let sloganIdx = 0;
  const prefixEl = document.getElementById('sloganPrefix');
  const suffixEl = document.getElementById('sloganSuffix');

  setInterval(() => {
    sloganIdx = (sloganIdx + 1) % slogans.length;
    prefixEl.style.opacity = 0;
    suffixEl.style.opacity = 0;

    setTimeout(() => {
      prefixEl.innerText = slogans[sloganIdx].prefix;
      suffixEl.innerText = slogans[sloganIdx].suffix;
      prefixEl.style.opacity = 1;
      suffixEl.style.opacity = 1;
    }, 400);
  }, 4000);

});