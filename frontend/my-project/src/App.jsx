import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import UserOrders from "./pages/UserOrders";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/login";
import Payment from "./pages/Payment";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Shipping from "./pages/Shipping";
import ProtectedRoute from "./components/Protectedroute";


import ProtectedAdminRoute from "./pages/Admin/ProtectedAdminRoute";


import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminUsers from "./pages/Admin/AdminUserDetails";
import AdminUserDetails from "./pages/Admin/AdminUserDetails";
import AdminHome from "./pages/Admin/AdminHome";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminAddProducts from "./pages/Admin/AdminAddProducts";

import { AdminProvider } from "./pages/Admin/context/AdminContext";

import ErrorBoundary from "./components/ErrorBoundary";
import UserRoute from "./components/UserRoute";


function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/account" ||
    location.pathname === "/Account";

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}

      <ErrorBoundary>
        <Routes>
          {}
          <Route path="/" element={<UserRoute><Home /></UserRoute>} />
          <Route path="/products" element={<UserRoute><Products category="Products" /></UserRoute>} />
          <Route path="/about" element={<UserRoute><About /></UserRoute>} />
          <Route path="/contact" element={<UserRoute><Contact /></UserRoute>} />
          <Route path="/login" element={<UserRoute><Login /></UserRoute>} />
          <Route path="/account" element={<UserRoute><Account /></UserRoute>} />

          {}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminAddProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetails />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shipping"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ErrorBoundary>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AdminProvider>
          <Router>
            <AppContent />
          </Router>
        </AdminProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
