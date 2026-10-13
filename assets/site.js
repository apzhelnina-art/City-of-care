/* iFCM — общие скрипты: шапка с меню, подвал, контакты из content.json, отправка форм */
(function () {
  'use strict';
  var PAGES = [
    ['index.html', 'Главная'],
    ['about.html', 'О нас'],
    ['services.html', 'Услуги'],
    ['suppliers.html', 'Поставщикам'],
    ['career.html', 'Карьера'],
    ['contacts.html', 'Контакты']
  ];
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (here === '') here = 'index.html';
  /* язык: пара страниц RU <-> EN */
  var LANG = 'EN', LANG_ALT = {'index.html':'en.html','about.html':'en-about.html','services.html':'en-services.html','suppliers.html':'en-suppliers.html','career.html':'en-career.html','contacts.html':'en-contacts.html'};
  var alt = LANG_ALT[here] || 'en.html';
  function cur(href) { return href === here ? ' aria-current="page"' : ''; }

  /* ---------- шапка ---------- */
  (function () { var st = document.createElement('style'); st.textContent = '.lang-pill{background:#fff;color:#211C59;border-radius:999px;padding:15px 18px;text-decoration:none;font-weight:700}.lang-pill:hover{background:#FFD3C4}@media (max-width:600px){.lang-pill{display:none}}'; document.head.appendChild(st); })();
  var head = document.getElementById('siteHeader');
  if (head) {
    var links = PAGES.slice(1, 5).map(function (p) { return '<a href="' + p[0] + '"' + cur(p[0]) + '>' + p[1] + '</a>'; }).join('');
    head.innerHTML =
      '<a class="logo-fix" href="index.html" aria-label="iFCM GROUP — на главную"><img src="assets/logo-white.png" alt="iFCM"></a>' +
      '<nav class="nav" aria-label="Разделы сайта">' +
        '<div class="pill links lbl">' + links + '</div>' +
        '<a class="lang-pill lbl" href="' + alt + '" hreflang="' + LANG.toLowerCase() + '">' + LANG + '</a>' +
        '<a class="cta-pill lbl" href="contacts.html"' + cur('contacts.html') + '>Связаться</a>' +
        '<button class="burger lbl" type="button" aria-expanded="false" aria-controls="siteMenu"><i></i>Меню</button>' +
      '</nav>' +
      '<div class="menu" id="siteMenu" hidden>' +
        '<button class="close lbl" type="button">Закрыть</button>' +
        PAGES.map(function (p) { return '<a href="' + p[0] + '"' + cur(p[0]) + '>' + p[1] + '</a>'; }).join('') +
        '<a href="' + alt + '" hreflang="' + LANG.toLowerCase() + '">' + LANG + '</a>' +
        '<div class="m-foot"><span data-c="phone">+7 (495) 246-01-10</span><br><span data-c="email">reception.ru@ifcmgroup.ru</span></div>' +
      '</div>';
    var menu = document.getElementById('siteMenu'), burger = head.querySelector('.burger');
    function setMenu(open) { menu.hidden = !open; burger.setAttribute('aria-expanded', String(open)); document.documentElement.style.overflow = open ? 'hidden' : ''; if (open) menu.querySelector('.close').focus(); else burger.focus(); }
    /* логотип: на главной — плавно в начало страницы, на других — переход на главную */
    head.querySelector('.logo-fix').addEventListener('click', function (e) {
      var page = (location.pathname.split('/').pop() || 'index.html');
      if (page === 'index.html') {
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
          '<div class="brand"><img src="assets/logo-white.png" alt="iFCM"><span class="s" style="color:var(--red-soft);font-size:19px;line-height:1.35">с 1993 года каждый день заботимся о вас</span></div>' +
          '<div class="cols">' +
            '<div class="col"><b>Компания</b>' + PAGES.slice(1).map(function (p) { return '<a href="' + p[0] + '">' + p[1] + '</a>'; }).join('') + '</div>' +
            '<div class="col"><b>Документы</b>' +
              '<a href="https://drive.google.com/file/d/1yCam7RIS36lduGr7LoDhpSAOm9wahNjR/view" target="_blank" rel="noopener">Кодекс ведения бизнеса</a>' +
              '<a href="https://www.ifcmgroup.ru/policy2" target="_blank" rel="noopener">Политика cookies</a>' +
              '<a href="https://disk.360.yandex.ru/i/gnEF3XklKYBSMg" target="_blank" rel="noopener">Обработка персональных данных</a>' +
              '<a href="https://www.ifcmgroup.ru/law_documents" target="_blank" rel="noopener">Правовые документы</a>' +
            '</div>' +
            '<div class="col"><b>Центральный офис</b><span class="sel" data-c="phone">+7 (495) 246-01-10</span><span class="sel" data-c="email">reception.ru@ifcmgroup.ru</span><span data-c="address">107113, Москва, ул. 3-я Рыбинская, д. 18, стр. 22</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="bottom"><span>© 1993–' + new Date().getFullYear() + ' ООО «АЙЭФСИЭМ ГРУПП»</span><a href="' + alt + '" style="color:#C9C7E0">English version</a></div>' +
      '</div></footer>';
  }

  /* ---------- контакты из content.json (правятся в админке) ---------- */
  fetch('content.json?v=' + Date.now(), { cache: 'no-store' })
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
      if (digits.length < 10 || digits.length > 12) { msg.textContent = 'Проверьте телефон: нужно 10–11 цифр.'; f.elements.phone.focus(); return; }
      if (f.elements.consent && !f.elements.consent.checked) { msg.textContent = 'Отметьте согласие на обработку персональных данных.'; return; }
      btn.disabled = true; msg.textContent = 'Отправляем…';
      var base = window.IFCM_BACKEND_URL || '';
      fetch(base + '/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: val('name'), phone: val('phone'), company: val('company'), topic: val('topic') || f.getAttribute('data-lead'), message: val('message'), services: [], website: val('website'), page: location.href })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || 'ошибка'); }); })
        .then(function () { msg.textContent = 'Спасибо! Заявка отправлена, мы свяжемся с вами.'; f.reset(); })
        .catch(function () { var ph = document.querySelector('[data-c=phone]'); msg.textContent = 'Не получилось отправить. Позвоните нам: ' + (ph ? ph.textContent : '+7 (495) 246-01-10'); })
        .then(function () { btn.disabled = false; });
    });
  });

  /* выбор темы формы по ссылке вида contacts.html?topic=career */
  var tp = new URLSearchParams(location.search).get('topic');
  var sel = document.querySelector('form[data-lead] select[name=topic]');
  if (tp && sel) { Array.prototype.forEach.call(sel.options, function (o) { if (o.getAttribute('data-key') === tp) sel.value = o.value; }); }
})();
