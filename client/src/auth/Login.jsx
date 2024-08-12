import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputField } from '../Component/inputFields/index.js';
import axios from 'axios';
import { toastMessage } from '../utils/toasMessage.js';

const loginSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = ({ setisLoggedin }) => {
  const navigate = useNavigate();

  const { handleChange, handleSubmit, errors, touched, values, resetForm } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const handleLogin = async (datas) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", datas);
      const { message, status, data } = response?.data;
      if (status === 1) {
        toastMessage("success", message);
        resetForm();
        localStorage.setItem("accessToken", data?.accessToken);
        localStorage.setItem("role", data?.role);
        localStorage.setItem("userId", data?.id);
        setisLoggedin(true);
        navigate("/home-page");
        window.location.reload();
      } else if (status === 0) {
        toastMessage("error", message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="min-h-[91vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div
          className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg"
          style={{
            boxShadow:
              "3px 4px 4px rgba(0, 0, 0, 0.25), -2px -2px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <h2 className="text-center text-2xl font-bold mb-6">
            Log in to <span className="text-[#22A196]">Shoppieee</span>
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            We"ll never post without your permission.
          </p>

          <div className="space-y-6">
            <InputField
              htmlFor="email"
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your first name"
              required={true}
              value={values.email}
              onChange={handleChange("email")}
              error={errors.email && touched.email}
            />
            <InputField
              htmlFor="password"
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your registered password"
              required={true}
              value={values.password}
              onChange={handleChange("password")}
              error={errors.password && touched.password}
            />
            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </Link>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in
              </button>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600">
            New to Shoppieee?{" "}
            <Link to="/" className="text-green-600 hover:text-green-500">
              Sign up for an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;



// import React, { useEffect } from 'react';
// import { InputField } from '../Component/inputFields';
// import { Link, useNavigate } from 'react-router-dom';
// import { useFormik } from 'formik';
// import * as Yup from "yup";
// import axios from 'axios';
// import { toastMessage } from '../utils/toasMessage';

// const loginSchema = Yup.object().shape({
//   email: Yup.string()
//     .required("Email is required"),
//   password: Yup.string()
//     .required("Password is required"),
// });

// const Login = ({ setisLoggedin }) => {
//   const navigate = useNavigate();
//   const { handleChange, handleSubmit, errors, touched, values, resetForm } = useFormik({
//     initialValues: {
//       email: "dhinakings123@gmail.com",
//       password: "Dheena@123"
//     },
//     validationSchema: loginSchema,
//     onSubmit: (values) => {
//       handleLogin(values);
//     }
//   });

//   useEffect(() => {
//     if (localStorage.getItem("accessToken")) {
//       navigate("/home-page");
//     }
//   }, [navigate]);

//   const handleLogin = async (datas) => {
//     try {
//       const response = await axios.post("http://localhost:8000/api/login", datas);
//       const { message, status, data } = response?.data;
//       if (status === 1) {
//         toastMessage("success", message);
//         resetForm();
//         localStorage.setItem("accessToken", data?.accessToken);
//         localStorage.setItem("role", data?.role);
//         localStorage.setItem("userId", data?.id);
//         setisLoggedin(true);
//         navigate("/");
//         window.location.reload();
//       } else if (status === 0) {
//         toastMessage("error", message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <div className="min-h-[91vh] flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-md shadow-md w-[40%]">
//         <h2 className="text-2xl font-sm mb-6 text-start border-b pb-2">Login</h2>
//         {/* <form> */}
//         <div className="flex items-center justify-between w-full border-b mb-5">
//           <div className="w-[100%]">
//             <div className="mb-4">
//               <InputField
//                 htmlFor="emailAddress"
//                 label="Email Address"
//                 type="email"
//                 placeholder="Please Enter Your Email"
//                 name="email"
//                 required="true"
//                 value={values.email}
//                 onChange={handleChange("email")}
//                 error={errors.email && touched.email}
//                 errText={errors.email && touched.email ? errors.email : ""}
//               />
//             </div>
//             <div className="mb-4">
//               <InputField
//                 htmlFor="password"
//                 label="Password"
//                 type="password"
//                 placeholder="Please Enter Your Password"
//                 name="password"
//                 required="true"
//                 value={values.password}
//                 onChange={handleChange("password")}
//                 error={errors.password && touched.password}
//                 errText={errors.password && touched.password ? errors.password : ""}
//               />
//             </div>
//           </div>
//           {/* <div className="w-[50%] flex flex-col items-center">
//             <button className="flex items-center px-4 py-2 border rounded w-[50%] justify-center">
//               <FcGoogle className="w-5 h-5 mr-2" />
//               Login with Google
//             </button>
//             <button className="flex items-center px-4 py-2 border rounded mt-3 w-[50%] justify-center">
//               <FaFacebook className="w-5 h-5 mr-2" style={{ color: "#5262bc" }} />
//               Login with Facebook
//             </button>
//           </div> */}
//         </div>
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-5">
//             <button type="submit" className="text-black border hover:bg-[#ff4b30] hover:text-white px-7 py-2 rounded" onClick={handleSubmit} >Login</button>
//             <Link to="/" className="text-[#323232] text-[13px]">Create An Account</Link>
//           </div>
//           <Link className="text-blue-500 text-[14px]">Forgot Password?</Link>
//         </div>

//         {/* </form> */}
//       </div>
//     </div>
//   )
// }

// export default Login