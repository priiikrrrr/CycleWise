import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FeedCard from '@/components/ui/FeedCard';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Textarea } from '@headlessui/react';
import { Droplet, CirclePlus, Trash } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GradientButton = ({ onClick, icon: Icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="relative inline-block p-[2px] rounded-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
  >
    <div className="bg-black/80 rounded-md px-4 py-2 flex items-center gap-2">
      <button onClick={onClick} className="text-white flex items-center gap-2">
        {Icon && <Icon size={20} />}
        <span>{label}</span>
      </button>
    </div>
  </motion.div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [myFeeds, setFeeds] = useState([]);
  const [bioText, setBioText] = useState('');
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetchUser();
    fetchMyFeeds();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:3002/user/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(res.data.data);
      setBioText(res.data.data.bio);
    } catch (error) {
      console.error('error fetching user', error);
    }
  };

  const fetchMyFeeds = async () => {
    try {
      const res = await axios.get('https://cyclewise.onrender.com/feed/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const feedsArray = res.data.data.data;
      setFeeds(Array.isArray(feedsArray) ? feedsArray : []);
    } catch (error) {
      console.error('error fetching feeds', error);
      setFeeds([]);
    }
  };

  const updateBio = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        'http://localhost:3002/user/update',
        { bio: bioText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchUser();
      toast.success('Bio updated!');
    } catch (error) {
      console.error('Failed to update bio', error);
    }
  };

  const createFeed = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3002/feed/create',
        { content: newPost },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNewPost('');
      fetchMyFeeds();
      toast.success('Posted!');
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  const deleteFeed = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/feed/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchMyFeeds();
      toast.success('Deleted!');
    } catch (err) {
      console.error('Failed to delete feed', err);
    }
  };

  if (!user) return <p className="justify-center text-white p-4">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <ToastContainer />

      {/* Profile Section */}
      <div className="mb-8 bg-black/30 border border-white/20 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-700 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-shadow-pink-800">{user.username}</h2>
        </div>

        <Textarea
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
          className="w-full bg-transparent border mt-2 p-2 rounded-md"
        />
        <GradientButton onClick={updateBio} icon={Droplet} label="Update Bio" />
      </div>

      {/* Post Section */}
      <div className="mb-6">
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 bg-pink-200 text-black rounded-xl shadow"
        />
        <GradientButton onClick={createFeed} icon={CirclePlus} label="Post" />
      </div>

      {/* Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myFeeds.map((post) => (
          <motion.div
            key={post._id}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <FeedCard post={post} />
            <button
              onClick={() => deleteFeed(post._id)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Profile;