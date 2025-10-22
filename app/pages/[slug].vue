<template>
  <LayoutAppHeader
    :settings="cafeSettings"
    @open-quick-order="openQuickOrderFromPage"
  />
  <HomeContent :menu="menu" :settings="cafeSettings" ref="homeContentRef" />
  <LayoutAppFooter :settings="cafeSettings" />
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, createError, useHead } from '#imports'
import { SETTINGS } from '~/config/settings'
import type { PublicMenuPayload } from '~/types/menu'

const homeContentRef = ref<{ openQuickOrder: () => void } | null>(null)

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, error } = await useFetch<PublicMenuPayload>(
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

const payload = computed(() => data.value)

const menu = computed(() => payload.value?.menu ?? [])
const cafeSettings = computed(() => payload.value?.cafe ?? SETTINGS)

useHead(() => ({
  title: payload.value ? `${payload.value.title} — Get Menu` : 'Меню — Get Menu',
  meta: payload.value?.description
    ? [
        {
          name: 'description',
          content: payload.value.description,
        },
      ]
    : [],
}))

function openQuickOrderFromPage () {
  homeContentRef.value?.openQuickOrder()
}
</script>
