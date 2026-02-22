import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Send,
  SlidersHorizontal,
  Zap,
  Wand2,
  Film,
  Music,
  User,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { useAuthStore } from '@/store/authStore'
import VideoCard from '@/components/creation/VideoCard'
import SettingsModal from '@/components/creation/SettingsModal'
import type { ChatMessage, VideoProject, AdConcept } from '@/types'

const SUGGESTIONS = [
  'Create a luxury watch ad with cinematic lighting',
  'Design a sneaker campaign with urban street energy',
  'Build a perfume commercial in an elegant French setting',
  'Make a tech product reveal with futuristic vibes',
  'Craft a coffee brand story for a Sunday morning',
]

const AI_CONCEPTS: AdConcept[] = [
  {
    hook: 'A single drop of water falls in slow motion onto the watch face',
    script: ['Opening with macro lens on watch crown', 'Pull back to reveal full watch on stone surface', 'Final shot: model checking time at golden hour'],
    shots: [],
    talent: 'Sophisticated male model, 35–45, minimalist style',
    music: 'Orchestral swell with piano undertones — Hans Zimmer inspired',
    style: 'High contrast cinematic — muted warm tones, deep blacks',
    mood: 'Aspirational, timeless, prestige',
  },
  {
    hook: 'Sneaker drops from above into a puddle splash',
    script: ['Street-level close-up on sole', 'Dynamic dolly past graffiti mural', 'Final freeze-frame on logo'],
    shots: [],
    talent: 'Urban athlete, 20s, high energy, authentic streetwear',
    music: 'Bass-heavy trap with vinyl scratch elements',
    style: 'High saturation, gritty urban textures, slow-mo moments',
    mood: 'Raw, confident, rebellious',
  },
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-zh-card border border-zh-border rounded-2xl w-fit">
      <div className="flex gap-1 items-end h-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-zh-teal"
            animate={{ scaleY: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span className="text-xs text-zh-muted">Co-Director is analyzing...</span>
    </div>
  )
}

function AIMessage({ content, concept }: { content: string; concept?: AdConcept }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 max-w-[640px]"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl bg-zh-teal/15 border border-zh-teal/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Zap size={14} className="text-zh-teal fill-zh-teal" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-zh-card border border-zh-border rounded-2xl rounded-tl-sm p-4">
          <p className="text-sm text-zh-text leading-relaxed">{content}</p>

          {/* Concept breakdown */}
          {concept && (
            <div className="mt-4 border-t border-zh-border pt-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-xs font-medium text-zh-teal hover:text-opacity-80 transition-colors"
              >
                <Wand2 size={12} />
                Co-Director Analysis
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <ConceptItem icon={Film} label="Style" value={concept.style} />
                      <ConceptItem icon={Music} label="Music" value={concept.music} />
                      <ConceptItem icon={User} label="Talent" value={concept.talent} />
                      <ConceptItem icon={Layers} label="Mood" value={concept.mood} />
                    </div>
                    <div className="mt-2 p-2 bg-zh-card2 rounded-xl">
                      <p className="text-[10px] font-bold text-zh-muted uppercase tracking-wider mb-1">Hook</p>
                      <p className="text-xs text-zh-text">{concept.hook}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        <p className="text-[10px] text-zh-subtle mt-1 ml-1">ZeroHuman Co-Director</p>
      </div>
    </motion.div>
  )
}

function UserMessage({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[480px]">
        <div className="bg-zh-user border border-zh-teal/20 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-white leading-relaxed">{content}</p>
        </div>
        <p className="text-[10px] text-zh-subtle mt-1 mr-1 text-right">You</p>
      </div>
    </motion.div>
  )
}

function ConceptItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-2 bg-zh-card2 rounded-xl">
      <div className="flex items-center gap-1 mb-1">
        <Icon size={10} className="text-zh-teal" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-zh-muted">{label}</span>
      </div>
      <p className="text-[11px] text-zh-text leading-snug">{value}</p>
    </div>
  )
}

