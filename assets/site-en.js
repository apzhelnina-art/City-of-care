/* iFCM — общие скрипты: шапка с меню, подвал, контакты of content.json, отправка форм */
(function () {
  'use strict';
  var PAGES = [
    ['en.html', 'Home'],
    ['en-about.html', 'About'],
    ['en-services.html', 'Services'],
    ['en-suppliers.html', 'Suppliers'],
    ['en-career.html', 'Careers'],
    ['en-contacts.html', 'Contacts']
  ];
  var here = (location.pathname.split('/').pop() || 'en.html').toLowerCase();
  if (here === '') here = 'en.html';
  /* язык: пара страниц RU <-> EN */
  var LANG = 'RU', LANG_ALT = {'en.html':'index.html','en-about.html':'about.html','en-services.html':'services.html','en-suppliers.html':'suppliers.html','en-career.html':'career.html','en-contacts.html':'contacts.html'};
  var alt = LANG_ALT[here] || 'index.html';
  function cur(href) { return href === here ? ' aria-current="page"' : ''; }

  /* ---------- шапка ---------- */
  (function () { var st = document.createElement('style'); st.textContent = '.lang-pill{background:#fff;color:#211C59;border-radius:999px;padding:15px 18px;text-decoration:none;font-weight:700}.lang-pill:hover{background:#FFD3C4}@media (max-width:600px){.lang-pill{display:none}}'; document.head.appendChild(st); })();
  var head = document.getElementById('siteHeader');
  if (head) {
    var links = PAGES.slice(1, 5).map(function (p) { return '<a href="' + p[0] + '"' + cur(p[0]) + '>' + p[1] + '</a>'; }).join('');
    head.innerHTML =
      '<a class="logo-fix" href="en.html" aria-label="iFCM GROUP — home"><img src="assets/logo-white.png" alt="iFCM"></a>' +
      '<nav class="nav" aria-label="Site sections">' +
        '<div class="pill links lbl">' + links + '</div>' +
        '<a class="lang-pill lbl" href="' + alt + '" hreflang="' + LANG.toLowerCase() + '">' + LANG + '</a>' +
        '<a class="cta-pill lbl" href="en-contacts.html"' + cur('en-contacts.html') + '>Contact us</a>' +
        '<button class="burger lbl" type="button" aria-expanded="false" aria-controls="siteMenu"><i></i>Menu</button>' +
      '</nav>' +
      '<div class="menu" id="siteMenu" hidden>' +
        '<button class="close lbl" type="button">Close</button>' +
        PAGES.map(function (p) { return '<a href="' + p[0] + '"' + cur(p[0]) + '>' + p[1] + '</a>'; }).join('') +
        '<a href="' + alt + '" hreflang="' + LANG.toLowerCase() + '">' + LANG + '</a>' +
        '<div class="m-foot"><span data-c="phone">+7 (495) 246-01-10</span><br><span data-c="email">reception.ru@ifcmgroup.ru</span></div>' +
      '</div>';
    var menu = document.getElementById('siteMenu'), burger = head.querySelector('.burger');
    function setMenu(open) { menu.hidden = !open; burger.setAttribute('aria-expanded', String(open)); document.documentElement.style.overflow = open ? 'hidden' : ''; if (open) menu.querySelector('.close').focus(); else burger.focus(); }
    /* логотип: на главной — плавно в начало страницы, на других — переход на главную */
    head.querySelector('.logo-fix').addEventListener('click', function (e) {
      var page = (location.pathname.split('/').pop() || 'en.html');
      if (page === 'en.html') {
        e.preventDefault();
        try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {}
        window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    });
    burger.addEventListener('click', function () { setMenu(true); });
    menu.querySelector('.close').addEventListener('click', function () { setMenu(false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  }

  /* ---------- подвал ---------- */
  var foot = document.getElementById('siteFooter');
  if (foot) {
    foot.innerHTML =
      '<footer class="foot w"><div class="wrap">' +
        '<div class="top">' +
          '<div class="brand"><img src="assets/logo-white.png" alt="iFCM"><span class="s" style="color:var(--red-soft);font-size:19px;line-height:1.35">caring for you every day since 1993</span></div>' +
          '<div class="cols">' +
            '<div class="col"><b>Company</b>' + PAGES.slice(1).map(function (p) { return '<a href="' + p[0] + '">' + p[1] + '</a>'; }).join('') + '</div>' +
            '<div class="col"><b>Documents</b>' +
              '<a href="https://drive.google.com/file/d/1yCam7RIS36lduGr7LoDhpSAOm9wahNjR/view" target="_blank" rel="noopener">Code of business conduct</a>' +
              '<a href="https://www.ifcmgroup.ru/policy2" target="_blank" rel="noopener">Cookie policy</a>' +
              '<a href="https://disk.360.yandex.ru/i/gnEF3XklKYBSMg" target="_blank" rel="noopener">Personal data processing</a>' +
              '<a href="https://www.ifcmgroup.ru/law_documents" target="_blank" rel="noopener">Legal documents</a>' +
            '</div>' +
            '<div class="col"><b>Head office</b><span class="sel" data-c="phone">+7 (495) 246-01-10</span><span class="sel" data-c="email">reception.ru@ifcmgroup.ru</span><span data-c="address">18 3rd Rybinskaya St., bldg. 22, Moscow 107113</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="bottom"><span>© 1993–' + new Date().getFullYear() + ' iFCM GROUP LLC</span><a href="' + alt + '" style="color:#C9C7E0">Русская версия</a></div>' +
      '</div></footer>';
  }

  /* ---------- контакты of content.json (правятся в админке) ---------- */
  fetch('content-en.json?v=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (c) {
      var ct = c && c.contacts; if (!ct) return;
      document.querySelectorAll('[data-c]').forEach(function (el) { var v = ct[el.getAttribute('data-c')]; if (v) el.textContent = v; });
    }).catch(function () {});

  /* ---------- формы с data-lead отправляются на бэкенд ---------- */
  document.querySelectorAll('form[data-lead]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = f.querySelector('.msg'), btn = f.querySelector('button[type=submit]');
      var val = function (n) { var el = f.elements[n]; return el ? el.value : ''; };
      var digits = val('phone').replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 12) { msg.textContent = 'Check the phone: 10–11 digits needed.'; f.elements.phone.focus(); return; }
      if (f.elements.consent && !f.elements.consent.checked) { msg.textContent = 'Please tick the consent to personal data processing.'; return; }
      btn.disabled = true; msg.textContent = 'Sending…';
      var base = window.IFCM_BACKEND_URL || '';
      fetch(base + '/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: val('name'), phone: val('phone'), company: val('company'), topic: val('topic') || f.getAttribute('data-lead'), message: val('message'), services: [], website: val('website'), page: location.href })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || 'error'); }); })
        .then(function () { msg.textContent = 'Thank you! Your request has been sent, we’ll contact you.'; f.reset(); })
        .catch(function () { var ph = document.querySelector('[data-c=phone]'); msg.textContent = 'Couldn’t send. Please call us: ' + (ph ? ph.textContent : '+7 (495) 246-01-10'); })
        .then(function () { btn.disabled = false; });
    });
  });

  /* выбор темы формы по ссылке вида en-contacts.html?topic=career */
  var tp = new URLSearchParams(location.search).get('topic');
  var sel = document.querySelector('form[data-lead] select[name=topic]');
  if (tp && sel) { Array.prototype.forEach.call(sel.options, function (o) { if (o.getAttribute('data-key') === tp) sel.value = o.value; }); }
})();
