import type { ReactNode } from 'react';

export interface StoryVariant {
  id: string;
  label: string;
  description: string;
}

export type StoryPreviewSize = 'compact' | 'standard' | 'wide' | 'canvas' | 'immersive';

export interface StoryRecord {
  id: string;
  title: string;
  group: 'Showcase Effects' | '3D Primitives' | 'Interactive Systems' | 'Application Components' | 'UI Primitives' | 'Notifications';
  packageName: string;
  importSnippet: string;
  overview: string;
  packageNotes: string;
  previewSize: StoryPreviewSize;
  usage: string;
  variants: readonly StoryVariant[];
  render: (variant: StoryVariant) => ReactNode;
}
