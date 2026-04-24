const c = document.getElementById('bg');
const ctx = c.getContext('2d');
const detailOverlay = document.getElementById('detailOverlay');
const detailPanel = document.getElementById('detailPanel');
let W = 1400, H = 900;

let earthCX = W / 2, earthCY = H + 1800, earthRX = W * 2.2, earthRY = 2000;
let wg = null;

const { bgStars, CONSTELLATIONS } = window.createSceneData();

function initLineTweens() {
  if (typeof gsap === 'undefined') return;
  CONSTELLATIONS.forEach((con) => {
    con.edgesMeta.forEach((line) => {
      gsap.to(line, {
        alpha: 0.8,
        duration: gsap.utils.random(2, 4),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: gsap.utils.random(0, 2)
      });
      gsap.to(line, {
        glow: gsap.utils.random(0.28, 0.42),
        duration: gsap.utils.random(2.2, 4.4),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: gsap.utils.random(0, 2)
      });
      gsap.to(line, {
        flowCenter: gsap.utils.random(0.18, 0.82),
        duration: gsap.utils.random(5.5, 9),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: gsap.utils.random(0, 2)
      });
    });
  });
}
initLineTweens();

function positionConstellations() {
  const allStars = CONSTELLATIONS.flatMap((con) => con.designStars);
  const currentCenterX = allStars.reduce((sum, s) => sum + s.x, 0) / allStars.length;
  const currentCenterY = allStars.reduce((sum, s) => sum + s.y, 0) / allStars.length;
  const targetCenterX = W * 0.5;
  const targetCenterY = H * 0.45;
  const dx = targetCenterX - currentCenterX;
  const dy = targetCenterY - currentCenterY;

  CONSTELLATIONS.forEach((con) => {
    const centeredStars = con.designStars.map((s) => ({ x: s.x + dx, y: s.y + dy }));
    const centeredCx = centeredStars.reduce((sum, p) => sum + p.x, 0) / centeredStars.length;
    const spreadOffsetX = (centeredCx - targetCenterX) * 0.22;
    con.stars = centeredStars.map((s) => ({ x: s.x + spreadOffsetX, y: s.y }));
    con.cx = con.stars.reduce((sum, p) => sum + p.x, 0) / con.stars.length;
    con.cy = con.stars.reduce((sum, p) => sum + p.y, 0) / con.stars.length;
  });
}

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
  positionConstellations();
}
setupCanvas();
window.addEventListener('resize', setupCanvas);

