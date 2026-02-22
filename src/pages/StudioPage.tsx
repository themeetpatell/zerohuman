import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Scissors,
  Type,
  Image,
  Music,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Download,
  Share2,
  ChevronLeft,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  MousePointer,
  Sliders,
  Film,
  Sparkles,
  AlignCenter,
  Bold,
  Italic,
  Maximize2,
} from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'

// ─── Layer Types ────────────────────────────────────────────────────────────

interface Layer {
  id: string
  type: 'video' | 'text' | 'image' | 'audio' | 'effect'
  name: string
  start: number // seconds
  end: number
  isVisible: boolean
  isLocked: boolean
  color: string
  opacity: number
}

const LAYER_COLORS: Record<Layer['type'], string> = {
  video: '#3dd9b3',
  text: '#a78bfa',
  image: '#60a5fa',
  audio: '#fb923c',
  effect: '#f472b6',
}

const LAYER_ICONS: Record<Layer['type'], React.ElementType> = {
  video: Film,
  text: Type,
  image: Image,
  audio: Music,
  effect: Sparkles,
}

const DEFAULT_LAYERS: Layer[] = [
  { id: 'l1', type: 'video', name: 'Main Footage', start: 0, end: 10, isVisible: true, isLocked: false, color: LAYER_COLORS.video, opacity: 1 },
  { id: 'l2', type: 'video', name: 'B-Roll', start: 2, end: 6, isVisible: true, isLocked: false, color: LAYER_COLORS.video, opacity: 0.8 },
  { id: 'l3', type: 'text', name: 'Brand Text', start: 0.5, end: 3, isVisible: true, isLocked: false, color: LAYER_COLORS.text, opacity: 1 },
  { id: 'l4', type: 'text', name: 'Tagline', start: 7, end: 9.5, isVisible: true, isLocked: false, color: LAYER_COLORS.text, opacity: 1 },
  { id: 'l5', type: 'audio', name: 'Background Music', start: 0, end: 10, isVisible: true, isLocked: true, color: LAYER_COLORS.audio, opacity: 0.7 },
  { id: 'l6', type: 'effect', name: 'Color Grade', start: 0, end: 10, isVisible: true, isLocked: false, color: LAYER_COLORS.effect, opacity: 0.5 },
  { id: 'l7', type: 'image', name: 'Logo Watermark', start: 0, end: 10, isVisible: true, isLocked: false, color: LAYER_COLORS.image, opacity: 0.9 },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function ToolBar({
  activeTool,
  onToolChange,
}: {
  activeTool: string
  onToolChange: (t: string) => void
}) {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select (V)' },
    { id: 'cut', icon: Scissors, label: 'Cut (C)' },
    { id: 'text', icon: Type, label: 'Text (T)' },
    { id: 'image', icon: Image, label: 'Image (I)' },
  ]

  return (
    <div className="flex items-center gap-1">
      {tools.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          title={label}
          onClick={() => onToolChange(id)}
          className={`p-2 rounded-lg transition-all duration-150 ${
            activeTool === id
              ? 'bg-zh-teal/20 text-zh-teal'
              : 'text-zh-muted hover:text-zh-text hover:bg-zh-card2'
          }`}
        >
          <Icon size={15} />
        </button>
      ))}
    </div>
  )
}

