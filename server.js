const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Простейший "in-memory" список товаров
let products = [
  {
    id: 1,
    name: "Сухой корм для собак",
    price: 1200,
    category: "корм",
    description: "Полноценный сухой корм для взрослых собак всех пород.",
    quantity: 15,
  },
  {
    id: 2,
    name: "Игрушка-канат",
    price: 450,
    category: "игрушки",
    description: "Прочная игрушка-канат для игр и чистки зубов.",
    quantity: 30,
  },
  {
    id: 3,
    name: "Поводок нейлоновый",
    price: 800,
    category: "поводки",
    description: "Удобный нейлоновый поводок длиной 3 м.",
    quantity: 20,
  },
  {
    id: 4,
    name: "Миска металлическая",
    price: 600,
    category: "миски",
    description: "Непроливаемая миска из нержавеющей стали.",
    quantity: 25,
  },
  {
    id: 5,
    name: "Лакомства для дрессировки",
    price: 350,
    category: "корм",
    description: "Мягкие лакомства для поощрения во время занятий.",
    quantity: 40,
  },
];

// Вспомогательная функция для генерации нового id
const getNextId = () => {
  if (products.length === 0) return 1;
  return Math.max(...products.map((p) => p.id)) + 1;
};

// Swagger/OpenAPI базовая конфигурация
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dog Store API",
    version: "1.0.0",
    description: "API для учебного проекта магазина товаров для собак",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [__filename],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Сухой корм для собак
 *         price:
 *           type: number
 *           example: 1200
 *         category:
 *           type: string
 *           example: корм
 *         description:
 *           type: string
 *           example: Полноценный сухой корм для взрослых собак всех пород.
 *         quantity:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список всех товаров
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// GET /products — получить все товары
app.get("/products", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить один товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Найденный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
// GET /products/:id — получить один товар по id
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  res.json(product);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Добавить новый товар
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Неверные данные
 */
// POST /products — добавить новый товар
app.post("/products", (req, res) => {
  const { name, price, category, description, quantity } = req.body;

  if (!name || price == null || !category) {
    return res
      .status(400)
      .json({ message: "Поля name, price и category обязательны" });
  }

  const newProduct = {
    id: getNextId(),
    name,
    price,
    category,
    description: description || "",
    quantity: quantity ?? 0,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Частично изменить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
// PATCH /products/:id — частично изменить товар
app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  const { name, price, category, description, quantity } = req.body;

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  if (description !== undefined) product.description = description;
  if (quantity !== undefined) product.quantity = quantity;

  res.json(product);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Товар успешно удалён
 *       404:
 *         description: Товар не найден
 */
// DELETE /products/:id — удалить товар
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  const deleted = products.splice(index, 1)[0];

  res.json({ message: "Товар удалён", product: deleted });
});

app.listen(PORT, () => {
  console.log(`Dog Store API запущен на http://localhost:${PORT}`);
});

