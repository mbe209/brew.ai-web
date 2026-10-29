// Scrollytelling: Kapitelfarben, Parallax, Sticky-Szenen (Rezept, Glas, Sorten)
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const cfg = window.BREW_CONFIG || {};
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;

  // Sterne im Intro
  const stars = $("#st-stars");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.opacity = (0.2 + Math.random() * 0.6).toFixed(2);
    stars.appendChild(s);
  }

  // Aromawörter
  const words = [
    ["Mango", 8, 12, 3.2, 0.5, "#C6E35A"], ["Zitrus", 70, 8, 2.4, 0.3, "#FFB547"], ["Kiefer", 82, 40, 1.8, 0.7, "#FAF7F0"],
    ["Maracuja", 60, 70, 2.8, 0.45, "#FF8C2B"], ["Karamell", 12, 78, 1.6, 0.25, "#FAF7F0"], ["Grapefruit", 40, 92, 2.1, 0.6, "#C6E35A"],
    ["Yuzu", 88, 82, 2.6, 0.35, "#C6E35A"], ["Kaffee", 30, 4, 1.5, 0.8, "#FAF7F0"], ["Pfirsich", 52, 30, 1.4, 0.2, "#FFB547"]
  ];
  const wbox = $("#st-words");
  const wEls = words.map(([t, x, y, size, speed, c]) => {
    const e = document.createElement("span");
    e.className = "st-word"; e.textContent = t; e.setAttribute("aria-hidden", "true");
    Object.assign(e.style, { left: x + "%", top: y + "%", fontSize: `clamp(1rem, ${size * 1.6}vw, ${size}rem)`, color: c });
    e.dataset.x = x; e.dataset.speed = speed;
    wbox.appendChild(e); return e;
  });

  // Große Dolde mit einzeln steuerbaren Schuppen
  const pos = [[50,31],[42,42],[58,42],[34,55],[50,58],[66,55],[30,70],[50,73],[70,70],[32,86],[50,88],[68,86],[40,100],[60,100],[50,112]];
  const hop = $("#st-hop");
  hop.innerHTML = '<path d="M50 4 C52 12 51 18 50 24" stroke="#C6E35A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M52 12 C64 2 82 6 86 16 C74 22 60 20 52 12Z" fill="#4CAF50"/>' +
    pos.slice().reverse().map(([x, y]) => `<path class="br" transform="translate(${x} ${y})" d="M0 -11 C9 -11 13 2 0 15 C-13 2 -9 -11 0 -11Z" fill="transparent" stroke="#C6E35A" stroke-width="1.4"/>`).join("");
  const bracts = $$(".br", hop).reverse(); // oben zuerst

  // Blasen im Glas
  const gb = $("#st-glassbubbles");
  for (let i = 0; i < 18; i++) gb.insertAdjacentHTML("beforeend", `<circle cx="${50 + Math.random() * 100}" cy="${40 + Math.random() * 260}" r="${1.5 + Math.random() * 2.5}"/>`);

  // Echter Kampagnenstand als Schaumkrone (aus config.js)
  const raised = cfg.raised || 0;
  const live = raised > 0;
  if (live) $("#st-raised").textContent = `Stand heute: ${raised.toLocaleString("de-DE")} €`;
  // Glas: 10k bei 10 %, 50k bei 50 %, 100k bei 100 % der Füllhöhe
  const raisedLevel = clamp(raised / (cfg.goal || 100000));

  // Blasen im Finale
  const bub = $("#st-bubbles");
  for (let i = 0; i < 16; i++) {
    const b = document.createElement("i"), s = 8 + Math.random() * 26;
    Object.assign(b.style, { left: Math.random() * 100 + "%", width: s + "px", height: s + "px", animationDuration: 7 + Math.random() * 9 + "s", animationDelay: -Math.random() * 12 + "s" });
    bub.appendChild(b);
  }

  // Kapitel-Leiste
  const chapters = $$(".st[data-ch]");
  chapters.forEach((c) => c.style.setProperty("--st-fg", c.dataset.fg));
  const rail = $("#st-rail");
  rail.innerHTML = chapters.map((s) => `<li><a href="#${s.id}"><span>${s.dataset.ch}</span><i></i></a></li>`).join("");
  const railLinks = $$("a", rail);

  // Farbe pro Abschnitt: Story-Kapitel bringen data-bg/data-fg mit,
  // alle anderen Abschnitte haben eigene Hintergründe; die Navigation übernimmt deren Farben.
  const sections = $$("main > section");
  const colorOf = (s) => ({
    bg: s.dataset.bg || getComputedStyle(s).backgroundColor,
    fg: s.dataset.fg || getComputedStyle(s).color
  });

  const progress = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };
  const parallaxEls = $$("[data-speed]").filter((e) => !e.classList.contains("st-word"));
  const recipeRows = $$("#st-recipe div");
  const miles = $$("#st-miles li");
  let current = null;

  function frame() {
    const H = innerHeight;

    let sec = sections[0];
    sections.forEach((s) => { if (s.getBoundingClientRect().top < H * 0.5) sec = s; });
    if (sec !== current) {
      current = sec;
      const { bg, fg } = colorOf(sec);
      if (sec.dataset.bg) root.style.setProperty("--story-bg", bg);
      root.style.setProperty("--story-fg", fg);
      document.body.classList.toggle("in-story", !!sec.dataset.bg);
      railLinks.forEach((a) => a.classList.toggle("on", a.hash === "#" + sec.id));
      rail.classList.toggle("hide", !sec.dataset.ch);
    }

    if (!reduce) {
      parallaxEls.forEach((el) => {
        const r = el.closest("section").getBoundingClientRect();
        el.style.transform = `translate3d(0, ${-r.top * parseFloat(el.dataset.speed)}px, 0)`;
      });
      const tr = $("#geschmack").getBoundingClientRect();
      const tp = clamp((H - tr.top) / (H + tr.height));
      wEls.forEach((w) => {
        const sp = parseFloat(w.dataset.speed), x = parseFloat(w.dataset.x);
        w.style.transform = `translate3d(${(50 - x) * tp * 0.5}vw, ${(0.5 - tp) * 600 * sp}px, 0) rotate(${(x - 50) * 0.08 * (1 - tp)}deg)`;
      });
    }

    // Rezept
    const ep = progress($("#rezept"));
    const lit = Math.round(ep * 1.15 * bracts.length);
    bracts.forEach((b, i) => { b.setAttribute("fill", i < lit ? "#C6E35A" : "transparent"); b.setAttribute("stroke", i < lit ? "#22612C" : "#C6E35A"); });
    recipeRows.forEach((d, i) => d.classList.toggle("in", reduce || ep * 1.1 >= i / recipeRows.length));
    $("#st-meter").style.width = clamp(ep * 1.15) * 100 + "%";

    // Glas: vor dem Start füllt der Scroll es ganz, danach bis zum echten Stand
    const gp = clamp(progress($("#ziele")) * 1.15) * (live ? raisedLevel : 1);
    const top = 312 - gp * 292;
    $("#st-beer").setAttribute("y", top);
    $("#st-foam").setAttribute("y", top - 14);
    miles.forEach((li) => li.classList.toggle("on", gp >= parseFloat(li.dataset.at) - 0.001));

    // Sorten seitlich
    const sp = progress($("#sorten"));
    const track = $("#st-track");
    track.style.transform = `translate3d(${-sp * Math.max(0, track.scrollWidth - innerWidth)}px, 0, 0)`;

    ticking = false;
  }
  let ticking = false;
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", req);
  frame();
})();
