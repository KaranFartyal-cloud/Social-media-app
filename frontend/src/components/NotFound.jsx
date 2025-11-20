import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-9xl font-bold text-gray-900 dark:text-white"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-xl"
      >
        The page you are looking for doesn’t exist or has been moved.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Go Home
        </Link>
      </motion.div>
    </div>
  );
}
