import axios from "axios";
import React, { useEffect, useState } from "react";
import { InputField } from "../inputFields";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toastMessage } from "../../utils/toasMessage";

const createProductSchema = Yup.object().shape({
  productName: Yup.string().required("Product name is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  description: Yup.string().required("Description is required"),
  offer: Yup.number()
    .required("Offer price is required")
    .positive("Offer price must be positive"),
  image: Yup.mixed().required("Image is required"),
});

const Dashboard = ({ userId, role }) => {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/getUser/${userId}`
      );
      const { status, data, message } = response?.data;
      if (status === 1) {
        setUser({ ...data });
      } else {
        toastMessage("error", message);
      }
    } catch (error) {
      console.log(error);
      toastMessage("error", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/getAllProducts"
      );
      setProducts(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getUser();
    fetchProducts();
  }, []);

  const {
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    errors,
    values,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      productName: "",
      price: "",
      description: "",
      offer: "",
      image: null,
    },
    validationSchema: createProductSchema,
    onSubmit: (values) => {
      handleCreateProduct(values);
    },
  });

  const handleCreateProduct = async (values) => {
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("offer", values.offer);
      formData.append("image", values.image);

      const response = await axios.post(
        `http://localhost:8000/api/createProduct/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { status, message, data } = response?.data;
      if (status === 1) {
        toastMessage("success", message);
        setProducts([...products, data]);
        resetForm();
      } else {
        toastMessage("error", message);
      }
    } catch (error) {
      console.log(error);
      toastMessage("error", error);
    }
  };

  const handleFileChange = (event) => {
    setFieldValue("image", event.currentTarget.files[0]);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-[#ff4b30]">
          Welcome to the Shoppieee
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Products</h2>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              Current Login User Details
            </h2>
            <div className="mt-4">
              <p className="text-lg">
                <span className="font-semibold">User ID:</span> {user?.id}
              </p>
              <p className="text-lg mt-2">
                <span className="font-semibold">User Name:</span> {user?.name}
              </p>
              <p className="text-lg mt-2">
                <span className="font-semibold">User Email:</span> {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border shadow-md rounded-md p-5 max-w-4xl mx-auto mb-5">
        <h1 className="border-b text-lg font-medium pb-2 mb-2">
          Create New Product
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <div>
            <InputField
              htmlFor="productName"
              label="Product Name"
              type="text"
              placeholder="Please Enter Product name"
              name="productName"
              required={true}
              value={values.productName}
              onChange={handleChange("productName")}
              error={errors.productName && touched.productName}
              errText={
                errors.productName && touched.productName
                  ? errors.productName
                  : ""
              }
            />
          </div>
          <div>
            <InputField
              htmlFor="description"
              label="Product Description"
              type="text"
              placeholder="Please Enter Product description"
              name="description"
              required={true}
              value={values.description}
              onChange={handleChange("description")}
              error={errors.description && touched.description}
              errText={
                errors.description && touched.description
                  ? errors.description
                  : ""
              }
            />
          </div>
          <div>
            <InputField
              htmlFor="price"
              label="Product Price"
              type="number"
              placeholder="Please Enter Product price"
              name="price"
              required={true}
              value={values.price}
              onChange={handleChange("price")}
              error={errors.price && touched.price}
              errText={errors.price && touched.price ? errors.price : ""}
            />
          </div>
          <div>
            <InputField
              htmlFor="offer"
              label="Product Offer Price"
              type="number"
              placeholder="Please Enter Product offer"
              name="offer"
              required={true}
              value={values.offer}
              onChange={handleChange("offer")}
              error={errors.offer && touched.offer}
              errText={errors.offer && touched.offer ? errors.offer : ""}
            />
          </div>
          <div>
            <InputField
              htmlFor="image"
              label="Product Image"
              type="file"
              placeholder="Please Upload Product image"
              name="image"
              required={true}
              onChange={handleFileChange}
              error={errors.image && touched.image}
              errText={errors.image && touched.image ? errors.image : ""}
            />
          </div>
          <div className="col-span-2 mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
