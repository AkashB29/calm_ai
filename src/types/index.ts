export interface StressData {
  faceStress: number;
  voiceStress: number;
  textStress: number;
  combined: number;
  level: 'critical' | 'high' | 'normal';
  expression: string;
}

export interface Step {
  step: number;
  action: string;
  detail: string;
  duration: string;
  link: string | null;
  linkLabel: string | null;
}

export interface CrisisResponse {
  scenario: string;
  calming: string;
  needsBreathing: boolean;
  emergencyCall: string | null;
  steps: Step[];
}

export type AppPhase =
  | 'home'
  | 'listening'
  | 'thinking'
  | 'breathing'
  | 'tunnel'
  | 'done';