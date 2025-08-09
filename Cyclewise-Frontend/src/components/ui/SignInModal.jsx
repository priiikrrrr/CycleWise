import axios from "axios";
import React, { useState,useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AuthStore from "@/store/AuthStore";

const SignInModal = ({ isOpen, onClose }) => {
  const modalRef = useRef();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = useState("");
  const login = AuthStore((state) => state.login);
  


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  const handleSubmit = async(e) =>{
    e.preventDefault();
    setError("");
    try{
      
      const res = await axios.post("http://localhost:3002/auth/login",{
        email,
        password,
      });
      console.log("Response data:", res.data);
      const token = res.data.data.accessToken;
      localStorage.setItem("token", token);
      localStorage.setItem("email", res.data.data.email);
      localStorage.setItem("firstName", res.data.data.firstName);
        login({
          firstName: res.data.data.firstName,
          email: res.data.data.email,
        });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      onClose();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };
  if (!isOpen) return null;

  return createPortal(
  <div
  onClick={handleOutsideClick}
  className="fixed inset-0 bg-[#00000099] backdrop-blur-sm flex items-center justify-center z-50"
>
  <div
    ref={modalRef}
    className="bg-[#FDF4F5] text-[#322626] rounded-2xl p-6 w-full max-w-md shadow-lg border border-[#F8AFA6]"
  >
    <h2 className="text-2xl font-semibold mb-4 text-[#322626]">Welcome back!</h2>
    
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="bg-[#FFE9EC] placeholder-[#9B6B6B] border border-[#F8AFA6] text-[#322626] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF7DAA]"
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="bg-[#FFE9EC] placeholder-[#9B6B6B] border border-[#F8AFA6] text-[#322626] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF7DAA]"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="mt-2 bg-[#FF7DAA] hover:bg-[#ff5b93] text-white font-semibold rounded-md px-4 py-2 transition-colors"
      >
        Sign In
      </button>
    </form>
  </div>
</div>,
  document.body
  );
};

export default SignInModal;