function LayersPanel({
  layers,
  selectedId,
  onSelect,
  onToggleVisible,
  onToggleLock,
  onDelete,
  onAdd,
}: {
  layers: Layer[]
  selectedId: string | null
  onSelect: (id: string) => void
  onToggleVisible: (id: string) => void
  onToggleLock: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}) {
  return (
    <div className="w-56 flex-shrink-0 border-r border-zh-border flex flex-col bg-zh-elevated">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zh-border">
        <span className="text-xs font-semibold text-zh-text">Layers</span>
        <button
          onClick={onAdd}
          className="p-1 rounded-md text-zh-muted hover:text-zh-teal hover:bg-zh-teal/10 transition-all"
        >
          <Plus size={13} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {[...layers].reverse().map((layer) => {
          const Icon = LAYER_ICONS[layer.type]
          const isSelected = selectedId === layer.id
          return (
            <div
              key={layer.id}
              onClick={() => onSelect(layer.id)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-150 ${
                isSelected ? 'bg-zh-card border-l-2 border-zh-teal' : 'hover:bg-zh-card/50 border-l-2 border-transparent'
              }`}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: layer.color }}
              />
              <Icon size={12} style={{ color: layer.color }} className="flex-shrink-0" />
              <span className="flex-1 text-xs truncate text-zh-text">{layer.name}</span>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleVisible(layer.id) }}
                  className={`p-0.5 rounded transition-colors ${layer.isVisible ? 'text-zh-muted hover:text-zh-text' : 'text-zh-subtle'}`}
                >
                  {layer.isVisible ? <Eye size={11} /> : <EyeOff size={11} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id) }}
                  className={`p-0.5 rounded transition-colors ${layer.isLocked ? 'text-yellow-400' : 'text-zh-subtle hover:text-zh-muted'}`}
                >
                  {layer.isLocked ? <Lock size={10} /> : <Unlock size={10} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(layer.id) }}
                  className="p-0.5 rounded text-zh-subtle hover:text-red-400 transition-colors"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PropertiesPanel({
  layer,
  onUpdate,
}: {
  layer: Layer | null
  onUpdate: (id: string, updates: Partial<Layer>) => void
}) {
  if (!layer) {
    return (
      <div className="w-64 flex-shrink-0 border-l border-zh-border bg-zh-elevated flex items-center justify-center">
        <p className="text-xs text-zh-subtle text-center px-4">
          Select a layer to edit its properties
        </p>
      </div>
    )
  }

  const Icon = LAYER_ICONS[layer.type]

  return (
    <div className="w-64 flex-shrink-0 border-l border-zh-border bg-zh-elevated overflow-y-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zh-border">
        <Icon size={14} style={{ color: layer.color }} />
        <span className="text-xs font-semibold text-zh-text flex-1 truncate">{layer.name}</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Opacity */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zh-muted mb-2 block">
            Opacity
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={layer.opacity}
              onChange={(e) => onUpdate(layer.id, { opacity: parseFloat(e.target.value) })}
              className="flex-1 accent-zh-teal h-1"
            />
            <span className="text-xs text-zh-text w-10 text-right">
              {Math.round(layer.opacity * 100)}%
            </span>
          </div>
        </div>

        {/* Timing */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zh-muted mb-2 block">
            Timing
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zh-subtle mb-1 block">Start</label>
              <input
                type="number"
                min={0}
                max={layer.end}
                step={0.1}
                value={layer.start}
                onChange={(e) => onUpdate(layer.id, { start: parseFloat(e.target.value) })}
                className="w-full bg-zh-card border border-zh-border rounded-lg px-2 py-1.5 text-xs text-zh-text outline-none focus:border-zh-teal"
              />
            </div>
            <div>
              <label className="text-[10px] text-zh-subtle mb-1 block">End</label>
              <input
                type="number"
                min={layer.start}
                step={0.1}
                value={layer.end}
                onChange={(e) => onUpdate(layer.id, { end: parseFloat(e.target.value) })}
                className="w-full bg-zh-card border border-zh-border rounded-lg px-2 py-1.5 text-xs text-zh-text outline-none focus:border-zh-teal"
              />
            </div>
          </div>
        </div>

        {/* Text-specific properties */}
        {layer.type === 'text' && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zh-muted mb-2 block">
              Text Style
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {[Bold, Italic, AlignCenter].map((Icon, i) => (
                  <button
                    key={i}
                    className="p-1.5 rounded-lg bg-zh-card border border-zh-border text-zh-muted hover:text-zh-text hover:border-zh-border2 transition-all"
                  >
                    <Icon size={13} />
                  </button>
                ))}
              </div>
              <input
                type="text"
                defaultValue="Brand Text"
                className="w-full bg-zh-card border border-zh-border rounded-lg px-3 py-2 text-xs text-zh-text outline-none focus:border-zh-teal"
                placeholder="Enter text..."
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zh-subtle mb-1 block">Size</label>
                  <input
                    type="number"
                    defaultValue={48}
                    className="w-full bg-zh-card border border-zh-border rounded-lg px-2 py-1.5 text-xs text-zh-text outline-none focus:border-zh-teal"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zh-subtle mb-1 block">Color</label>
                  <input
                    type="color"
                    defaultValue="#ffffff"
                    className="w-full h-[30px] rounded-lg border border-zh-border bg-zh-card cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Effects */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zh-muted mb-2 block">
            Effects
          </label>
          <div className="space-y-1.5">
            {['Fade In', 'Fade Out', 'Blur', 'Vignette'].map((effect) => (
              <label key={effect} className="flex items-center justify-between py-1 cursor-pointer group">
                <span className="text-xs text-zh-muted group-hover:text-zh-text transition-colors">{effect}</span>
                <input type="checkbox" className="accent-zh-teal" />
              </label>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zh-muted mb-2 block">
            Color Correction
          </label>
          <div className="space-y-2">
            {[
              { label: 'Brightness', val: 50 },
              { label: 'Contrast', val: 50 },
              { label: 'Saturation', val: 50 },
            ].map(({ label, val }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-zh-muted">{label}</span>
                  <span className="text-[10px] text-zh-subtle">{val}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={val}
                  className="w-full accent-zh-teal h-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Timeline({
  layers,
  currentTime,
  duration,
  onScrub,
  selectedId,
  onSelectLayer,
}: {
  layers: Layer[]
  currentTime: number
  duration: number
  onScrub: (t: number) => void
  selectedId: string | null
  onSelectLayer: (id: string) => void
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  const handleRailClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return
    const rect = railRef.current.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    onScrub(Math.max(0, Math.min(duration, pct * duration)))
  }

  const TICK_COUNT = 11

  return (
    <div className="border-t border-zh-border bg-zh-elevated flex flex-col" style={{ height: '220px' }}>
      {/* Timeline toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-zh-border flex-shrink-0">
        <span className="text-[10px] font-mono text-zh-muted w-14">
          {currentTime.toFixed(2)}s
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="p-1 rounded text-zh-muted hover:text-zh-text transition-colors"
          >
            <ZoomOut size={13} />
          </button>
          <span className="text-[10px] text-zh-muted w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(4, zoom + 0.25))}
            className="p-1 rounded text-zh-muted hover:text-zh-text transition-colors"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Layer name column */}
        <div className="w-40 flex-shrink-0 border-r border-zh-border pt-6">
          {[...layers].reverse().map((layer) => {
            const Icon = LAYER_ICONS[layer.type]
            return (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`h-8 flex items-center gap-1.5 px-3 cursor-pointer border-b border-zh-border/50 ${
                  selectedId === layer.id ? 'bg-zh-card' : 'hover:bg-zh-card/30'
                }`}
              >
                <Icon size={10} style={{ color: layer.color }} />
                <span className="text-[10px] text-zh-muted truncate">{layer.name}</span>
              </div>
            )
          })}
        </div>

        {/* Rail */}
        <div className="flex-1 overflow-x-auto">
          {/* Time ruler */}
          <div
            ref={railRef}
            className="relative h-6 border-b border-zh-border cursor-pointer"
            style={{ width: `${100 * zoom}%`, minWidth: '100%' }}
            onClick={handleRailClick}
          >
            {Array.from({ length: TICK_COUNT }).map((_, i) => {
              const t = (i / (TICK_COUNT - 1)) * duration
              return (
                <div
                  key={i}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${(i / (TICK_COUNT - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-px h-2 bg-zh-border2" />
                  <span className="text-[8px] text-zh-subtle mt-0.5">{t.toFixed(1)}s</span>
                </div>
              )
            })}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-px bg-zh-teal pointer-events-none z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
              <div className="w-2.5 h-2.5 bg-zh-teal rounded-full absolute -top-0.5 -translate-x-1/2" />
            </div>
          </div>

          {/* Layer tracks */}
          <div style={{ width: `${100 * zoom}%`, minWidth: '100%' }}>
            {[...layers].reverse().map((layer) => (
              <div
                key={layer.id}
                className="relative h-8 border-b border-zh-border/50"
                onClick={handleRailClick}
              >
                {/* Clip */}
                <div
                  className="absolute top-1 bottom-1 rounded cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                  style={{
                    left: `${(layer.start / duration) * 100}%`,
                    width: `${((layer.end - layer.start) / duration) * 100}%`,
                    backgroundColor: layer.color + '40',
                    borderLeft: `2px solid ${layer.color}`,
                    borderRight: `1px solid ${layer.color}60`,
                  }}
                  onClick={(e) => { e.stopPropagation(); onSelectLayer(layer.id) }}
                >
                  <span className="absolute inset-0 flex items-center px-1.5 text-[9px] font-medium truncate"
                    style={{ color: layer.color }}>
                    {layer.name}
                  </span>
                  {/* Resize handles */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-white/10 rounded-l" />
                  <div className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-white/10 rounded-r" />
                </div>

                {/* Playhead overlay */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-zh-teal/30 pointer-events-none"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Studio Page ─────────────────────────────────────────────────────────

export default function StudioPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects } = useProjectStore()

  const project = projects.find((p) => p.id === projectId) ?? projects[0]

  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS)
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('l1')
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeTool, setActiveTool] = useState('select')
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [zoom, setZoom] = useState(1)

  const duration = project?.duration ?? 10
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? null

  const toggleLayer = (id: string, field: 'isVisible' | 'isLocked') => {
    setLayers((ls) => ls.map((l) => l.id === id ? { ...l, [field]: !l[field] } : l))
  }

  const deleteLayer = (id: string) => {
    setLayers((ls) => ls.filter((l) => l.id !== id))
    if (selectedLayerId === id) setSelectedLayerId(null)
  }

  const addLayer = () => {
    const newLayer: Layer = {
      id: `l${Date.now()}`,
      type: 'text',
      name: 'New Text',
      start: 0,
      end: 5,
      isVisible: true,
      isLocked: false,
      color: LAYER_COLORS.text,
      opacity: 1,
    }
    setLayers((ls) => [...ls, newLayer])
    setSelectedLayerId(newLayer.id)
  }

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers((ls) => ls.map((l) => l.id === id ? { ...l, ...updates } : l))
  }

  return (
    <div className="h-full flex flex-col bg-zh-bg overflow-hidden">
      {/* Top toolbar */}
      <div className="h-12 flex items-center gap-3 px-4 border-b border-zh-border flex-shrink-0 bg-zh-elevated">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="w-px h-5 bg-zh-border" />

        {/* Project name */}
        <span className="text-sm font-medium text-zh-text max-w-40 truncate">
          {project?.title ?? 'Studio'}
        </span>

        <div className="w-px h-5 bg-zh-border" />

        {/* Tools */}
        <ToolBar activeTool={activeTool} onToolChange={setActiveTool} />

        <div className="w-px h-5 bg-zh-border" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card transition-all">
            <RotateCcw size={14} />
          </button>
          <button className="p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card transition-all">
            <RotateCw size={14} />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} className="p-1 rounded text-zh-muted hover:text-zh-text transition-colors">
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-zh-muted w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(3, zoom + 0.25))} className="p-1 rounded text-zh-muted hover:text-zh-text transition-colors">
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className={`p-1.5 rounded-lg transition-all ${leftPanelOpen ? 'text-zh-teal bg-zh-teal/10' : 'text-zh-muted hover:text-zh-text hover:bg-zh-card'}`}
          >
            <Layers size={15} />
          </button>
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className={`p-1.5 rounded-lg transition-all ${rightPanelOpen ? 'text-zh-teal bg-zh-teal/10' : 'text-zh-muted hover:text-zh-text hover:bg-zh-card'}`}
          >
            <Sliders size={15} />
          </button>

          <div className="w-px h-5 bg-zh-border" />

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zh-card border border-zh-border rounded-full text-xs text-zh-muted hover:border-zh-border2 hover:text-zh-text transition-all">
            <Share2 size={13} />
            Share
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zh-teal text-black rounded-full text-xs font-semibold hover:bg-opacity-90 transition-all active:scale-95">
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layers panel */}
        <AnimatePresence>
          {leftPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 224, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex-shrink-0"
            >
              <LayersPanel
                layers={layers}
                selectedId={selectedLayerId}
                onSelect={setSelectedLayerId}
                onToggleVisible={(id) => toggleLayer(id, 'isVisible')}
                onToggleLock={(id) => toggleLayer(id, 'isLocked')}
                onDelete={deleteLayer}
                onAdd={addLayer}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video canvas */}
        <div className="flex-1 flex flex-col items-center justify-center bg-zh-bg relative overflow-hidden">
          {/* Canvas area */}
          <div
            className="relative bg-black border border-zh-border rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: `min(${zoom * 480}px, 90%)`,
              aspectRatio: project?.aspectRatio.replace(':', '/') ?? '9/16',
              maxHeight: '75%',
            }}
          >
            {project?.thumbnailUrl ? (
              <img
                src={project.thumbnailUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zh-card to-zh-bg flex items-center justify-center">
                <Film size={48} className="text-zh-subtle" />
              </div>
            )}

            {/* Overlay for text layer preview */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span
                className="text-white font-bold text-center drop-shadow-lg"
                style={{ fontSize: `${Math.min(32, 480 * zoom * 0.07)}px` }}
              >
                Brand Name
              </span>
            </div>

            {/* Scrubber playhead indicator */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />

            {/* Corner handles for selection */}
            {selectedLayer && (
              <>
                {[
                  'top-0 left-0',
                  'top-0 right-0',
                  'bottom-0 left-0',
                  'bottom-0 right-0',
                ].map((pos) => (
                  <div
                    key={pos}
                    className={`absolute ${pos} w-3 h-3 border-2 border-zh-teal bg-zh-bg rounded-sm`}
                  />
                ))}
              </>
            )}
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => setCurrentTime(0)}
              className="p-2 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card transition-all"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-zh-teal text-black flex items-center justify-center hover:bg-opacity-90 transition-all active:scale-95"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button
              onClick={() => setCurrentTime(duration)}
              className="p-2 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card transition-all"
            >
              <SkipForward size={16} />
            </button>

            {/* Timecode */}
            <span className="text-xs font-mono text-zh-muted ml-2">
              {currentTime.toFixed(2)}s / {duration}s
            </span>

            {/* Volume */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card transition-all ml-2"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Fullscreen */}
            <button className="p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card transition-all">
              <Maximize2 size={15} />
            </button>
          </div>
        </div>

        {/* Properties panel */}
        <AnimatePresence>
          {rightPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex-shrink-0"
            >
              <PropertiesPanel layer={selectedLayer} onUpdate={updateLayer} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline */}
      <Timeline
        layers={layers}
        currentTime={currentTime}
        duration={duration}
        onScrub={setCurrentTime}
        selectedId={selectedLayerId}
        onSelectLayer={setSelectedLayerId}
      />
    </div>
  )
}
