
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, DemoId } from '../types';
import { ACHIEVEMENTS } from '../achievements';
import { useNotification } from './NotificationContext';

const USER_PROFILE_STORAGE_KEY = 'echoMastersUserProfile';

const defaultProfile: UserProfile = {
    completedModules: [],
    quizScores: {},
    achievements: [],
};

interface UserContextType {
    userProfile: UserProfile | null;
    markModuleAsCompleted: (moduleId: DemoId) => void;
    awardAchievement: (achievementId: string) => void;
    setSpiQuizScore: (score: number) => void;
    setSpiMockExamScore: (score: number) => void;
    resetProgress: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
            if (storedProfile) {
                // Ensure achievements array exists for older profiles
                const profile = JSON.parse(storedProfile);
                if (!profile.achievements) {
                    profile.achievements = [];
                }
                setUserProfile(profile);
            } else {
                setUserProfile(defaultProfile);
            }
        } catch (error) {
            console.error("Failed to load user profile from local storage:", error);
            setUserProfile(defaultProfile);
        }
    }, []);

    useEffect(() => {
        if (userProfile) {
            try {
                localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
            } catch (error) {
                console.error("Failed to save user profile to local storage:", error);
            }
        }
    }, [userProfile]);

    const markModuleAsCompleted = useCallback((moduleId: DemoId) => {
        setUserProfile(prev => {
            if (!prev || prev.completedModules.includes(moduleId)) {
                return prev;
            }
            return {
                ...prev,
                completedModules: [...prev.completedModules, moduleId],
            };
        });
    }, []);

    const awardAchievement = useCallback((achievementId: string) => {
        // Check if this is an achievement that can be awarded
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        setUserProfile(prev => {
            if (!prev || prev.achievements.includes(achievementId)) {
                return prev;
            }
            console.log(`Awarding achievement: ${achievementId}`);
            addNotification(achievement); // Trigger toast
            return {
                ...prev,
                achievements: [...prev.achievements, achievementId],
            };
        });
    }, [addNotification]);

    const setSpiQuizScore = useCallback((score: number) => {
        setUserProfile(prev => {
            if (!prev) return prev;
            const currentBest = prev.quizScores.spi ?? -1;
            if (score > currentBest) {
                return {
                    ...prev,
                    quizScores: {
                        ...prev.quizScores,
                        spi: score,
                    },
                };
            }
            return prev;
        });
    }, []);

    const setSpiMockExamScore = useCallback((score: number) => {
        setUserProfile(prev => {
            if (!prev) return prev;
            const currentBest = prev.quizScores.spiMockExam ?? -1;
            if (score > currentBest) {
                 const newProfile = {
                    ...prev,
                    quizScores: {
                        ...prev.quizScores,
                        spiMockExam: score,
                    },
                };
                // Award achievement if score is high enough
                if (score >= 90 && !newProfile.achievements.includes('exam_master')) {
                    const achievement = ACHIEVEMENTS.find(a => a.id === 'exam_master');
                    if (achievement) {
                        newProfile.achievements.push('exam_master');
                        addNotification(achievement); // Trigger toast
                    }
                }
                return newProfile;
            }
            return prev;
        });
    }, [addNotification]);

    const resetProgress = useCallback(() => {
        if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
            setUserProfile(defaultProfile);
            localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userProfile, markModuleAsCompleted, awardAchievement, setSpiQuizScore, setSpiMockExamScore, resetProgress }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
