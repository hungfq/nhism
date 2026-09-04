/* =============================================================
 *  main.js — toàn bộ logic của trang. Không cần build, không thư viện.
 *  Nội dung nằm ở js/config.js.
 * ============================================================= */
(function () {
  'use strict';

  /* ---------- Config + giá trị mặc định (phòng khi thiếu key) ---------- */
  var DEFAULTS = {
    herName: 'Em',
    myName: 'Anh',
    startDate: '2024-01-01T00:00:00+07:00',
    taglines: ['Một món quà nhỏ dành cho iem ❤️'],
    timeline: [],
    photos: [],
    reasons: [],
    letter: { title: 'Gửi em,', paragraphs: [] },
    footerNote: '',
    music: null
  };

  var raw = window.GIFT_CONFIG || {};
  var CFG = {};
  Object.keys(DEFAULTS).forEach(function (k) {
    CFG[k] = (raw[k] === undefined || raw[k] === null) ? DEFAULTS[k] : raw[k];
  });
  if (!CFG.letter || typeof CFG.letter !== 'object') CFG.letter = DEFAULTS.letter;
  if (!Array.isArray(CFG.letter.paragraphs)) CFG.letter.paragraphs = [];

  /* ---------- Helpers ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  /** '2023-02-14' -> Date theo giờ địa phương (tránh lệch múi giờ khi format). */
  function parseYMD(s) {
    if (typeof s !== 'string') return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
    if (!m) {
      var d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  var VI_MONTHS = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
                   'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

  function formatVi(date) {
    if (!date) return '';
    return date.getDate() + ' ' + VI_MONTHS[date.getMonth()] + ', ' + date.getFullYear();
  }

  var startDate = (function () {
    var d = new Date(CFG.startDate);
    return isNaN(d.getTime()) ? null : d;
  })();

  /* ---------- 1. Đổ tên vào các chỗ có data-bind ---------- */
  function bindText() {
    var map = {
      herName: CFG.herName,
      myName: CFG.myName,
      footerNote: CFG.footerNote,
      startPretty: startDate ? 'Từ ngày ' + formatVi(startDate) : ''
    };
    $$('[data-bind]').forEach(function (node) {
      var key = node.getAttribute('data-bind');
      if (map[key] !== undefined) node.textContent = map[key];
    });
    document.title = 'Gửi ' + CFG.herName + ' ❤️';
  }

  /* ---------- 2. Hiệu ứng gõ chữ ---------- */
  function initTyping() {
    var out = $('#typed');
    var caret = $('.caret');
    var sr = $('#typedSr');
    var lines = Array.isArray(CFG.taglines) ? CFG.taglines.filter(Boolean) : [];
    if (!out) return;

    // trình đọc màn hình đọc bản tĩnh, khỏi phải nghe từng ký tự một
    if (sr) sr.textContent = lines.join(' ');

    if (!lines.length || reduceMotion || lines.length === 1) {
      out.textContent = lines.length ? lines[0] : '';
      if (caret) caret.style.display = 'none';
      return;
    }

    var li = 0, ci = 0, deleting = false;
    (function step() {
      var line = lines[li];
      ci += deleting ? -1 : 1;
      out.textContent = line.slice(0, ci);

      var delay = deleting ? 35 : 70;
      if (!deleting && ci === line.length) { deleting = true; delay = 1800; }
      else if (deleting && ci === 0) { deleting = false; li = (li + 1) % lines.length; delay = 350; }

      window.setTimeout(step, delay);
    })();
  }

  /* ---------- 3. Bộ đếm thời gian ---------- */
  function initCounter() {
    var grid = $('#counterGrid');
    if (!grid || !startDate) return;

    var cells = {};
    $$('[data-unit]', grid).forEach(function (n) { cells[n.getAttribute('data-unit')] = n; });

    var lastDay = new Date().getDate();

    function tick() {
      // mở trang qua đêm thì tính lại ngày kỷ niệm cho đúng
      var today = new Date().getDate();
      if (today !== lastDay) { lastDay = today; renderNextAnniversary(); }

      var diff = Date.now() - startDate.getTime();
      if (diff < 0) diff = 0;                       // ngày bắt đầu ở tương lai

      var s = Math.floor(diff / 1000);
      var days = Math.floor(s / 86400);
      var hours = Math.floor((s % 86400) / 3600);
      var minutes = Math.floor((s % 3600) / 60);
      var seconds = s % 60;

      if (cells.days) cells.days.textContent = days.toLocaleString('vi-VN');
      if (cells.hours) cells.hours.textContent = pad2(hours);
      if (cells.minutes) cells.minutes.textContent = pad2(minutes);
      if (cells.seconds) cells.seconds.textContent = pad2(seconds);

      grid.setAttribute('aria-label', 'Đã bên nhau ' + days + ' ngày ' + hours + ' giờ ' + minutes + ' phút');
    }

    tick();
    window.setInterval(tick, 1000);
    renderNextAnniversary();
  }

  function renderNextAnniversary() {
    var out = $('#nextAnniversary');
    if (!out || !startDate) return;

    var now = new Date();
    if (now.getTime() < startDate.getTime()) { out.textContent = ''; return; }

    // Hôm nay có đúng ngày kỷ niệm không?
    if (now.getMonth() === startDate.getMonth() && now.getDate() === startDate.getDate()) {
      var y = now.getFullYear() - startDate.getFullYear();
      out.textContent = y > 0
        ? '🎉 Hôm nay là kỷ niệm ' + y + ' năm của mình đó em!'
        : '🎉 Hôm nay là ngày đặc biệt của mình!';
      return;
    }

    var next = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());
    if (next.getTime() <= now.getTime()) {
      next = new Date(now.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
    }
    var years = next.getFullYear() - startDate.getFullYear();
    var left = Math.ceil((next.getTime() - now.getTime()) / 86400000);

    out.textContent = 'Còn ' + left + ' ngày nữa tới kỷ niệm ' + years + ' năm (' + formatVi(next) + ').';
  }

  /* ---------- 4. Timeline ---------- */
  function removeSection(id) {
    var s = document.getElementById(id);
    if (s) s.remove();
    var link = $('.nav__list a[href="#' + id + '"]');
    if (link && link.parentNode) link.parentNode.remove();
  }

  function initTimeline() {
    var list = $('#timelineList');
    if (!list) return;
    var items = Array.isArray(CFG.timeline) ? CFG.timeline : [];
    if (!items.length) { removeSection('timeline'); return; }

    var frag = document.createDocumentFragment();
    items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'timeline__item reveal';

      var time = document.createElement('time');
      var d = parseYMD(item.date);
      time.className = 'timeline__date';
      if (d) {
        time.dateTime = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
        time.textContent = formatVi(d);
      } else {
        time.textContent = item.date || '';
      }

      var h3 = document.createElement('h3');
      h3.className = 'timeline__title';
      h3.textContent = item.title || '';

      var p = document.createElement('p');
      p.className = 'timeline__text';
      p.textContent = item.text || '';

      li.appendChild(time);
      li.appendChild(h3);
      li.appendChild(p);
      frag.appendChild(li);
    });
    list.appendChild(frag);
  }

  /* ---------- 5. Gallery + Lightbox ---------- */
  // dải màu tím nhạt → hồng nhạt, khớp tone của trang
  var PLACEHOLDER_HUES = [272, 300, 330, 285, 345, 315];

  function placeholderSrc(i) {
    var h = PLACEHOLDER_HUES[i % PLACEHOLDER_HUES.length];
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="hsl(' + h + ',72%,86%)"/>' +
      '<stop offset="1" stop-color="hsl(' + ((h + 30) % 360) + ',65%,74%)"/>' +
      '</linearGradient></defs>' +
      '<rect width="600" height="600" fill="url(#g)"/>' +
      '<text x="300" y="330" font-size="140" text-anchor="middle">💗</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  var photos = [];

  function initGallery() {
    var grid = $('#galleryGrid');
    if (!grid) return;

    photos = (Array.isArray(CFG.photos) ? CFG.photos : []).map(function (p, i) {
      return {
        src: (p && p.src) ? p.src : placeholderSrc(i),
        caption: (p && p.caption) ? p.caption : ''
      };
    });
    if (!photos.length) { removeSection('gallery'); return; }

    var frag = document.createDocumentFragment();
    photos.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery__item reveal';
      btn.setAttribute('aria-label', 'Xem ảnh: ' + (p.caption || 'ảnh ' + (i + 1)));

      var img = document.createElement('img');
      img.src = p.src;
      img.alt = '';                                  // nút đã có aria-label, tránh đọc trùng
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', function onErr() {
        img.removeEventListener('error', onErr);      // tránh lặp vô hạn
        p.src = placeholderSrc(i);
        img.src = p.src;
      });

      var cap = document.createElement('span');
      cap.className = 'gallery__caption';
      cap.textContent = p.caption;

      btn.appendChild(img);
      if (p.caption) btn.appendChild(cap);
      btn.addEventListener('click', function () { openLightbox(i, btn); });
      frag.appendChild(btn);
    });
    grid.appendChild(frag);
  }

  var lbIndex = 0;

  function showPhoto(i) {
    if (!photos.length) return;
    lbIndex = (i + photos.length) % photos.length;
    var p = photos[lbIndex];
    var img = $('#lbImg');
    var cap = $('#lbCaption');
    img.src = p.src;
    img.alt = p.caption || 'Ảnh kỷ niệm ' + (lbIndex + 1);
    cap.textContent = p.caption;
    cap.hidden = !p.caption;
  }

  function openLightbox(i, trigger) {
    showPhoto(i);
    openModal($('#lightbox'), trigger);
  }

  /* ---------- 6. Lý do (rút thẻ) ---------- */
  function initReasons() {
    var btn = $('#reasonBtn');
    var text = $('#reasonText');
    var meta = $('#reasonMeta');
    var list = Array.isArray(CFG.reasons) ? CFG.reasons.filter(Boolean) : [];
    if (!btn || !text) return;

    if (!list.length) { removeSection('reasons'); return; }

    var pool = [];
    var drawn = 0;

    btn.addEventListener('click', function () {
      if (!pool.length) pool = shuffle(list.slice());
      var pick = pool.pop();

      text.classList.remove('is-in');
      void text.offsetWidth;                         // ép trình duyệt chạy lại animation
      text.textContent = pick;
      text.classList.add('is-in');

      drawn++;
      if (meta) {
        meta.textContent = pool.length
          ? 'Lý do thứ ' + drawn + ' · còn ' + pool.length + ' lý do chưa rút'
          : 'Lý do thứ ' + drawn + ' · hết bộ rồi, bấm tiếp là xáo lại nhé';
      }
      burstHearts(10, btn);
      setButtonLabel(btn, 'Rút lý do khác', '🎴');
    });
  }

  /** Đặt lại nhãn nút nhưng giữ emoji ở dạng aria-hidden. */
  function setButtonLabel(btn, label, emoji) {
    btn.textContent = label + ' ';
    var span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.textContent = emoji;
    btn.appendChild(span);
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- 7. Hộp quà + lá thư ---------- */
  function initGift() {
    var btn = $('#giftBtn');
    var titleEl = $('#letterTitle');
    var body = $('#letterBody');
    if (!btn || !body) return;

    if (titleEl) titleEl.textContent = CFG.letter.title || 'Gửi em,';
    CFG.letter.paragraphs.forEach(function (para) {
      var p = document.createElement('p');
      p.textContent = para;
      body.appendChild(p);
    });

    btn.addEventListener('click', function () {
      btn.classList.add('is-open');
      burstHearts(40, btn);
      window.setTimeout(function () { openModal($('#letter'), btn); }, reduceMotion ? 0 : 450);
    });
  }

  /* ---------- 8. Modal chung ---------- */
  var activeModal = null;
  var lastFocus = null;
  var closeTimer = null;

  function focusables(root) {
    return $$('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return !el.hasAttribute('hidden') && el.offsetParent !== null; });
  }

  function openModal(modal, trigger) {
    if (!modal || activeModal) return;
    // huỷ lượt đóng đang chờ, tránh việc mở lại nhanh bị ẩn ngay sau đó
    if (closeTimer) { window.clearTimeout(closeTimer); closeTimer = null; }

    activeModal = modal;
    lastFocus = trigger || document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add('has-modal');
    // đợi 1 frame để phần tử được render rồi mới focus
    window.requestAnimationFrame(function () {
      modal.classList.add('is-open');
      var f = focusables(modal);
      if (f.length) f[0].focus();
    });
  }

  function closeModal() {
    if (!activeModal) return;
    var modal = activeModal;
    activeModal = null;

    if (modal.id === 'letter') {                     // đóng nắp lại để lần sau mở còn vui
      var gift = $('#giftBtn');
      if (gift) gift.classList.remove('is-open');
    }
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('has-modal');

    var toFocus = lastFocus;
    lastFocus = null;

    var done = function () {
      closeTimer = null;
      if (activeModal === modal) return;              // đã được mở lại trong lúc chờ
      modal.hidden = true;
      if (toFocus && document.contains(toFocus)) toFocus.focus();
    };

    if (reduceMotion) done();
    else closeTimer = window.setTimeout(done, 200);
  }

  function initModals() {
    $$('.modal').forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target.hasAttribute('data-close')) closeModal();
      });
    });

    var lbImg = $('#lbImg');
    if (lbImg) {
      lbImg.addEventListener('error', function () {   // ảnh hỏng thì thay bằng khung màu
        if (!photos.length) return;
        var ph = placeholderSrc(lbIndex);
        if (photos[lbIndex].src === ph) return;       // đã là placeholder, không lặp
        photos[lbIndex].src = ph;
        lbImg.src = ph;
      });
    }

    var prev = $('#lbPrev');
    var next = $('#lbNext');
    if (prev) prev.addEventListener('click', function () { showPhoto(lbIndex - 1); });
    if (next) next.addEventListener('click', function () { showPhoto(lbIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!activeModal) return;

      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }

      if (activeModal.id === 'lightbox') {
        if (e.key === 'ArrowLeft') { showPhoto(lbIndex - 1); return; }
        if (e.key === 'ArrowRight') { showPhoto(lbIndex + 1); return; }
      }

      if (e.key === 'Tab') {                       // giữ focus trong modal
        var f = focusables(activeModal);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- 9. Tim rơi (canvas) ---------- */
  var fx = (function () {
    var canvas = $('#fx');
    var noop = { burst: function () {} };
    if (!canvas || !canvas.getContext) return noop;
    var ctx = null;
    try { ctx = canvas.getContext('2d'); } catch (e) { ctx = null; }
    if (!ctx) return noop;                             // trình duyệt không hỗ trợ canvas
    var parts = [];
    var running = false;
    var GLYPHS = ['💜', '💗', '💖', '💕', '🌸'];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    });

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.vy += 0.12;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 1;
        if (p.life <= 0 || p.y > window.innerHeight + 60) { parts.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 45));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = p.size + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      }
      if (parts.length) window.requestAnimationFrame(frame);
      else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }

    return {
      burst: function (n, originEl) {
        if (reduceMotion) return;
        var x = window.innerWidth / 2;
        var y = window.innerHeight / 2;
        if (originEl && originEl.getBoundingClientRect) {
          var r = originEl.getBoundingClientRect();
          x = r.left + r.width / 2;
          y = r.top + r.height / 2;
        }
        var cap = 160;
        var count = Math.min(n, cap - parts.length);
        for (var i = 0; i < count; i++) {
          parts.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 7,
            vy: -Math.random() * 8 - 2,
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.2,
            size: 16 + Math.random() * 18,
            life: 70 + Math.random() * 50,
            glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          });
        }
        if (!running && parts.length) { running = true; window.requestAnimationFrame(frame); }
      }
    };
  })();

  function burstHearts(n, el) { fx.burst(n, el); }

  /* ---------- 10. Hiện dần khi cuộn ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 11. Nhạc nền (chỉ hiện khi config.music có giá trị) ---------- */
  function initMusic() {
    if (!CFG.music) return;

    var audio = new Audio(CFG.music);
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'none';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-btn';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = '<span aria-hidden="true">🎵</span>';
    btn.setAttribute('aria-label', 'Bật nhạc nền');
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function () {
          btn.classList.add('is-playing');
          btn.setAttribute('aria-pressed', 'true');
          btn.setAttribute('aria-label', 'Tắt nhạc nền');
        }).catch(function () {
          btn.setAttribute('aria-label', 'Không phát được nhạc');
        });
      } else {
        audio.pause();
        btn.classList.remove('is-playing');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Bật nhạc nền');
      }
    });
  }

  /* ---------- Khởi động ---------- */
  function init() {
    bindText();
    initTyping();
    initCounter();
    initTimeline();
    initGallery();
    initReasons();
    initGift();
    initModals();
    initMusic();
    initReveal();          // gọi cuối: các phần tử .reveal đã được render xong
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
