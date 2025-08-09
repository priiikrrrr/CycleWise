import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import {
  // eslint-disable-next-line no-unused-vars
  motion,
  useMotionValue,
  useMotionTemplate,
  animate,
  AnimatePresence,
} from "framer-motion";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import AuthStore from "@/store/AuthStore";

  

const taglines = [
  "Fresh out the dev oven 🍪",
  "Barely born, already wise 🦉",
  "Running on vibes and version 0.1 💻✨",
  "Mood swings? We track 'em 🩷",
  "Soft launch, big feels 💖",
];

// Palindromic color array for smooth flow
const COLORS_TOP = [
  "#2A0C1C", "#5E1224", "#A6192E", "#D44B64", "#F28DA8",
  "#F7D6C5", "#F6E7DC", "#D9A5C7", "#B97DB9", "#5D2D88",
  "#22052D", "#5D2D88", "#B97DB9", "#D9A5C7", "#F6E7DC",
  "#F7D6C5", "#F28DA8", "#D44B64", "#A6192E", "#5E1224",
  "#2A0C1C"
];

export const AuroraHero = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const isAuthenticated = AuthStore((s)=> s.isAuthenticated);
  const color = useMotionValue(COLORS_TOP[0]);
  
  // Animate background color smoothly
  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 30,
      repeat: Infinity,
      repeatType: "loop",
    });
  },[]);
  
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const borderColor = useMotionTemplate`${color}`;
  const boxShadow = useMotionTemplate`0px 0px 12px ${color}`;
  
  return (
    <motion.section
    style={{
      backgroundImage,
    }}
    className="relative grid min-h-screen place-content-center overflow-hidden px-4 py-24 text-gray-200"
    >
      {/* Animated border */}
      <motion.div
        style={{ borderColor, boxShadow }}
        whileHover={{ boxShadow: "0px 0px 20px 4px currentColor" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute inset-0 z-0 pointer-events-none border-2 rounded-xl"
        />

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full px-6 py-4 z-20">

        <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
        <Navbar onSignInClick={() => setShowSignIn(true)} />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Tagline */}
        <div className="h-6 mb-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm font-medium text-gray-100"
            >
              {taglines[index]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Title */}
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl md:text-7xl">
          Your Cycle. Your Mood. Your Space.
        </h1>

        {/* Subtext */}
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg">
          Track your period, log your emotions, and connect with a safe, supportive community — all in one beautiful app.
        </p>

        {/* CTA Button */}
      {!isAuthenticated && (
        <>
          <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />

          <motion.button
            onClick={() => setShowSignUp(true)}
            style={{
              border: useMotionTemplate`1px solid ${color}`,
              boxShadow,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            Start your journey
            <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>
        </>
      )}
      </div>
    </motion.section>
  );
};

export default AuroraHero;