function EmptyState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full py-16 px-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-zh-teal/10 border border-zh-teal/20 flex items-center justify-center mb-6">
        <Sparkles size={28} className="text-zh-teal" />
      </div>
      <h2 className="text-xl font-semibold text-zh-text mb-2">Voice-Directed Cinematic AI</h2>
      <p className="text-sm text-zh-muted text-center max-w-sm mb-10">
        Describe your ad vision. Your Co-Director will craft the concept, script, and generate a cinematic video in seconds.
      </p>

      <div className="w-full max-w-lg space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zh-muted mb-3 text-center">
          Try a prompt
        </p>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="w-full text-left px-4 py-3 bg-zh-card border border-zh-border rounded-xl text-sm text-zh-muted hover:border-zh-teal hover:text-zh-text hover:bg-zh-card2 transition-all duration-200 group"
          >
            <span className="text-zh-teal/60 mr-2 group-hover:text-zh-teal transition-colors">→</span>
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export default function CreationPage() {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<unknown>(null)

  const { messages, addMessage, updateMessage, isGenerating, setGenerating, addProject, settings } = useProjectStore()
  const { user } = useAuthStore()

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, isTyping, scrollToBottom])

  const generateVideo = useCallback(async (prompt: string) => {
    // Add user message
    addMessage({ role: 'user', content: prompt })
    scrollToBottom()

    // Show AI typing
    setIsTyping(true)
    await new Promise((r) => setTimeout(r, 1400))
    setIsTyping(false)

    // Pick a random concept
    const concept = AI_CONCEPTS[Math.floor(Math.random() * AI_CONCEPTS.length)]

    // Add AI analysis message
    addMessage({
      role: 'ai',
      content: `Outstanding vision. I've analyzed your brief and crafted a cinematic concept. Your ad will feature ${concept.style.toLowerCase()} aesthetics with ${concept.mood.toLowerCase()} energy. The ${concept.talent.toLowerCase()} will anchor the narrative. Generating your cinematic ad now...`,
    })
    scrollToBottom()

    // Start generation
    setGenerating(true, 0)
    const project: VideoProject = {
      id: `proj_${Date.now()}`,
      title: prompt.slice(0, 40) + (prompt.length > 40 ? '…' : ''),
      prompt,
      status: 'generating',
      thumbnailUrl: '',
      duration: settings.duration,
      resolution: settings.resolution,
      aspectRatio: settings.aspectRatio,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      tags: ['generated'],
      concept,
    }

    // Add video card (generating state)
    const videoMsg = addMessage({ role: 'video', video: project })
    scrollToBottom()

    // Simulate generation progress
    for (let p = 10; p <= 85; p += 15) {
      await new Promise((r) => setTimeout(r, 600))
    }

    // Complete generation
    await new Promise((r) => setTimeout(r, 800))

    const completedProject: VideoProject = {
      ...project,
      status: 'ready',
      thumbnailUrl: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      ][Math.floor(Math.random() * 4)],
    }

    updateMessage(videoMsg.id, { video: completedProject })
    addProject(completedProject)
    setGenerating(false)
    scrollToBottom()
  }, [addMessage, addProject, settings, setGenerating, updateMessage, scrollToBottom])

  const handleSubmit = async () => {
    const prompt = input.trim()
    if (!prompt || isGenerating) return
    setInput('')
    await generateVideo(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleRecording = () => {
    const SpeechRecognitionCtor =
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition ||
      (window as unknown as Record<string, unknown>).SpeechRecognition

    if (!SpeechRecognitionCtor) {
      alert('Voice input not supported in this browser. Try Chrome.')
      return
    }

    if (isRecording) {
      const rec = recognitionRef.current as { stop: () => void } | null
      rec?.stop()
      setIsRecording(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognitionCtor as any)()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
      const transcript = Array.from(
        { length: (e.results as unknown as ArrayLike<unknown>).length },
        (_, i) => e.results[i][0].transcript,
      ).join('')
      setInput(transcript)
    }
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="h-full flex flex-col bg-zh-bg relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zh-border flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zh-text">Create Ad</h1>
          <p className="text-[11px] text-zh-muted">Voice-Directed Co-Director</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zh-card border border-zh-border rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-zh-teal animate-pulse" />
            <span className="text-[11px] font-medium text-zh-text">{user?.credits ?? 0} credits</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
      >
        {isEmpty ? (
          <EmptyState onSuggestion={(s) => { setInput(s); inputRef.current?.focus() }} />
        ) : (
          <>
            {messages.map((msg: ChatMessage) => {
              if (msg.role === 'user') {
                return <UserMessage key={msg.id} content={msg.content ?? ''} />
              }
              if (msg.role === 'ai') {
                return <AIMessage key={msg.id} content={msg.content ?? ''} />
              }
              if (msg.role === 'video' && msg.video) {
                return (
                  <div key={msg.id} className="flex justify-start">
                    <VideoCard
                      video={msg.video}
                      onCoDirector={() => {}}
                      onExtend={() => {}}
                      onRemix={() => {}}
                      onUpscale={() => {}}
                    />
                  </div>
                )
              }
              return null
            })}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-6 pb-6 pt-3 border-t border-zh-border">
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-zh-card border border-zh-border rounded-2xl px-4 py-3 focus-within:border-zh-teal/50 transition-all duration-200">
            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl text-zh-muted hover:text-zh-teal hover:bg-zh-teal/10 transition-all duration-200 flex-shrink-0 mb-0.5"
              title="Settings"
            >
              <SlidersHorizontal size={18} />
            </button>

            {/* Text area */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your ad vision or speak it..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-zh-text placeholder:text-zh-subtle outline-none resize-none max-h-32 py-1 leading-relaxed"
              style={{ minHeight: '24px' }}
              onInput={(e) => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = `${el.scrollHeight}px`
              }}
              disabled={isGenerating}
            />

            {/* Voice button */}
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5 ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'text-zh-muted hover:text-zh-teal hover:bg-zh-teal/10'
              }`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isGenerating}
              className="p-2 rounded-xl bg-zh-teal text-black hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 mb-0.5 active:scale-95"
            >
              {isGenerating ? (
                <div className="w-[18px] h-[18px] border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>

          {/* Voice waveform */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-500/20 border border-red-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-red-400 rounded-full"
                    style={{ height: 16 }}
                    animate={{ scaleY: [0.2, 1, 0.2] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.06,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
                <span className="text-xs text-red-400 ml-1 font-medium">Recording...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-zh-subtle text-center mt-2">
            Press Enter to generate · Shift+Enter for new line · or use mic
          </p>
        </div>
      </div>

      {/* Settings modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
