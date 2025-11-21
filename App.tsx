
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingParticles from './components/FloatingParticles';
import LearningDashboard from './components/LearningDashboard';
import ModuleView from './components/ModuleView';
import AIAssistant from './components/AIAssistant';
import { DemoId } from './types';
import { useUser } from './contexts/UserContext';
import { COURSE_MODULES } from './constants';
import { AnimatePresence } from 'framer-motion';
import { useNotification } from './contexts/NotificationContext';
import AchievementToast from './components/AchievementToast';


const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<DemoId | null>(null);
  const { userProfile, markModuleAsCompleted, awardAchievement, resetProgress } = useUser();
  const { notifications, removeNotification } = useNotification();


  const handleModuleClick = useCallback((moduleId: DemoId) => {
    setActiveModuleId(moduleId);
  }, []);


  const handleCloseModule = useCallback(() => {
    if (activeModuleId) {
      markModuleAsCompleted(activeModuleId);
      awardAchievement(activeModuleId);
    }
    setActiveModuleId(null);
  }, [activeModuleId, markModuleAsCompleted, awardAchievement]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModule();
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCloseModule]);

  const activeModule = useMemo(() => {
    if (!activeModuleId) return null;
    return COURSE_MODULES.find(m => m.id === activeModuleId) || null;
  }, [activeModuleId]);


  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <FloatingParticles />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          onDashboardClick={() => setActiveModuleId(null)} 
          userProfile={userProfile} 
          onResetProgress={resetProgress} 
        />
        <main className="flex-grow">
          {activeModuleId ? (
            <ModuleView 
              moduleId={activeModuleId} 
              onClose={handleCloseModule} 
            />
          ) : (
            <LearningDashboard 
              onModuleClick={handleModuleClick} 
              userProfile={userProfile} 
            />
          )}
        </main>
        <Footer />
      </div>
      <AIAssistant activeModule={activeModule} />

      {/* Notification Container */}
      <div className="fixed bottom-6 left-6 z-[200] space-y-4">
        <AnimatePresence>
          {notifications.map(notification => (
            <AchievementToast
              key={notification.id}
              achievement={notification.achievement}
              onRemove={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
