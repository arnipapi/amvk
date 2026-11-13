(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const P = window.PRODUCTS, rub = n => n.toLocaleString('ru-RU') + ' ₽';
const byId = id => P.find(p => p.id === id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let cart = []; try { cart = JSON.parse(localStorage.getItem('armvkus_cart') || '[]').filter(i => byId(i.id)); } catch {}
const save = () => { try { localStorage.setItem('armvkus_cart', JSON.stringify(cart)); } catch {} };
const count = () => cart.reduce((s, i) => s + i.qty, 0);
const total = () => cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200); }
function open(el) { el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); }
function closeAll() { $$('.modal.open,.drawer.open').forEach(e => { e.classList.remove('open'); e.setAttribute('aria-hidden', 'true'); }); document.body.classList.remove('lock'); }
document.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeAll(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

function card(p, i) {
  return `<article class="card" style="animation-delay:${i * 80}ms">
    <div class="ph" data-open="${p.id}"><img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy">${p.inStock ? '' : '<span class="stock-out">Нет в наличии</span>'}</div>
    <div class="info"><h3 data-open="${p.id}">${esc(p.name)}</h3><p>${esc(p.short)}</p>
    <div class="row"><span class="price">${rub(p.price)}</span><button class="mini" data-add="${p.id}" ${p.inStock ? '' : 'disabled'}>В корзину</button></div>
    <button class="link" data-open="${p.id}">Подробнее</button></div></article>`;
}
function renderCatalog(filter = 'all') {
  $('#catalogGrid').innerHTML = P.filter(p => filter === 'all' || p.id === filter).map(card).join('');
  $$('#tabs .tab').forEach(t => t.classList.toggle('on', t.dataset.f === filter));
}
$('#tabs').innerHTML = `<button class="tab on" data-f="all">Все</button>` + P.map(p => `<button class="tab" data-f="${p.id}">${esc(p.name)}</button>`).join('');
$('#tabs').addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) renderCatalog(t.dataset.f); });
$('#popularGrid').innerHTML = (window.SITE.popular || []).map(byId).filter(Boolean).map(card).join('');
renderCatalog();

function renderCart() {
  $('#cartCount').textContent = count();
  $('#cartTotal').textContent = rub(total());
  $('#checkoutBtn').disabled = !cart.length;
  $('#cartItems').innerHTML = cart.length ? cart.map(i => { const p = byId(i.id); return `<div class="ci"><img src="${p.images[0]}" alt=""><div><h4>${esc(p.name)}</h4><small>${rub(p.price)} × ${i.qty} = <b>${rub(p.price * i.qty)}</b></small>
    <div class="qty"><button data-dec="${p.id}" aria-label="Меньше">−</button><span>${i.qty}</span><button data-inc="${p.id}" aria-label="Больше">+</button></div></div><button class="rm" data-rm="${p.id}">Удалить</button></div>`; }).join('')
    : '<div class="empty"><p>Корзина пуста</p><p><small>Добавьте что-нибудь вкусное из каталога</small></p></div>';
  save();
}
function add(id, q = 1) {
  const p = byId(id); if (!p || !p.inStock) return;
  const it = cart.find(i => i.id === id); it ? it.qty = Math.min(99, it.qty + q) : cart.push({ id, qty: q });
  renderCart(); const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); toast(`«${p.name}» добавлено в корзину`);
}
function setQty(id, d) { const it = cart.find(i => i.id === id); if (!it) return; it.qty += d; if (it.qty < 1) cart = cart.filter(i => i !== it); if (it && it.qty > 99) it.qty = 99; renderCart(); }

function product(id) {
  const p = byId(id); let q = 1;
  $('#productBody').innerHTML = `<div class="pd"><div><img class="main" id="pmain" src="${p.images[0]}" alt="${esc(p.name)}"><div class="thumbs">${p.images.map((s, i) => `<img src="${s}" alt="" data-img="${s}" class="${i ? '' : 'on'}">`).join('')}</div></div>
  <div><h2>${esc(p.name)}</h2><span class="price">${rub(p.price)}</span><p>${esc(p.description)}</p>${p.weight ? `<p><b>Вес:</b> ${esc(p.weight)}</p>` : ''}<p>${p.inStock ? '✔ В наличии' : '✖ Нет в наличии'}</p>
  <div class="buy"><div class="qty"><button id="qm">−</button><span id="qv">1</span><button id="qp">+</button></div><button class="btn" id="qadd" ${p.inStock ? '' : 'disabled'}>В корзину</button></div></div></div>`;
  $('#qm').onclick = () => $('#qv').textContent = q = Math.max(1, q - 1);
  $('#qp').onclick = () => $('#qv').textContent = q = Math.min(99, q + 1);
  $('#qadd').onclick = () => { add(id, q); closeAll(); };
  $$('.thumbs img').forEach(t => t.onclick = () => { $('#pmain').src = t.dataset.img; $$('.thumbs img').forEach(x => x.classList.toggle('on', x === t)); });
  open($('#productModal'));
}

