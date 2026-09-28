/* ==========================================================
   Victoria Vale – fictional professional network profile
   Vanilla JS. No backend, no storage, no network requests.
   All asset paths are relative so they work from a GitHub
   Pages project subdirectory.
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Centralised image references ---------- */
  var IMAGES = {
    PROFILE_IMAGE:    './images/profile.jpg',
    COVER_IMAGE:      './images/cover.jpg',
    FEATURED_IMAGE_1: './images/featured-1.jpg',
    FEATURED_IMAGE_2: './images/featured-2.jpg',
    FEATURED_IMAGE_3: './images/featured-3.jpg',
    POST_IMAGE_1:     './images/post-1.jpg',
    POST_IMAGE_2:     './images/post-2.jpg',
    POST_IMAGE_3:     './images/post-3.jpg',
    COMPANY_LOGO:     './images/vale-logo.png'
  };

  document.querySelectorAll('[data-img]').forEach(function (el) {
    var src = IMAGES[el.getAttribute('data-img')];
    if (src) el.setAttribute('src', src);
  });

  /* ---------- Funnel CTA ----------
     Set CTA_URL to the next step of the funnel. When it is set, the
     Message button (and the nav Messaging link) send visitors there.
     When it is empty, they open the demo message modal instead. */
  var CTA_URL = 'https://www.lego.com/en-us';
  var CTA_NEW_TAB = false;

  function goCTA() {
    if (!CTA_URL) return false;
    if (CTA_NEW_TAB) window.open(CTA_URL, '_blank', 'noopener');
    else window.location.href = CTA_URL;
    return true;
  }

  /* ---------- Helpers ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var fmt = function (n) { return Number(n).toLocaleString('en-US'); };
  var parseNum = function (t) { return parseInt(String(t).replace(/[^0-9]/g, ''), 10) || 0; };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- Toast ---------- */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- Modal ---------- */
  var modal = $('#modal');
  var modalDialog = $('.modal__dialog', modal);
  var modalTitle = $('#modalTitle');
  var modalBody = $('#modalBody');
  var modalFoot = $('#modalFoot');
  var lastFocus = null;

  function openModal(opts) {
    lastFocus = document.activeElement;
    modalTitle.textContent = opts.title || '';
    modalBody.innerHTML = opts.body || '';
    modalDialog.classList.toggle('is-wide', !!opts.wide);
    if (opts.foot) {
      modalFoot.innerHTML = opts.foot;
      modalFoot.hidden = false;
    } else {
      modalFoot.innerHTML = '';
      modalFoot.hidden = true;
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalDialog.focus();
    if (opts.onOpen) opts.onOpen();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeModal();
  });

  /* Simple focus trap */
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])', modalDialog)
      .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- Modal content ---------- */
  function openContact() {
    openModal({
      title: 'Victoria Vale',
      body:
        '<h3 style="font-size:16px;margin-bottom:14px">Contact info</h3>' +
        '<dl class="info">' +
        '<dt>Website</dt><dd><a href="https://victoriavale.carrd.co" target="_blank" rel="noopener">victoriavale.carrd.co</a></dd>' +
        '<dt>Industry</dt><dd>Industrial / Manufacturing</dd>' +
        '</dl>'
    });
  }

  function openMessage(prefill) {
    openModal({
      title: 'New message',
      body:
        '<div class="modal__person">' +
        '<img class="avatar avatar--md" src="' + IMAGES.PROFILE_IMAGE + '" alt="">' +
        '<div><strong>Victoria Vale</strong><span>CEO | Vale Industrial Group</span></div></div>' +
        '<label for="msgText" class="meta" style="display:block;margin-bottom:6px">Message</label>' +
        '<textarea id="msgText" placeholder="Write a message&hellip;"></textarea>' +
        '<p class="modal__note">This is a fictional demo. Nothing you type here is sent or stored anywhere.</p>',
      foot:
        '<button class="btn btn--outline" type="button" data-close>Cancel</button>' +
        '<button class="btn btn--primary" type="button" id="msgSend" disabled>Send</button>',
      onOpen: function () {
        var ta = $('#msgText'), send = $('#msgSend');
        if (prefill) ta.value = prefill;
        send.disabled = !ta.value.trim();
        ta.addEventListener('input', function () { send.disabled = !ta.value.trim(); });
        send.addEventListener('click', function () {
          closeModal();
          toast('Message sent to Victoria Vale (fictional \u2013 nothing was delivered).');
        });
        ta.focus();
      }
    });
  }

  function openAbout() {
    openModal({
      title: 'About this profile',
      body:
        '<p class="modal__lead">Victoria Vale is a fictional AI-generated character.</p>' +
        '<p>This profile is part of a fictional digital project. The people, company, school, figures and posts shown here are invented. It is a static page with no accounts, messaging or tracking.</p>' +
        '<p>The interface imitates the conventions of a professional networking site, but it is not affiliated with any real network.</p>'
    });
  }

  var FEATURES = [
    {
      title: 'The Vale Standard',
      img: IMAGES.FEATURED_IMAGE_1,
      lead: 'Operational discipline matters more than growth for growth\'s sake.',
      body: [
        'Every business in the portfolio is measured against the same short list: cash conversion, on-time delivery, safety record, customer retention. Growth that improves those numbers is welcome. Growth that only improves the deck is not.',
        'The standard isn\'t complicated. It\'s applied every week, including the weeks when nobody is watching.'
      ]
    },
    {
      title: 'Industrial Ownership',
      img: IMAGES.FEATURED_IMAGE_2,
      lead: 'Long-term ownership changes the way you think about capital.',
      body: [
        'If you plan to sell in three years, you optimize for the buyer. If you plan to hold for thirty, you optimize for the plant, the people, and the balance sheet \u2013 in that order more often than you\'d expect.',
        'Patience isn\'t passivity. It\'s a decision you make again at every capital allocation meeting.'
      ]
    },
    {
      title: 'The Acquisition Pipeline',
      img: IMAGES.FEATURED_IMAGE_3,
      lead: 'Three deals survived initial diligence. One didn\'t.',
      body: [
        'The pipeline review is the least glamorous meeting of the month, which is why it\'s useful. Each target gets the same three questions: What do we understand that other buyers don\'t? What has to stay true for the cash flow to hold? What would make us walk away?',
        'The deal that didn\'t survive failed on the second question. It was a good company. It was not a good price for a company with that customer concentration.'
      ]
    }
  ];

  function openFeature(i) {
    var f = FEATURES[i];
    if (!f) return;
    openModal({
      title: f.title,
      wide: true,
      body:
        '<div class="modal__hero"><img src="' + f.img + '" alt=""></div>' +
        '<p class="modal__lead">\u201C' + esc(f.lead) + '\u201D</p>' +
        f.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
        '<p class="modal__note">Fictional content from a fictional profile.</p>'
    });
  }

  function openLightbox(key) {
    openModal({
      title: 'Media',
      wide: true,
      body: '<div class="modal__lightbox"><img src="' + IMAGES[key] + '" alt=""></div>'
    });
  }

  /* ---------- Dropdowns ---------- */
  function closeDropdowns(except) {
    $$('.dropdown').forEach(function (d) {
      if (d === except) return;
      var m = $('.dropdown__menu', d), t = $('[data-dropdown-toggle]', d);
      if (m) m.hidden = true;
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-dropdown-toggle]');
    if (toggle) {
      var dd = toggle.closest('.dropdown');
      var menu = $('.dropdown__menu', dd);
      var willOpen = menu.hidden;
      closeDropdowns(dd);
      menu.hidden = !willOpen;
      toggle.setAttribute('aria-expanded', String(willOpen));
      return;
    }
    if (!e.target.closest('.dropdown__menu')) closeDropdowns();
    if (!e.target.closest('#search')) hideSearchResults();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!modal.hidden) closeModal();
      closeDropdowns();
      hideSearchResults();
      closeMobileSearch();
    }
  });

  /* ---------- Delegated actions ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    var post = el.closest('.post');

    switch (action) {
      case 'toast':
        e.preventDefault();
        toast(el.getAttribute('data-msg') || 'Not available in this demo.');
        closeDropdowns();
        break;
      case 'message':
        closeDropdowns();
        openMessage('Sharing this profile: Victoria Vale, CEO | Vale Industrial Group.');
        break;
      case 'about-project':
        closeDropdowns();
        openAbout();
        break;
      case 'copy-link':
        closeDropdowns();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(window.location.href.split('#')[0]).then(
            function () { toast('Profile link copied.'); },
            function () { toast('Couldn\u2019t copy the link. Copy it from the address bar.'); }
          );
        } else {
          toast('Copy the link from the address bar.');
        }
        break;
      case 'like':
        toggleLike(el, post);
        break;
      case 'toggle-comments':
        toggleComments(post);
        break;
      case 'repost':
        toggleRepost(el, post);
        break;
      case 'send':
        toast('Sharing by message isn\u2019t available in this demo.');
        break;
      case 'post-comment':
        submitComment(post);
        break;
    }
  });

  /* ---------- Posts ---------- */
  function toggleLike(btn, post) {
    var on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('span').textContent = on ? 'Liked' : 'Like';
    var out = $('.count-likes', post);
    var base = parseInt(post.getAttribute('data-likes'), 10);
    out.textContent = fmt(base + (on ? 1 : 0));
  }

  function toggleRepost(btn, post) {
    var on = !btn.classList.contains('is-on');
    btn.classList.toggle('is-on', on);
    var out = $('.count-reposts', post);
    var base = parseInt(post.getAttribute('data-reposts'), 10);
    out.textContent = fmt(base + (on ? 1 : 0));
    toast(on ? 'Reposted (fictional).' : 'Repost removed.');
  }

  function toggleComments(post) {
    var box = $('.comments', post);
    box.hidden = !box.hidden;
    if (!box.hidden) $('input', box).focus();
  }

  function submitComment(post) {
    var box = $('.comments', post);
    var input = $('input', box);
    var text = input.value.trim();
    if (!text) return;
    var li = document.createElement('li');
    li.className = 'comment';
    li.innerHTML =
      '<span class="avi avi--c5" aria-hidden="true">You</span>' +
      '<div class="comment__bubble"><strong>You</strong><span>Just now</span><p>' + esc(text) + '</p></div>';
    $('.comment-list', box).insertBefore(li, $('.comment-list', box).firstChild);
    input.value = '';
    var btn = $('[data-action="post-comment"]', box);
    btn.disabled = true;
    var out = $('.count-comments', post);
    out.textContent = fmt(parseNum(out.textContent) + 1);
  }

  /* Enable Post button only when there is text; Enter submits */
  document.addEventListener('input', function (e) {
    if (!e.target.matches('.comment-form input')) return;
    var btn = $('[data-action="post-comment"]', e.target.closest('.comment-form'));
    btn.disabled = !e.target.value.trim();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches('.comment-form input')) {
      e.preventDefault();
      submitComment(e.target.closest('.post'));
    }
  });

  /* ---------- Connect / Follow ---------- */
  var connectBtn = $('#connectBtn');
  connectBtn.addEventListener('click', function () {
    var pending = connectBtn.getAttribute('aria-pressed') !== 'true';
    connectBtn.setAttribute('aria-pressed', String(pending));
    connectBtn.classList.toggle('is-pending', pending);
    connectBtn.innerHTML = pending
      ? '<svg class="icon icon--sm"><use href="#i-clock"/></svg><span>Pending</span>'
      : '<svg class="icon icon--sm"><use href="#i-plus"/></svg><span>Connect</span>';
    toast(pending ? 'Invitation sent to Victoria Vale (fictional).' : 'Invitation withdrawn.');
  });

  var followBtn = $('#followBtn');
  followBtn.addEventListener('click', function () {
    var on = followBtn.getAttribute('aria-pressed') !== 'true';
    followBtn.setAttribute('aria-pressed', String(on));
    followBtn.classList.toggle('is-pending', on);
    followBtn.innerHTML = on
      ? '<svg class="icon icon--xs"><use href="#i-check"/></svg><span>Following</span>'
      : '<svg class="icon icon--xs"><use href="#i-plus"/></svg><span>Follow</span>';
  });

  $$('[data-connect]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = !btn.classList.contains('is-pending');
      btn.classList.toggle('is-pending', on);
      btn.textContent = on ? 'Pending' : 'Connect';
    });
  });

  $('#messageBtn').addEventListener('click', function () { if (!goCTA()) openMessage(); });
  $('#contactBtn').addEventListener('click', openContact);

  /* ---------- Clamped text (About, roles, posts) ---------- */
  function refreshClamps() {
    $$('[data-clamp]').forEach(function (el) {
      var btn = document.querySelector('[data-clamp-toggle="' + el.id + '"]');
      if (!btn) return;
      if (el.classList.contains('is-open')) return;
      btn.hidden = !(el.scrollHeight > el.clientHeight + 1);
    });
  }
  $$('[data-clamp-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-clamp-toggle'));
      el.classList.add('is-open');
    });
  });
  window.addEventListener('load', refreshClamps);
  window.addEventListener('resize', refreshClamps);
  refreshClamps();

  /* ---------- Experience expansion ---------- */
  var expToggle = $('#expToggle');
  expToggle.addEventListener('click', function () {
    var exp = $('#experience .exp');
    var open = expToggle.getAttribute('aria-expanded') !== 'true';
    expToggle.setAttribute('aria-expanded', String(open));
    exp.classList.toggle('is-detailed', open);
    $$('.role__desc', exp).forEach(function (d) { d.classList.toggle('is-open', open); });
    expToggle.textContent = open ? 'Show fewer details' : 'Show role details';
    if (!open) refreshClamps();
  });

  /* ---------- Skills expansion ---------- */
  var skillsToggle = $('#skillsToggle');
  skillsToggle.addEventListener('click', function () {
    var open = skillsToggle.getAttribute('aria-expanded') !== 'true';
    skillsToggle.setAttribute('aria-expanded', String(open));
    $$('.skill--extra').forEach(function (s) { s.hidden = !open; });
    skillsToggle.textContent = open ? 'Show fewer skills' : 'Show all 6 skills';
  });

  /* ---------- Featured ---------- */
  $$('.feat').forEach(function (card) {
    var open = function () { openFeature(parseInt(card.getAttribute('data-feature'), 10)); };
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  /* ---------- Media lightbox ---------- */
  $$('[data-lightbox]').forEach(function (b) {
    b.addEventListener('click', function () { openLightbox(b.getAttribute('data-lightbox')); });
  });

  /* ---------- Activity tabs ---------- */
  var tabs = $$('.tab');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    refreshClamps();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------- Nav links ---------- */
  $$('[data-nav]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var k = a.getAttribute('data-nav');
      if (k === 'home' || k === 'profile') {
        e.preventDefault();
        window.scrollTo({ top: 0 });
        return;
      }
      e.preventDefault();
      if (k === 'messaging') { if (!goCTA()) openMessage(); return; }
      var labels = { network: 'My Network', jobs: 'Jobs', notifications: 'Notifications' };
      toast((labels[k] || 'That page') + ' isn\u2019t part of this fictional profile.');
    });
  });

  /* ---------- Search ---------- */
  var searchWrap = $('#search');
  var searchInput = $('#searchInput');
  var searchResults = $('#searchResults');
  var searchToggle = $('#searchToggle');
  var searchClose = $('#searchClose');

  var SEARCH_INDEX = [
    { name: 'Victoria Vale', sub: 'CEO | Vale Industrial Group', type: 'person', target: 'top' },
    { name: 'Vale Industrial Group', sub: 'Company \u00B7 Industrial / Manufacturing', type: 'company', target: 'experience' },
    { name: 'Vale School of Business', sub: 'School', type: 'company', target: 'education' },
    { name: 'James Mercer', sub: 'Managing Director | Industrial Investments', type: 'person' },
    { name: 'Sarah Chen', sub: 'Principal | Private Capital', type: 'person' },
    { name: 'Michael Rowan', sub: 'COO | Manufacturing', type: 'person' },
    { name: 'Daniel Kessler', sub: 'CFO | Precision Components', type: 'person' },
    { name: 'Eleanor Hartwell', sub: 'Chair | Hartwell Infrastructure Partners', type: 'person' },
    { name: 'Raymond Okafor', sub: 'CEO | Northline Fabrication', type: 'person' },
    { name: 'Anna Lindqvist', sub: 'Partner | Long-Horizon Capital', type: 'person' },
    { name: 'Mergers & acquisitions', sub: 'Topic', type: 'topic' },
    { name: 'Capital allocation', sub: 'Topic', type: 'topic' },
    { name: 'Industrial manufacturing', sub: 'Topic', type: 'topic' }
  ];

  var activeIdx = -1;

  function renderResults(q) {
    q = q.trim().toLowerCase();
    if (!q) { hideSearchResults(); return; }
    var hits = SEARCH_INDEX.filter(function (i) {
      return i.name.toLowerCase().indexOf(q) !== -1 || i.sub.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 6);
    activeIdx = -1;
    if (!hits.length) {
      searchResults.innerHTML = '<li class="empty">No results for \u201C' + esc(q) + '\u201D</li>';
    } else {
      searchResults.innerHTML = hits.map(function (h, i) {
        return '<li role="option" data-i="' + SEARCH_INDEX.indexOf(h) + '">' +
          '<svg class="icon"><use href="#i-search"/></svg>' +
          '<span>' + esc(h.name) + '<small>' + esc(h.sub) + '</small></span></li>';
      }).join('');
    }
    searchResults.hidden = false;
  }

  function hideSearchResults() {
    if (searchResults) searchResults.hidden = true;
    activeIdx = -1;
  }

  function chooseResult(li) {
    if (!li || li.classList.contains('empty')) return;
    var item = SEARCH_INDEX[parseInt(li.getAttribute('data-i'), 10)];
    hideSearchResults();
    searchInput.value = '';
    closeMobileSearch();
    if (item && item.target) {
      var t = document.getElementById(item.target);
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast('Other profiles aren\u2019t part of this fictional demo.');
    }
  }

  searchInput.addEventListener('input', function () { renderResults(searchInput.value); });
  searchInput.addEventListener('focus', function () { if (searchInput.value) renderResults(searchInput.value); });
  searchInput.addEventListener('keydown', function (e) {
    var items = $$('li:not(.empty)', searchResults);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!items.length || searchResults.hidden) return;
      e.preventDefault();
      activeIdx = e.key === 'ArrowDown' ? (activeIdx + 1) % items.length : (activeIdx - 1 + items.length) % items.length;
      items.forEach(function (li, i) { li.setAttribute('aria-selected', String(i === activeIdx)); });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[activeIdx >= 0 ? activeIdx : 0]) chooseResult(items[activeIdx >= 0 ? activeIdx : 0]);
    }
  });
  searchResults.addEventListener('click', function (e) { chooseResult(e.target.closest('li')); });

  /* Mobile search: icon opens a full-width bar */
  function closeMobileSearch() {
    searchWrap.classList.remove('is-open');
    hideSearchResults();
  }
  searchToggle.addEventListener('click', function () {
    searchWrap.classList.add('is-open');
    searchInput.focus();
  });
  searchClose.addEventListener('click', function () {
    searchInput.value = '';
    closeMobileSearch();
  });
})();
