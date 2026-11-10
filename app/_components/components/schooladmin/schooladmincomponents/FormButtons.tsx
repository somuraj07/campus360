import { motion } from "framer-motion";
import { Loader } from "lucide-react";

interface FormButtonsProps {
  submitLabel: string;
  onCancel: () => void;
  loading?: boolean;
}

export default function FormButtons({
  submitLabel,
  onCancel,
  loading = false,
}: FormButtonsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ x: 4 }}
        className="flex-1 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold
          hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed
          transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </motion.button>
      <motion.button
        type="button"
        onClick={onCancel}
        disabled={loading}
        whileHover={{ x: -4 }}
        className="flex-1 px-6 py-3 rounded-xl bg-elev-2 border border-line-strong
          text-fg font-semibold hover:bg-elev-3 disabled:opacity-50
          transition"
      >
        Cancel
      </motion.button>
    </div>
  );
}
