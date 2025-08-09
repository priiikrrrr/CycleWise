import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Heart, MessageCircle, Send } from "lucide-react";

const FeedCard = ({ post }) => {
  // declarations

  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = decodedToken?.sub || "guest";

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [reactions, setReactions] = useState(post?.reactions || {});
  const [comments, setComments] = useState(post?.comments || []);
  const [likes, setLikes] = useState(post?.likes || []);
  const [activeEmoji, setActiveEmoji] = useState(null);

  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false);
  const dropdownRef = useRef();

  const commonEmojis = ["❤️", "🔥", "🥰"];
  const extraEmojis = ["👍", "😂", "😮", "👏", "😭", "🎉"];
  console.log("Post ID:", post?._id);
  console.log("Post reactions on first render:", post?.reactions);
  console.log("User ID:", userId);

  // drop-down-effect
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowEmojiDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

//   useEffect(() => {
//     // Only update reactions if it's actually different
//     setReactions((prev) => {
//       const prevStr = JSON.stringify(prev);
//       const nextStr = JSON.stringify(post?.reactions || {});
//       return prevStr !== nextStr ? post?.reactions || {} : prev;
//     });

//     setComments(post?.comments || []);
//     setLikes(post?.likes || []);
//   }, [post]);


// useEffect(() => {
//   if (!post?.reactions || !userId) return;

//   setReactions(post.reactions);

//   const userReactionEntry = Object.entries(post.reactions).find(
//     ([_, ids]) => ids.includes(userId)
//   );

//   const emoji = userReactionEntry?.[0] || null;
//   setActiveEmoji(emoji);
//   console.log("Initial active emoji:", emoji);
// }, [post?._id, post?.reactions, userId]);

