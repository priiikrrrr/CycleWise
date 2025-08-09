// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Card from "./Card";

const MoodCard = ({ mood, emoji, style, drag, onDragEnd }) => {
  return (
    <motion.div
      className="absolute w-full h-full"
      drag={drag}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      style={style}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Card mood={mood} emoji={emoji} />
      </div>
    </motion.div>
  );
};

export default MoodCard;

