import React, { useState, useEffect, useMemo } from 'react';
import MoodCard from '@/components/ui/MoodCard';
import CalendarView from '@/components/ui/CalendarView';
import axios from 'axios';

const moodOptions = [
  { mood: "Happy", emoji: "😄" }, { mood: "Relaxed", emoji: "😌" },
  { mood: "Sad", emoji: "😢" }, { mood: "Angry", emoji: "😠" },
  { mood: "Excited", emoji: "🤩" }, { mood: "Grateful", emoji: "🙏" },
  { mood: "Loved", emoji: "❤️" }, { mood: "Lonely", emoji: "😔" },
  { mood: "Anxious", emoji: "😰" }, { mood: "Energetic", emoji: "⚡" },
  { mood: "Chill", emoji: "🧊" }, { mood: "Sleepy", emoji: "😴" },
  { mood: "Confident", emoji: "😎" }, { mood: "Focused", emoji: "🎯" },
  { mood: "Overwhelmed", emoji: "🥵" }, { mood: "Silly", emoji: "😜" },
  { mood: "Hopeful", emoji: "🌈" }, { mood: "Inspired", emoji: "✨" },
  { mood: "Frustrated", emoji: "😤" }, { mood: "Nostalgic", emoji: "📼" },
];

function Dashboard() {
  const [periodDates, setPeriodDates] = useState([]);
  const [fertileDates, setFertileDates] = useState([]);
  const [ovulationDates, setOvulationDates] = useState([]);
  const [savedPeriods, setSavedPeriods] = useState([]);
  const [latestMood, setLatestMood] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMood = async () => {
    try {
      const res = await fetch("http://localhost:3002/mood/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setLatestMood(result?.data?.data);
    } catch (error) {
      console.error("Error fetching latest mood:", error);
    }
  };

  const fetchCycles = async () => {
    try {
      const res = await fetch("http://localhost:3002/cycle/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      const all = result.data?.data || [];

      const periodDays = [], fertileDays = [], ovulationDays = [];

      all.forEach(({ periodStartDate, periodEndDate, predictionLogic }) => {
        // Period
        if (periodStartDate && periodEndDate) {
          let curr = new Date(periodStartDate);
          const end = new Date(periodEndDate);
          while (curr <= end) {
            periodDays.push(new Date(curr));
            curr.setDate(curr.getDate() + 1);
          }
        }

        // Fertility
        const fertileStart = predictionLogic?.fertilityWindow?.start;
        const fertileEnd = predictionLogic?.fertilityWindow?.end;
        if (fertileStart && fertileEnd) {
          let curr = new Date(fertileStart);
          const end = new Date(fertileEnd);
          while (curr <= end) {
            fertileDays.push(new Date(curr));
            curr.setDate(curr.getDate() + 1);
          }
        }

        // Ovulation
        const ovu = predictionLogic?.ovulationDay;
        if (ovu) ovulationDays.push(new Date(ovu));
      });

      setPeriodDates(periodDays);
      setFertileDates(fertileDays);
      setOvulationDates(ovulationDays);
    } catch (err) {
      console.error("Error fetching cycles:", err);
    }
  };

  const fetchPeriods = async () => {
    try {
      const res = await axios.get("http://localhost:3002/cycle/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched savedPeriods:", res.data?.data?.data);
      setSavedPeriods(res.data?.data?.data || []);
    } catch (err) {
      console.error("Error fetching saved periods:", err);
    }
  };

  useEffect(() => {
    fetchMood();
    fetchCycles();
    fetchPeriods();
  }, []);

  const mood = latestMood?.mood?.[0];
  const emoji = moodOptions.find((item) => item.mood === mood)?.emoji || "🙂";

  const markedDates = useMemo(() => {
    const dates = new Set();
    savedPeriods.forEach(({ periodStartDate, periodEndDate }) => {
      let curr = new Date(periodStartDate);
      const end = new Date(periodEndDate || periodStartDate);
      while (curr <= end) {
        dates.add(curr.toDateString());
        curr.setDate(curr.getDate() + 1);
      }
    });
    return dates;
  }, [savedPeriods]);

const handleAddPeriodDates = async (selectedRange) => {
  if (!selectedRange || selectedRange.length !== 2) return;

  const [start, end] = selectedRange;

const formatDate = (date) => {
  const corrected = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return corrected.toISOString().split("T")[0];
};

  const payload = {
    periodStartDate: formatDate(start),
    periodEndDate: formatDate(end),
    symptoms: [],
  };

  try {
    await axios.post("http://localhost:3002/cycle/create", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchCycles();     // refresh UI after saving
    await fetchPeriods();    // refresh any highlights
  } catch (err) {
    console.error("Error saving period:", err);
  }
};


  return (
    <div className="min-h-screen text-white pt-2 px-4 pb-4 space-y-6">
      <h1 className="text-3xl font-bold text-center drop-shadow-lg"
        style={{
          textShadow: "0 0 10px rgba(92, 103, 255, 0.5)",
          filter: "drop-shadow(0 0 15px rgba(0, 255, 170, 0.3))",
        }}>
        Your Dashboard ✨
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 w-full">
          <CalendarView
            periodDates={periodDates}
            fertileDates={fertileDates}
            ovulationDates={ovulationDates}
            onSave={handleAddPeriodDates}
          />
        </div>
        <div className="lg:w-1/3 w-full flex justify-center relative -translate-y-4">
          <MoodCard mood={mood} emoji={emoji} className="h-[300px] md:h-[350px]" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
