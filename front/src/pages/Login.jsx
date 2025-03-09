// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/loginAuthSlice"; // Import the action
import { setUser } from "../features/auth/authSlice";
import api from "../api/api";
const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      dispatch(setUser(data.user));
      dispatch(loginSuccess(data.user));
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password.");
    }
  };

  return (
    <div
      style={{ backgroundColor: "darkblue" }}
      className="min-h-screen flex items-center justify-center h-full  "
    >
      <div className="bg-[#00008B] px-6 rounded shadow-md lg:w-96 w-full h-full text-white">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-lg ">
            <label className="block mb-1 text-xl">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded text-xl text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xl">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded text-xl text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2  hover:bg-blue-600 text-3xl"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