document.addEventListener('click', e => {
  const a = e.target.closest('[data-add]'), o = e.target.closest('[data-open]'), inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]'), rm = e.target.closest('[data-rm]');
  if (a) add(a.dataset.add); else if (o) product(o.dataset.open);
  else if (inc) setQty(inc.dataset.inc, 1); else if (dec) setQty(dec.dataset.dec, -1);
  else if (rm) { cart = cart.filter(i => i.id !== rm.dataset.rm); renderCart(); }
});
$('#cartBtn').onclick = () => open($('#drawer'));

function checkout() {
  closeAll();
  $('#checkoutBody').innerHTML = `<form class="form" id="orderForm" novalidate><h2>Оформление заказа</h2>
  <div class="sum">${cart.map(i => { const p = byId(i.id); return `<div><span>${esc(p.name)} × ${i.qty}</span><span>${rub(p.price * i.qty)}</span></div>`; }).join('')}<div class="t"><span>Общая сумма</span><span>${rub(total())}</span></div></div>
  <div class="f"><label>Имя *</label><input name="name" autocomplete="name"><small>Введите имя</small></div>
  <div class="f"><label>Телефон *</label><input name="phone" type="tel" autocomplete="tel" placeholder="+7 ___ ___ __ __"><small>Введите корректный номер</small></div>
  <div class="f"><label>Город *</label><input name="city" autocomplete="address-level2"><small>Введите город</small></div>
  <div class="f"><label>Комментарий к заказу</label><textarea name="comment" rows="3"></textarea></div>
  <label class="agree" id="agreeBox"><input type="checkbox" name="agree"><span>Я согласен(на) на обработку персональных данных в соответствии с <a href="privacy.html" target="_blank">Политикой конфиденциальности</a></span></label><div id="ferr"></div><button class="btn full" id="sendBtn" type="submit">Оформить заказ</button></form>`;
  const form = $('#orderForm');
  form.onsubmit = async e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(form)); let ok = true;
    const chk = (n, v) => { const f = form[n].closest('.f'); f.classList.toggle('err', !v); if (!v) ok = false; };
    chk('name', d.name.trim()); chk('phone', d.phone.replace(/\D/g, '').length >= 10); chk('city', d.city.trim());
    $('#agreeBox').classList.toggle('err', !d.agree); if (!d.agree) ok = false;
    if (!ok) return;
    const lines = cart.map((i, n) => { const p = byId(i.id); return `${n + 1}. ${p.name}\n    Количество: ${i.qty}\n    Цена: ${rub(p.price * i.qty)}`; }).join('\n');
    const text = `НОВЫЙ ЗАКАЗ — Арм - вкус\n\nИмя: ${d.name.trim()}\nТелефон: ${d.phone.trim()}\nГород: ${d.city.trim()}\n\nСОСТАВ ЗАКАЗА:\n\n${lines}\n\nОБЩАЯ СУММА: ${rub(total())}\n\nКомментарий: ${d.comment.trim() || '—'}`;
    const url = 'https://wa.me/' + window.SITE.whatsapp + '?text=' + encodeURIComponent(text);
    $('#checkoutBody').innerHTML = `<div class="done"><div class="ok">✓</div><h2>Почти готово!</h2><p>Откройте WhatsApp и нажмите «Отправить» — так заказ дойдёт до нас.</p><br><a class="btn" id="waGo" href="${url}" target="_blank" rel="noopener">Отправить заказ в WhatsApp</a></div>`;
    window.open(url, '_blank', 'noopener');
    $('#waGo').onclick = () => { cart = []; renderCart(); setTimeout(closeAll, 400); };
    setTimeout(() => { cart = []; renderCart(); }, 1500);
  };
  open($('#checkoutModal'));
}
$('#checkoutBtn').onclick = () => cart.length && checkout();

// навигация, меню, прокрутка
const burger = $('#burger'), nav = $('#nav');
burger.onclick = () => { burger.classList.toggle('open'); nav.classList.toggle('open'); };
$$('#nav a').forEach(a => a.onclick = () => { burger.classList.remove('open'); nav.classList.remove('open'); });
addEventListener('scroll', () => $('#header').classList.toggle('scrolled', scrollY > 10), { passive: true });
const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && (x.target.classList.add('in'), io.unobserve(x.target))), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));
$('#year').textContent = new Date().getFullYear();
renderCart();
// cookie-баннер
const CK = 'armvkus_cookie';
function cookieBanner(force) {
  let v = null; try { v = localStorage.getItem(CK); } catch {}
  if (v && !force) return;
  const el = document.createElement('div'); el.className = 'cookie'; el.setAttribute('role', 'dialog');
  el.innerHTML = '<p>Мы используем только необходимые технические данные (хранение корзины в вашем браузере) и шрифты Google Fonts. Аналитику и рекламные cookie мы не используем. Подробнее — в <a href="cookies.html">Политике cookie</a>.</p><div class="b"><button class="sec" data-v="necessary">Только необходимые</button><button data-v="accepted">Принять</button></div>';
  document.body.appendChild(el); requestAnimationFrame(() => el.classList.add('show'));
  el.onclick = e => { const b = e.target.closest('button'); if (!b) return; try { localStorage.setItem(CK, b.dataset.v); } catch {} el.classList.remove('show'); setTimeout(() => el.remove(), 500); };
}
cookieBanner();
$('#cookieSettings').onclick = e => { e.preventDefault(); if (!$('.cookie')) cookieBanner(true); };
})();
