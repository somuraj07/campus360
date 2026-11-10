import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FormMessageProps {
  type: "error" | "success";
  message: string;
}

export default function FormMessage({ type, message }: FormMessageProps) {
  const isError = type === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
        isError
          ? "bg-red-500/20 border-red-500/30"
          : "bg-primary/20 border-primary/30"
      }`}
    >
      {isError ? (
        <AlertCircle size={18} className="text-red-700 dark:text-red-400 flex-shrink-0" />
      ) : (
        <CheckCircle size={18} className="text-primary flex-shrink-0" />
      )}
      <span className={`text-sm ${isError ? "text-red-700 dark:text-red-300" : "text-primary"}`}>
        {message}
      </span>
    </motion.div>
  );
}
