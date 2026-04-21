const c = document.getElementById('bg');
const ctx = c.getContext('2d');
const detailOverlay = document.getElementById('detailOverlay');
const detailPanel = document.getElementById('detailPanel');
let W = 1400, H = 900;

let earthCX = W / 2, earthCY = H + 1800, earthRX = W * 2.2, earthRY = 2000;
let wg = null;

const bgStars = Array.from({ length: 320 }, () => ({
  x: Math.random(), y: Math.random() * 0.82,
  r: Math.random() < 0.05 ? Math.random() * 1.65 + 0.85 : Math.random() * 1.0 + 0.35,
  a: Math.random() * 0.5 + 0.3,
  phase: Math.random() * Math.PI * 2,
  speed: 0.35 + Math.random() * 0.7
}));

const CONSTELLATIONS = [
  {
    name: 'About Me',
    stars: [
      { x: 292, y: 292 }, { x: 358, y: 246 }, { x: 438, y: 276 },
      { x: 420, y: 348 }, { x: 336, y: 330 }, { x: 254, y: 364 }
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [4, 5], [5, 0]],
    items: [
      { star: 0, label: 'Who Am I', title: 'Who Am I', dates: 'About Me', desc: 'I turn ideas into polished interactive products with a strong visual voice.' },
      { star: 2, label: 'My Interests', title: 'My Interests', dates: 'About Me', desc: 'I blend front-end craft and engineering to build experiences that feel cinematic and precise.' },
      { star: 3, label: 'My Resume', title: 'My Resume', dates: 'About Me', desc: 'I favor clarity, empathy, and thoughtful detail in both interface and implementation.' }
    ]
  },
  {
    name: 'Experiences',
    stars: [
      { x: 596, y: 252 }, { x: 676, y: 222 }, { x: 726, y: 286 },
      { x: 706, y: 372 }, { x: 792, y: 332 }, { x: 642, y: 350 }
    ],
    edges: [[0, 5], [5, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 4]],
    items: [
      { star: 0, label: 'Private Equity Analyst', title: 'Private Equity Analyst at Solen Software Group', dates: '2024 - Present', desc: 'Built performant interfaces and component systems for consumer-facing web products.' },
      { star: 1, label: 'Data Analyst', title: 'Data Analyst at Autumn', dates: '2022 - 2024', desc: 'Led interaction design and prototyping for multi-step user journeys and growth surfaces.' },
      { star: 3, label: 'Director of Finance', title: 'Director of Finance at Western Entrepreneurship Association', dates: '2021 - 2022', desc: 'Developed motion-heavy narrative experiences that united visual direction with web tech.' },
      { star: 4, label: 'Director of Projects', title: 'Director of Projects at Western Founder\'s Network', dates: '2020 - 2021', desc: 'Partnered with teams on rapid concept-to-launch builds across branding and digital products.' }
    ]
  },
  {
    name: 'Projects',
    stars: [
      { x: 926, y: 284 }, { x: 1008, y: 238 }, { x: 1092, y: 296 },
      { x: 1050, y: 364 }, { x: 1134, y: 338 }, { x: 952, y: 376 }
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [0, 5]],
    items: [
      { star: 0, label: 'Optimized Browser', title: 'Optimized Browser', dates: 'Project', desc: 'A design system concept focused on expressive typography and modular product primitives.' },
      { star: 2, label: 'PoliTalk', title: 'PoliTalk', dates: 'Project', desc: 'An ambient finance dashboard with cinematic data storytelling and spatial interaction cues.' },
      { star: 3, label: 'Get Home Safe', title: 'Get Home Safe', dates: 'Project', desc: 'A reflective writing app featuring lightweight prompts and a calm, low-contrast visual language.' }
    ]
  }
];

