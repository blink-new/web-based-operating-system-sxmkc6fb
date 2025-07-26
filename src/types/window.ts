import { AppData } from './app';

export interface WindowData {
  id: string;
  app: AppData;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}