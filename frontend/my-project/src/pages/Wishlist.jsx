import React from "react";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <FaHeart className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Your wishlist is empty
          </h3>
          <button
            onClick={() => (window.location.href = "/products")}
            className="px-6 py-2 bg-[#FD5600] text-white rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Add Products
          </button>
        </div>
      </div>
    );
  }

  const totalValue = wishlist.reduce(
    (sum, item) => sum + (item.product?.price || 0),
    0
  );

  return (
    <div className="bg-gray-50 py-10 px-6 sm:px-10 lg:px-20 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Wishlist
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{wishlist.length}</p>
            <p className="text-gray-600">Total Items</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">₹{totalValue}</p>
            <p className="text-gray-600">Total Price</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => {
          const product = item.product;
          if (!product) return null;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden w-80 mx-auto"
            >
              <div className="w-full h-72 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  {product.category}
                </p>
                <p className="text-gray-900 font-bold text-xl mb-4">
                  ₹{product.price}
                </p>

                <div className="space-y-3 mt-4">
                  <button
                    onClick={() => moveToCart(product)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
