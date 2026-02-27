# Postman — Практическое занятие №3

## 1. Тестирование своего API (Dog Store)

Базовый URL: `http://localhost:3001`

Перед тестированием запусти сервер:

```bash
npm start
```

### 1.1. GET /products — получить список товаров

- Метод: **GET**
- URL: `http://localhost:3001/products`
- Тело запроса: нет
- Ожидаемый ответ: статус **200**, массив товаров (JSON).
- Скриншот: список товаров.

### 1.2. POST /products — добавить новый товар

- Метод: **POST**
- URL: `http://localhost:3001/products`
- Headers:
  - `Content-Type: application/json`
- Body → raw → JSON, пример:

```json
{
  "name": "Игрушка мяч",
  "price": 500,
  "category": "игрушки",
  "description": "Резиновый мяч для активных игр.",
  "quantity": 10
}
```

- Ожидаемый ответ: статус **201**, созданный товар.
- Скриншот: отправленный запрос + ответ.

### 1.3. DELETE /products/:id — удалить товар

- Метод: **DELETE**
- URL: `http://localhost:3001/products/1` (или другой существующий id)
- Тело запроса: нет
- Ожидаемый ответ: статус **200**, сообщение `"Товар удалён"` и объект удалённого товара.
- Скриншот: запрос и ответ.

---

## 2. Внешний публичный API (пример: Dog CEO API)

Базовый URL: `https://dog.ceo/api`

Сделай минимум 5 разных запросов и сохрани скриншоты ответов JSON.

Примеры запросов:

1. **GET** `https://dog.ceo/api/breeds/list/all` — список всех пород.
2. **GET** `https://dog.ceo/api/breeds/image/random` — случайная картинка собаки.
3. **GET** `https://dog.ceo/api/breed/hound/images` — все изображения породы `hound`.
4. **GET** `https://dog.ceo/api/breed/hound/images/random/3` — 3 случайных изображения породы `hound`.
5. **GET** `https://dog.ceo/api/breed/beagle/images/random` — случайная картинка породы `beagle`.

Для каждой операции:

- Укажи метод (GET).
- Укажи URL.
- Посмотри JSON в ответе.
- Сделай скриншот, чтобы приложить к отчёту.

