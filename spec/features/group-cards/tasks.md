# Tasks

**Context:** Группировка карточек блюд по категориям на странице меню с сохранением поиска, фильтров и избранного.

## Main directions

### UI / Компоненты
- [ ] Обновить `app/components/home/Content.vue`, добавив вычисление сгруппированного списка меню и передачу его в `HomeListCards` вместе с признаком выбранной категории.
- [ ] Переработать шаблон `app/components/home/ListCards.vue`, чтобы выводить категории с заголовками и сеткой карточек внутри каждой группы.
- [ ] Настроить стили заголовков категорий (Tailwind), обеспечить корректные отступы между группами и поддержку светлой/тёмной тем.

### Логика фильтров
- [ ] Гарантировать, что фильтр по категории и поиск применяются до группировки, исключая пустые секции.
- [ ] Обработать сценарий «Избранное», чтобы выводился единый заголовок и карточки избранных блюд.
- [ ] Сохранить и переиспользовать пустое состояние «Ничего не найдено», если после фильтров нет результатов.

### Тестирование и проверка
- [ ] Протестировать сценарии: без фильтров, выбор одной категории, поиск, режим «Избранное», пустой результат.
- [ ] Выполнить `npm run lint` и `npm test` (при наличии соответствующих тестов) для проверки качества.

## Supporting tasks

- [ ] Documentation: update relevant instructions and descriptions (Not required — reason: интерфейсные изменения очевидны, дополнительные инструкции не требуются).
- [ ] Observability: add or clarify metrics, alerts, and/or logging (Not required — reason: клиентская вёрстка, метрики не предусмотрены).
- [ ] Code review and PR: prepare changes for review and accompanying information.

## Definition of Done

- [ ] All tasks are completed and tested.
- [ ] Relevant unit/e2e/integration tests pass successfully.
- [ ] Documentation and operational instructions are updated.
- [ ] `/spec/core/verify.md` is executed after completing all tasks to verify the task list.