CONSTELLATIONS.forEach((con, ci) => {
  const baseCx = con.stars.reduce((s, p) => s + p.x, 0) / con.stars.length;
  const baseCy = con.stars.reduce((s, p) => s + p.y, 0) / con.stars.length;
  const sizeScale = 1.18;
  con.stars = con.stars.map((s) => ({
    x: baseCx + (s.x - baseCx) * sizeScale,
    y: baseCy + (s.y - baseCy) * sizeScale
  }));
  con.cx = con.stars.reduce((s, p) => s + p.x, 0) / con.stars.length;
  con.cy = con.stars.reduce((s, p) => s + p.y, 0) / con.stars.length;
  con.hitRadius = 132 * sizeScale;
  con.edgesMeta = con.edges.map((_, ei) => ({
    phase: ci * 1.9 + ei * 0.73 + Math.random() * 2.2,
    speed: 0.27 + Math.random() * 0.4,
    flow: 0.045 + Math.random() * 0.03
  }));
  const ranked = con.stars
    .map((s, i) => ({ i, score: (Math.sin((s.x + s.y) * 0.013 + ci) + 1) * 0.5 }))
    .sort((a, b) => b.score - a.score);
  con.anchorStars = ranked.slice(0, 2).map((v) => v.i);
});

function setupCanvas() {
  W = Math.max(960, window.innerWidth);
  H = Math.max(620, window.innerHeight);
  c.width = W;
  c.height = H;
  earthCX = W / 2;
  earthCY = H + 1860;
  earthRX = W * 2.2;
  earthRY = 2000;
  wg = ctx.createLinearGradient(W * 0.05, 0, W * 0.95, 0);
  wg.addColorStop(0, 'rgba(255,255,255,0)');
  wg.addColorStop(0.15, 'rgba(230,220,255,0.65)');
  wg.addColorStop(0.5, 'rgba(255,253,255,0.95)');
  wg.addColorStop(0.85, 'rgba(230,220,255,0.65)');
  wg.addColorStop(1, 'rgba(255,255,255,0)');
}
setupCanvas();
window.addEventListener('resize', setupCanvas);

