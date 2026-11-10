import { motion } from "framer-motion";

interface ButtonProps {
  title: string;
  loading?: boolean;
  onClick?: () => void;
}

export default function SecondaryButton({ title, loading, onClick }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      disabled={loading}
      onClick={onClick}
      type="button"
      className="w-full rounded-lg border border-line-strong bg-surface px-4 py-2.5 font-medium text-fg transition-colors hover:bg-elev-2 disabled:opacity-60"
    >
      {loading ? "Loading..." : title}
    </motion.button>
  );
}
