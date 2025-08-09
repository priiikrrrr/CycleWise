import { useEffect, useState } from "react";
import axios from "axios";
import FeedCard from "@/components/ui/FeedCard";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .get("http://localhost:3002/feed/all", { headers })
      .then((res) => {
        setPosts(Array.isArray(res.data.data) ? res.data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Feed fetch failed", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white text-center mt-10">Loading feed...</div>;
  if (posts.length === 0) return <div className="text-white text-center mt-10">No feeds yet.</div>;

return (
  <div className="max-w-7xl mx-auto px-6 py-10 overflow-visible">
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 lg:p-8"
    >
      {posts.map((post, i) => {
        const randomRotation = -4 + (i % 3) * 4;
        return (
          <motion.div
            key={i}
            variants={{
              hidden: {
                opacity: 0,
                y: 60,
                rotateZ: randomRotation,
                scale: 0.9,
              },
              visible: {
                opacity: 1,
                y: 0,
                rotateZ: 0,
                scale: 1,
              },
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 14,
            }}
            whileHover={{
              scale: 1.03,
              rotateZ: 0.5,
              boxShadow: "0 0 18px rgba(255, 0, 128, 0.2)",
            }}
            className="break-inside-avoid"
          >
            <FeedCard post={post} />
          </motion.div>
        );
      })}
    </motion.div>
  </div>
);
}



//   {posts.map((post) => (
// <FeedCard key={post._id} post={post} />
// ))}