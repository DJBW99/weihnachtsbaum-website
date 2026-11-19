/* Weihnachtsbaum-Verkauf – Interaktionen (Vanilla JS, keine Abhängigkeiten) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');
  var wenigBewegung = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Kopfzeile + Parallax ---------- */
  var kopf = document.getElementById('kopf');
  var hero = document.querySelector('.hero');
  var ebenenX = document.querySelectorAll('[data-parallax-x]');
  var ebenenY = document.querySelectorAll('[data-parallax-y]');
  var geplant = false;

  function beiScroll() {
    geplant = false;
    var y = window.scrollY;
    if (kopf) kopf.classList.toggle('ist-fest', y > 40);
    if (wenigBewegung || !hero || y > hero.offsetHeight) return;
    for (var i = 0; i < ebenenX.length; i++) {
      var fx = parseFloat(ebenenX[i].dataset.parallaxX);
      ebenenX[i].style.transform = 'translate3d(' + (y * fx).toFixed(1) + 'px,0,0)';
    }
    for (var j = 0; j < ebenenY.length; j++) {
      var fy = parseFloat(ebenenY[j].dataset.parallaxY);
      ebenenY[j].style.transform = 'translate3d(0,' + (y * fy).toFixed(1) + 'px,0)';
    }
  }
  window.addEventListener('scroll', function () {
    if (!geplant) { geplant = true; requestAnimationFrame(beiScroll); }
  }, { passive: true });
  beiScroll();

  /* ---------- Schneefall ---------- */
  var canvas = document.getElementById('schnee');
  if (canvas && hero && !wenigBewegung) {
    var ctx = canvas.getContext('2d');
    var flocken = [];
    var b = 0, h = 0, laeuft = false, sichtbar = true, letzte = 0;

    function groesse() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      b = hero.clientWidth; h = hero.clientHeight;
      canvas.width = b * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var anzahl = Math.round(Math.min(90, Math.max(35, b / 14)));
      while (flocken.length < anzahl) flocken.push(neueFlocke(true));
      flocken.length = anzahl;
    }
    function neueFlocke(ueberall) {
      var r = 0.8 + Math.random() * 2.2;
      return {
        x: Math.random() * b,
        y: ueberall ? Math.random() * h : -5,
        r: r,
        v: 12 + r * 14 + Math.random() * 10,   // Fallgeschwindigkeit px/s
        p: Math.random() * Math.PI * 2,         // Phase für das Pendeln
        a: 0.35 + Math.random() * 0.5
      };
    }
    function zeichne(t) {
      if (!laeuft) return;
      var dt = Math.min((t - letzte) / 1000, 0.05); letzte = t;
      ctx.clearRect(0, 0, b, h);
      ctx.fillStyle = '#fff';
      for (var i = 0; i < flocken.length; i++) {
        var f = flocken[i];
        f.y += f.v * dt;
        f.p += dt;
        f.x += Math.sin(f.p) * 12 * dt;
        if (f.y > h + 5) flocken[i] = f = neueFlocke(false);
        ctx.globalAlpha = f.a;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 6.2832);
        ctx.fill();
      }
      requestAnimationFrame(zeichne);
    }
    function schalte() {
      var soll = sichtbar && !document.hidden;
      if (soll && !laeuft) { laeuft = true; letzte = performance.now(); requestAnimationFrame(zeichne); }
      else if (!soll) laeuft = false;
    }

    groesse();
    window.addEventListener('resize', groesse);
    document.addEventListener('visibilitychange', schalte);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; schalte(); }).observe(hero);
    }
    schalte();
  }

  /* ---------- Einblenden + Liefer-Auto ---------- */
  var ziele = document.querySelectorAll('.einblenden, .lieferweg');
  if ('IntersectionObserver' in window) {
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('ist-sichtbar'); beobachter.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    ziele.forEach(function (z) { beobachter.observe(z); });
  } else {
    ziele.forEach(function (z) { z.classList.add('ist-sichtbar'); });
  }

  /* ---------- Auto: bei Klick/Tippen eine weitere Runde ---------- */
  var bahn = document.getElementById('lieferweg');
  var auto = bahn && bahn.querySelector('.lieferweg__auto');
  if (auto && auto.animate && !wenigBewegung) {
    var faehrt = false;
    auto.addEventListener('click', function () {
      if (faehrt || !bahn.classList.contains('ist-sichtbar')) return;
      // Parkposition aus dem aktuellen Transform lesen (rechts ausgerichtet, daher negativ)
      var parkX = new DOMMatrixReadOnly(getComputedStyle(auto).transform).m41;
      var raus = auto.offsetWidth + 20;          // rechts aus dem Bild
      var rein = -bahn.clientWidth;              // links vor dem Bild
      var park = 'translateX(' + parkX + 'px)';
      faehrt = true;
      var runde = auto.animate([
        { transform: park, easing: 'cubic-bezier(.5, 0, .9, .5)' },
        { transform: 'translateX(' + raus + 'px)', offset: 0.28 },
        { transform: 'translateX(' + rein + 'px)', offset: 0.28, easing: 'cubic-bezier(.16, .7, .25, 1)' },
        { transform: park }
      ], { duration: 3800 });
      var bild = auto.querySelector('img');
      if (bild) {
        bild.animate(
          [{ transform: 'none' }, { transform: 'translateY(-2px) rotate(-.6deg)' }, { transform: 'none' }],
          { duration: 400, iterations: 8, easing: 'ease-in-out' }
        );
      }
      runde.onfinish = runde.oncancel = function () { faehrt = false; };
    });
  }

  /* ---------- Karte erst nach Einwilligung laden ---------- */
  var mapKnopf = document.getElementById('map-laden');
  if (mapKnopf) {
    mapKnopf.addEventListener('click', function () {
      var rahmen = document.createElement('iframe');
      rahmen.title = 'Karte: Zum Schäferhof 10, Osnabrück-Dodesheide';
      rahmen.loading = 'lazy';
      rahmen.referrerPolicy = 'no-referrer';
      // Eingebettete Karte einschränken: kein Zugriff auf die umgebende Seite, keine Navigation des Hauptfensters
      rahmen.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      rahmen.src = 'https://www.google.com/maps?q=' +
        encodeURIComponent('Zum Schäferhof 10, 49088 Osnabrück') + '&z=15&output=embed';
      var feld = document.getElementById('map');
      while (feld.firstChild) feld.removeChild(feld.firstChild);
      feld.appendChild(rahmen);
    });
  }

  /* ---------- Jahr im Footer ---------- */
  var jahr = document.getElementById('jahr');
  if (jahr) jahr.textContent = new Date().getFullYear();
})();
