import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuThemeEditor from '~/components/admin/MenuThemeEditor.vue'
import { DEFAULT_MENU_THEME, MENU_THEME_PRESETS, MENU_THEME_FONT_OPTIONS } from '~/config/menuThemes'
import { resolveMenuTheme, validateMenuTheme } from '~/utils/theme'

const previewTheme = resolveMenuTheme(DEFAULT_MENU_THEME)
const baseProps = {
  theme: JSON.parse(JSON.stringify(DEFAULT_MENU_THEME)),
  previewTheme,
  previewMenuItems: [
    { id: '1', name: 'Превью блюдо', category: 'Категория', price: 320, tags: ['Хит'] },
  ],
  previewCafe: { cafeName: 'Кафе Превью', announcement: 'Тут будет приветствие.' },
  presets: MENU_THEME_PRESETS,
  fontOptions: MENU_THEME_FONT_OPTIONS,
  validation: validateMenuTheme(DEFAULT_MENU_THEME),
  warnings: [],
}

describe('MenuThemeEditor', () => {
  it('emits update when preset is selected', async () => {
    const wrapper = mount(MenuThemeEditor, {
      props: {
        ...baseProps,
        theme: JSON.parse(JSON.stringify(DEFAULT_MENU_THEME)),
      },
      global: {
        stubs: {
          MenuThemePreview: true,
        },
      },
    })

    const secondPreset = MENU_THEME_PRESETS[1]
    const button = wrapper.findAll('[aria-pressed]').find((node) => node.text().includes(secondPreset.name))
    expect(button).toBeDefined()
    await button!.trigger('click')

    const emitted = wrapper.emitted('update:theme')
    expect(emitted).toBeTruthy()
    const lastPayload = emitted![emitted!.length - 1][0]
    expect(lastPayload.presetId).toBe(secondPreset.id)
  })

  it('emits reset when reset button clicked', async () => {
    const wrapper = mount(MenuThemeEditor, {
      props: {
        ...baseProps,
        theme: JSON.parse(JSON.stringify(DEFAULT_MENU_THEME)),
      },
      global: { stubs: { MenuThemePreview: true } },
    })

    const resetButton = wrapper.findAll('button').find((node) => node.text().includes('Сбросить к дефолту'))
    expect(resetButton).toBeDefined()
    await resetButton!.trigger('click')

    expect(wrapper.emitted('reset')).toBeTruthy()
  })
})
