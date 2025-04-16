import React, { useState } from "react";
import { ThemeProvider } from "next-themes";
import ReactMarkdown from "react-markdown";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import Label from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import DatePicker from "../components/DatePicker";
import RippleButton from "../components/ui/ripple-button";
import { callConsoleGroqApi } from "../api";
import SparklesText from "../components/ui/sparkles-text";
import { motion } from 'framer-motion';
import { Rocket, Brain, Calendar, Target } from 'lucide-react';

const App: React.FC = () => {
  // ... (keeping existing state and functions)
  const [endGoal, setEndGoal] = useState("");
  const [learningSpeed, setLearningSpeed] = useState("");
  const [learningLevel, setLearningLevel] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [roadmap, setRoadmap] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!endGoal) newErrors.endGoal = "Please select an end goal";
    if (!learningSpeed) newErrors.learningSpeed = "Please select your learning speed";
    if (!learningLevel) newErrors.learningLevel = "Please select your learning level";
    if (!startDate) newErrors.startDate = "Please select a start date";
    if (!endDate) newErrors.endDate = "Please select an end date";
    if (startDate && endDate && startDate > endDate) newErrors.dateRange = "End date must be after start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const systemMessage = "Generate a personalized learning roadmap.";
      const prompt = `
        I am a ${learningSpeed} aiming to prepare for ${endGoal} at a ${learningLevel} level. My preparation timeline is from ${startDate} to ${endDate}. Ensure the references and YouTube channel links are correct and legitimate, and provide clickable hyperlinks so users can directly access them.

        Please keep in mind the following:

        JEE has three subjects: Physics, Chemistry, and Mathematics.
        GATE has 7 subjects.
        UPSC has 3 subjects.
        CA has 2 subjects.
        Provide the following information:
        
        Goal: A one-line description of the end goal.
        
        Daily Study Plan:
        
        Include a day-wise and topic-wise study plan.
        Provide clickable references for each topic.
        Present the study plan in a bullet point format.
        Example structure 
        
        Day	Topic	Reference
        Day 1-2	Physics: Kinematics	Kinematics - Khan Academy
        Day 3-4	Physics: Dynamics	Dynamics - BYJU'S
        ...	...	...
        YouTube Channels:
        
        Provide a list of YouTube channels for JEE preparation.Also use the youtube api to get the correct links for the channels ensure the links are correct and refer to the correct channel.Only list and provide clickable links which are correct and ensure you double-check them.
        Separate the channels into English and Hindi categories.
        English:
        
        Hindi:
        
        Books List:
        
        Include a list of recommended books for JEE preparation, separated by subject.
        Physics:
        
        
        Chemistry:
        
        
        Mathematics:
        
        
        Websites:
        
        Provide a list of helpful websites for JEE preparation.
        
        
        
        Additional Tips:
        
        Please ensure that the references and resources are reliable and up-to-date. The study plan should be detailed, and each element should be accessible with the provided hyperlinks.
      `;

      const response = await callConsoleGroqApi(prompt, systemMessage);
      setRoadmap(response); // Update roadmap with API response
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setRoadmap("Failed to generate roadmap. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-purple-600/10">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#68468012_1px,transparent_1px),linear-gradient(to_bottom,#68468012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#9333ea20_0%,transparent_100%)]" />

        <div className="relative container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <SparklesText>Get Your Personalized Roadmap</SparklesText>
            <p className="mt-4 text-lg text-muted-foreground">
              Create a customized learning journey tailored to your goals and pace
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto backdrop-blur-xl bg-background/60 rounded-2xl shadow-2xl p-8 border border-purple-200/20"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* End Goal Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-purple-500" />
                  <Label htmlFor="end-goal" className="text-xl font-semibold">
                    What is your end goal?
                  </Label>
                </div>
                <Select value={endGoal} onValueChange={setEndGoal}>
                  <SelectTrigger id="end-goal" className="w-full h-12 text-lg border-purple-200/20 focus:ring-purple-500/20">
                    <SelectValue placeholder="Select your end goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {["UPSC", "JEE", "NEET", "GATE", "CA"].map((goal) => (
                      <SelectItem key={goal} value={goal} className="text-lg">
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.endGoal && (
                  <p className="text-red-400 text-sm mt-2">{errors.endGoal}</p>
                )}
              </motion.div>

              {/* Learning Speed Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Rocket className="w-6 h-6 text-purple-500" />
                  <Label className="text-xl font-semibold">
                    How do you describe your learning speed?
                  </Label>
                </div>
                <RadioGroup
                  value={learningSpeed}
                  onValueChange={setLearningSpeed}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {["Fast learner", "Medium learner", "Slow learner"].map((speed) => (
                    <div key={speed} className="relative">
                      <RadioGroupItem value={speed} id={speed} className="peer sr-only" />
                      <Label
                        htmlFor={speed}
                        className="flex p-4 bg-card/50 rounded-xl cursor-pointer border-2 border-transparent 
                                 peer-checked:border-purple-500 peer-checked:bg-purple-500/10 
                                 hover:bg-purple-50/10 transition-all"
                      >
                        {speed}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.learningSpeed && (
                  <p className="text-red-400 text-sm">{errors.learningSpeed}</p>
                )}
              </motion.div>

              {/* Learning Level Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-500" />
                  <Label className="text-xl font-semibold">
                    At what level do you want to learn?
                  </Label>
                </div>
                <RadioGroup
                  value={learningLevel}
                  onValueChange={setLearningLevel}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <div key={level} className="relative">
                      <RadioGroupItem value={level} id={level} className="peer sr-only" />
                      <Label
                        htmlFor={level}
                        className="flex p-4 bg-card/50 rounded-xl cursor-pointer border-2 border-transparent 
                                 peer-checked:border-purple-500 peer-checked:bg-purple-500/10 
                                 hover:bg-purple-50/10 transition-all"
                      >
                        {level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.learningLevel && (
                  <p className="text-red-400 text-sm">{errors.learningLevel}</p>
                )}
              </motion.div>

              {/* Timeline Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-6 h-6 text-purple-500" />
                  <Label className="text-xl font-semibold">
                    Select your preparation timeline:
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-lg">Start Date</Label>
                    <DatePicker selected={startDate} onSelect={setStartDate} />
                    {errors.startDate && (
                      <p className="text-red-400 text-sm">{errors.startDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg">End Date</Label>
                    <DatePicker selected={endDate} onSelect={setEndDate} />
                    {errors.endDate && (
                      <p className="text-red-400 text-sm">{errors.endDate}</p>
                    )}
                  </div>
                </div>
                {errors.dateRange && (
                  <p className="text-red-400 text-sm">{errors.dateRange}</p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-4"
              >
                <RippleButton
                  type="submit"
                  disabled={isLoading}
                  className="w-auto py-4 px-10 text-lg font-medium rounded-full bg-gradient-to-r from-purple-600 to-purple-500 
                           hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl 
                           disabled:from-purple-600/50 disabled:to-purple-500/50"
                  rippleColor="rgba(255, 255, 255, 0.3)"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Creating Your Roadmap...</span>
                    </div>
                  ) : (
                    "Generate Your Roadmap"
                  )}
                </RippleButton>
              </motion.div>
            </form>
          </motion.div>

          {/* Roadmap Display */}
          {roadmap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto mt-12 backdrop-blur-xl bg-background/60 rounded-2xl shadow-2xl p-8 border border-purple-200/20"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                Your Learning Roadmap
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-purple-500">
                <ReactMarkdown>{roadmap}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ThemeProvider>

    
  );
};

export default App;