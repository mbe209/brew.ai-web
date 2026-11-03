// Sprachumschaltung DE/EN. Deutsch steht im HTML, Englisch (US) hier.
// Elemente mit data-i18n="key" bekommen EN[key] als Inhalt,
// data-i18n-alt / -aria-label / -placeholder übersetzen Attribute.
// Texte aus dem JavaScript (Demo, Countdown, Story) holen sich ihre Fassung über BREW_T().
(() => {
  const EN = {
  "nav.toggle": "Menu",
  "nav.idee": "Idea",
  "nav.sorten": "Beers",
  "nav.probieren": "Try it",
  "nav.rewards": "Rewards",
  "nav.b2b": "For breweries",
  "nav.support": "Back us",
  "intro.kicker": "Crowdfunding starts February 2, 2027",
  "intro.h1": "Your taste.<span class=\"st-disp\">Your beer.</span>",
  "intro.lead": "Three craft beer fans, plenty of hops, and a recipe that hits your taste exactly.",
  "intro.cta": "Notify me at launch",
  "intro.story": "The story",
  "intro.cue": "Scroll and brew along",
  "idee.h2a": "Brewing your own batch is expensive. A <span class=\"st-disp\">bad batch</span> costs even more.",
  "idee.suba": "When you have your own beer brewed at a contract brewery, you want to raise a glass afterwards, not stare into the can in disappointment.",
  "idee.h2b": "For us, AI stands for <span class=\"st-disp\">Aroma Intelligence.</span>",
  "idee.subb": "Not Artificial Intelligence. It works quietly in the background and helps you develop a recipe that's sure to taste great. So your batch doesn't end in disappointment, but in a rush of hop aroma that hits your taste exactly.",
  "taste.kicker": "Step 1",
  "taste.h2": "You tell us what you like.",
  "taste.quote": "“Like a summer evening by the lake. Just with mango. And please, not too bitter.”",
  "recipe.kicker": "Step 2 · Aroma Intelligence",
  "recipe.h2": "Behind the scenes, your recipe takes shape.",
  "recipe.style": "Style",
  "recipe.styleval": "Hazy Pale Ale · 5.2%",
  "recipe.hops": "Hops",
  "recipe.malt": "Malt",
  "recipe.maltval": "Pale ale, oats, wheat",
  "recipe.yeast": "Yeast",
  "recipe.extrasval": "Mango, dry-hopped",
  "recipe.values": "Specs",
  "recipe.valuesval": "28 IBU · 12 EBC · 12.5 °P",
  "brew.kicker": "Step 3",
  "brew.h2": "A brewmaster checks it. A contract brewery brews it.",
  "brew.sub": "No basement hobby setup, no bad batch. Real brewhouses, real brewers, and your beer ends up in a can.",
  "goals.kicker": "Crowdfunding · from February 2, 2027",
  "goals.h2": "The fuller the glass, the more beers.",
  "goals.sub": "All or nothing: only once we reach €10,000 do we brew, and only then is anyone charged.",
  "goals.m1b": "€10,000",
  "goals.m1": "Citra Comet gets brewed",
  "goals.m1s": "Funding goal · beer 1",
  "goals.m2b": "€50,000",
  "goals.m2": "Mango Mood joins the lineup",
  "goals.m2s": "Stretch goal · 2 beers",
  "goals.m3b": "€100,000",
  "goals.m3": "You vote on 3 more",
  "goals.m3s": "Stretch goal · 5 beers + web store",
  "goals.extras": "Extras: €25,000 a glass in every box · €75,000 recipe builder beta · €150,000 release party",
  "beers.kicker": "The first five · working titles",
  "beers.h2": "Five cans, five stories.",
  "beers.b1": "West Coast IPA · 6.2%",
  "beers.b2": "Hazy Pale Ale · 5.2%",
  "beers.b3": "Amber Ale · 5.6%",
  "beers.b4": "Session IPA · 4.0%",
  "beers.b5": "Black IPA · 6.8%",
  "beers.w1": "from €10,000",
  "beers.w2": "from €50,000",
  "beers.w3": "Vote at €100,000",
  "beers.d1": "Grapefruit, citrus, crisp bitterness.",
  "beers.d2": "Mango, passion fruit, smooth.",
  "beers.d3": "Caramel, bread crust, spicy hops.",
  "beers.d4": "Yuzu, lime, super fresh.",
  "beers.d5": "Roasty notes, pine, coffee.",
  "try.eyebrow": "Try it out · Preview",
  "try.h2": "What does your beer taste like?",
  "try.p": "Move the sliders, pick your aromas, and see what beer comes out. This is a simplified preview: we'll build the full Aroma Intelligence, with over 2,000 ingredients, with the money from the crowdfunding campaign.",
  "try.bitter": "Bitterness <output data-for=\"bitter\"></output><input type=\"range\" name=\"bitter\" min=\"0\" max=\"10\" value=\"5\">",
  "try.fruit": "Fruit <output data-for=\"fruit\"></output><input type=\"range\" name=\"fruit\" min=\"0\" max=\"10\" value=\"7\">",
  "try.malt": "Malt &amp; roast <output data-for=\"malt\"></output><input type=\"range\" name=\"malt\" min=\"0\" max=\"10\" value=\"3\">",
  "try.body": "Body <output data-for=\"body\"></output><input type=\"range\" name=\"body\" min=\"0\" max=\"10\" value=\"6\">",
  "try.sour": "Sourness <output data-for=\"sour\"></output><input type=\"range\" name=\"sour\" min=\"0\" max=\"10\" value=\"1\">",
  "try.strength": "Strength <output data-for=\"strength\"></output><input type=\"range\" name=\"strength\" min=\"0\" max=\"10\" value=\"5\">",
  "try.aromas": "Aromas",
  "try.a1": "Citrus",
  "try.a2": "Tropical",
  "try.a3": "Stone fruit",
  "try.a4": "Berry",
  "try.a5": "Pine &amp; resin",
  "try.a6": "Herbal",
  "try.a7": "Caramel",
  "try.a8": "Coffee &amp; chocolate",
  "try.abv": "ABV",
  "try.extras": "Extras",
  "try.note": "Demo output, not a brew-ready recipe.",
  "rw.eyebrow": "Rewards · Draft",
  "rw.h2": "Get your beer before it exists",
  "rw.1a": "Your name on the Wall of Hops",
  "rw.1b": "Updates from the brewhouse",
  "rw.2a": "All recipe cards, digital",
  "rw.2b": "Early access to the recipe builder",
  "rw.3price": "€25 <s>€35</s>",
  "rw.3a": "4 cans of Citra Comet",
  "rw.3b": "Recipe card",
  "rw.4a": "8 cans, a mix of all unlocked beers",
  "rw.4b": "Brew.ai glass",
  "rw.5badge": "Our pick",
  "rw.5a": "12-can mix, glass, T-shirt",
  "rw.5b": "12 months of Recipe Builder Pro",
  "rw.5c": "Your vote in the beer lineup poll",
  "rw.6a": "Your name on the label as “Founding Crew”",
  "rw.7a": "Brew day at the contract brewery, with tasting",
  "rw.8a": "Your recipe, built together with you",
  "rw.8b": "13 gallons (50 l) on the pilot system, about 110 cans with your own label",
  "rw.9a": "A beer for your company or club",
  "rw.9b": "Your own recipe and label, 240 cans",
  "rw.p0": "€5",
  "rw.p1": "€15",
  "rw.p2": "€59",
  "rw.p3": "€99",
  "rw.p4": "€179",
  "rw.p5": "€349",
  "rw.p6": "€990",
  "rw.p7": "€2,490",
  "rw.fine": "Draft; final prices will follow before launch. Beer rewards ship within Germany only, plus about €7–9 shipping. We only deliver beer to people 18 and over, with an age check on delivery.",
  "team.eyebrow": "Who we are",
  "team.h2": "Three craft beer fans on a mission",
  "team.p": "For years we've been drinking anything hoppy, sour, smoky, or just plain crazy. At some point we asked ourselves: what if everyone could create their perfect beer, without a brewing course or their own equipment? That's exactly what we're building: recipes that are sure to taste great, brewed by pros.",
  "team.f1": "Founder 1",
  "team.f1r": "Hop nerd &amp; product",
  "team.f2": "Founder 2",
  "team.f2r": "Recipes &amp; Aroma Intelligence",
  "team.f3": "Founder 3",
  "team.f3r": "Brewing &amp; community",
  "road.h2": "Where we're headed",
  "road.1": "Crowdfunding goes live, 30 days",
  "road.2b": "March–April",
  "road.2": "Brewing at the contract brewery, labels, canning",
  "road.3b": "May 2027",
  "road.3": "Boxes ship, release party",
  "road.4b": "June 2027",
  "road.4": "Web store with all beers, recipe builder opens to everyone",
  "road.5b": "After that",
  "road.5": "Your own recipes via partner contract breweries near you",
  "b2b.eyebrow": "For contract breweries",
  "b2b.h2": "Spare capacity? We bring recipes and customers.",
  "b2b.p": "Brew.ai sends finished, brew-ready recipes, along with the customers, straight to your brewhouse. You get predictable orders, standardized recipe data, and less idle time on your equipment.",
  "b2b.1": "Fill your idle slots",
  "b2b.2": "Recipes in your format, scaled to your system",
  "b2b.3": "No sales effort, we bring the orders",
  "b2b.cta": "Become a partner",
  "faq.h2": "Frequently asked questions",
  "faq.q1": "When does the campaign start?",
  "faq.a1": "On February 2, 2027, for 30 days. Sign up below and you'll be the first to know, so you can grab the early bird rewards.",
  "faq.q2": "Who brews the beer?",
  "faq.a2": "An experienced contract brewery with a professional brewhouse. We develop the recipes and the brand; the brewery makes sure the quality is consistent.",
  "faq.q3": "What happens if the goal isn't reached?",
  "faq.a3": "The campaign is all or nothing. If we don't reach the €10,000 funding goal, nobody is charged.",
  "faq.q4": "What about allergens?",
  "faq.a4": "Our beers contain barley, and some contain wheat or oats (all contain gluten). All required information is on the label and the recipe card.",
  "faq.q5": "Where do you ship?",
  "faq.a5": "At launch, within Germany only; we're looking into other countries. We only ship to people 18 and over, with an age check on delivery.",
  "faq.q6": "Can I have my own recipe brewed?",
  "faq.a6": "Yes, that's the whole idea. You can already do it during the campaign with the “Your Own Beer” reward. Later, we'll open the recipe builder in our web store to everyone.",
  "launch.h2": "Get your beer before it exists.",
  "launch.p": "Sign up and we'll let you know at launch. Early birds get 4 cans of Citra Comet for €25.",
  "launch.email": "Email address",
  "launch.btn": "Notify me",
  "foot.p": "Your taste. Your beer. Please drink responsibly. No sales to anyone under 18.",
  "foot.imprint": "Legal notice",
  "foot.privacy": "Privacy",
  "a.home": "Brew.ai home",
  "a.mainnav": "Main navigation",
  "a.chapters": "Chapters",
  "a.trio1": "Hop character giving a thumbs up",
  "a.trio2": "Malt character cheering",
  "a.trio3": "Yeast character jumping for joy",
  "a.idea1": "Malt character running away in fright",
  "a.idea2": "Hop character with arms crossed, totally relaxed",
  "a.taste": "Malt character thinking about what it likes",
  "a.recipe": "Hop, malt and yeast working out a beer recipe on a laptop",
  "a.tank": "Hop checks the stainless steel fermenter with a clipboard, malt holds a flashlight, yeast climbs a pipe",
  "a.glasschar": "Yeast character sitting on the rim of the glass",
  "a.glass": "Beer glass filling up to the campaign goals",
  "a.can1": "Label artwork Citra Comet",
  "a.can2": "Label artwork Mango Mood",
  "a.can3": "Label artwork Mighty Malt",
  "a.can4": "Label artwork Yummy Yuzu",
  "a.can5": "Label artwork Midnight Hop",
  "a.form": "Flavor sliders",
  "a.radar": "Flavor radar",
  "a.team": "Hop, malt and yeast toasting with beer and pretzels",
  "a.b2b": "Hop stirs the copper kettle while yeast tosses in ingredients",
  "a.lhop": "Hop character",
  "a.lhefe": "Yeast character pointing up",
  "a.count": "Countdown to campaign launch",
  "a.email": "you@email.com"
};

  // Texte, die per JavaScript entstehen
  const EN_JS = {
    title: "Brew.ai – Your taste. Your beer.",
    description: "Brew.ai: Three craft beer fans having beers brewed that match your taste exactly. Back our crowdfunding campaign and help brew the first five beers.",
    "count.live": "Live!", "count.now": "Back us now",
    "count.d": "Days", "count.h": "Hrs", "count.m": "Min", "count.s": "Sec",
    "signup.pending": "Thanks! Sign-up is being set up right now, please check back soon.",
    "signup.ok": "Cheers! We'll be in touch at launch.",
    "signup.err": "That didn't work. Please try again later.",
    "axis.bitter": "Bitter", "axis.fruit": "Fruit", "axis.malt": "Malt",
    "axis.body": "Body", "axis.sour": "Sour", "axis.strength": "Strength",
    "extra.zitrus": "Orange zest", "extra.beere": "Raspberry purée", "extra.steinobst": "Peach",
    "extra.kaffee": "Cold brew coffee", "extra.karamell": "Bourbon vanilla", "extra.lactose": "Lactose (milk sugar)",
    "extra.none": "none, just pure brewing ingredients",
    "yeast.sour": "Lactobacillus + Kveik", "yeast.hazy": "London Ale III (fruity, hazy)",
    "yeast.dark": "English ale, high attenuation", "yeast.lager": "Bottom-fermenting lager yeast",
    "yeast.default": "American ale (clean, clear)",
    "malt.pils": "Pilsner malt", "malt.pale": "Pale ale malt", "malt.oats": "Flaked oats", "malt.wheat": "Wheat malt",
    "malt.munich": "Munich malt", "malt.crystal": "Caramel malt", "malt.choc": "Chocolate malt", "malt.roast": "Roasted barley",
    "hop.bitter": "Magnum (bittering)",
    "raised": "Raised so far: ",
    words: ["Mango", "Citrus", "Pine", "Passion fruit", "Caramel", "Grapefruit", "Yuzu", "Coffee", "Peach"],
    ch: { Intro: "Intro", Idee: "Idea", Geschmack: "Taste", Rezept: "Recipe", Sudhaus: "Brewhouse", Ziele: "Goals", Sorten: "Beers" }
  };

  const KEY = "brew-lang";
  const store = { get() { try { return localStorage.getItem(KEY); } catch { return null; } },
                  set(v) { try { localStorage.setItem(KEY, v); } catch {} } };
  const param = new URLSearchParams(location.search).get("lang");
  let lang = param || store.get() || ((navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en");
  if (lang !== "en") lang = "de";
  if (param) store.set(lang);

  window.BREW_LANG = lang;
  window.BREW_LOCALE = lang === "en" ? "en-US" : "de-DE";
  // BREW_T(key, deutscherText): liefert auf Englisch EN_JS[key], sonst den deutschen Text
  window.BREW_T = (key, de) => (lang === "en" && key in EN_JS ? EN_JS[key] : de);

  if (lang === "en") {
    document.documentElement.lang = "en";
    document.title = EN_JS.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", EN_JS.description);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const t = EN[el.dataset.i18n];
      if (t != null) el.innerHTML = t;
    });
    ["alt", "aria-label", "placeholder"].forEach((attr) => {
      document.querySelectorAll(`[data-i18n-${attr}]`).forEach((el) => {
        const t = EN[el.getAttribute(`data-i18n-${attr}`)];
        if (t != null) el.setAttribute(attr, t);
      });
    });
    document.querySelectorAll("section[data-ch]").forEach((s) => { s.dataset.ch = EN_JS.ch[s.dataset.ch] || s.dataset.ch; });
  }

  // Umschalter im Kopf
  document.querySelectorAll(".lang a").forEach((a) => {
    const on = a.dataset.lang === lang;
    a.classList.toggle("on", on);
    if (on) a.setAttribute("aria-current", "true");
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (a.dataset.lang === lang) return;
      store.set(a.dataset.lang);
      try { sessionStorage.setItem("brew-scroll", String(scrollY)); } catch {}
      const u = new URL(location.href);
      u.searchParams.set("lang", a.dataset.lang);
      location.replace(u);
    });
  });
  try {
    const y = sessionStorage.getItem("brew-scroll");
    if (y !== null) { sessionStorage.removeItem("brew-scroll"); addEventListener("load", () => scrollTo(0, +y)); }
  } catch {}
})();
