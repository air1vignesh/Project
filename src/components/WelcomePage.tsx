import { PartyPopper, Clock, Sparkles, Rocket } from "lucide-react";
import { useState, useEffect } from "react";

function WelcomePage() {
  // ✅ Configuration
  const redirectURL = "https://ajanthaconsultancy.in/";
  const targetDate = new Date("2025-11-23T14:30:00+05:30");

  // ✅ State management
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  // ✅ Prevent returning to this page after launch
  useEffect(() => {
    const now = new Date().getTime();
    const launchTime = targetDate.getTime();

    if (now >= launchTime || localStorage.getItem("siteLaunched") === "true") {
      window.location.replace(redirectURL); // no back button return
    }
  }, []);

  // ✅ Handle button click with validation
  const handleClick = () => {
    const now = new Date().getTime();

    if (now >= targetDate.getTime()) {
      localStorage.setItem("siteLaunched", "true"); // remember entry
      setIsAnimating(true);
      setTimeout(() => {
        window.location.replace(redirectURL); // prevents back navigation
      }, 1600);
    }
  };

  // ✅ Countdown timer with auto-enable
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const launch = targetDate.getTime();
      const diff = launch - now;

      if (diff <= 0) {
        setIsLive(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return true;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });

      return false;
    };

    if (updateCountdown()) return;

    const timer = setInterval(() => {
      if (updateCountdown()) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // ✅ Format countdown display
  const formatCountdown = () => {
    if (isLive) return "✅ Website is LIVE!";
    const { days, hours, minutes, seconds } = timeLeft;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 sm:w-96 sm:h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl w-full">
        {/* Company Logo */}
        <div className="mb-10 sm:mb-14 flex justify-center">
          <div className="
            w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80
            rounded-full shadow-3xl p-3 sm:p-4 flex items-center justify-center
            border-8 border-yellow-300 bg-white/10 backdrop-blur-xl
          ">
            <img
              src="src/components/assist/Vertical white.png"
              alt="Logo"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Title with icon */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Rocket className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-300 animate-bounce" />
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white drop-shadow-2xl leading-tight">
            Our Website Launches Soon
          </h1>
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-300 animate-pulse" />
        </div>

        {/* Countdown display */}
        <div className="mb-6 sm:mb-8 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 mx-2">
          <p className="text-base sm:text-xl text-white/90 mb-2 sm:mb-3 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            {isLive ? "🎉 Launch Time!" : "⏳ Going live in:"}
          </p>
          <p className={`text-2xl sm:text-3xl lg:text-5xl font-bold ${isLive ? 'text-green-300' : 'text-yellow-300'} ${!isLive && 'animate-pulse'}`}>
            {formatCountdown()}
          </p>
        </div>

        {/* Launch button */}
        <button
          onClick={handleClick}
          disabled={!isLive}
          className={`
            relative px-8 py-4 sm:px-12 sm:py-6 text-lg sm:text-2xl font-bold rounded-full
            bg-gradient-to-r from-yellow-400 to-pink-500 text-white
            shadow-2xl transform transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            ${isLive ? 'hover:scale-110 hover:shadow-pink-500/50 active:scale-95 cursor-pointer' : ''}
            ${isAnimating ? 'scale-0 opacity-0' : ''}
            overflow-hidden group w-full max-w-xs sm:max-w-md mx-auto
          `}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
            {isLive ? 'Enter Website' : 'Launching Soon'}
            <PartyPopper className="w-5 h-5 sm:w-6 sm:h-6" />
          </span>
        </button>

        {!isLive && (
          <p className="mt-4 sm:mt-6 text-white/80 text-xs sm:text-sm lg:text-base px-4">
            The button will activate automatically when the countdown reaches zero
          </p>
        )}
      </div>

      {/* Info popup */}
      {showPopup && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto bg-white text-gray-900 shadow-2xl rounded-xl sm:rounded-2xl p-4 sm:p-6 w-auto sm:w-80 border-2 border-purple-200 z-50 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 sm:gap-3 font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-purple-700">
            <Clock size={20} className="sm:w-6 sm:h-6 animate-pulse" />
            Launch Information
          </div>
          
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-gray-600">The website will go live on:</p>
            <p className="font-bold text-purple-700 bg-purple-50 rounded-lg p-2 text-xs sm:text-sm">
              📅 {targetDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="font-bold text-purple-700 bg-purple-50 rounded-lg p-2 text-xs sm:text-sm">
              🕐 {targetDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
            
            <div className="pt-2 border-t border-gray-200">
              <p className="text-blue-600 font-semibold text-xs sm:text-sm">
                ⏱️ {formatCountdown()}
              </p>
            </div>
          </div>

          <button
            className="mt-3 sm:mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95 text-sm"
            onClick={() => setShowPopup(false)}
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
}

export default WelcomePage;
