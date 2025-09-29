<template>
  <!-- Header / Hero -->
  <header id="hero" class="bg-white">
    <div class="mx-auto container-capped px-4 pt-8 pb-10">
      <div class="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 id="cafeName" class="text-3xl md:text-4xl font-extrabold leading-tight">Меню</h1>
          <p id="announcement" class="mt-3 text-slate-600">…</p>
          <div class="mt-5 flex gap-3">
            <a href="#menu" class="px-5 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-soft">Смотреть меню</a>
            <a id="waQuick" target="_blank" class="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700">Заказать в WhatsApp</a>
          </div>
        </div>
        <div>
          <div class="relative rounded-2xl overflow-hidden shadow-soft">
            <img id="bannerImage" class="w-full h-60 object-cover" alt="Баннер" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div class="absolute bottom-3 left-3 text-white">
              <div id="bannerTitle" class="text-xl font-semibold"></div>
              <div id="bannerSub" class="opacity-90 text-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Controls: Search + Categories -->
  <section id="controls" class="sticky top-[52px] z-30 bg-white/85 backdrop-blur border-b border-slate-100">
    <div class="mx-auto container-capped px-4 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div class="flex items-center gap-2 w-full md:w-1/2">
        <input id="search" type="search" placeholder="Поиск по меню…" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-300" />
      </div>
      <div id="categories" class="flex gap-2 overflow-x-auto"></div>
    </div>
  </section>

  <!-- Menu List -->
  <main id="menu" class="mx-auto container-capped px-4 py-8 grid md:grid-cols-[1fr_360px] gap-6">
    <!-- Items -->
    <div id="items" class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4"></div>

    <!-- Cart Drawer (sticky on desktop) -->
    <aside id="cartDrawer" class="hidden md:block sticky top-[120px] h-fit">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-soft p-4">
        <h3 class="text-lg font-semibold">Ваш заказ</h3>
        <div id="cartList" class="mt-3 flex flex-col gap-3"></div>
        <div class="mt-4 border-t pt-3 text-sm text-slate-600 space-y-1">
          <div class="flex justify-between"><span>Доставка</span><span id="deliveryFee">—</span></div>
          <div class="flex justify-between font-semibold text-slate-800"><span>Итого</span><span id="cartTotal">0</span></div>
          <div id="minOrderNote" class="hidden text-[12px] text-amber-700 bg-amber-50 rounded-lg p-2"></div>
        </div>
        <button id="checkoutBtn" class="mt-3 w-full rounded-xl bg-brand-600 text-white py-2.5 hover:bg-brand-700 disabled:opacity-50">Оформить заказ</button>
        <a id="waOrder" target="_blank" class="mt-2 w-full inline-block text-center rounded-xl border border-green-600 text-green-700 py-2 hover:bg-green-50">WhatsApp</a>
      </div>
    </aside>
  </main>

  <!-- Quick Order Modal -->
  <div id="quickOrder" class="fixed inset-0 hidden items-end md:items-center justify-center z-50">
    <div class="absolute inset-0 bg-black/50" onclick="toggleQuick(false)"></div>
    <div class="w-full md:w-[720px] bg-white rounded-t-2xl md:rounded-2xl p-5 max-h-[90vh] overflow-y-auto shadow-soft">
      <div class="flex items-start justify-between gap-4">
        <h3 class="text-xl font-semibold">Оформление заказа</h3>
        <button class="text-slate-500" onclick="toggleQuick(false)">✕</button>
      </div>
      <form id="orderForm" class="mt-4 grid md:grid-cols-2 gap-4">
        <div class="grid gap-3">
          <label class="text-sm">Имя
            <input name="name" required class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Ваше имя"/>
          </label>
          <label class="text-sm">Телефон
            <input name="phone" required class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="+996..."/>
          </label>
          <label class="text-sm">Способ получения
            <select name="type" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2">
              <option value="delivery">Доставка</option>
              <option value="pickup">Самовывоз</option>
            </select>
          </label>
          <label id="addressField" class="text-sm">Адрес (для доставки)
            <input name="address" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Улица, дом, подъезд"/>
          </label>
          <label class="text-sm">Время
            <select name="time" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2">
              <option value="asap">Как можно скорее</option>
              <option>Через 30 минут</option>
              <option>Через 1 час</option>
            </select>
          </label>
        </div>
        <div class="grid gap-3">
          <div class="p-3 rounded-xl bg-slate-50 text-sm">
            <div class="font-medium">Состав заказа</div>
            <div id="summary" class="mt-1 whitespace-pre-wrap"></div>
          </div>
          <label class="text-sm">Комментарий курьеру
            <textarea name="comment" rows="4" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Код домофона, пожелания…"></textarea>
          </label>
          <button class="rounded-xl bg-brand-600 text-white py-2.5 hover:bg-brand-700">Подтвердить заказ</button>
          <a id="waBigOrder" target="_blank" class="rounded-xl border border-green-600 text-green-700 py-2 text-center hover:bg-green-50">Отправить в WhatsApp</a>
        </div>
      </form>
    </div>
  </div>

  <!-- Mobile Cart Bar -->
  <div class="md:hidden fixed bottom-4 inset-x-0 z-40 px-4">
    <div class="bg-white border border-slate-200 shadow-soft rounded-2xl px-4 py-2 flex items-center justify-between">
      <div>
        <div class="text-xs text-slate-500">Итого</div>
        <div id="cartTotalMobile" class="font-semibold">0</div>
      </div>
      <button onclick="toggleQuick(true)" class="rounded-xl bg-brand-600 text-white px-4 py-2">Оформить</button>
    </div>
  </div>
</template>