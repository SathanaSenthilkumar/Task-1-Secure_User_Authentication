import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { toastMessage } from "../../utils/toasMessage";

const HomeLayout = () => {
  const [products, setProducts] = useState([]);
  const userRole = localStorage.getItem("role");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/getAllProducts"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/deleteProduct/${id}`
      );
      toastMessage("success", response?.data?.message);
      setProducts((item) => item.product_id !== id);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-[#ff4b30]">
          Welcome to the Shoppieee
        </h1>
      </div>
      {products && (
        <div className="products-container">
          <h1>Product List</h1>
          <div className="product-list">
            {products?.data?.map((product, index) => (
              <div key={index} className="product-card relative">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="product-image"
                />
                <div className="product-details">
                  <h2 className="product-name">{product.productName}</h2>
                  <p className="product-description">
                    {product.product_description}
                  </p>
                  <p className="product-price line-through font-normal text-sm">
                    Price: ${product.product_price}
                  </p>
                  <p className="product-offer">
                    Offer Price: ${product.product_offer}
                  </p>
                </div>
                {userRole === "admin" && (
                  <div
                    className="absolute top-3 right-3 w-[35px] h-[35px] border bg-red-400 flex items-center justify-center rounded-full"
                    onClick={() => handleDeleteProduct(product.product_id)}
                  >
                    <MdDelete className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeLayout;