function drawBg(t) {
  const sb = ctx.createLinearGradient(0, 0, 0, H);
  sb.addColorStop(0, '#04040a');
  sb.addColorStop(0.5, '#07061a');
  sb.addColorStop(0.85, '#0d0828');
  sb.addColorStop(1, '#06050f');
  ctx.fillStyle = sb;
  ctx.fillRect(0, 0, W, H);

  bgStars.forEach((s) => {
    const pulse = 0.76 + 0.24 * Math.sin(t * s.speed + s.phase);
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.a * (0.9 + (pulse - 0.76) * 1.35)})`;
    ctx.fill();
  });

  ctx.beginPath();
  ctx.ellipse(earthCX, earthCY, earthRX, earthRY, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#05040e';
  ctx.fill();

  for (let i = 0; i < 45; i++) {
    const tt = i / 45, ex = i * 3.8, al = (1 - tt) * (1 - tt) * 0.11;
    const fg = ctx.createLinearGradient(W * 0.05, 0, W * 0.95, 0);
    fg.addColorStop(0, 'rgba(100,60,200,0)');
    fg.addColorStop(0.12, `rgba(120,80,220,${al * 0.7})`);
    fg.addColorStop(0.5, `rgba(150,100,255,${al * 1.5})`);
    fg.addColorStop(0.88, `rgba(120,80,220,${al * 0.7})`);
    fg.addColorStop(1, 'rgba(100,60,200,0)');
    ctx.strokeStyle = fg;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.ellipse(earthCX, earthCY, earthRX + ex, earthRY + ex, 0, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
  }

  ctx.strokeStyle = wg;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(earthCX, earthCY, earthRX, earthRY, 0, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();
}

let hoveredConstellation = -1;
let activeConstellation = -1;
let targetZoom = 0;
let zoomProgress = 0;
let selectedItem = null;
let mouse = { x: 0, y: 0 };
let cam = { scale: 1, tx: 0, ty: 0 };

function lerp(a, b, t) { return a + (b - a) * t; }
function getScreenXY(worldX, worldY) {
  return { x: worldX * cam.scale + cam.tx, y: worldY * cam.scale + cam.ty };
}
function getWorldXY(screenX, screenY) {
  return { x: (screenX - cam.tx) / cam.scale, y: (screenY - cam.ty) / cam.scale };
}
function hideCard() {
  selectedItem = null;
  detailOverlay.classList.remove('show');
}
function showCard(con, item) {
  selectedItem = { con, item };
  detailPanel.innerHTML =
    `<div class="kicker">${con.name}</div>` +
    `<div class="title">${item.title}</div>` +
    `<div class="date">${item.dates}</div>` +
    `<div class="desc">${item.desc}</div>`;
  detailOverlay.classList.add('show');
}

c.addEventListener('mousemove', (e) => {
  const r = c.getBoundingClientRect();
  mouse.x = (e.clientX - r.left) * (W / r.width);
  mouse.y = (e.clientY - r.top) * (H / r.height);
  if (activeConstellation === -1) {
    hoveredConstellation = -1;
    for (let i = 0; i < CONSTELLATIONS.length; i++) {
      const con = CONSTELLATIONS[i];
      if (Math.hypot(mouse.x - con.cx, mouse.y - con.cy) < con.hitRadius) {
        hoveredConstellation = i;
        break;
      }
    }
  }
});

c.addEventListener('mouseleave', () => {
  if (activeConstellation === -1) hoveredConstellation = -1;
});

c.addEventListener('click', () => {
  if (detailOverlay.classList.contains('show')) return;
  if (activeConstellation === -1 && hoveredConstellation !== -1) {
    activeConstellation = hoveredConstellation;
    targetZoom = 1;
    hoveredConstellation = -1;
    hideCard();
    return;
  }
  if (activeConstellation !== -1 && zoomProgress > 0.75) {
    const world = getWorldXY(mouse.x, mouse.y);
    const con = CONSTELLATIONS[activeConstellation];
    let hit = null;
    con.items.forEach((item) => {
      const s = con.stars[item.star];
      if (Math.hypot(world.x - s.x, world.y - s.y) < 12) hit = item;
    });
    if (hit) {
      showCard(con, hit);
    } else {
      const outsideConstellation = Math.hypot(world.x - con.cx, world.y - con.cy) > con.hitRadius * 1.3;
      if (outsideConstellation) {
        targetZoom = 0;
      }
      hideCard();
    }
  } else if (activeConstellation !== -1 && zoomProgress <= 0.75) {
    // If user clicks during early zoom, allow clicking outside to cancel back to main sky.
    const world = getWorldXY(mouse.x, mouse.y);
    const con = CONSTELLATIONS[activeConstellation];
    const outsideConstellation = Math.hypot(world.x - con.cx, world.y - con.cy) > con.hitRadius * 1.3;
    if (outsideConstellation) {
      targetZoom = 0;
      hideCard();
    }
  }
});

detailOverlay.addEventListener('click', (e) => {
  if (e.target === detailOverlay) hideCard();
});

window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (detailOverlay.classList.contains('show')) {
    // Escape while viewing an item returns to constellation view.
    hideCard();
    return;
  }
  if (activeConstellation !== -1 || targetZoom > 0) {
    // Escape while zoomed/in-transition returns to main sky.
    targetZoom = 0;
    hideCard();
  }
});

function loop(ts) {
  const t = ts * 0.001;
  c.style.cursor = (activeConstellation === -1 && hoveredConstellation !== -1) ? 'pointer' : 'default';
  zoomProgress = lerp(zoomProgress, targetZoom, 0.055);
  if (targetZoom === 0 && zoomProgress < 0.02) {
    zoomProgress = 0;
    activeConstellation = -1;
  }
  if (activeConstellation !== -1) {
    const focus = CONSTELLATIONS[activeConstellation];
    cam.scale = lerp(1, 2.2, zoomProgress);
    cam.tx = lerp(0, W / 2 - focus.cx * cam.scale, zoomProgress);
    cam.ty = lerp(0, H * 0.45 - focus.cy * cam.scale, zoomProgress);
  } else {
    cam.scale = 1;
    cam.tx = 0;
    cam.ty = 0;
  }

  drawBg(t);
  if (zoomProgress < 0.15) {
    const a = 1 - (zoomProgress / 0.15);
    const landingTitleY = H - 82;
    const landingSubtitleY = H - 48;
    ctx.textAlign = 'center';
    ctx.font = '500 40px "Cormorant Garamond", serif';
    ctx.fillStyle = `rgba(228, 233, 250, ${0.9 * a})`;
    ctx.fillText('Welcome to Crystal\'s Universe', W / 2, landingTitleY);
    ctx.font = '500 24px "Cormorant Garamond", serif';
    ctx.fillStyle = `rgba(184, 196, 234, ${0.82 * a})`;
    ctx.fillText('Explore these constellations to learn more about her', W / 2, landingSubtitleY);
  }

  ctx.save();
  ctx.translate(cam.tx, cam.ty);
  ctx.scale(cam.scale, cam.scale);

  CONSTELLATIONS.forEach((con, ci) => {
    const conScreen = getScreenXY(con.cx, con.cy);
    const proximity = Math.max(0, 1 - (Math.hypot(mouse.x - conScreen.x, mouse.y - conScreen.y) / 240));
    const hoverBoost = 1 + proximity * 0.18;

    con.edges.forEach(([a, b], ei) => {
      const sa = con.stars[a], sb = con.stars[b];
      const meta = con.edgesMeta[ei];
      const breathe = 0.18 + 0.24 * (0.5 + 0.5 * Math.sin(t * meta.speed + meta.phase));
      const flowCenter = (t * meta.flow + meta.phase * 0.11) % 1;
      const left = Math.max(0, flowCenter - 0.33);
      const right = Math.min(1, flowCenter + 0.33);
      let lineAlpha = breathe;
      if (activeConstellation !== -1 && ci !== activeConstellation) {
        lineAlpha *= (1 - zoomProgress);
      } else if (activeConstellation === -1 && hoveredConstellation !== -1 && hoveredConstellation !== ci) {
        lineAlpha *= 0.35;
      } else if (hoveredConstellation === ci && activeConstellation === -1) {
        lineAlpha *= 1.35;
      }
      lineAlpha *= hoverBoost;

      const lg = ctx.createLinearGradient(sa.x, sa.y, sb.x, sb.y);
      lg.addColorStop(0, `rgba(100,140,255,${lineAlpha})`);
      lg.addColorStop(left, `rgba(100,140,255,${lineAlpha * 0.9})`);
      lg.addColorStop(flowCenter, `rgba(170,215,255,${lineAlpha + 0.18})`);
      lg.addColorStop(right, `rgba(100,140,255,${lineAlpha * 0.9})`);
      lg.addColorStop(1, `rgba(100,140,255,${lineAlpha})`);
      ctx.strokeStyle = lg;
      ctx.lineWidth = activeConstellation === ci ? 1.35 : 1.2;
      ctx.beginPath();
      ctx.moveTo(sa.x, sa.y);
      ctx.lineTo(sb.x, sb.y);
      ctx.stroke();
    });

    con.stars.forEach((s, si) => {
      let alpha = 1;
      if (activeConstellation !== -1 && ci !== activeConstellation) {
        alpha = 1 - zoomProgress;
      } else if (activeConstellation === -1 && hoveredConstellation !== -1 && hoveredConstellation !== ci) {
        alpha = 0.35;
      } else if (hoveredConstellation === ci && activeConstellation === -1) {
        alpha = 1.3;
      }
      alpha *= hoverBoost;
      const isAnchor = con.anchorStars.includes(si);
      const isZoomedStar = activeConstellation === ci && zoomProgress > 0.65 && con.items.some((item) => item.star === si);
      const rad = isZoomedStar ? 4.7 : (isAnchor ? 4.4 : 3);
      const glowR = isAnchor ? 20 : 14;
      const softGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
      softGlow.addColorStop(0, `rgba(180,205,255,${(isAnchor ? 0.52 : 0.35) * alpha})`);
      softGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = softGlow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s.x, s.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225,235,255,${(isAnchor ? 1 : 0.95) * alpha})`;
      ctx.fill();
    });

    const avgX = con.stars.reduce((s, p) => s + p.x, 0) / con.stars.length;
    const maxY = Math.max(...con.stars.map((p) => p.y));
    const nameAlpha = (activeConstellation !== -1 && ci !== activeConstellation) ? (1 - zoomProgress) : 1;
    ctx.font = '500 18px "Cormorant Garamond", serif';
    ctx.fillStyle = `rgba(150,170,220,${0.74 * nameAlpha})`;
    ctx.textAlign = 'center';
    ctx.fillText(con.name.toUpperCase(), avgX, maxY + 26);

    if (activeConstellation === ci && zoomProgress > 0.68) {
      const labelAlpha = (zoomProgress - 0.68) / 0.32;
      con.items.forEach((item) => {
        const s = con.stars[item.star];
        ctx.font = '500 19px "Cormorant Garamond", serif';
        ctx.fillStyle = `rgba(222,230,252,${0.9 * labelAlpha})`;
        ctx.fillText(item.label, s.x, s.y - 14);
      });
    }
  });

  ctx.restore();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
