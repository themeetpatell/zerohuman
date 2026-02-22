import { create } from 'zustand'
import type { VideoProject, ChatMessage, GenerationSettings, AspectRatio } from '@/types'

const MOCK_THUMBNAILS = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
]

const makeProject = (
  id: string,
  title: string,
  prompt: string,
  status: VideoProject['status'],
  thumbIdx: number,
  aspectRatio: AspectRatio = '9:16',
): VideoProject => ({
  id,
  title,
  prompt,
  status,
  thumbnailUrl: MOCK_THUMBNAILS[thumbIdx % MOCK_THUMBNAILS.length],
  duration: 10,
  resolution: 'HD',
  aspectRatio,
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
  views: Math.floor(Math.random() * 5000),
  likes: Math.floor(Math.random() * 500),
  tags: ['cinematic', 'luxury', 'brand'],
})

interface ProjectState {
  projects: VideoProject[]
  messages: ChatMessage[]
  settings: GenerationSettings
  isGenerating: boolean
  generationProgress: number
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void
  addProject: (project: VideoProject) => void
  updateSettings: (updates: Partial<GenerationSettings>) => void
  setGenerating: (val: boolean, progress?: number) => void
  setProgress: (progress: number) => void
  clearMessages: () => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [
    makeProject('proj_1', 'Luxury Watch Campaign', 'Create a luxury watch ad for Rolex', 'ready', 0, '9:16'),
    makeProject('proj_2', 'Sneaker Launch Ad', 'Cinematic sneaker reveal with urban vibes', 'ready', 1, '16:9'),
    makeProject('proj_3', 'Perfume Brand Story', 'Elegant perfume commercial for Dior', 'ready', 2, '9:16'),
    makeProject('proj_4', 'Tech Product Reveal', 'Futuristic laptop reveal animation', 'generating', 3, '16:9'),
    makeProject('proj_5', 'Fashion Campaign', 'High fashion editorial ad for runway', 'ready', 4, '9:16'),
    makeProject('proj_6', 'Coffee Brand Ad', 'Warm and inviting coffee morning spot', 'ready', 5, '1:1'),
  ],
  messages: [],
  isGenerating: false,
  generationProgress: 0,
  settings: {
    duration: 10,
    resolution: 'HD',
    aspectRatio: '9:16',
    isPublic: false,
    style: 'cinematic',
    cameraAngle: 'FRONT',
  },

  addMessage: (msg) => {
    const message: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      timestamp: new Date(),
    }
    set((state) => ({ messages: [...state.messages, message] }))
    return message
  },

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }))
  },

  addProject: (project) => {
    set((state) => ({ projects: [project, ...state.projects] }))
  },

  updateSettings: (updates) => {
    set((state) => ({ settings: { ...state.settings, ...updates } }))
  },

  setGenerating: (val, progress = 0) => {
    set({ isGenerating: val, generationProgress: progress })
  },

  setProgress: (progress) => {
    set({ generationProgress: progress })
  },

  clearMessages: () => {
    set({ messages: [] })
  },

  // Expose get for external use
  _get: get,
}))
