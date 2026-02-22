export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '5:2' | '16:10'
export type Resolution = 'HD' | '2K' | '4K' | '8K'
export type VideoStatus = 'idle' | 'generating' | 'ready' | 'error'
export type ProjectStatus = 'draft' | 'generating' | 'ready' | 'published'
export type MessageRole = 'user' | 'ai' | 'video'

export interface GenerationSettings {
  duration: 5 | 10 | 15 | 30
  resolution: Resolution
  aspectRatio: AspectRatio
  isPublic: boolean
  style: string
  cameraAngle: string
}

export interface VideoProject {
  id: string
  title: string
  prompt: string
  status: ProjectStatus
  thumbnailUrl: string
  videoUrl?: string
  duration: number
  resolution: Resolution
  aspectRatio: AspectRatio
  createdAt: Date
  updatedAt: Date
  views: number
  likes: number
  tags: string[]
  concept?: AdConcept
}

export interface AdConcept {
  hook: string
  script: string[]
  shots: ShotDescription[]
  talent: string
  music: string
  style: string
  mood: string
}

export interface ShotDescription {
  id: string
  order: number
  description: string
  duration: number
  cameraAngle: string
  transition: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content?: string
  video?: VideoProject
  timestamp: Date
  isTyping?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'studio'
  credits: number
}

export interface StudioLayer {
  id: string
  type: 'video' | 'text' | 'image' | 'audio' | 'effect'
  name: string
  startTime: number
  endTime: number
  isVisible: boolean
  isLocked: boolean
  opacity: number
  zIndex: number
  properties: Record<string, unknown>
}

export interface StudioState {
  projectId: string
  layers: StudioLayer[]
  currentTime: number
  duration: number
  isPlaying: boolean
  selectedLayerId: string | null
  zoom: number
}
