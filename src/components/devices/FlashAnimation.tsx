import { Box } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);

//* フラッシュアニメーション
export const FlashAnimation = (args: {
  flash: boolean;
  setFlash: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { flash, setFlash } = args;

  return (
    <AnimatePresence>
      {flash && (
        <MotionBox
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bg="white"
          zIndex={10}
          pointerEvents="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.9, 0] }} // 一瞬光って消える
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onAnimationComplete={() => setFlash(false)} // アニメ完了後に消す
        />
      )}
    </AnimatePresence>
  );
};
