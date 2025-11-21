
import React from 'react';
import { UserProfile } from '../types';
import { COURSE_MODULES } from '../constants';

interface HeaderProps {
    userProfile: UserProfile | null;
    onResetProgress: () => void;
    onDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, onResetProgress, onDashboardClick }) => {
  const completedCount = userProfile?.completedModules.length ?? 0;
  const totalModules = COURSE_MODULES.length;
  const progress = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  
  const userName = userProfile?.name || "Sonographer";
  const userAvatar = userProfile?.avatar;
  const initials = userName.charAt(0).toUpperCase();

  // Circumference for progress ring (r=16)
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <header className="px-4 sm:px-8 md:px-[5%] py-3 backdrop-blur-md bg-black/80 border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Left: Logo */}
        <div 
            onClick={onDashboardClick} 
            className="flex items-center gap-3 cursor-pointer group"
        >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">🇺🇸</span>
            <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                  EchoMasters
                </span>
                <span className="text-[10px] text-white/50 tracking-widest uppercase hidden sm:block font-medium">Ultrasound Physics Mastery</span>
            </div>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-6">
            
            {/* Desktop Progress Section */}
            <div className="hidden md:flex items-center gap-4 bg-white/5 px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors group/progress">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider group-hover/progress:text-white/80 transition-colors">Course Progress</span>
                    <span className="text-sm font-bold text-yellow-400">{Math.round(progress)}% Complete</span>
                </div>
                {/* Circular Progress */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 drop-shadow-md">
                        <circle
                            cx="20" cy="20" r={radius}
                            stroke="currentColor" strokeWidth="3"
                            fill="transparent"
                            className="text-gray-700"
                        />
                        <circle
                            cx="20" cy="20" r={radius}
                            stroke="currentColor" strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="text-yellow-400 transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>

            {/* User Profile & Menu */}
            <div className="flex items-center gap-4">
                 <button 
                    onClick={onDashboardClick} 
                    className="hidden sm:block text-sm font-medium text-white/70 hover:text-yellow-400 transition-colors"
                >
                    Dashboard
                </button>

                <div className="flex items-center gap-3 pl-4 sm:border-l border-white/10">
                    <div className="flex flex-col items-end hidden lg:flex">
                        <span className="text-sm font-bold text-white">{userName}</span>
                        <button onClick={onResetProgress} className="text-[10px] text-red-400/80 hover:text-red-400 transition-colors uppercase font-semibold tracking-wide">
                            Reset
                        </button>
                    </div>
                    
                    <div className="relative group cursor-pointer">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 p-[2px] shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all group-hover:scale-105">
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-yellow-400 select-none">{initials}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Mobile Progress Bar (visible only on small screens) */}
      <div className="md:hidden absolute bottom-0 left-0 w-full h-[2px] bg-gray-800">
         <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
};

export default Header;
