/* =====================================================
   EDIT YOUR DETAILS HERE
   ===================================================== */
const INVITE = {
  bride: "Bride Name",
  groom: "Groom Name",
  dateISO: "2026-12-12T16:00:00",          // used for the countdown
  dateText: "Saturday, 12th December 2026",
  timeText: "4:00 PM onwards",
  venue: "Venue Name",
  address: "Street address, City",
  mapLink: "https://maps.google.com",
  brideFamily: "Mr. & Mrs. Bride's Parents\nBride's family names",
  groomFamily: "Mr. & Mrs. Groom's Parents\nGroom's family names",
  rsvpNote: "Kindly confirm your attendance before 1st December",
  rsvpWhatsApp: "923000000000"             // country code + number, no + or spaces
};

/* ---------- fill text ---------- */
const $ = id => document.getElementById(id);
const initial = value => (value.trim()[0] || "?").toUpperCase();
$("n-bride").textContent = INVITE.bride;
$("n-groom").textContent = INVITE.groom;
$("date-line").textContent = INVITE.dateText;
$("d-date").textContent = INVITE.dateText;
$("d-time").textContent = INVITE.timeText;
$("d-venue").textContent = INVITE.venue;
$("d-address").textContent = INVITE.address;
$("map-btn").href = INVITE.mapLink;
$("f-bride").innerHTML = INVITE.brideFamily.replace(/\n/g, "<br>");
$("f-groom").innerHTML = INVITE.groomFamily.replace(/\n/g, "<br>");
$("rsvp-note").textContent = INVITE.rsvpNote;
$("foot-names").textContent = `${INVITE.bride} & ${INVITE.groom}`;
$("intro-b").textContent = initial(INVITE.bride);
$("intro-g").textContent = initial(INVITE.groom);
$("rsvp-btn").href = `https://wa.me/${INVITE.rsvpWhatsApp}?text=${encodeURIComponent("Assalamu Alaikum! I will be attending the Nikkah. ")}`;

/* ---------- SVG flowers ---------- */
function flowerSVG(size) {
  const petals = 12;
  let s = `<svg width="${size}" height="${size}" viewBox="-60 -60 120 120">`;
  for (let ring = 0; ring < 3; ring++) {
    const len = 52 - ring * 15, w = 14 - ring * 3, rot = ring * 15;
    const fill = ["#f9c3d3", "#f3a1bb", "#e87b9f"][ring];
    for (let i = 0; i < petals; i++) {
      const a = (360 / petals) * i + rot;
      s += `<path d="M0 0 C ${-w} ${-len * .35}, ${-w} ${-len * .85}, 0 ${-len} C ${w} ${-len * .85}, ${w} ${-len * .35}, 0 0z"
        fill="${fill}" fill-opacity=".92" stroke="#fff" stroke-opacity=".6" stroke-width=".6" transform="rotate(${a})"/>`;
    }
  }
  s += `<circle r="7" fill="#c9a36a"/><circle r="3.5" fill="#fff3c9"/></svg>`;
  return s;
}
document.querySelectorAll("[data-flower]").forEach(el => {
  el.innerHTML = flowerSVG(+el.dataset.flower);
});

/* ---------- envelope open ---------- */
const env = $("envelope");
function openInvite() {
  if (env.classList.contains("open")) return;
  env.classList.add("open");
  burst(window.innerWidth / 2, window.innerHeight / 2, 70);
  setTimeout(() => {
    $("intro").classList.add("gone");
    $("card").classList.remove("hidden");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    initReveal();
  }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 1600);
}
env.addEventListener("click", openInvite);

/* ---------- scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  items.forEach((el, i) => el.style.setProperty("--d", (i % 5) * 0.12 + "s"));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.18 });
  items.forEach(el => io.observe(el));
}

/* ---------- countdown ---------- */
const target = new Date(INVITE.dateISO).getTime();
const cd = { d: $("c-d"), h: $("c-h"), m: $("c-m"), s: $("c-s") };
function tick() {
  let diff = Math.max(0, target - Date.now());
  const vals = {
    d: Math.floor(diff / 864e5),
    h: Math.floor(diff % 864e5 / 36e5),
    m: Math.floor(diff % 36e5 / 6e4),
    s: Math.floor(diff % 6e4 / 1e3)
  };
  for (const k in vals) {
    const t = String(vals[k]).padStart(2, "0");
    if (cd[k].textContent !== t) {
      cd[k].textContent = t;
      cd[k].classList.remove("tick"); void cd[k].offsetWidth; cd[k].classList.add("tick");
    }
  }
}
tick(); setInterval(tick, 1000);

/* ---------- falling petals + burst ---------- */
const cv = $("petals"), ctx = cv.getContext("2d");
let W, H, parts = [];
function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
resize(); addEventListener("resize", resize);
const COLORS = ["#f9c3d3", "#f3a1bb", "#fde2ea", "#ffffff", "#e98aa9"];
function petal(x, y, burstMode) {
  return {
    x, y, r: 6 + Math.random() * 8,
    vx: burstMode ? (Math.random() - .5) * 12 : (Math.random() - .5) * .8,
    vy: burstMode ? -Math.random() * 9 - 2 : .6 + Math.random() * 1.2,
    rot: Math.random() * 6.28, vr: (Math.random() - .5) * .08,
    sway: Math.random() * 6.28, c: COLORS[(Math.random() * COLORS.length) | 0],
    life: burstMode ? 140 : Infinity, burst: burstMode
  };
}
function burst(x, y, n) { for (let i = 0; i < n; i++) parts.push(petal(x, y, true)); }
for (let i = 0; i < 26; i++) parts.push(petal(Math.random() * innerWidth, Math.random() * innerHeight, false));
function draw() {
  ctx.clearRect(0, 0, W, H);
  parts.forEach(p => {
    p.sway += .02;
    p.x += p.vx + Math.sin(p.sway) * .6;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.burst) { p.vy += .22; p.vx *= .985; p.life--; }
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.globalAlpha = p.burst ? Math.min(1, p.life / 40) : .85;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.moveTo(0, -p.r);
    ctx.bezierCurveTo(p.r, -p.r * .6, p.r * .7, p.r * .8, 0, p.r);
    ctx.bezierCurveTo(-p.r * .7, p.r * .8, -p.r, -p.r * .6, 0, -p.r);
    ctx.fill();
    ctx.restore();
    if (!p.burst && p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
  });
  parts = parts.filter(p => p.life > 0);
  requestAnimationFrame(draw);
}
draw();
