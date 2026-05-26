/**
 * ================================================
 *  EID-UL-ADHA GIFT WEBSITE — script.js  v4.0
 *  Mobile-optimised, touch-friendly, polished
 * ================================================
 */

/* ================================================
   1. DOM REFERENCES
================================================ */
const loader          = document.getElementById('loader');
const loaderBar       = document.getElementById('loaderBar');
const loaderPercent   = document.getElementById('loaderPercent');
const mainSite        = document.getElementById('mainSite');
const particleCanvas  = document.getElementById('particleCanvas');
const pCtx            = particleCanvas.getContext('2d');
const openGiftBtn     = document.getElementById('openGiftBtn');
const messageSection  = document.getElementById('msgSection');
const typingTarget    = document.getElementById('typingTarget');
const typingCursor    = document.getElementById('typingCursor');
const galleryItems    = document.querySelectorAll('.gal-item');
const lightbox        = document.getElementById('lightbox');
const lightboxClose   = document.getElementById('lbClose');
const lightboxInner   = document.getElementById('lbImg');
const lightboxCaption = document.getElementById('lbCaption');
const surpriseBtn     = document.getElementById('surpriseBtn');
const surpriseCard    = document.getElementById('surpCard');
const confettiCanvas  = document.getElementById('confettiCanvas');
const cCtx            = confettiCanvas.getContext('2d');
const scrollTopBtn    = document.getElementById('scrollTopBtn');

/* Detect touch/mobile */
const isMobile = /Android|Tablet|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;

/* ================================================
   2. LOADER ANIMATION
================================================ */
function runLoader() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 4 + 1;
    if (progress >= 100) progress = 100;
    loaderBar.style.width     = progress + '%';
    loaderPercent.textContent = Math.floor(progress) + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('out');
        mainSite.style.display = 'block';
        setTimeout(() => {
          loader.style.display = 'none';
          initScrollReveal();
          startParticles();
          initProfileAnimations();
        }, 900);
      }, 400);
    }
  }, 22);
}

/* ================================================
   3. PARTICLE CANVAS — twinkling stars
   (fewer particles on mobile for performance)
================================================ */
let particles = [];

function Particle() { this.reset(); }
Particle.prototype.reset = function () {
  this.x       = Math.random() * particleCanvas.width;
  this.y       = Math.random() * particleCanvas.height;
  this.radius  = Math.random() * 1.8 + 0.3;
  this.speed   = Math.random() * 0.3 + 0.06;
  this.opacity = Math.random() * 0.6 + 0.2;
  this.twinkle = Math.random() * 0.018 + 0.004;
  this.dir     = Math.random() < 0.5 ? 1 : -1;
  this.isGold  = Math.random() < 0.28;
};

function resizeParticleCanvas() {
  particleCanvas.width  = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

function startParticles() {
  resizeParticleCanvas();
  window.addEventListener('resize', resizeParticleCanvas, { passive: true });
  // Fewer particles on mobile for battery/performance
  const count = isMobile ? 80 : 170;
  for (let i = 0; i < count; i++) particles.push(new Particle());
  animateParticles();
}

let lastFrame = 0;
function animateParticles(ts) {
  // Throttle to ~30fps on mobile
  if (isMobile && ts - lastFrame < 33) {
    requestAnimationFrame(animateParticles);
    return;
  }
  lastFrame = ts;
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach(p => {
    p.y -= p.speed;
    p.opacity += p.twinkle * p.dir;
    if (p.opacity >= 0.92 || p.opacity <= 0.08) p.dir *= -1;
    if (p.y < -5) { p.reset(); p.y = particleCanvas.height + 5; }
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    pCtx.fillStyle = p.isGold
      ? `rgba(245,200,66,${p.opacity})`
      : `rgba(255,255,255,${p.opacity})`;
    pCtx.fill();
  });
  requestAnimationFrame(animateParticles);
}

/* ================================================
   4. SCROLL-REVEAL
================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.rv');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ================================================
   5. PARALLAX — hero star layers (desktop only)
================================================ */
function initParallax() {
  if (isMobile) return; // Skip on mobile to prevent jank
  const layers = document.querySelectorAll('.hero__stars[data-speed]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    layers.forEach(l => { l.style.transform = `translateY(${y * parseFloat(l.dataset.speed)}px)`; });
  }, { passive: true });
}

/* ================================================
   6. TYPING ANIMATION
================================================ */
const MESSAGE_TEXT =
`On this blessed day of Eid-ul-Adha, I want you to know how much you mean to me.
You are the kind of love who shows up with tea at 2am and asks no questions.
Who remembers every small thing, and never lets me face anything alone.
Your kindness, your laugh, and your heart — they are gifts I cherish every day.
Allah placed you in my life, and for that I am endlessly grateful.
May this Eid bring you peace, joy, and all the biryani you deserve. 💛`;

