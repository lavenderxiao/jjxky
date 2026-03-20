export type ExamTarget = '专硕' | '学硕';

export interface University {
  id: string;
  name: string;
}

export interface Major {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  type: 'choice' | 'qa' | 'calculation';
  content: string;
  options?: string[];
  answer: string;
  analysis: string;
  knowledgePoint: string;
  subject: string;
  source?: string; // e.g., "2023年真题" or "北京大学2024年真题"
}

export interface WrongQuestion extends Question {
  addedAt: number;
  collectionIds: string[];
}

export interface WrongCollection {
  id: string;
  name: string;
}

export interface UserProfile {
  target: ExamTarget | null;
  university: string | null;
  major: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
