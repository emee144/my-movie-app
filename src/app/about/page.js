"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl w-full bg-gray-800 p-8 rounded-2xl shadow-lg" // Increased width to max-w-5xl
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold text-center text-yellow-400 mb-6"
        >
          About Our Movie Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-300 mb-6 text-center"
        >
          Welcome to our movie platform! We provide an exciting opportunity for users to 
          watch movies and earn money. Simply register, log in, and start streaming movies 
          to accumulate earnings.
        </motion.p>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-yellow-300 mb-3">How It Works</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-400">
            <li>✅ Register and create an account.</li>
            <li>🎬 Log in and browse our movie collection.</li>
            <li>💰 Watch movies and earn rewards for each view.</li>
            <li>📩 Request withdrawals through our manual payment process.</li>
          </ul>
        </motion.div>

        {/* Payment System Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-yellow-300 mb-3">Payment System</h2>
          <p className="text-lg text-gray-300">
            Each movie has a fixed earning amount (e.g., <span className="text-yellow-400 font-semibold">1000 Naira per movie</span>). 
            Payments are processed manually, and users can request withdrawals based on their accumulated earnings.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-yellow-300 mb-3">Contact Us</h2>
          <p className="text-lg text-gray-300">
            Need help? Reach out to our support team at 
            <a href="mailto:support@example.com" className="text-yellow-400 font-semibold hover:underline ml-1">support@example.com</a>.
          </p>
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/signup">
            <button className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg text-lg hover:bg-yellow-500 transition duration-300 cursor-pointer">
              Get Started
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Spacer to push footer down */}
      <div className="h-16"></div>
    </div>
  );
}