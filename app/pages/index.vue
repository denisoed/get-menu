<template>
  <LayoutAppHeader />
  <HomeContent 
    :menu="MENU" 
    :format-price="fmt"
    :add-to-cart="addToCart"
  />
  <LayoutAppFooter />
</template>

<script setup>
  const { data, error } = await useFetch('/api/menu')
  console.log('DATA', data);
  console.log('ERROR', error);
  
  let MENU = data.value || []
  const SETTINGS = {
    cafeName: 'Кафе «Вкусно и Точка»',
    address: 'г. Бишкек, пр. Чуй, 123',
    phone: '+996 555 123 456',
    whatsapp: '+996555123456', // digits only also ok
    currency: 'KGS',
    deliveryFee: 150,
    minOrder: 0,
    openHours: 'Ежедневно 10:00–22:00',
    announcement: 'Скидка 10% на самовывоз по промокоду PICKUP10',
    banner: {
      title: 'Горячие обеды · Быстро и вкусно',
      subtitle: 'Доставка за 30–45 минут по городу',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop'
    }
  }

  const $ = (sel, root=document) => root.querySelector(sel);
  const $all = (sel, root=document) => [...root.querySelectorAll(sel)];

  const state = {
    items: MENU,
    filter: 'Все',
    search: '',
    cart: [] // { id, qty, size?, extras?:[], price }
  }

  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ' + SETTINGS.currency;

  function init() {
    // Header setup
    $('#cafeName').textContent = SETTINGS.cafeName;
    $('#announcement').textContent = SETTINGS.announcement;
    $('#openHours').textContent = SETTINGS.openHours;
    $('#address').textContent = SETTINGS.address;
    $('#fCafe').textContent = SETTINGS.cafeName;
    $('#fAddr').textContent = SETTINGS.address;
    $('#fCall').textContent = SETTINGS.phone; $('#fCall').href = `tel:${SETTINGS.phone}`;
    $('#callLink').href = `tel:${SETTINGS.phone}`;
    $('#bannerImage').src = SETTINGS.banner.image;
    $('#bannerTitle').textContent = SETTINGS.banner.title;
    $('#bannerSub').textContent = SETTINGS.banner.subtitle;
    $('#waQuick').href = whatsappLink('Здравствуйте! Хочу сделать заказ.');

    // Categories
    const cats = ['Все', ...new Set(state.items.map(i=>i.category))];
    const catWrap = $('#categories');
    catWrap.innerHTML = '';
    cats.forEach(c => {
      const b = document.createElement('button');
      b.className = 'px-3 py-1.5 rounded-full text-sm border border-slate-200 hover:bg-slate-50 whitespace-nowrap';
      b.textContent = c; b.dataset.cat = c;
      b.onclick = () => { state.filter = c; renderItems(); highlightCats(); };
      catWrap.appendChild(b);
    });
    highlightCats();

    // Search
    $('#search').addEventListener('input', (e)=>{ state.search = e.target.value.trim().toLowerCase(); renderItems(); })

    // Buttons
    $('#cartBtn').onclick = () => toggleQuick(true);
    $('#checkoutBtn').onclick = () => toggleQuick(true);
    $('#themeToggle').onclick = toggleDark;
    $('#darkToggleBottom').onclick = toggleDark;

    // Form interactions
    $('#orderForm').type.onchange = (e)=>{
      $('#addressField').style.display = e.target.value === 'delivery' ? 'block' : 'none';
    }
    $('#orderForm').onsubmit = (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const text = buildOrderText(data);
      alert('Заказ принят!\n\n' + text);
      window.open(whatsappLink(text), '_blank');
    }

    // renderItems();
    renderCart();
    applyThemeFromStorage();
  }

  function highlightCats(){
    $all('#categories button').forEach(b=>{
      b.classList.toggle('bg-brand-600', b.dataset.cat===state.filter);
      b.classList.toggle('text-white', b.dataset.cat===state.filter);
      b.classList.toggle('border-brand-600', b.dataset.cat===state.filter);
    })
  }

  function renderItems(){
    const wrap = $('#items');
    const q = state.search;
    const cat = state.filter;
    const list = state.items.filter(i => (
      (cat==='Все' || i.category===cat) && (!q || i.name.toLowerCase().includes(q))
    ));
    wrap.innerHTML = '';
    if (!list.length) {
      wrap.innerHTML = `<div class="col-span-full text-slate-500">Ничего не найдено</div>`;
      return;
    }
    list.forEach(item => wrap.appendChild(card(item)));
  }

  function card(item){
    const el = document.createElement('div');
    el.className = 'bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft flex flex-col';
    el.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="h-44 w-full object-cover">
      <div class="p-4 flex-1 flex flex-col">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h4 class="font-semibold text-lg">${item.name}</h4>
            <div class="text-sm text-slate-500">${item.category}</div>
          </div>
          <div class="text-right">
            <div class="font-bold text-brand-700">${fmt(item.price)}</div>
            ${item.tags? `<div class='mt-1 flex flex-wrap gap-1'>${item.tags.map(t=>`<span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100">${t}</span>`).join('')}</div>`:''}
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <button class="px-3 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50" onclick='addToCart("${item.id}")'>В корзину</button>
        </div>
      </div>`
    return el;
  }


  function addToCart(id, opts={}){
    const item = state.items.find(i=>i.id===id);
    const key = JSON.stringify({id, ...opts});
    let row = state.cart.find(r=>r.key===key);
    const addPrice = calcAddPrice(item, opts);
    if(row){ row.qty++; }
    else { row = { key, id, name:item.name, base:item.price, add:addPrice, qty:1, opts }; state.cart.push(row); }
    renderCart();
  }

  function calcAddPrice(item, {sizeIdx=null, extrasIdx=[]}={}){
    let add = 0;
    if(item.options?.sizes && sizeIdx!=null){ add += item.options.sizes[sizeIdx].add||0; }
    if(item.options?.extras && extrasIdx?.length){ extrasIdx.forEach(i=> add += item.options.extras[i].add||0 ); }
    return add;
  }

  function removeFromCart(key){
    const i = state.cart.findIndex(r=>r.key===key);
    if(i>-1){ state.cart.splice(i,1); renderCart(); }
  }

  function changeQty(key, d){
    const row = state.cart.find(r=>r.key===key);
    if(!row) return;
    row.qty += d; if(row.qty<=0) removeFromCart(key); else renderCart();
  }

  function cartTotals(){
    const sub = state.cart.reduce((s,r)=> s + (r.base + r.add)*r.qty, 0);
    const delivery = state.cart.length? SETTINGS.deliveryFee : 0;
    const total = sub + delivery;
    return { sub, delivery, total };
  }

  function renderCart(){
    $('#cartCount').textContent = state.cart.reduce((s,r)=>s+r.qty,0);
    const list = $('#cartList');
    if(list){
      list.innerHTML = '';
      if(!state.cart.length){ list.innerHTML = `<div class='text-slate-500 text-sm'>Корзина пуста</div>`; }
      state.cart.forEach(r=>{
        const item = state.items.find(i=>i.id===r.id);
        const opts = [];
        if(item.options?.sizes && r.opts.sizeIdx!=null) opts.push(item.options.sizes[r.opts.sizeIdx].label);
        if(item.options?.extras && r.opts.extrasIdx?.length) opts.push(...r.opts.extrasIdx.map(i=>item.options.extras[i].label));
        const el = document.createElement('div');
        el.className='flex items-start justify-between gap-2';
        el.innerHTML = `
          <div>
            <div class='font-medium'>${r.name}</div>
            ${opts.length? `<div class='text-[12px] text-slate-500'>${opts.join(', ')}</div>`:''}
            <div class='text-[12px] text-slate-500'>${fmt(r.base + r.add)} × ${r.qty}</div>
          </div>
          <div class='text-right'>
            <div class='font-semibold'>${fmt((r.base + r.add)*r.qty)}</div>
            <div class='mt-1 flex items-center gap-1 justify-end'>
              <button class='w-6 h-6 rounded-full border' onclick='changeQty("${r.key}",-1)'>-</button>
              <button class='w-6 h-6 rounded-full border' onclick='changeQty("${r.key}",1)'>+</button>
              <button class='ml-1 text-slate-400 hover:text-red-500' onclick='removeFromCart("${r.key}")'>Удалить</button>
            </div>
          </div>`
        list.appendChild(el);
      })
    }
    const {sub, delivery, total} = cartTotals();
    const dFee = state.cart.length? fmt(delivery): '—';
    $('#deliveryFee').textContent = dFee;
    $('#cartTotal').textContent = fmt(total);
    $('#cartTotalMobile').textContent = fmt(total);

    const meetsMin = total >= SETTINGS.minOrder;
    $('#minOrderNote').classList.toggle('hidden', meetsMin);
    if(!meetsMin){ $('#minOrderNote').textContent = `Минимальная сумма заказа: ${fmt(SETTINGS.minOrder)}`; }

    // Update links
    $('#waOrder').href = whatsappLink(buildOrderText());
    $('#waBigOrder').href = whatsappLink(buildOrderText());
    $('#waQuick').href = whatsappLink('Здравствуйте! Хочу сделать заказ.');

    // Summary in modal
    if($('#summary')) $('#summary').textContent = orderLines().join('\n');
  }

  function orderLines(){
    const lines = state.cart.map(r=>{
      const item = state.items.find(i=>i.id===r.id);
      const opts = [];
      if(item.options?.sizes && r.opts.sizeIdx!=null) opts.push(item.options.sizes[r.opts.sizeIdx].label);
      if(item.options?.extras && r.opts.extrasIdx?.length) opts.push(...r.opts.extrasIdx.map(i=>item.options.extras[i].label));
      const title = opts.length? `${r.name} (${opts.join(', ')})` : r.name;
      const sum = (r.base + r.add) * r.qty;
      return `• ${title} — ${r.qty} шт. = ${fmt(sum)}`;
    })
    const {delivery, total} = cartTotals();
    if(delivery) lines.push(`Доставка: ${fmt(delivery)}`);
    lines.push(`Итого: ${fmt(total)}`);
    return lines;
  }

  function buildOrderText(formData){
    const header = `Заказ из ${SETTINGS.cafeName}`;
    const lines = orderLines();
    let info = '';
    if(formData){
      info = `\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nТип: ${formData.type}${formData.type==='delivery' ? `\nАдрес: ${formData.address||''}`:''}\nВремя: ${formData.time}\nКомментарий: ${formData.comment||''}`
    }
    return `${header}\n${lines.join('\n')}${info}\n\nСпасибо!`;
  }

  function whatsappLink(text){
    const phone = SETTINGS.whatsapp.replace(/\D/g,'');
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  function toggleQuick(show){
    $('#quickOrder').classList.toggle('hidden', !show);
    if(show){ $('#summary').textContent = orderLines().join('\n'); }
  }

  function toggleDark(){
    document.documentElement.classList.toggle('dark');
    document.body.classList.toggle('bg-slate-900');
    document.body.classList.toggle('text-slate-100');
    localStorage.setItem('menu_dark', document.documentElement.classList.contains('dark')? '1':'0');
  }

  function applyThemeFromStorage(){
    if(localStorage.getItem('menu_dark')==='1'){ toggleDark(); }
  }

  // Boot
  onMounted(() => {
    init();
  });
</script>