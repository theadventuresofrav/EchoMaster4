
import React from 'react';
import { CheckCircleIcon, LockClosedIcon } from './Icons';

interface CourseModuleProps {
  id: string;
  status: string;
  icon: string;
  title:string;
  description: string;
  isCompleted?: boolean;
  score?: number;
  onClick: () => void;
}

const CourseModule: React.FC<CourseModuleProps> = ({ status, icon, title, description, isCompleted, score, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col cursor-pointer transition-all duration-300 hover:border-yellow-400/50 hover:bg-white/10 hover:-translate-y-1 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full">{status}</span>
            {isCompleted && (
                <div className="text-green-400 flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span className="text-xs font-bold">Done</span>
                </div>
            )}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 flex-grow">{title}</h3>
      <p className="text-sm text-white/60 mb-4">{description}</p>
      
      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
        {score !== undefined ? (
           <div>
             <p className="text-xs text-white/60">Best Score:</p>
             <p className="text-lg font-bold text-yellow-400">{score.toFixed(0)}%</p>
           </div>
        ) : <div />}
        <button className="text-sm font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors">
          {isCompleted ? 'Review Module' : 'Start Module'} &rarr;
        </button>
      </div>
    </div>
  );
};

export default CourseModule;
