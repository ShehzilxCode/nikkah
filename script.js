/* =====================================================
   EDIT YOUR DETAILS HERE
   ===================================================== */
const INVITE = {
  bride: "Syeda Ansharah Shoaib",
  groom: "Hamza Shakeel",
  dateISO: "2026-11-12T16:00:00",          // used for the countdown
  dateText: "Thursday, 12th November 2026",
  timeText: "4:00 PM onwards",
  venue: "Events Lawn",
  address: "Plot # J-75, P.E.C.H.S Block 6, Near Ambala Bakery, Karachi.",
  mapLink: "https://maps.app.goo.gl/ykJur5nAvdqNfJ3B8?g_st=aw",
  brideFamily: "Daughter of late Hafiz Syed Muhammad Shoaib",
  groomFamily: "Son of Abdul Shakeel",
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
// Map embed — build iframe src from venue+address, link goes to original mapLink
(function(){
  const wrap = document.getElementById("map-wrap");
  const frame = document.getElementById("map-frame");
  if (!wrap || !frame) return;
  const q = encodeURIComponent(INVITE.venue + " " + INVITE.address);
  frame.src = "https://maps.google.com/maps?q=" + q + "&output=embed&z=16";
  wrap.href = INVITE.mapLink;
})();
$("f-bride").innerHTML = INVITE.brideFamily.replace(/\n/g, "<br>");
$("f-groom").innerHTML = INVITE.groomFamily.replace(/\n/g, "<br>");
$("profile-bride").textContent = INVITE.bride;
$("profile-groom").textContent = INVITE.groom;
$("profile-bride-family").innerHTML = INVITE.brideFamily.replace(/\n/g, "<br>");
$("profile-groom-family").innerHTML = INVITE.groomFamily.replace(/\n/g, "<br>");
$("revealed-date").textContent = INVITE.dateText;
$("rsvp-note").textContent = INVITE.rsvpNote;
$("foot-names").textContent = `${INVITE.bride} & ${INVITE.groom}`;
$("intro-b").textContent = initial(INVITE.bride);
$("intro-g").textContent = initial(INVITE.groom);

/* ---------- date reveal ---------- */
const revealDateButton = $("reveal-date-btn");
revealDateButton.addEventListener("click", () => {
  const panel = $("date-reveal");
  if (panel.classList.contains("date-is-revealed")) return;
  panel.classList.add("date-is-revealed");
  revealDateButton.setAttribute("aria-expanded", "true");
  revealDateButton.querySelector("b").textContent = "Date Revealed";
  burst(innerWidth / 2, innerHeight * .58, 34);
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
  }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 2550);
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
for (let i = 0; i < 16; i++) parts.push(petal(Math.random() * innerWidth, Math.random() * innerHeight, false));
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
    ctx.globalAlpha = p.burst ? Math.min(1, p.life / 40) : .68;
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
