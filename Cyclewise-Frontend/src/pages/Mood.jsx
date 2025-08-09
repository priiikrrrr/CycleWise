import { useEffect, useState } from "react";
import MoodStack from "@/components/ui/MoodStack";

const MoodPage = () => {
  const [mousePosition, setMousePosition] = useState({x:0, y :0});
    const [mouseMoved, setMouseMoved] = useState(false);
  useEffect(() =>{
    const handleMove = (e) =>{
       if (!mouseMoved) setMouseMoved(true);
      setMousePosition({x:e.clientX, y:e.clientY});
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  },[mouseMoved]);
  return (
    <div className="relative group min-h-screen overflow-hidden">
      {!mouseMoved && (
        <div className="absolute top-10 w-full text-center z-20">
          <h1 className="text-white text-3xl font-semibold animate-pulse">Hover over me</h1>
        </div>
      )}
    <div className="min-h-screen flex items-center justify-center relative z-0">
      <MoodStack />
    </div>
          <div
        className="pointer-events-none absolute inset-0 z-10 transition-all duration-75"
        style={{
          background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px,  rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.9) 100%)`,
        }}
      />
  </div>  
  );
};

export default MoodPage;