const TYPING_SPEED = 28;
let typingIndex   = 0;
let typingStarted = false;

function startTyping() {
  if (typingStarted) return;
  typingStarted = true;
  typingTarget.innerHTML = '';
  typingIndex = 0;
  setTimeout(typeNextChar, 600);
}

function typeNextChar() {
  if (typingIndex < MESSAGE_TEXT.length) {
    typingTarget.innerHTML += MESSAGE_TEXT[typingIndex] === '\n' ? '<br/>' : MESSAGE_TEXT[typingIndex];
    typingIndex++;
    setTimeout(typeNextChar, TYPING_SPEED);
  } else {
    setTimeout(() => { typingCursor.style.display = 'none'; }, 2500);
  }
}

/* ================================================
   7. HERO GIFT BUTTON — unlock + scroll + type
================================================ */
function initGiftButton() {
  openGiftBtn.addEventListener('click', () => {
    messageSection.classList.remove('locked');
    messageSection.classList.add('unlocked');

    const hiddenReveal = messageSection.querySelectorAll('.rv:not(.on)');
    setTimeout(() => {
      hiddenReveal.forEach(el => el.classList.add('on'));
    }, 100);

    messageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { startTyping(); }, 1200);

    openGiftBtn.style.transform = 'scale(0.95)';
    setTimeout(() => { openGiftBtn.style.transform = ''; }, 200);
  });
}

/* ================================================
   8. GALLERY LIGHTBOX — touch-friendly
================================================ */
function openLightbox(item) {
  const thumbnailImg = item.querySelector('img');
  const thumbSrc = thumbnailImg ? thumbnailImg.src : '';
  const imgSrc   = item.dataset.img || thumbSrc;
  const caption  = item.dataset.caption || '';

  lightboxInner.innerHTML = `<img src="${thumbSrc}" alt="${caption}" style="filter:blur(4px);transition:filter 0.3s ease;" />`;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (imgSrc && imgSrc !== thumbSrc) {
    const highRes = new Image();
    highRes.src = imgSrc;
    highRes.onload = () => {
      const currentImg = lightboxInner.querySelector('img');
      if (currentImg) { currentImg.src = imgSrc; currentImg.style.filter = 'none'; }
    };
  } else {
    const currentImg = lightboxInner.querySelector('img');
    if (currentImg) currentImg.style.filter = 'none';
  }
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function initGallery() {
  galleryItems.forEach(item => {
    // Both click and touchend for mobile
    item.addEventListener('click', () => openLightbox(item));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  
  // Swipe to close lightbox on mobile
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diff) > 60) closeLightbox();
  }, { passive: true });
}

/* ================================================
   9. SURPRISE — confetti + floating hearts
================================================ */
let confettiParticles = [];
let confettiRunning   = false;
let confettiFrames    = 0;

const CONFETTI_COLORS = ['#f5c842','#fff3b0','#ffb6c1','#ffffff','#ff9f43','#ffeaa7','#a29bfe','#fd79a8'];

