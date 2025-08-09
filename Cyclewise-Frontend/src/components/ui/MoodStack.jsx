import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { useMotionValue } from "framer-motion";
import MoodCard from "./MoodCard";
import confetti from "canvas-confetti";

const moodOptions = [
  { mood: "Happy", emoji: "😄" },
  { mood: "Relaxed", emoji: "😌" },
  { mood: "Sad", emoji: "😢" },
  { mood: "Angry", emoji: "😠" },
  { mood: "Excited", emoji: "🤩" },
  { mood: "Grateful", emoji: "🙏" },
  { mood: "Loved", emoji: "❤️" },
  { mood: "Lonely", emoji: "😔" },
  { mood: "Anxious", emoji: "😰" },
  { mood: "Energetic", emoji: "⚡" },
  { mood: "Chill", emoji: "🧊" },
  { mood: "Sleepy", emoji: "😴" },
  { mood: "Confident", emoji: "😎" },
  { mood: "Focused", emoji: "🎯" },
  { mood: "Overwhelmed", emoji: "🥵" },
  { mood: "Silly", emoji: "😜" },
  { mood: "Hopeful", emoji: "🌈" },
  { mood: "Inspired", emoji: "✨" },
  { mood: "Frustrated", emoji: "😤" },
  { mood: "Nostalgic", emoji: "📼" },
];

const moodStyles = {
  Happy: "text-yellow-400",
  Relaxed: "text-green-300",
  Sad: "text-blue-400",
  Angry: "text-red-500",
  Excited: "text-pink-400",
  Grateful: "text-orange-300",
  Loved: "text-rose-400",
  Lonely: "text-gray-400",
  Anxious: "text-indigo-400",
  Energetic: "text-amber-400",
  Chill: "text-cyan-300",
  Sleepy: "text-purple-300",
  Confident: "text-emerald-400",
  Focused: "text-teal-300",
  Overwhelmed: "text-rose-500",
  Silly: "text-pink-300",
  Hopeful: "text-sky-300",
  Inspired: "text-fuchsia-400",
  Frustrated: "text-orange-500",
  Nostalgic: "text-stone-400",
};

const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());
const MoodStack = () => {
  const [stack, setStack] = useState(()=> shuffleArray(moodOptions));
  const [moodOfTheDay, setMoodOfTheDay] = useState(
    () => localStorage.getItem("moodOfTheDay") || null
  );

  const removeTopCard = async(selectedMood) => {
    setMoodOfTheDay(selectedMood);
    localStorage.setItem("moodOfTheDay", selectedMood);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

    console.log("Logging mood:", selectedMood);
    console.log("Payload:", JSON.stringify({ mood: selectedMood, note: "" }));
      try {
    const token = localStorage.getItem("token"); // or use auth context
    await fetch("http://localhost:3002/mood/logMood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({ 
        mood: selectedMood,
        note: "",
      }),
    });
  } catch (error) {
    console.error("Failed to save mood to server:", error);
  }
    setStack((prev) => prev.slice(1));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] align-middle">
      <div className="text-white text-2xl font-semibold mb-6 flex flex-col items-center gap-1">
        <span className="text-pink-400 animate-pulse">Today’s Vibe Is... </span>  
        <span
          className={`${
            moodStyles[moodOfTheDay] || "text-white"
          } text-4xl font-bold tracking-wider text-shadow-glow`}
        >
          {moodOfTheDay}
        </span>
      </div>
      <div className="relative w-[32rem] h-[32rem]">
        {stack.slice(0, 5).map((mood, i) => {
          const isTop = i === 0;
          const zIndex = stack.length - i;
          return (
            <MoodCard
              key={mood.mood}
              mood={mood.mood}
              emoji={mood.emoji}
              drag={isTop ? "x" : false}
              onDragEnd={(e, info) => {
                if (isTop && Math.abs(info.offset.x) > 100) {
                  removeTopCard(mood.mood);
                }
              }}
              style={{
                zIndex,
                scale: isTop ? 1 : 1 - i * 0.03,
                y: i * 10,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MoodStack;

