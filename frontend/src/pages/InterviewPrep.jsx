import React from "react";
import SparklesText from "../components/ui/sparkles-text";
import { motion } from "framer-motion";

const InterviewPrep = () => {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-200 to-purple-400 flex justify-center items-center">
      {/* Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, purple 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.15,
        }}
      ></div>

      {/* Main Content Wrapper */}
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Change the text color to white */}
          <SparklesText>Master Your Exam With PrepWise</SparklesText>
        </motion.div>

        {/* Glass Effect Container */}
        <div className="relative w-11/12 max-w-4xl h-5/6 backdrop-blur-sm bg-white/10 rounded-xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Main Content */}
          <div className="w-full h-full">
            <iframe
              src="https://vaishnal16-streamlit-app-mock-ltmy6u.streamlit.app/?embedded=true"
              width="100%"
              height="100%"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full filter blur-3xl"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full filter blur-3xl"></div>
    </div>
  );
};

export default InterviewPrep;
