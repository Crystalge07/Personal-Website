window.createSceneData = function createSceneData() {
  const bgStars = Array.from({ length: 320 }, () => {
    const r = Math.random() < 0.05 ? Math.random() * 1.9 + 1.0 : Math.random() * 1.15 + 0.42;
    const depth = Math.pow(Math.random(), 1.8) * 0.9 + 0.05;
    return {
      x: Math.random(), y: Math.random() * 0.82,
      r,
      a: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.7,
      depth
    };
  });

  const CONSTELLATIONS = [
    {
      name: 'About Me',
      stars: [
        { x: 292, y: 292 }, { x: 358, y: 246 }, { x: 438, y: 276 },
        { x: 420, y: 348 }, { x: 336, y: 330 }, { x: 254, y: 364 }
      ],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [4, 5], [5, 0]],
      items: [
        { star: 0, label: 'Who Am I', title: 'Who Am I', dates: 'About Me', desc: '<div class="who-am-i-layout"><div class="headshot-side"><img src="./Headshot.png" alt="Crystal Ge"></div><div class="bio-side">Hi, I\'m Crystal :D I\'m a Computer Science and Business student @ Western University. I\'m passionate about the intersection of technology and human experience, specifically how to use software to make the products people use feel more intuitive, personal, and meaningful - and ultimately how businesses can grow through that. I\'ve explored this through roles spanning data, marketing, software engineering, and private equity, and I\'m now seeking SWE and PM opportunities where I can keep building at that intersection.</div></div>' },
        { star: 2, label: 'My Interests', title: 'My Interests', dates: 'About Me', desc: '<ul class="heart-list"><li>Playing volleyball (playing and coaching for over 8 years)</li><li>F1 fan (Oscar Piastri fan!!)</li><li>Drawing</li><li>Handmaking pickles</li><li>Mid century modern architecture, furniture, and antiques</li><li>Coin collecting</li><li>Travelling</li><li>Hayday, Clash Royale, Brawl Stars, and Clash of Clans (anything Supercell!!) </li></ul>' },
        { star: 3, label: 'Connect with Me', title: 'Connect with Me', dates: 'About Me', desc: 'LinkedIn: <a href="https://www.linkedin.com/in/crystal-ge-796334269/" target="_blank" rel="noopener noreferrer">Crystal Ge</a><br>GitHub: <a href="https://github.com/Crystalge07" target="_blank" rel="noopener noreferrer">Crystalge07</a><br>Email: <a href="mailto:cge49@uwo.ca">cge49@uwo.ca</a>' },
        { star: 5, label: 'My Resume', title: 'My Resume', dates: 'About Me', desc: 'Explore my background, experiences, and projects in one place.' }
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
        { star: 0, label: 'Private Equity Analyst', title: 'Private Equity Analyst @ Solen Software Group', dates: 'May 2026 - August 2026', desc: 'Incoming in-person 16-week private equity internship focused on deal sourcing, portfolio management, and financial analysis' },
        { star: 2, label: 'Director of Finance', title: 'Director of Finance @ Western Entrepreneurship Association', dates: 'September 2025 - April 2026', desc: 'Developed motion-heavy narrative experiences that united visual direction with web tech.' },
        { star: 1, label: 'Data Analyst', title: 'Data Analyst @ Autumn', dates: 'January 2026 - August 2024', desc: 'Led interaction design and prototyping for multi-step user journeys and growth surfaces.' },
        { star: 3, label: 'Finance Executive', title: 'Finance Executive @ Taiwanese Association at Western', dates: '', desc: 'Directed budgeting, reimbursements, and financial reporting to sustain a vibrant cultural student community.' },
        { star: 4, label: 'Founder and President', title: 'Founder and President @ King FBLC', dates: '', desc: 'I founded this chapter from the ground up and scaled it to 100+ members across schools in the GTA, recruiting and leading a team of 20+ executives to build and deliver a comprehensive business education curriculum. Under my leadership the chapter earned 3 national-level chapter awards and 18 national-level event wins!' },
        { star: 5, label: 'Director of Projects', title: 'Director of Projects @ Western Founder\'s Network', dates: 'September 2025 - April 2026', desc: 'Partnered with teams on rapid concept-to-launch builds across branding and digital products.' },
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
    const sizeScale = 1.5;
    con.stars = con.stars.map((s) => ({
      x: baseCx + (s.x - baseCx) * sizeScale,
      y: baseCy + (s.y - baseCy) * sizeScale
    }));
    con.cx = con.stars.reduce((s, p) => s + p.x, 0) / con.stars.length;
    con.cy = con.stars.reduce((s, p) => s + p.y, 0) / con.stars.length;
    con.hitRadius = 132 * sizeScale;
    con.edgesMeta = con.edges.map(() => ({
      alpha: 0.34 + Math.random() * 0.18,
      glow: 0.16 + Math.random() * 0.14,
      flowCenter: 0.18 + Math.random() * 0.64,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.45 + Math.random() * 0.8,
      wobbleAmp: 4 + Math.random() * 5
    }));
    const ranked = con.stars
      .map((s, i) => ({ i, score: (Math.sin((s.x + s.y) * 0.013 + ci) + 1) * 0.5 }))
      .sort((a, b) => b.score - a.score);
    con.anchorStars = ranked.slice(0, 2).map((v) => v.i);
    con.labeledStars = con.items
      .filter((item) => typeof item.label === 'string' && item.label.trim().length > 0)
      .map((item) => item.star);
    con.designStars = con.stars.map((s) => ({ x: s.x, y: s.y }));
  });

  return { bgStars, CONSTELLATIONS };
};
