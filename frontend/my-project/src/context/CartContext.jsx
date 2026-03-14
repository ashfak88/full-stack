import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify";
import api from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"))
      if (loggedUser) {
        setUser(loggedUser)
      } else {
        setUser(null)
        setCart([])
        setLoading(false)
      }
    }

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const fetchCart = async () => {
      try {
        const res = await api.get(`/cart/${user._id}`);
        setCart(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const saveCartToBackend = async (updatedCart) => {
    if (!user?._id) return;

    try {
      const filteredCart = updatedCart.filter(item => item.product); 

      const res = await api.put(`/cart/${user._id}`, {
        cartItems: filteredCart.map((item) => ({
          product: item.product?._id || item.product,
          quantity: item.quantity,
        })),
      });

      if (res.data) {
        setCart(res.data);
      }
      return res.data;
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.error("Cloud sync failed. Check your connection.");
    }
  };

  const addToCart = async (product, quantity = 1) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => (item.product?._id || item.product) === product._id);
      let updatedCart;

      if (exists) {
        updatedCart = prevCart.map((item) =>
          (item.product?._id || item.product) === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...prevCart, { product, quantity }];
      }

      saveCartToBackend(updatedCart);
      return updatedCart;
    });
    toast.success("Added to cart!");
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => (item.product?._id || item.product) !== productId);
      saveCartToBackend(updatedCart);
      return updatedCart;
    });
    toast.success("Removed from cart!");
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        (item.product?._id || item.product) === productId ? { ...item, quantity } : item
      );
      saveCartToBackend(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = (skipBackend = false) => {
    setCart([]);
    if (!skipBackend) {
      saveCartToBackend([]);
    }
  };

  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
