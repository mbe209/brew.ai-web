(() => {
  const cfg = window.BREW_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Mobile-Navigation
  const toggle = $(".nav__toggle");
  const links = $("#nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("#nav-links a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

  // Kampagnen-Links
  if (cfg.campaignUrl) {
    $$(".js-campaign").forEach((a) => {
      a.href = cfg.campaignUrl;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  // Artworks: generierte Bilder aus public/art/ einsetzen, sonst Platzhalter behalten
  // (Liste in public/art/manifest.json, wird von scripts/generate-artworks.mjs gepflegt)
  fetch("public/art/manifest.json")
    .then((r) => (r.ok ? r.json() : {}))
    .then((files) => {
      $$("img[data-art]").forEach((img) => {
        if (!files[img.dataset.art]) return;
        img.src = `public/art/${files[img.dataset.art]}`;
        img.hidden = false;
      });
    })
    .catch(() => {});

  // Countdown bis zum Start
  const launch = new Date(cfg.launchDate);
  const count = $("#count");
  function tick() {
    let d = Math.max(0, launch - Date.now());
    if (!d && cfg.campaignUrl) { count.innerHTML = "<div><b>Live!</b><small>Jetzt unterstützen</small></div>"; return; }
    count.innerHTML = [["Tage", 864e5], ["Std", 36e5], ["Min", 6e4], ["Sek", 1e3]].map(([l, ms]) => {
      const n = Math.floor(d / ms); d -= n * ms;
      return `<div><b>${String(n).padStart(2, "0")}</b><small>${l}</small></div>`;
    }).join("");
  }
  tick();
  setInterval(tick, 1000);

  // Anmeldung
  $("#signup").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("#signup-msg");
    const email = e.target.email.value;
    if (!cfg.signupEndpoint) {
      msg.textContent = "Danke! Die Anmeldung wird gerade eingerichtet, schau bald wieder vorbei.";
      return;
    }
    try {
      const res = await fetch(cfg.signupEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error(res.status);
      msg.textContent = "Prost! Wir melden uns zum Start.";
      e.target.reset();
    } catch {
      msg.textContent = "Das hat nicht geklappt. Bitte versuch es später noch einmal.";
    }
  });

  // ---------- Flavor Engine Demo (regelbasiert, nur zur Veranschaulichung) ----------
  const form = $("#engine-form");
  const AXES = [
    ["bitter", "Bitter"], ["fruit", "Frucht"], ["malt", "Malz"],
    ["body", "Körper"], ["sour", "Säure"], ["strength", "Stärke"]
  ];

  const HOPS = {
    zitrus: ["Citra", "Cascade"],
    tropisch: ["Mosaic", "Galaxy"],
    steinobst: ["Nectaron", "Amarillo"],
    beere: ["Hallertau Blanc", "Ekuanot"],
    harz: ["Simcoe", "Chinook"],
    kraeuter: ["Hallertauer Mittelfrüh", "Saazer"]
  };
  const EXTRAS = {
    zitrus: "Orangenzeste",
    beere: "Himbeerpüree",
    steinobst: "Pfirsich",
    kaffee: "Cold-Brew-Kaffee",
    karamell: "Bourbon-Vanille"
  };

  function pickStyle(v, a) {
    const roast = a.has("kaffee");
    if (v.sour >= 6) return v.fruit >= 5 ? "Fruited Sour" : "Berliner Weisse";
    if (v.malt >= 7 && v.strength >= 6) return roast ? "Imperial Stout" : "Barley Wine";
    if (v.malt >= 6) return roast ? "Porter" : "Amber Ale";
    if (v.fruit >= 6 && v.bitter <= 6) return v.strength >= 7 ? "Hazy Double IPA" : (v.strength <= 3 ? "Hazy Session IPA" : "Hazy IPA");
    if (v.bitter >= 7) return v.strength >= 7 ? "Double IPA" : "West Coast IPA";
    if (v.bitter >= 5) return v.strength <= 3 ? "Session IPA" : "Pale Ale";
    if (v.body <= 3) return "Helles";
    return "Hoppy Pils";
  }

  function pickYeast(style) {
    if (/Sour|Weisse/.test(style)) return "Lactobacillus + Kveik";
    if (/Hazy/.test(style)) return "London Ale III (fruchtig, trüb)";
    if (/Stout|Porter|Barley/.test(style)) return "English Ale, hoch vergärend";
    if (/Pils|Helles/.test(style)) return "Untergärige Lagerhefe";
    return "American Ale (neutral, klar)";
  }

  function pickMalts(v, a, style) {
    const m = [/Pils|Helles/.test(style) ? "Pilsner Malz" : "Pale Ale Malz"];
    if (/Hazy/.test(style) || v.body >= 7) m.push("Haferflocken", "Weizenmalz");
    if (v.malt >= 4) m.push("Münchner Malz");
    if (a.has("karamell") || (v.malt >= 5 && !/Stout|Porter/.test(style))) m.push("Karamellmalz");
    if (/Stout|Porter/.test(style)) m.push("Schokoladenmalz", "Röstgerste");
    return [...new Set(m)];
  }

  function pickHops(v, a, style) {
    let h = [];
    a.forEach((k) => HOPS[k] && h.push(...HOPS[k]));
    if (!h.length) h = /Pils|Helles|Stout|Porter|Amber|Barley/.test(style) ? ["Hallertauer Tradition", "Perle"] : ["Cascade", "Citra"];
    if (v.bitter >= 7) h.unshift("Magnum (Bittere)");
    return [...new Set(h)].slice(0, 4);
  }

  // kleiner deterministischer Namensgenerator
  const ADJ = ["Cosmic", "Velvet", "Golden", "Wild", "Lazy", "Electric", "Hazy", "Midnight", "Bright", "Jolly"];
  const NOUN = ["Cone", "Comet", "Lupulin", "Orbit", "Drift", "Garden", "Kettle", "Pulse", "Harvest", "Wave"];
  function nameFor(v, a) {
    const seed = AXES.reduce((s, [k], i) => s + v[k] * (i + 3) * 7, 0) + [...a].join("").length * 13;
    return `${ADJ[seed % ADJ.length]} ${NOUN[Math.floor(seed / 3) % NOUN.length]}`;
  }

  function drawRadar(v) {
    const svg = $("#radar");
    const R = 80;
    const pt = (i, r) => {
      const ang = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
      return [Math.cos(ang) * r, Math.sin(ang) * r];
    };
    let html = "";
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      html += `<polygon class="grid" points="${AXES.map((_, i) => pt(i, R * f).join(",")).join(" ")}"/>`;
    });
    AXES.forEach(([, label], i) => {
      const [x, y] = pt(i, R);
      const [lx, ly] = pt(i, R + 18);
      html += `<line class="axis" x1="0" y1="0" x2="${x}" y2="${y}"/><text x="${lx}" y="${ly}">${label}</text>`;
    });
    html += `<polygon class="shape" points="${AXES.map(([k], i) => pt(i, R * Math.max(0.06, v[k] / 10)).join(",")).join(" ")}"/>`;
    svg.innerHTML = html;
  }

  function update() {
    const v = {};
    AXES.forEach(([k]) => {
      v[k] = +form.elements[k].value;
      $(`output[data-for="${k}"]`).textContent = v[k];
    });
    const a = new Set($$('input[name="aroma"]:checked', form).map((i) => i.value));
    const style = pickStyle(v, a);
    const abv = (3.4 + v.strength * 0.72).toFixed(1).replace(".", ",");
    const ibu = Math.round(/Sour|Weisse/.test(style) ? 6 + v.bitter : 12 + v.bitter * 8.5);
    let ebc = 7 + v.malt * 4;
    if (/Stout|Porter/.test(style)) ebc = 70 + v.malt * 10;
    const extras = [...a].map((k) => EXTRAS[k]).filter(Boolean);
    if (v.body >= 8 && /Hazy|Stout/.test(style)) extras.push("Laktose (Milchzucker)");

    $("#r-style").textContent = style;
    $("#r-name").textContent = nameFor(v, a);
    $("#r-abv").textContent = abv + " %";
    $("#r-ibu").textContent = ibu;
    $("#r-ebc").textContent = ebc;
    $("#r-hops").textContent = pickHops(v, a, style).join(", ");
    $("#r-malts").textContent = pickMalts(v, a, style).join(", ");
    $("#r-yeast").textContent = pickYeast(style);
    $("#r-extras").textContent = extras.length ? extras.join(", ") : "keine, pure Brauzutaten";
    drawRadar(v);
  }

  form.addEventListener("input", update);
  update();
})();
