"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import "../index.css";
import Confetti from "../components/ui/confetti";
import { NeonGradientCard } from "../components/ui/neon-gradient-card";
import Particles from "../components/ui/particles";
import ScrollProgress from "../components/ui/scroll-progress";

import WordPullUp from "../components/ui/word-pull-up";
import { BentoGrid } from "../components/ui/bento-grid";
import Marquee from "../components/ui/marquee";
import Navbar from "../components/ui/navbar";
import TypingAnimation from "../components/ui/typing-animation";




const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "PrepWise transformed my interview preparation. The mock interviews were incredibly realistic!",
    img: "data:image/jpeg;base64,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"
  },
  {
    name: "Jill",
    username: "@jill",
    body: "The skill tracking feature helped me identify and improve my weak areas. Highly recommended!",
    img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQDxAQFRAQDxAVEBAWDQ8XFRYXFREXFhYSFRUYHSggGBolGxcWITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQFy0lHSUtLS0uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQIFAwQGBwj/xAA8EAACAQIDBAcGBAUEAwAAAAAAAQIDEQQFIRIxQVEGEyJhcYGRBzJCUqGxFCPR4WKCksHwFSRysjOiwv/EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/EACMRAQEAAgICAgMAAwAAAAAAAAABAhEDMRIhMkEiUWEEE0L/2gAMAwEAAhEDEQA/APX7CJAQsiIlYLARAYAIQwAQrDABWESACIJEjUzTMaWFpTrVpbMILXm+SXNsJbE5RiryaSXFs5zNenGCobSU3Umvhgr6+O48s6UdNq2Nq7KbhRT7NNN3fJytvZQY6vsq15X4rX7X0M7nfppMJ9vSZ+1OTdo4eKjZ6usm+5NJaHBZ1n+Lxc5Tq16lru0YTcIruSXD6lTgKMqino3ZaeN9NxodZJSte1nus/uV91bUi1wed43CS26OJxEbW7Mpzkn5Sumen9C/anCs40Mfs06ktI1lpTl3S+R9+7wPMYU9uF1TvJb+09V4foVlVxTs4tc4ta+K5jdnRZK+rotNaBY8Y9m3TqWHccLipuWGdlRqt60nwhJvfDv4eG72iMrq5rjltlljoAAyVSGA7ACQ0AwEMBhBDAYCAdh2AjYZIQEAGASiAxAJoRIAIiJWEAgGIBAMAIykkm3oktWeD+0rpW8ZXdOnJ/h6Lagvme5zt9u7xPRfal0h/C4XqoO1XEXiuahbty9NPM8Ar1Nrwfq9TLO7um2E1Ns2AhKU7RNrH05NqK3X4Wd/3MeV022kr6vcuPd4Ho2S9GXNKVSNlytvM8stNsOO33VH0Wyu0JO3acJa8VoUGIwE1Vbcd732f3PacDksYqySUVuVu7e+8WNyClKNnHwfHxK+VX8Mf28axEtiFk2pK+v77milxGIlOynvW49J6R9EpauGv2Z5zjcJKnJxkmrPVPh+xbHPamXHr2jSqOLvvXFdx7l7Juk/X0vwlWV6lKN6Um9ZU1ps97jdLwt3ng0W1p9S+6J5vLC4mlWi2urqKTXNbpLzV0W3q7Z63NPp1jIYetGpCM4u8ZxUovmmrpmQ3c4SABgAAMAAEMIA7AgAYAAAAwAgIbQBJCGACEMAEKxIQEQJCaAQMaMWImoxbe5K7A+fvaVmrxOOryb/AC6L6qH8vvPzlc46lFyld+S+hvdIMR1leoo+71k3fntSb+zLvoHlCr4hOS/LopSa5tvsr/ORzW6m3Zjju6dd0H6LxpwjWrxvUlrGL+FeHM72hBI1cNHRG7TRlG2TaijHUiZIimtLmjJWYuindNHC9LOjqrJyS/MS0a+JL+51uc57h6F1VqJP5VqygXSrB1Xs7ezfdtKy9eBlZd7jade3j+Lw7pzcZaa6Cg7NNc/8R2nTfLU4urCz4vz4+hxNKV+y/J8vE2xu4588fGvof2T5p+Iy+MW7uhN0/wCWycfo7eR2h4t7EczcMTWw0nZVqblFX+KDvp4xbfke0m+F9OfOewCAZZQACGADQkMIAwAAGCAAAAAiJjBhJCGIAEMAEIYAIAABHKe0rM/w+ArNN7U1sq3fv+h1jOK9rGHcsuqyXCVPTu21ovoVy6Wx7j59Wt298n92d30Qq1aeGm8NS26tSo7Sa7EYw7Kvzd09DiF7y7jt+juO/D4GM3pG9VrTlUkc2Tt44t10gzGhrWoXjzVN2+hfZL00pVmoNOE+TX2OGl0sr9X1ypvqXNQ23e0W+LaTbSXKPhcsOj9api4wqui47bexJqO9a2vx9ERZZN6Xlxt1t6b+JbWhy/SrOK6XVUPfkve5F5lrcqd5aNKz8UUjwM61WpK67Keynx1sU3U4ybc9gclpQ/Nxk1Obd5XlaN78eZcSxeH2dmEaWyuCjGxTZ1lGMVOVSjNdcpq9NW2nDe/zJJ2ei0jp4nNxwGZRUJyqKVRy7UbLaXi1o95bx3N7POTLXiv8dCElKEV2GtI8FzS5HnmPwjpTa8WvXcz1XK8tapOVX333WOH6VUUmrLXaa9ScL7V5ZubZfZ9jOrx+Ekt6rxj5S7DXpJn0nE+Wejc9nF0NbWr0768NtWf9z6lp7tTow+3HyGMANGRggGgAAAINACABgAAMAACAMAYSQAACAAAQAAAIYgApul+AeIwWIpRV5SpvZ8U00/oXJj61OThftJJtdzIqY+XMdgJ0q0qck1KL19T0rongoVMBShJJpqfDnNl57Rui8a86FeCSl1kYVN3uN6yXetTL+EhhnCFNJQcOzFKyVrL67/U5OSad/D+U3FfSyK0erSi6XyNaeNuZcYLBKlDgtNIxSSXkjZw7urmfFr8t25FYvlWvg9IS8zVwEkpvxNvBxTpb1u5lP1mzW0aa2kmuVyt+iTe13Xy6Etbb+9o0/wDTIQbdtebdy2hVTWvAr8xxCSdi+WtIx8t6U+aVlGL8DzjOY7dWK0u1fXcryWv3OuzvFaNc2c/meAlGVRyspOChGLnFTTtwje738CuH7X5NTUUuQZbKpjqCjBzTanOKeuxB3l4PT1Ppik00mt1lY819mfR53q4urFRnUSjCPGNNq705y5vkelQVlbkdfHPW3n8t96TAQzRkY0IAGAADRgABBgIYAAABETYNgEgQxAAAIAAAATAGAAc9mDlCrVqx3wnBx13rZjePnuOhKLHxblUS+e7+iM+Xptw/JX9IMWlDral9ZpRjfhtaLzX1ZgzulOc6bhHSEJSm/lWiX1MGaYV1cVhaUpXpxntuNvljffyvYvXOC/EyqO1OFFbUtdF2m346HPryvt1XLwk0psHiDflLahKPNNJ8u8oqc1e8d0kmn46mTFZzToRvUdjPq6a2eXTT/wBHxsVJQrqSlJu77LSfBJIWXdFZU5xnVxNaWqlKCktlu9+Wi8DEukk5O8adVxe61Op/ZGP/AFfFvtKhUtwvsr7snxbf6s/46rFVeK3lLjsQ2maeAxWKrSk5xhTilxacm/J2RPMZWjbiUyUxx8bpUq0qtNz93rIXvy2lodpj8GtuMtiDjLZe04xutlOS3+XocZDDuc4U4+9UmkvN7z0OthX1coN9qnulztqn5qxphvW1ObKbkZsqWziHFLR0PW01b0uy8KPDrZr0ZcJRlF+cbr6pFvip7MJy5Qk16HVx38XBy+8mqsyTrwpr3Zbav/FFXuu6ya8ixOcwNNfiaK+WlUdvBKN//Z+p0ROGVs2ryYzGyQxiAuzSTAQ0AwEMAGIYNAAAI0gAgCQACAAAAABAAAAADKSvLabkvjqq3gl+xdTV00+Ksc5UlsJRm9adTZb9bPz09TLlbcXaqzGM45jSlfsypTXmmv1RlzqbeHqRv7+NpQkucVSUreqMucRlt06yXZpqV+dmt/0Cph3PAurbV11WSfyq0Lvu2U5eZhrt17n42/xU42l1bj8slp3PkOMduNuZtZzh70G29yvp3aqxy+V5/DrJ05aJTahLg1fS/IysbT+Ln8NjI/8AjUJcm5WEspxtRfmzhCPKLbfqWuFx0bXuvUnVzSNtZL1LTrsvJn9NBYaNGOyuBT46sr68AzzPqcb2ld9xxmOzac7pOyfqV8dp6911vRzNIRxLlsOahZVJrVU1J22vK2r4XPSswSvGaelSOy/Gzafpf6HjXQTHRo10qlurry6ud1pZxlZPuueo4fDyo09mEpdTCdtiTu479mz+XVfudGPxscfJ7z2zYqts06c+EJ05N9ykm/oZs6zG9OSptOLjHZktdptKUbd2qNXNVsYeVle0HZc3bRepoV11GEowmu1FUlzs1ZL0t9CPKyaTMZbKvcsiniajXwUkv653/wDguig6JbU4Va8lZVZrY74wur+F3L0L434/i5uX5VIBAXZmNCACVwEO4DAQwAAADGAgAYCAAAAAAAVwGK5hrYqnD3pxXdfX0NeWa0V8d/CMv0IuUn2tMbfpvFRnOGTe0/dmtma7/hl/b0Mks6prcpv+VfqaGMzV1U6ahsp8W7vTVfYzzzxsaYYZS70MHO6dOe+Onjyfoa2Z46phMLUjCi6qW3srafuyu2rb2lyXAxLEpuE1ys/88fuWVKcZx338zGX9N7P300aFp0Y34xWnijgp5NGFatTe5vai+58PLcehbPV6P3OD5ePcU+eUEnGqlotJeD4mdjfHJwdfC1abtGUkuW07GlKU+Mpf1M7THYdSV0UGJw3cQ1mSgrGKNG5a/gnJ7i/yjou5tSq3jDhH4n+hKlrncpwkptxhFuSlCUdG1dO1n4ps9Uw1WbhGDdnKEVJvf2bWXjfiSwGUwglGEdiK5cTebp0+GpabYZaZK3aUdNFZsoM628TXpYan8b1a+GPxTfhG78bFT0r6dQpKVLD9qqtHZaR8+Zcey+nKrSq4updznLq4t79mKUpPzbS/kLyeV0pb4TbtsPSjTjGEFaEIqMVySVkjKRA6nIkMimO5CDAQwGAgAkmO5ECRK4ERgQAVwbAYEQAkK4gICqTUU5N2SV2ygxWaTqNqHZh9X5mXpNiWlCkvjd5eC3L1+xo4eCSMOTO71HRxYTW6j+HDqjcSINGNb7a6iKtSuv7mWSI30INueqOVKbTejd0+D7n3lngcUtO/eLNaKlF6cCiy/FauD0lF/wCPwHS+tx3MWpIrcbhmoyW+L+Hl4foLLcS3o+BY1HdGncYy+NcdTkrOD+F2XhwNSth23ZRbv3FvnWB2WqkdNVtG/lGFTW07dxlr26d6m2jlGR2tKaV/sdJRw0Y6sNpRKrNM12dFqzWSTthllcr6bOPzFQWhzGbZtUcdlyUdrRy5LjZb2zQzDMrNuUldei/c5LH5ztSexr/EUt2vjjpd47FYWLpKnS7FNtybttTdmtfN3Oq6F9NsJSoww9W9PZc2p6uL2puTut61keSYjFt8QwsXJ7y+F8faM8JlNPpnB46jWW1Rq05rnGcX9txsHgmSqpCSlTlKMluabT9Uej5R0pqxSVdba+ZWU/0ZrOafbny/x8p07UDXweMp1o7VOV1x5rua4Gc1YdJXC4gCEgIjTAlcBAAwEAEQAQDAQAMQABy/SGX+5iuVKP8A2ZKixdKY2rUpfNBr0l+5jw7OTP5V2YfGN+BGSJUxTIqWOSNdqxstmGRS1eMNeltI5vM8BKMlUhpKLv49zOsSNbFUNpErS6VeW1dpQmtz7LXFPl6nS4eF1c5zL8O41HFbpO/mmdNSp7MS2LPk7V2dyiqVRtboP7BkDvQpy+aO15PVfQjnMb0pp7tlmfLValTXKEfsP+k7/AZhJJNnCZ1mShtu+zGPvT4tvW0VxZ32MpKSd91jxbp3iH17p37MXJpcBezBU5jmUqz10gt0L/WXNmptt6Ilh8O5Fxg8pb4BqqaGGlJnTZRlbdtCyy/I910dLgcvUeBW5GtNXB5eopaFpQwpswom1SplYi1p05Tovbptpr69z7jqckzSOJg3unF2nHk+a7mc9i1oaPRvF9Vjox+GtGUWu9Lai/p9TbjysumHLhLN/b0ABAdTjMYgAY7kRgO4CABAIAGAgAYCACh6XU+xSn8tRr+qP7FfhZF10kp7WGqfw7Ml5SX9rnP4GeiObln5Oriu8VvSZKSMdJmVlV2KZrQfDkzZqlZTrWqOL36Py1MsmmCwIyRKL0BlhpuahVg/mui1qVNCkx6/Mp92paTloiZVc500M11pT/4v7FhSjZLwRqY6F4W5tfc3raE/au/Suz3F9XSlJctDxbPKcp14uW9p3/qPWuk6uox4N6nnWNo3xMb8pf8AYjftrhGzkmUXSbR1WEypaaBk2HVkdLQoKxXtbK6aVDBpcDZVOxmqtR8hUoO13vfDl3EaU2UaRkehNIx1WXkV20sbLQpMsblmGFS4VG34RhJs38yrWTI+z/CdZiK2Kfu011cP+UtZNeCsv5i2E3kjO6xr0C4XIgdbhSuMhcLgTuFyIBKVwFcAI3C4AEC40wAB3IjADBjae3TqR+aEl9DjMtnuADDm+nTwfa6oszpjAzaVjmijxa2a0HzvH11/sAFM2nH2t6W4yWEAitVfvVn/AAu3p+9y1mtwAMTJrYx6JfxR/wCyNtMALK/Siz/Wz5HC4mn/ALmHftfdABWtsHbZVSskXO3ZABE6Rl20JV9qoo+foyxigAjAz9G2auImAGlZxyvSHFbMWd10TwH4fB0YfE4qc/8AlPtP9PIANOHtnz31FuMQHQ5jAAAAGAAAAB//2Q=="
  },
  {
    name: "John",
    username: "@john",
    body: "The personalized learning paths made my career transition so much smoother.",
    img: "data:image/jpeg;base64,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"
  },
  {
    name: "Jane",
    username: "@jane",
    body: "Outstanding resource library! Everything I needed was just a click away.",
    img: "data:image/jpeg;base64,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"
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "PrepWise's structured approach helped me land my dream job. Thank you!",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTETbUlr0jNr2Nvb2Js3aIjx8WBnt53DvBrTA&s"
  },
  {
    name: "James",
    username: "@james",
    body: "The progress tracking features kept me motivated throughout my journey.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO5o4empTvUKcKI8KhtuUDwKgsqDaSjoMfXg&s"
  }
];

