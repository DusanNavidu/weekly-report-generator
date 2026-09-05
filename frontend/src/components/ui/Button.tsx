import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const MotionButton = motion.button as unknown as React.ComponentType<
  ButtonProps & {
    whileHover?: object;
    whileTap?: object;
  }
>;

export default function Button({ children, isLoading, className = "", ...props }: ButtonProps) {
  return (
    <MotionButton
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || props.disabled}
      className={`w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading && (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </MotionButton>
  );
}