function Confetti(x, y) {
  this.x = x; this.y = y;
  this.vx = (Math.random() - 0.5) * 9;
  this.vy = (Math.random() * -14) - 4;
  this.gravity = 0.38;
  this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  this.size = Math.random() * 9 + 4;
  this.rotation = Math.random() * 360;
  this.rotSpeed = (Math.random() - 0.5) * 9;
  this.opacity = 1;
  this.shape = Math.random() < 0.5 ? 'rect' : 'circle';
}
Confetti.prototype.update = function () {
  this.vy += this.gravity; this.x += this.vx; this.y += this.vy;
  this.rotation += this.rotSpeed; this.opacity -= 0.011;
};
Confetti.prototype.draw = function (ctx) {
  ctx.save(); ctx.globalAlpha = Math.max(0, this.opacity);
  ctx.fillStyle = this.color; ctx.translate(this.x, this.y);
  ctx.rotate((this.rotation * Math.PI) / 180);
  if (this.shape === 'rect') {
    ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
  } else {
    ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
};

function launchConfetti(ox, oy) {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const count = isMobile ? 120 : 220;
  for (let i = 0; i < count; i++) confettiParticles.push(new Confetti(ox, oy));
  for (let i = 0; i < count / 2; i++) confettiParticles.push(new Confetti(Math.random() * window.innerWidth, window.innerHeight));
  if (!confettiRunning) { confettiRunning = true; confettiFrames = 0; animateConfetti(); }
}

function animateConfetti() {
  confettiFrames++;
  cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles = confettiParticles.filter(p => p.opacity > 0);
  confettiParticles.forEach(p => { p.update(); p.draw(cCtx); });
  if (confettiParticles.length > 0 && confettiFrames < 320) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

function launchHearts() {
  const hearts = ['💛','🤍','🌸','✨','💫','🌟','🌹','💖','🦋','👑'];
  const count  = isMobile ? 16 : 26;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent  = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.cssText = `
        position:fixed;left:${Math.random()*window.innerWidth}px;bottom:0;
        font-size:${(Math.random()*1.4+0.9)*1.5}rem;z-index:860;pointer-events:none;
        animation:heartFloat 4s ease-out forwards;
        animation-delay:${Math.random()*2}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 6500);
    }, i * 90);
  }
}

function initSurprise() {
  surpriseBtn.addEventListener('click', e => {
    surpriseCard.classList.add('show');
    setTimeout(() => surpriseCard.scrollIntoView({ behavior:'smooth', block:'center' }), 200);
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    launchConfetti(x || window.innerWidth / 2, y || window.innerHeight / 2);
    launchHearts();
    surpriseBtn.style.opacity     = '0.4';
    surpriseBtn.style.pointerEvents = 'none';
  });
}

/* ================================================
   10. SCROLL-TO-TOP
================================================ */
function initScrollTop() {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ================================================
   11. INIT
================================================ */
document.addEventListener('DOMContentLoaded', () => {
  runLoader();
  initParallax();
  initGiftButton();
  initGallery();
  initSurprise();
  initScrollTop();
});

/* ================================================
   12. ROMANTIC PROFILE ANIMATIONS
================================================ */
const tickerMessages = [
  'Eid Mubarak to you both 🌙',
  'Made for each other 💛',
  'Two hearts, one soul ❤️',
  'Together under the same moon 🌙✨',
  'May Allah bless your bond 🤍',
  'Forever & always 🌹',
  'You complete each other 💫',
];
let tickerIndex = 0;

function initProfileAnimations() {
  const floaters   = document.getElementById('profileFloaters');
  const tickerText = document.getElementById('loveTickerText');
  if (!floaters || !tickerText) return;

  const emojiPool = ['❤️','💛','🌹','✨','💫','🌸','💖','🌙','💕','🦋','👑','🥰'];
  function spawnFloater() {
    const el = document.createElement('span');
    el.textContent = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    const leftPct = 35 + Math.random() * 30;
    el.style.cssText = `
      position:absolute;left:${leftPct}%;bottom:10%;
      font-size:${(Math.random() * 1.1 + 0.7).toFixed(2)}rem;
      opacity:1;pointer-events:none;
      animation:floatUp ${(Math.random() * 2 + 2.5).toFixed(1)}s ease-out forwards;
      animation-delay:${(Math.random() * .5).toFixed(2)}s;
    `;
    floaters.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
  // Spawn floaters less often on mobile to save battery
  setInterval(spawnFloater, isMobile ? 1200 : 700);

  function cycleTicker() {
    tickerText.style.transition = 'opacity .4s';
    tickerText.style.opacity = '0';
    setTimeout(() => {
      tickerIndex = (tickerIndex + 1) % tickerMessages.length;
      tickerText.textContent = tickerMessages[tickerIndex];
      tickerText.style.opacity = '1';
    }, 420);
  }
  setInterval(cycleTicker, 3200);

  // Desktop hover only — touch devices don't get mouseenter
  if (!isMobile) {
    const cardBoy  = document.getElementById('cardBoy');
    const cardGirl = document.getElementById('cardGirl');
    function magneticLean(card, direction) {
      card.addEventListener('mouseenter', () => {
        const rotate = direction === 'right' ? '4deg' : '-4deg';
        card.style.transform = `translateY(-10px) scale(1.05) rotate(${rotate})`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    }
    if (cardBoy)  magneticLean(cardBoy,  'right');
    if (cardGirl) magneticLean(cardGirl, 'left');
  }

  // Card click — heart burst
  [document.getElementById('cardBoy'), document.getElementById('cardGirl')].forEach(card => {
    if (!card) return;
    card.addEventListener('click', () => {
      const count = isMobile ? 8 : 12;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const h = document.createElement('span');
          h.textContent = ['❤️','💛','🌹','✨'][Math.floor(Math.random()*4)];
          const rect = card.getBoundingClientRect();
          h.style.cssText = `
            position:fixed;
            left:${rect.left + rect.width/2 + (Math.random()-0.5)*80}px;
            top:${rect.top + rect.height/2 + (Math.random()-0.5)*80}px;
            font-size:${Math.random()*1.2+0.8}rem;
            pointer-events:none;z-index:9999;
            animation:floatUp 1.8s ease-out forwards;
          `;
          document.body.appendChild(h);
          setTimeout(() => h.remove(), 2000);
        }, i * 60);
      }
    });
  });
}