// Split reviews for alternate scrolling
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

// Review Card Component
const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure className={cn(
      // Base styles
      "relative w-64 cursor-pointer overflow-hidden rounded-xl p-4 mx-2",
      // Updated border and background styles for better visibility
      "border-2 border-gray-700/50",
      "bg-gray-900/80 backdrop-blur-sm",
      // Hover effects
      "hover:border-gray-500/50 hover:bg-gray-800/90",
      "transition-all duration-300",
      // Dark mode specific styles
      "dark:border-gray-600/50 dark:hover:border-gray-400/50"
    )}>
      <div className="flex flex-row items-center gap-2">
        <img 
          className="rounded-full ring-2 ring-gray-700/50" 
          width="32" 
          height="32" 
          alt={name} 
          src={img} 
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-400">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-gray-300">
        {body}
      </blockquote>
    </figure>
  );
};
function App() {
  const [showDialog, setShowDialog] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const navigate=useNavigate();

  const handleConfetti = () => {
    setConfettiTrigger(true);
    setTimeout(() => setConfettiTrigger(false), 3000);
  };

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="relative font-inter bg-black text-white min-h-screen">
      <Navbar />
      <Particles 
        className="absolute inset-0 -z-10"
        quantity={50}
        staticity={50}
        ease={50}
      />
      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Background Particles */}
      

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="text-center space-y-6 max-w-4xl px-4">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            
            <TypingAnimation>
              Welcome to PrepWise
            </TypingAnimation>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 drop-shadow-md max-w-2xl mx-auto">
            Your Ultimate Career Companion for Interview Success and Professional Growth
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              Get Started
            </button>
            <a
              href="#features"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full shadow-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-black w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 drop-shadow-lg">
          <WordPullUp>Features You’ll Love</WordPullUp>
        </h2>
        <BentoGrid>
          <NeonGradientCard
            className="max-w-sm mx-auto"
            gradientFrom="#FF6A00"
            gradientTo="#FF4F58"
            textColor="#FFFFFF"
            backgroundColor="#1a1a1a"
          >
            <h3 className="text-xl font-bold mb-2 text-white drop-shadow-md">
              Exam Preparation
            </h3>
            <p className="text-white/90">
              Monitor and improve your Exams.
            </p>
          </NeonGradientCard>
          <NeonGradientCard
            className="max-w-sm mx-auto"
            gradientFrom="#2E8B57"
            gradientTo="#3CB371"
            textColor="#FFFFFF"
            backgroundColor="#1a1a1a"
          >
            <h3 className="text-xl font-bold mb-2 text-white drop-shadow-md">
              Mock Interviews
            </h3>
            <p className="text-white/90">
              Simulate interviews to boost your confidence.
            </p>
          </NeonGradientCard>
          <NeonGradientCard
            className="max-w-sm mx-auto"
            gradientFrom="#8A2BE2"
            gradientTo="#9370DB"
            textColor="#FFFFFF"
            backgroundColor="#1a1a1a"
          >
            <h3 className="text-xl font-bold mb-2 text-white drop-shadow-md">
              Learning Paths
            </h3>
            <p className="text-white/90">
              Get personalized learning paths tailored to your goals.
            </p>
          </NeonGradientCard>
          <NeonGradientCard
            className="max-w-sm mx-auto"
            gradientFrom="#FF6347"
            gradientTo="#FF4500"
            textColor="#FFFFFF"
            backgroundColor="#1a1a1a"
          >
            <h3 className="text-xl font-bold mb-2 text-white drop-shadow-md">
              Resume Builder
            </h3>
            <p className="text-white/90">
              Build an ATS Friendly Resume.
            </p>
          </NeonGradientCard>
        </BentoGrid>
      </section>

      <section className="py-16 bg-black">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 drop-shadow-lg">
          <WordPullUp>What Our Users Say</WordPullUp>
        </h2>
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg bg-gray-950/50 py-8">
          {/* First Marquee row with updated spacing and visibility */}
          <div className="mb-4 w-full">
            <Marquee pauseOnHover className="[--duration:20s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          
          {/* Second Marquee row with updated spacing and visibility */}
          <div className="w-full">
            <Marquee reverse pauseOnHover className="[--duration:20s]">
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>

          {/* Updated gradient overlays with reduced opacity for better border visibility */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-950/90 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-950/90 to-transparent"></div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 bg-gradient-to-r from-gray-800 to-black text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
          Ready to Elevate Your Career?
        </h2>
        <button
          onClick={handleConfetti}
          className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          Get Started
        </button>
        {confettiTrigger && <Confetti />}
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-gray-400 text-center">
        <p>© 2025 PrepWise. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
