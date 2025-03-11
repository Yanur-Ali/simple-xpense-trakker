
import { MotionConfig } from "framer-motion";

interface FramerMotionProviderProps {
  children: React.ReactNode;
}

export function FramerMotionProvider({ children }: FramerMotionProviderProps) {
  return (
    <MotionConfig 
      reducedMotion="user" 
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      {children}
    </MotionConfig>
  );
}
