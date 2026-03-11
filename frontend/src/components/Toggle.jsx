import { motion } from "framer-motion";

const Toggle = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F1114] ${
        enabled ? "bg-primary" : "bg-gray-600"
      }`}
    >
      <span className="sr-only">Enable notification</span>

      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default Toggle;
