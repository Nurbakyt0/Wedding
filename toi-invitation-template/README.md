# Toi Invitation Template

Минималистичный MVP-шаблон онлайн-приглашения для казахских мероприятий: үйлену той, қыз ұзату, тұсаукесер, сүндет той, мерейтой, құдалық, туған күн и корпоративные события.

## 1. Как открыть сайт локально

Откройте файл `index.html` в браузере двойным кликом.

Проект не использует React, npm, backend или сборщики. Это обычные HTML, CSS и JavaScript, поэтому он готов для GitHub Pages.

## 2. Где менять имена, дату, место и текст

Все данные мероприятия находятся в одном месте: в начале файла `script.js`, внутри объекта `CONFIG`.

Меняйте там:

- `eventType`
- `mainTitle`
- `subtitle`
- `date`
- `time`
- `venueName`
- `venueAddress`
- `mapLink`
- `invitationTextKz`
- `invitationTextRu`
- `dressCode`
- `hosts`
- `coupleEyebrow`, `coupleTitle`, `coupleText`
- `middleQuote`
- `program`
- `googleScriptUrl`

Формат даты: `YYYY-MM-DD`, например `2026-08-15`.

## 3. Куда положить изображения

Положите фотографии в папку:

```text
assets/images/
```

Используемые имена файлов:

```text
hero.jpg
couple.jpg
middle.jpg
gallery1.jpg
gallery2.jpg
gallery3.jpg
gallery4.jpg
gallery5.jpg
gallery6.jpg
```

Если фото временно отсутствует, сайт не сломается: появится аккуратный CSS-фон.

## 4. Куда положить музыку

Положите музыкальный файл сюда:

```text
assets/music/music.mp3
```

Музыка запускается после первого действия пользователя или по нажатию на круглую кнопку внизу справа. Это нужно, потому что современные браузеры часто блокируют автозапуск.

## 5. Как подключить Google Sheets

1. Создайте Google Таблицу.
2. Добавьте лист с названием `Guests`.
3. Откройте `Расширения -> Apps Script`.
4. Вставьте код ниже.
5. Нажмите `Deploy -> New deployment`.
6. Выберите тип `Web app`.
7. В доступе выберите `Anyone`.
8. Скопируйте URL Web App.
9. Вставьте его в `CONFIG.googleScriptUrl` в файле `script.js`.

Код Google Apps Script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Guests");

    if (!sheet) {
      throw new Error('Sheet "Guests" not found');
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.eventType || "",
      data.mainTitle || "",
      data.name || "",
      data.phone || "",
      data.attendance || "",
      data.guests || "",
      data.comment || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Data saved successfully"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("Google Sheets RSVP Web App is working")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

Пока URL не подключен, форма работает в demo mode и показывает сообщение:

```text
Demo mode: Google Sheets URL is not connected yet.
```

## 6. Как опубликовать через GitHub Pages

1. Создайте новый репозиторий на GitHub.
2. Загрузите все файлы проекта в репозиторий.
3. Откройте `Settings -> Pages`.
4. В разделе `Build and deployment` выберите `Deploy from a branch`.
5. Выберите ветку `main` и папку `/root`.
6. Сохраните настройки.

Через несколько минут GitHub покажет ссылку на опубликованный сайт.

## 7. Как дублировать шаблон для нового клиента

1. Скопируйте папку проекта.
2. Переименуйте папку под клиента или мероприятие.
3. Замените фотографии в `assets/images/`.
4. Замените музыку в `assets/music/music.mp3`.
5. Измените данные в `CONFIG` внутри `script.js`.
6. Подключите новый Google Sheets URL, если нужен сбор RSVP.
7. Опубликуйте копию через GitHub Pages.

Так можно быстро создавать отдельные приглашения для разных клиентов без изменения структуры проекта.
