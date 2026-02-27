import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001";

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error("Ошибка загрузки товаров");
        }
        const data = await response.json();
        setProducts(data);
      } catch (e) {
        setError(e.message || "Не удалось загрузить товары");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((item) => item.id !== productId);
      }
      return prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleClearCart = () => setCartItems([]);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.price * (item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  );

  return (
    <div className="page">
      <header className="header">
        <div className="header__left">
          <div className="header__logo">🐾</div>
          <div>
            <h1 className="header__title">Dog Store</h1>
            <p className="header__subtitle">Магазин товаров для собак</p>
          </div>
        </div>
        <div className="header__right">
          <span className="header__badge">
            В корзине{" "}
            <strong>
              {totalItems} товар{totalItems === 1 ? "" : totalItems >= 2 && totalItems <= 4 ? "а" : "ов"}
            </strong>
          </span>
        </div>
      </header>

      <main className="layout">
        <section className="catalog">
          <h2 className="section-title">Каталог товаров</h2>

          {loading && <p>Загрузка товаров...</p>}
          {error && <p className="error">{error}</p>}

          <div className="catalog__grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-card__image-placeholder">
                  <span>{product.category}</span>
                </div>

                <div className="product-card__content">
                  <h3 className="product-card__title">{product.name}</h3>
                  {product.description && (
                    <p className="product-card__description">
                      {product.description}
                    </p>
                  )}
                  <div className="product-card__footer">
                    <span className="product-card__price">
                      {product.price} ₽
                    </span>
                    <button
                      className="product-card__button"
                      onClick={() => handleAddToCart(product)}
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart">
          <h2 className="section-title">Корзина</h2>

          {cartItems.length === 0 ? (
            <p className="cart__empty">Корзина пуста</p>
          ) : (
            <>
              <ul className="cart__list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart__item">
                    <div className="cart__item-info">
                      <span className="cart__item-name">{item.name}</span>
                      <span className="cart__item-quantity">
                        x {item.quantity}
                      </span>
                    </div>
                    <div className="cart__item-actions">
                      <span className="cart__item-price">
                        {item.price * item.quantity} ₽
                      </span>
                      <button
                        className="cart__button cart__button--remove"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        −
                      </button>
                      <button
                        className="cart__button cart__button--add"
                        onClick={() => handleAddToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart__footer">
                <div className="cart__total">
                  <span>Итого:</span>
                  <strong>{totalPrice} ₽</strong>
                </div>
                <button
                  className="cart__clear-button"
                  onClick={handleClearCart}
                >
                  Очистить корзину
                </button>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
