import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./ui/Navbar";
import SignInModal from "./ui/SignInModal";
import {
  // eslint-disable-next-line no-unused-vars
  motion,
  useMotionValue,
  useMotionTemplate,
  animate,
} from "framer-motion";


const COLORS_TOP = [
  "#2A0C1C", "#5E1224", "#A6192E", "#D44B64", "#F28DA8",
  "#F7D6C5", "#F6E7DC", "#D9A5C7", "#B97DB9", "#5D2D88",
  "#22052D", "#5D2D88", "#B97DB9", "#D9A5C7", "#F6E7DC",
  "#F7D6C5", "#F28DA8", "#D44B64", "#A6192E", "#5E1224",
  "#2A0C1C"
];

const Layout = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 30,
      repeat: Infinity,
      repeatType: "loop",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const borderColor = useMotionTemplate`${color}`;
  const boxShadow = useMotionTemplate`0px 0px 12px ${color}`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative min-h-screen overflow-hidden text-white px-4 py-8"
    >
      <motion.div
        style={{ borderColor, boxShadow }}
        className="absolute inset-0 z-0 pointer-events-none border-2 rounded-xl"
      />

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full px-6 py-4 z-20">
        <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
        <Navbar onSignInClick={() => setShowSignIn(true)} />
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-20">
        <Outlet />
      </div>
    </motion.section>
  );
};

export default Layout;

