# Tasks

**Context:** Реализовать хранение черновика текста в модальном окне быстрого редактирования меню в localStorage с уникальными ключами, автоподстановку при открытии, очистку после успешного сохранения и ручную кнопку очистки.

## Main directions

### UI
- [ ] Добавить кнопку очистки черновика в поле ввода модального окна, обеспечить доступность (`aria-label`, фокусировка) и визуальную интеграцию с текущим дизайном.
- [ ] Подставлять сохраненный текст из localStorage при открытии модалки, обновлять состояние поля при изменении черновика.

### Client logic
- [ ] Реализовать helper/composable для работы с localStorage (`load/save/clear`), учитывая уникальный ключ по `menuId` и защиту от отсутствия storage.
- [ ] Настроить синхронизацию поля ввода с localStorage (watch/debounce), очищать данные после успешного запроса или по кнопке.
- [ ] Обновить обработчик успешного запроса редактирования меню, чтобы он вызывал очистку соответствующего ключа и сбрасывал локальное состояние.

### Testing
- [ ] Написать юнит- или компонентные тесты для проверки сохранения, загрузки и очистки черновика, замокав localStorage.

## Supporting tasks

- [ ] Documentation: update relevant instructions and descriptions.
- [ ] Observability: add or clarify metrics, alerts, and/or logging. Not required — reason: изменение ограничивается клиентским localStorage без серверных метрик.
- [ ] Code review and PR: prepare changes for review and accompanying information.

## Definition of Done

- [ ] All tasks are completed and tested.
- [ ] Relevant unit/e2e/integration tests pass successfully.
- [ ] Documentation and operational instructions are updated.
- [ ] `/spec/core/verify.md` is executed after completing all tasks to verify the task list.
