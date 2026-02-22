import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Download,
  Heart,
  Share2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Pencil,
  Expand,
  Wand2,
  ChevronDown,
  Lightbulb,
  Film,
  Mic,
  Music,
  User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { VideoProject } from '@/types'

const ASPECT_RATIO_DIMS: Record<string, { w: number; h: number }> = {
  '9:16': { w: 9, h: 16 },
  '16:9': { w: 16, h: 9 },
  '1:1': { w: 1, h: 1 },
  '4:5': { w: 4, h: 5 },
  '5:2': { w: 5, h: 2 },
  '16:10': { w: 16, h: 10 },
}

interface VideoCardProps {
  video: VideoProject
  onExtend?: () => void
  onRemix?: () => void
  onUpscale?: () => void
  onCoDirector?: () => void
}

export default function VideoCard({ video, onCoDirector, onExtend, onRemix, onUpscale }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(true)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const dim = ASPECT_RATIO_DIMS[video.aspectRatio] ?? { w: 9, h: 16 }
  const isPortrait = dim.h > dim.w
  const isLandscape = dim.w > dim.h

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = () => navigate(`/studio/${video.id}`)

  const ACTION_PILLS = [
    {
      icon: Wand2,
      label: 'Co-Director',
      teal: true,
      onClick: onCoDirector,
    },
    {
      icon: Film,
      label: 'Extend',
      teal: false,
      onClick: onExtend,
    },
    {
      icon: Expand,
      label: 'Remix',
      teal: false,
      onClick: onRemix,
    },
    {
      icon: Expand,
      label: 'Upscale',
      teal: false,
      onClick: onUpscale,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[520px]"
    >
      {/* Video preview container */}
      <div
        className="relative bg-zh-card border border-zh-border rounded-2xl overflow-hidden group"
        style={{
          aspectRatio: isPortrait ? '9/16' : isLandscape ? '16/9' : '1/1',
          maxHeight: isPortrait ? '400px' : undefined,
        }}
      >
        {/* Thumbnail / video background */}
        {video.status === 'ready' && video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zh-card via-zh-card2 to-zh-bg">
            {/* Cinematic shimmer while generating */}
            <div className="shimmer-overlay absolute inset-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-zh-teal/30 border-t-zh-teal animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-zh-text">Generating cinematic ad...</p>
                <p className="text-xs text-zh-muted mt-1">{video.title}</p>
              </div>
              {/* Progress bar */}
              <div className="w-48 h-1 bg-zh-border rounded-full overflow-hidden">
                <div className="h-full bg-zh-teal rounded-full animate-pulse-slow" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-cinematic pointer-events-none" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-bold text-white tracking-wider">
            {video.aspectRatio}
          </span>
          <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-medium text-white">
            {video.duration}s · {video.resolution}
          </span>
        </div>

        {/* Play button */}
        {video.status === 'ready' && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
              {isPlaying ? (
                <Pause size={22} className="text-white" />
              ) : (
                <Play size={22} className="text-white ml-1" />
              )}
            </div>
          </button>
        )}

        {/* Status badge */}
        {video.status === 'ready' && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-0.5 bg-zh-teal/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-black uppercase tracking-wider">
              Ready
            </span>
          </div>
        )}
      </div>

      {/* Action pills */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {ACTION_PILLS.map(({ icon: Icon, label, teal, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
              teal
                ? 'bg-zh-teal text-black hover:bg-opacity-90'
                : 'bg-zh-card border border-zh-border text-zh-muted hover:border-zh-teal hover:text-zh-teal'
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Icon actions row */}
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-1">
          <IconAction icon={ThumbsUp} onClick={() => {}} />
          <IconAction icon={ThumbsDown} onClick={() => {}} />
          <IconAction icon={copied ? Copy : Copy} label={copied ? 'Copied!' : undefined} onClick={handleCopy} />
          <IconAction icon={Download} onClick={() => {}} />
          <IconAction
            icon={Heart}
            active={liked}
            activeColor="text-red-400"
            onClick={() => setLiked(!liked)}
          />
          <IconAction icon={Share2} onClick={() => {}} />
          <IconAction icon={MoreHorizontal} onClick={() => {}} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zh-card2 border border-zh-border text-zh-text hover:border-zh-teal hover:text-zh-teal transition-all duration-200 active:scale-95"
          >
            <Pencil size={11} />
            Edit in Studio
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zh-teal text-black hover:bg-opacity-90 transition-all duration-200 active:scale-95">
            <Download size={11} />
            Export
          </button>
        </div>
      </div>

      {/* AI Suggestion */}
      {video.concept && (
        <div className="mt-3">
          <button
            onClick={() => setShowSuggestion(!showSuggestion)}
            className="flex items-center gap-2 text-xs text-zh-muted hover:text-zh-text transition-colors w-full"
          >
            <Lightbulb size={13} className="text-yellow-400" />
            <span className="font-medium">AI Suggestion</span>
            <ChevronDown
              size={13}
              className={`ml-auto transition-transform duration-200 ${showSuggestion ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showSuggestion && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-3 bg-zh-card border border-zh-border rounded-xl space-y-2">
                  {video.concept.hook && (
                    <SuggestionItem icon={Film} label="Hook" value={video.concept.hook} />
                  )}
                  {video.concept.music && (
                    <SuggestionItem icon={Music} label="Music" value={video.concept.music} />
                  )}
                  {video.concept.talent && (
                    <SuggestionItem icon={User} label="Talent" value={video.concept.talent} />
                  )}
                  {video.concept.mood && (
                    <SuggestionItem icon={Mic} label="Mood" value={video.concept.mood} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

function IconAction({
  icon: Icon,
  onClick,
  active,
  activeColor = 'text-zh-teal',
  label,
}: {
  icon: React.ElementType
  onClick: () => void
  active?: boolean
  activeColor?: string
  label?: string
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
        active ? activeColor + ' bg-zh-card' : 'text-zh-muted hover:text-zh-text hover:bg-zh-card'
      }`}
    >
      <Icon size={15} />
    </button>
  )
}

function SuggestionItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-5 h-5 rounded-md bg-zh-card2 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={11} className="text-zh-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-zh-muted uppercase tracking-wider">{label}</span>
        <p className="text-xs text-zh-text mt-0.5 leading-relaxed">{value}</p>
      </div>
    </div>
  )
}
