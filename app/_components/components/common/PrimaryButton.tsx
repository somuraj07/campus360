import { motion } from "framer-motion";

interface ButtonProps {
  title: string;
  loading?: boolean;
  onClick?:()=>void
}

export default function PrimaryButton({ title, loading = false, onClick }: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      disabled={loading}
      type="submit"
      className="w-full rounded-lg bg-primary py-3 font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {title}
    </motion.button>
  );
}