import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputField } from '../Component/inputFields';
import axios from 'axios';
import { toastMessage } from '../utils/toasMessage';

const RegisterSchema = Yup.object().shape({
  first_name: Yup.string().min(4, "Minimum 4 characters required.").required("First name is required."),
  last_name: Yup.string().min(1, "Minimum 4 characters required."),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character."
    )
    .required("Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [isActive, setisActive] = useState(false);

  const { handleChange, handleSubmit, values, errors, touched, resetForm } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      handleSignup(values);
    },
  });


  const handleSignup = async (datas) => {

    const { first_name, last_name, email, password } = datas;
    let reqData = {
      name: `${first_name} ${last_name}`,
      email,
      password,
    };
    try {
      const response = await axios.post("http://localhost:8000/api/register", reqData);
      const { message, status } = response?.data;
      if (status === 1) {
        toastMessage("success", message);
        resetForm();
        navigate("/signin");
      } else if (status === 0) {
        toastMessage("error", message);
      }
    } catch (error) {
      console.log(error);
      toastMessage("error", error);
    }
  };

  const RenderManualSignupForm = () => {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <div className="space-y-4">
          <InputField
            htmlFor="first_name"
            label="First Name"
            type="text"
            name="first_name"
            placeholder="Enter your first name"
            required={true}
            value={values.first_name}
            onChange={handleChange("first_name")}
            error={errors.first_name && touched.first_name}
            errText={errors.first_name && touched.first_name ? errors.first_name : ""}
          />

          <InputField
            htmlFor="last_name"
            label="Last Name"
            type="text"
            name="last_name"
            placeholder="Enter your last name"
            value={values.last_name}
            onChange={handleChange("last_name")}
            error={errors.last_name && touched.last_name}
            errText={errors.last_name && touched.last_name ? errors.last_name : ""}
          />

          <InputField
            htmlFor="email"
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            required={true}
            value={values.email}
            onChange={handleChange("email")}
            error={errors.email && touched.email}
            errText={errors.email && touched.email ? errors.email : ""}
          />
          <InputField
            htmlFor="password"
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required={true}
            value={values.password}
            onChange={handleChange("password")}
            error={errors.password && touched.password}
            errText={errors.password && touched.password ? errors.password : ""}
          />
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign up with email
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-[92vh] bg-gray-100 p-4 ">
        <div className="flex flex-col items-center justify-center lg:mt-[100px]">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mb-6">
            <h2 className="text-center text-2xl font-bold mb-4">
              Join <span className="text-[#22A196]">Shoppieee</span>
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Explore our wide range of products to enhance your shopping experience and enjoy exclusive deals and discounts.
            </p>
            <p className="text-center text-sm mb-4">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-green-600 hover:text-green-500"
              >
                Log in
              </Link>
            </p>
            <p className="text-center text-sm mb-4">
              or{" "}
              <Link
                to="#"
                className="text-green-600 hover:text-green-500"
                onClick={() => setisActive(isActive ? false : true)}
              >
                sign up with email
              </Link>
            </p>
          </div>

          {isActive && RenderManualSignupForm()}

          <p className="mt-4 text-center text-xs text-gray-600">
            By creating an account, you agree to our{" "}
            <Link to="#" className="text-green-600 hover:text-green-500">
              Terms of Service
            </Link>
            and{" "}
            <Link
              // to="/privacy-policy"
              className="text-green-600 hover:text-green-500"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;