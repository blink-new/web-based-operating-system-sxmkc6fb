export interface AppData {
  id: string;
  name: string;
  icon: string;
  category: 'system' | 'productivity' | 'development' | 'utilities' | 'media';
  description: string;
}