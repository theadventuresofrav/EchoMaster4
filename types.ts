
export type DemoId = 'waves' | 'transducers' | 'doppler' | 'pulsed' | 'artifacts' | 'safety' | 'hemodynamics' | 'qa' | 'resolution' | 'harmonics' | 'tgc' | 'dynamic_range' | 'processing' | 'study_guide' | 'contrast_agents' | 'elastography' | '3d_4d' | 'm_mode' | 'advanced_artifacts' | 'knobology' | 'biomedical_physics' | 'abdominal' | 'vascular' | 'msk' | 'cardiac' | 'jeopardy' | 'spi_mock_exam' | 'course_detail' | 'clinical_case_simulator' | 'escape_room' | 'crossword' | 'bingo' | 'personalized_study';

export interface CourseModuleData {
  id: DemoId;
  status: 'Core' | 'Advanced' | 'Clinical' | 'Premium' | 'New!' | 'Game';
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface UserProfile {
  name?: string;
  avatar?: string;
  completedModules: DemoId[];
  quizScores: {
    spi?: number; // Store highest score for the SPI quiz
    spiMockExam?: number; // Store highest score for the SPI mock exam
  };
  achievements: string[]; // Array of achievement IDs
}

// Types for AI-generated content
export interface AIQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface AIFlashcard {
  term: string;
  definition: string;
}

export interface AIStudyPlan {
  summary: string;
  weakAreas: {
    concept: string;
    explanation: string;
    recommendedModules?: string[];
    keyTakeaway: string;
  }[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  history: string;
  scanAreas: {
    id:string;
    name: string;
    imagePrompt: string;
    correctFindings: string[];
  }[];
  allFindings: string[];
  correctDiagnosis: string;
  feedbackPrompt: string;
}