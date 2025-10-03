<template>
  <LayoutAppHeader
    :settings="settings"
    @open-quick-order="openQuickOrderFromPage"
  />
  <HomeContent :menu="menu" ref="homeContentRef" />
  <LayoutAppFooter :settings="settings" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SETTINGS } from '~/config/settings'

const settings = SETTINGS
const homeContentRef = ref<{ openQuickOrder: () => void } | null>(null)

const { data } = await useFetch('/api/menu')

const menu = computed(() => data.value || [])

function openQuickOrderFromPage () {
  homeContentRef.value?.openQuickOrder()
}
</script>
