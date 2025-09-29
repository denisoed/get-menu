<template>
  <footer id="footer" class="mt-8 bg-white border-t">
    <div class="mx-auto container-capped px-4 py-6 text-sm text-slate-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <div>
        <strong id="fCafe"></strong> • <span id="fAddr"></span> • <a id="fCall" class="underline" href="#"></a>
      </div>
      <div class="flex gap-2">
        <button onclick="window.print()" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">🖨️ Печать QR/меню</button>
        <button id="darkToggleBottom" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">🌗 Тёмная тема</button>
      </div>
    </div>
  </footer>
</template>