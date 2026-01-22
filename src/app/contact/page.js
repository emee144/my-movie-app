"use client";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl w-full bg-gray-800 p-12 rounded-3xl shadow-xl"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl font-extrabold text-center text-yellow-400 mb-8"
        >
          Contact Us
        </motion.h1>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xl text-gray-300">
            Have any questions? Reach out to us, and we’ll respond as soon as possible.
          </p>
          <p className="mt-4 text-lg">
            📧 Email:{" "}
            <a
              href="mailto:support@example.com"
              className="text-yellow-400 font-semibold hover:underline"
            >
              support@example.com
            </a>
          </p>
          <p className="text-lg">
            📞 Phone:{" "}
            <span className="text-yellow-400 font-semibold">+123 456 7890</span>
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gray-700 p-8 rounded-2xl shadow-md max-w-4xl mx-auto"
        >
          <div className="mb-6">
            <label className="block text-yellow-300 font-semibold mb-2 text-lg">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-yellow-300 font-semibold mb-2 text-lg">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-yellow-300 font-semibold mb-2 text-lg">Message</label>
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 font-semibold py-4 rounded-lg text-xl hover:bg-yellow-500 transition duration-300 cursor-pointer"
          >
            Send Message
          </button>
        </motion.form>
      </motion.div>

      <div className="h-20"></div>
    </div>
  );
}