function drawBg(t) {
  const sb = ctx.createLinearGradient(0, 0, 0, H);
  sb.addColorStop(0, '#01040b');
  sb.addColorStop(0.5, '#040914');
  sb.addColorStop(0.85, '#08122a');
  sb.addColorStop(1, '#020712');
  ctx.fillStyle = sb;
  ctx.fillRect(0, 0, W, H);

  bgStars.forEach((s) => {
    const pulse = 0.76 + 0.24 * Math.sin(t * s.speed + s.phase);
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.a * (0.9 + (pulse - 0.76) * 1.35)})`;
    ctx.fill();
  });

  const dt = 1 / 60;
  for (let i = 0; i < shootingStars.length; i++) {
    const m = shootingStars[i];
    m.age += dt;
    if (m.age < 0) continue;
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    const p = m.age / m.life;
    if (p >= 1 || m.x > W + 150 || m.y < -150 || m.y > H * 0.9) {
      shootingStars.splice(i, 1);
      i -= 1;
      spawnShootingStar(3.5, 11);
      continue;
    }
    const alpha = Math.sin(Math.PI * p) * 0.55;
    const tx = m.x - m.dirX * m.tail;
    const ty = m.y - m.dirY * m.tail;
    const g = ctx.createLinearGradient(tx, ty, m.x, m.y);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.35, `rgba(206,216,255,${alpha * 0.35})`);
    g.addColorStop(1, `rgba(255,255,255,${alpha})`);
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(m.x, m.y);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.ellipse(earthCX, earthCY, earthRX, earthRY, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#05040e';
  ctx.fill();

  for (let i = 0; i < 45; i++) {
    const tt = i / 45, ex = i * 3.8, al = (1 - tt) * (1 - tt) * 0.11;
    const fg = ctx.createLinearGradient(W * 0.05, 0, W * 0.95, 0);
    fg.addColorStop(0, 'rgba(52,72,164,0)');
    fg.addColorStop(0.12, `rgba(74,96,198,${al * 0.55})`);
    fg.addColorStop(0.5, `rgba(102,124,224,${al * 1.02})`);
    fg.addColorStop(0.88, `rgba(74,96,198,${al * 0.55})`);
    fg.addColorStop(1, 'rgba(52,72,164,0)');
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
const cursorRibbon = [];
const MAX_RIBBON_POINTS = 44;
const MAX_RIBBON_LENGTH = 195;
const RIBBON_LAG = 0.38;
let ribbonTarget = { x: W * 0.5, y: H * 0.5 };
const shootingStars = [];

function spawnShootingStar(delayMin = 2, delayMax = 10) {
  const entryType = Math.random();
  let angle = Math.PI / 4 + (Math.random() - 0.5) * 0.45;
  let startX = Math.random() * W;
  let startY = -40 - Math.random() * (H * 0.12);
  if (entryType < 0.34) {
    // Top band, down-right
    angle = Math.PI / 4 + (Math.random() - 0.5) * 0.35;
    startX = Math.random() * W;
    startY = -40 - Math.random() * (H * 0.12);
  } else if (entryType < 0.67) {
    // Left edge, drifting down-right
    angle = Math.PI / 6 + (Math.random() - 0.5) * 0.35;
    startX = -40 - Math.random() * (W * 0.08);
    startY = Math.random() * (H * 0.55);
  } else {
    // Right edge, drifting down-left
    angle = (5 * Math.PI) / 6 + (Math.random() - 0.5) * 0.35;
    startX = W + 40 + Math.random() * (W * 0.08);
    startY = Math.random() * (H * 0.55);
  }
  const speed = 420 + Math.random() * 300;
  const life = 0.7 + Math.random() * 0.55;
  shootingStars.push({
    x: startX,
    y: startY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    dirX: Math.cos(angle),
    dirY: Math.sin(angle),
    age: -(delayMin + Math.random() * (delayMax - delayMin)),
    life,
    tail: 70 + Math.random() * 60
  });
}

for (let i = 0; i < 3; i++) spawnShootingStar(i * 2.4, 10 + i * 2.5);

function lerp(a, b, t) { return a + (b - a) * t; }
function getScreenXY(worldX, worldY) {
  return { x: worldX * cam.scale + cam.tx, y: worldY * cam.scale + cam.ty };
}
function getWorldXY(screenX, screenY) {
  return { x: (screenX - cam.tx) / cam.scale, y: (screenY - cam.ty) / cam.scale };
}

/** World position where section title sits so that at full zoom it lands on the horizon welcome line (screen Y = H - 72). */
function getZoomedSectionTitleWorld(focus) {
  const scaleFinal = 2.2;
  const focusTargetY = focus.name === 'Experiences' ? H * 0.5 : H * 0.45;
  const txFinal = W / 2 - focus.cx * scaleFinal;
  const tyFinal = focusTargetY - focus.cy * scaleFinal;
  const landingTitleY = H - 72;
  const lx = (W / 2 - txFinal) / scaleFinal;
  const ly = (landingTitleY - tyFinal) / scaleFinal;
  return { lx, ly };
}
function hideCard() {
  selectedItem = null;
  detailOverlay.classList.remove('show');
  detailPanel.classList.remove('who-am-i-mode');
}
function showCard(con, item) {
  selectedItem = { con, item };
  const normalizedDate = (item.dates || '').trim().toLowerCase();
  const normalizedSection = con.name.trim().toLowerCase();
  const shouldShowDate = normalizedDate && normalizedDate !== normalizedSection && normalizedDate !== 'project';
  detailPanel.innerHTML =
    `<div class="kicker">${con.name}</div>` +
    `<div class="title">${item.title}</div>` +
    (shouldShowDate ? `<div class="date">${item.dates}</div>` : '') +
    `<div class="desc">${item.desc}</div>`;
  if (item.title === 'Who Am I') {
    detailPanel.classList.add('who-am-i-mode');
  } else {
    detailPanel.classList.remove('who-am-i-mode');
  }
  detailOverlay.classList.add('show');
}

c.addEventListener('mousemove', (e) => {
  const r = c.getBoundingClientRect();
  mouse.x = (e.clientX - r.left) * (W / r.width);
  mouse.y = (e.clientY - r.top) * (H / r.height);
  ribbonTarget.x = mouse.x;
  ribbonTarget.y = mouse.y;
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
  ribbonTarget = { x: mouse.x, y: mouse.y };
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
      const sp = getScreenXY(con.stars[item.star].x, con.stars[item.star].y);
      if (Math.hypot(mouse.x - sp.x, mouse.y - sp.y) < 40) hit = item;
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
  if (cursorRibbon.length === 0) {
    for (let i = 0; i < MAX_RIBBON_POINTS; i++) {
      cursorRibbon.push({ x: ribbonTarget.x, y: ribbonTarget.y });
    }
  }
  cursorRibbon[0].x += (ribbonTarget.x - cursorRibbon[0].x) * RIBBON_LAG;
  cursorRibbon[0].y += (ribbonTarget.y - cursorRibbon[0].y) * RIBBON_LAG;
  for (let i = 1; i < cursorRibbon.length; i++) {
    cursorRibbon[i].x += (cursorRibbon[i - 1].x - cursorRibbon[i].x) * RIBBON_LAG;
    cursorRibbon[i].y += (cursorRibbon[i - 1].y - cursorRibbon[i].y) * RIBBON_LAG;
  }
  let length = 0;
  let keepCount = cursorRibbon.length;
  for (let i = 1; i < cursorRibbon.length; i++) {
    length += Math.hypot(cursorRibbon[i].x - cursorRibbon[i - 1].x, cursorRibbon[i].y - cursorRibbon[i - 1].y);
    if (length > MAX_RIBBON_LENGTH) {
      keepCount = i + 1;
      break;
    }
  }
  if (keepCount < cursorRibbon.length) {
    cursorRibbon.splice(keepCount);
  }
  while (cursorRibbon.length < MAX_RIBBON_POINTS) {
    const tail = cursorRibbon[cursorRibbon.length - 1];
    cursorRibbon.push({ x: tail.x, y: tail.y });
  }
  zoomProgress = lerp(zoomProgress, targetZoom, 0.055);
  if (targetZoom === 0 && zoomProgress < 0.02) {
    zoomProgress = 0;
    activeConstellation = -1;
  }
  if (activeConstellation !== -1) {
    const focus = CONSTELLATIONS[activeConstellation];
    cam.scale = lerp(1, 2.2, zoomProgress);
    const focusTargetY = focus.name === 'Experiences' ? H * 0.5 : H * 0.45;
    cam.tx = lerp(0, W / 2 - focus.cx * cam.scale, zoomProgress);
    cam.ty = lerp(0, focusTargetY - focus.cy * cam.scale, zoomProgress);
  } else {
    cam.scale = 1;
    cam.tx = 0;
    cam.ty = 0;
  }

  drawBg(t);
  {
    const landingTitleY = H - 72;
    const landingSubtitleY = H - 38;
    const welcomeFade =
      activeConstellation !== -1 ? 1 - zoomProgress : 1;
    if (welcomeFade > 0.02) {
      ctx.textAlign = 'center';
      ctx.font = '500 40px "Cormorant Garamond", serif';
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * welcomeFade})`;
      ctx.fillText('Welcome to Crystal\'s Universe', W / 2, landingTitleY);
      ctx.font = '500 24px "Cormorant Garamond", serif';
      ctx.fillStyle = `rgba(255, 255, 255, ${0.82 * welcomeFade})`;
      ctx.fillText('Have fun exploring the stars!', W / 2, landingSubtitleY);
    }
  }

  ctx.save();
  ctx.translate(cam.tx, cam.ty);
  ctx.scale(cam.scale, cam.scale);

  CONSTELLATIONS.forEach((con, ci) => {
    const conScreen = getScreenXY(con.cx, con.cy);
    const proximity = Math.max(0, 1 - (Math.hypot(mouse.x - conScreen.x, mouse.y - conScreen.y) / 240));
    const isSkyHoverThis = activeConstellation === -1 && hoveredConstellation === ci;
    const hoverBoostStars = 1 + proximity * 0.18;
    const hoverBoostLines = isSkyHoverThis ? 1 + proximity * 0.52 : hoverBoostStars;

    con.edges.forEach(([a, b], ei) => {
      const sa = con.stars[a], sb = con.stars[b];
      const meta = con.edgesMeta[ei];
      const flowCenter = meta.flowCenter;
      const left = Math.max(0, flowCenter - 0.33);
      const right = Math.min(1, flowCenter + 0.33);
      let lineAlpha = meta.alpha;
      if (activeConstellation !== -1 && ci !== activeConstellation) {
        lineAlpha *= (1 - zoomProgress);
      } else if (activeConstellation === -1 && hoveredConstellation !== -1 && hoveredConstellation !== ci) {
        lineAlpha *= 0.35;
      } else if (hoveredConstellation === ci && activeConstellation === -1) {
        lineAlpha *= 2.18;
      }
      lineAlpha *= hoverBoostLines;

      const lg = ctx.createLinearGradient(sa.x, sa.y, sb.x, sb.y);
      const coreBoost = isSkyHoverThis ? 0.24 : 0;
      lg.addColorStop(0, `rgba(188,194,214,${lineAlpha})`);
      lg.addColorStop(left, `rgba(188,194,214,${lineAlpha * 0.9})`);
      lg.addColorStop(flowCenter, `rgba(246,248,255,${lineAlpha + meta.glow + coreBoost})`);
      lg.addColorStop(right, `rgba(188,194,214,${lineAlpha * 0.9})`);
      lg.addColorStop(1, `rgba(188,194,214,${lineAlpha})`);
      ctx.strokeStyle = lg;
      ctx.lineWidth = activeConstellation === ci ? 1.35 : (isSkyHoverThis ? 1.55 : 1.2);
      const midX = (sa.x + sb.x) * 0.5;
      const midY = (sa.y + sb.y) * 0.5;
      const edx = sb.x - sa.x;
      const edy = sb.y - sa.y;
      const elen = Math.hypot(edx, edy) || 1;
      const nx = -edy / elen;
      const ny = edx / elen;
      const wobble = Math.sin(t * meta.wobbleSpeed + meta.wobblePhase) * meta.wobbleAmp;
      const cpX = midX + nx * wobble;
      const cpY = midY + ny * wobble;
      ctx.beginPath();
      ctx.moveTo(sa.x, sa.y);
      ctx.quadraticCurveTo(cpX, cpY, sb.x, sb.y);
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
      alpha *= hoverBoostStars;
      const isLabeledStar = con.labeledStars.includes(si);
      const isZoomedStar = activeConstellation === ci && zoomProgress > 0.65 && con.items.some((item) => item.star === si);
      const twinkle = isLabeledStar ? (0.9 + 0.1 * Math.sin(t * 2.2 + si * 1.7 + ci * 0.9)) : 1;
      const rad = isZoomedStar ? 4.7 : (isLabeledStar ? 3.7 : 2.6);
      if (isLabeledStar) {
        const glowR = 18;
        const softGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        softGlow.addColorStop(0, `rgba(180,205,255,${0.48 * alpha * twinkle})`);
        softGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = softGlow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, rad, 0, Math.PI * 2);
      const starOpacity = isLabeledStar
        ? Math.max(0.8, alpha * twinkle)
        : 0.8 * alpha;
      ctx.fillStyle = `rgba(225,235,255,${starOpacity})`;
      ctx.fill();
    });

    const avgX = con.stars.reduce((s, p) => s + p.x, 0) / con.stars.length;
    const maxY = Math.max(...con.stars.map((p) => p.y));
    const nameAlpha = (activeConstellation !== -1 && ci !== activeConstellation) ? (1 - zoomProgress) : 1;
    ctx.font = '500 18px "Cormorant Garamond", serif';
    const nameWhite = isSkyHoverThis ? 0.96 : 0.74;
    ctx.fillStyle = `rgba(255,255,255,${nameWhite * nameAlpha})`;
    ctx.textAlign = 'center';
    if (activeConstellation === ci && zoomProgress > 0) {
      const focus = con;
      const { lx, ly } = getZoomedSectionTitleWorld(focus);
      ctx.fillText(con.name.toUpperCase(), lx, ly);
    } else {
      ctx.fillText(con.name.toUpperCase(), avgX, maxY + 26);
    }

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

  if (cursorRibbon.length > 2) {
    const head = cursorRibbon[0];
    const tail = cursorRibbon[cursorRibbon.length - 1];
    const gradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
    gradient.addColorStop(0, 'rgba(226,228,236,0.74)');
    gradient.addColorStop(1, 'rgba(178,182,204,0)');
    const maxWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = maxWidth;
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(cursorRibbon[0].x, cursorRibbon[0].y);
    for (let i = 1; i < cursorRibbon.length - 1; i += 2) {
      const cpX = cursorRibbon[i].x;
      const cpY = cursorRibbon[i].y;
      const next = Math.min(i + 2, cursorRibbon.length - 1);
      const endX = (cursorRibbon[i].x + cursorRibbon[next].x) * 0.5;
      const endY = (cursorRibbon[i].y + cursorRibbon[next].y) * 0.5;
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    }
    ctx.lineTo(tail.x, tail.y);
    ctx.stroke();
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