useEffect(() => {
  if (!post || !userId || !post.reactions) return;

  const entry = Object.entries(post.reactions).find(
    ([_, ids]) => ids.includes(userId)
  );

  const emoji = entry?.[0] || null;
  console.log("Updated active emoji:", emoji);
  setActiveEmoji(emoji);
}, [post?._id, userId, post?.reactions]);



  //reaction compo
  const handleReaction = async (emoji) => {
    let nextActiveEmoji = emoji;

    setReactions((prev) => {
      const newReactions = { ...prev };

      // Remove existing reaction by user
      for (const [emo, ids] of Object.entries(newReactions)) {
        if (ids.includes(userId)) {
          newReactions[emo] = ids.filter((id) => id !== userId);
          if (newReactions[emo].length === 0) delete newReactions[emo];
          if (emo === emoji) nextActiveEmoji = null;
        }
      }
      if (nextActiveEmoji) {
        newReactions[nextActiveEmoji] = [...(newReactions[nextActiveEmoji] || []), userId];
      }
      return newReactions;
    });
    setActiveEmoji(nextActiveEmoji);
    setShowEmojiDropdown(false);

    try {
      const res = await axios.post(
        `http://localhost:3002/feed/react/${post._id}`,
        { emoji }
      );

      const { message, data } = res.data.data;
      setReactions(data);
      toast.success(message);
    } catch (err) {
      console.error("Reaction failed", err.response?.data || err.message);
      toast.error("Reaction failed!");
    }
  };


  //like compo
  const handleLike = async () => {
    if (!token) return toast.error("Please log in to like");

    try {
      const res = await axios.post(
        `http://localhost:3002/feed/like/${post._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data: updatedLikes, message } = res.data.data;
      setLikes(updatedLikes);
      toast.success(message);
    } catch {
      toast.error("Like failed");
    }
  };


  //comment compo
  const handleComment = async () => {
    if (!token) return toast.error("Please log in to comment");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:3002/feed/comment/${post._id}`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = res.data.data.data;
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    }
  };


  //img compo
  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-visible z-10 rounded-xl bg-black/30 border border-pink-600/80 backdrop-blur-xl p-6 shadow-[0_0_0_1.5px_rgba(255,105,180,0.3)] transition-all duration-300 flex flex-col justify-between min-h-[250px]"
    >
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-rose-500/10 to-pink-400/10 blur-lg opacity-10 group-hover:opacity-20 transition-all duration-300 z-[-1]" />

      <p className="text-white text-lg font-semibold mb-2 break-words whitespace-pre-wrap">
        {post.content.split("\n").map((line, idx) => {
          if (line.startsWith("http") && isImageUrl(line)) {
            return (
              <img
                key={idx}
                src={line}
                alt="feed"
                className="w-full h-48 object-cover rounded-xl my-2"
              />
            );
          }
          return (
            <span key={idx}>
              {line}
              <br />
            </span>
          );
        })}
      </p>

      {/* Emoji Reactions */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowEmojiDropdown((prev) => !prev)}
          className="text-2xl transition hover:scale-110 text-pink-500"
        >
          {activeEmoji || "😊"}
        </button>

        <AnimatePresence>
          {showEmojiDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 z-[100] left-0 bg-white dark:bg-transparent border border-gray-300 dark:border-zinc-700 rounded-xl p-2 shadow-xl flex gap-2"
            >
              {[...commonEmojis, ...extraEmojis].map((emoji) => {
                const count = reactions[emoji]?.length || 0;
                const userHasReacted = reactions[emoji]?.includes(userId);

                return (
                  <motion.button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    whileTap={{ scale: 1.3 }}
                    whileHover={{ scale: 1.15 }}
                    className={`text-xl p-1 rounded-full flex flex-col items-center transition ${
                      userHasReacted
                        ? "bg-pink-200 text-red-500"
                        : "text-gray-500 hover:bg-rose-100"
                    }`}
                  >
                    <span>{emoji}</span>
                    {count > 0 && (
                      <span className="text-xs text-pink-400 mt-1">{count}</span>
                    )}
                  </motion.button>

                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* like Comments Icon */}
      <div className="flex gap-3 items-center mt-4">
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 1.2 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 transition"
        >
          <Heart
            size={18}
            className={likes.includes(userId) ? "fill-pink-500" : "text-pink-500"}
          />
          {likes.length > 0 && <span>{likes.length}</span>}
        </motion.button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1 cursor-pointer text-sm text-pink-500 hover:text-pink-600 transition"
        >
          <MessageCircle size={18} />
          <span>Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 space-y-2 relative z-10">
          {comments.map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-md text-white text-sm px-3 py-2 rounded-xl border border-pink-200"
            >
              <span className="font-bold">{c.userName || "Anonymous"}:</span>{" "}
              {c.comment}
            </motion.div>
          ))}

          <div className="flex items-center mt-3 gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="text-neutral-900 bg-pink-200 hover:bg-pink-300 px-4 py-1 rounded-xl shadow-sm transition border border-black"
              placeholder="Write a comment..."
            />
            <motion.button
              onClick={handleComment}
              whileTap={{ scale: 0.95, rotate: -2 }}
              whileHover={{ scale: 1.05 }}
              className="text-white bg-pink-400 hover:bg-pink-500 px-3 py-1 rounded-full shadow-sm transition"
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FeedCard;

    
    
    // {/* 
    //   // {/* Toggle Comments */}
    //   // <button
    //   //   onClick={() => setShowComments(!showComments)}
    //   //   className="text-sm mt-3 text-purple-300 hover:text-purple-400"
    //   // >
    //   //   {showComments ? "Hide Comments" : "Comments"}
    //   // </button> */}
    //   {/* <p className="text-white text-lg font-semibold mb-2 break-words whitespace-pre-wrap">
    //   {post.content}
    //   </p>
    //   {post.imageUrl && (
    //     <img
    //       src={post.imageUrl}
    //       alt="post"
    //       className="w-full h-48 object-cover rounded-xl mt-2"
    //     />
    //   )} */}