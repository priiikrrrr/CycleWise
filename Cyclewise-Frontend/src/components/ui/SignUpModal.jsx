import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { createPortal } from "react-dom";
import axios from "axios";

const SignUpModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    avatarUrl: "",
    bio: ""
  });

  const [loading, setLoading] = useState(false);

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Close modal on outside click
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3002/user/create", formData, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("User created:", res.data);
      alert("Account created successfully!");
      navigate("/profile");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-semibold mb-4 text-[#322626]">
          Create your account
        </h2>

        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Hidden dummy fields to stop Chrome autofill */}
          <input
            type="text"
            name="fakeuser"
            autoComplete="username"
            style={{ display: "none" }}
          />
          <input
            type="password"
            name="fakepass"
            autoComplete="new-password"
            style={{ display: "none" }}
          />

          <input
            type="text"
            name="firstName"
            placeholder="First Name *"
            value={formData.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
            className="bg-[#FFE9EC] border border-[#F8AFA6] rounded-md px-4 py-2"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            className="bg-[#FFE9EC] border border-[#F8AFA6] rounded-md px-4 py-2"
          />
          <input
            type="text"
            name="username"
            placeholder="Username *"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            className="bg-[#FFE9EC] border border-[#F8AFA6] rounded-md px-4 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="bg-[#FFE9EC] border border-[#F8AFA6] rounded-md px-4 py-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
            className="bg-[#FFE9EC] border border-[#F8AFA6] rounded-md px-4 py-2"
          />
          {/* <input
            type="url"
            name="avatarUrl"
            placeholder="Avatar URL (optional)"
            value={formData.avatarUrl}
            onChange={handleChange}
            autoComplete="off"
            className="bg-[#FFE9EC] border border-[#F8AFA6] rounded-md px-4 py-2"
          />
          <textarea
            name="bio"
            placeholder="Bio (max 100 characters)"
            value={formData.bio}
            onChange={handleChange}
            maxLength={100}
            autoComplete="off"
            className="bg-[#FFE9EC] border border-[#F8AFA6] rounded-md px-4 py-2 resize-none"
          /> */}

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#FF7DAA] hover:bg-[#ff5b93] text-white font-semibold rounded-md px-4 py-2 transition-colors disabled:opacity-60"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-600 hover:underline text-center w-full"
        >
          Nevermind, maybe later
        </button>
      </div>
    </div>,
    document.body
  );
};

export default SignUpModal;

