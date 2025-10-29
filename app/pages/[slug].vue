<template>
  <LayoutAppHeader
    :settings="settings"
    @open-quick-order="openQuickOrderFromPage"
  />
  <HomeContent :menu="menu" ref="homeContentRef" />
  <LayoutAppFooter :settings="settings" />
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, createError } from '#imports'
import { SETTINGS } from '~/config/settings'
import type { MenuItem } from '~/types/menu'

const settings = SETTINGS
const homeContentRef = ref<{ openQuickOrder: () => void } | null>(null)

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, error } = await useFetch<MenuItem[]>(
  () => `/api/menu/${slug.value}`,
  {
    watch: [slug],
    immediate: true
  }
)

watchEffect(() => {
  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode ?? 404,
      statusMessage: error.value.statusMessage ?? 'Меню не найдено'
    })
  }
})

const menu = computed(() => data.value || [])

function openQuickOrderFromPage () {
  homeContentRef.value?.openQuickOrder()
}
</script>
