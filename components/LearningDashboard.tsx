
import React, { useEffect, useRef, useMemo } from 'react';
import CourseModule from './CourseModule';
import { COURSE_MODULES } from '../constants';
import { DemoId, UserProfile } from '../types';
import { ACHIEVEMENTS } from '../achievements';

interface LearningDashboardProps {
  onModuleClick: (moduleId: DemoId) => void;
  userProfile: UserProfile | null;
}

const GAME_MODULE_IDS = ['jeopardy', 'spi_mock_exam', 'escape_room', 'crossword', 'bingo', 'study_guide', 'clinical_case_simulator', 'personalized_study'];

const LearningDashboard: React.FC<LearningDashboardProps> = ({ onModuleClick, userProfile }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const modules = gridRef.current?.querySelectorAll('.module-card');
    if (modules) {
      Array.from(modules).forEach((module) => {
        if (module instanceof Element) {
          observer.observe(module);
        }
      });
    }

    return () => {
      if (modules) {
        Array.from(modules).forEach((module) => {
          if (module instanceof Element) {
            observer.unobserve(module);
          }
        });
      }
    };
  }, []);

  const completedCount = userProfile?.completedModules.length ?? 0;
  const totalModules = COURSE_MODULES.length;
  const progress = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

  const nextModule = useMemo(() => {
    return COURSE_MODULES.find(module => !userProfile?.completedModules.includes(module.id) && !GAME_MODULE_IDS.includes(module.id));
  }, [userProfile]);

  const earnedAchievements = useMemo(() => {
    if (!userProfile) return [];
    return ACHIEVEMENTS.filter(ach => userProfile.achievements.includes(ach.id));
  }, [userProfile]);

  const learningModules = COURSE_MODULES.filter(m => !GAME_MODULE_IDS.includes(m.id));
  const gameModules = COURSE_MODULES.filter(m => GAME_MODULE_IDS.includes(m.id));

  return (
    <div className="px-4 sm:px-[5%] py-8 sm:py-12" ref={gridRef}>
        {/* Dashboard Header */}
        <div className="max-w-7xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text leading-tight">
                Your Learning Pathway
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl">
                Here's your progress and what's next on your journey to mastering ultrasound physics.
            </p>

            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-1/2">
                    <h2 className="text-xl font-bold text-yellow-400 mb-2">Overall Progress</h2>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-sm text-white/70 mt-2">{completedCount} of {totalModules} modules completed ({progress.toFixed(0)}%)</p>
                </div>
                {nextModule && (
                    <div className="w-full sm:w-1/2">
                        <h2 className="text-xl font-bold text-yellow-400 mb-2">Up Next:</h2>
                        <div onClick={() => onModuleClick(nextModule.id)} className="bg-white/10 p-4 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-white/20 transition-colors">
                            <div className="text-2xl">{nextModule.icon}</div>
                            <div>
                                <h3 className="font-semibold text-white">{nextModule.title}</h3>
                                <p className="text-xs text-white/60">{nextModule.description.substring(0, 50)}...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {earnedAchievements.length > 0 && (
                <div className="mt-8">
                     <h2 className="text-xl font-bold text-yellow-400 mb-4">Achievements Unlocked</h2>
                     <div className="flex flex-wrap gap-4">
                        {earnedAchievements.map(ach => (
                            <div key={ach.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3" title={`${ach.title}: ${ach.description}`}>
                                <span className="text-2xl">{ach.icon}</span>
                                <span className="font-semibold text-sm hidden sm:inline">{ach.title}</span>
                            </div>
                        ))}
                     </div>
                </div>
            )}
        </div>

        {/* Learning Modules Grid */}
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-400">📚</span> Core Curriculum
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                {learningModules.map((module, index) => (
                    <div 
                        key={module.id}
                        className="module-card opacity-0 translate-y-8 transition-all duration-700"
                        style={{ transitionDelay: `${index * 50}ms`}}
                    >
                        <CourseModule
                        {...module}
                        isCompleted={userProfile?.completedModules.includes(module.id)}
                        onClick={() => onModuleClick(module.id)}
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* Game Modules Grid */}
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-400">🧬</span> Interactive Tools & Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {gameModules.map((module, index) => {
                    let score: number | undefined;
                    if (module.id === 'spi_mock_exam') {
                        score = userProfile?.quizScores.spiMockExam;
                    } else if (module.id === 'study_guide' || module.id === 'jeopardy') {
                        score = userProfile?.quizScores.spi;
                    }

                    return (
                        <div 
                            key={module.id}
                            className="module-card opacity-0 translate-y-8 transition-all duration-700"
                            style={{ transitionDelay: `${index * 50}ms`}}
                        >
                            <CourseModule
                            {...module}
                            status="Game"
                            isCompleted={userProfile?.completedModules.includes(module.id)}
                            score={score}
                            onClick={() => onModuleClick(module.id)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default LearningDashboard;