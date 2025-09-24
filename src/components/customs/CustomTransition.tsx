import { motion } from "framer-motion";

export const CustomTransition = (args: { children: React.ReactNode }) => {
  const { children } = args;
  return (
    <motion.div
      animate={{
        x: 0,
        opacity: 1,
      }}
      initial={{
        x: 100,
        opacity: 0,
      }}
      exit={{
        x: -100,
        opacity: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        minHeight: "100%",
      }}
    >
      {children}
    </motion.div>
  );
};
