import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Grid3x3,
  List,
  Play,
  Pencil,
  Download,
  MoreHorizontal,
  Clock,
  Eye,
  Heart,
  CheckCircle,
  Loader2,
  Film,
  Plus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import type { VideoProject } from '@/types'

type ViewMode = 'grid' | 'list'
type FilterStatus = 'all' | 'ready' | 'generating' | 'draft'

const STATUS_CONFIG = {
  ready: { label: 'Ready', icon: CheckCircle, color: 'text-zh-teal', bg: 'bg-zh-teal/10 border-zh-teal/30' },
  generating: { label: 'Generating', icon: Loader2, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  draft: { label: 'Draft', icon: Clock, color: 'text-zh-muted', bg: 'bg-zh-card2 border-zh-border' },
  published: { label: 'Published', icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
}

function ProjectCard({ project, view }: { project: VideoProject; view: ViewMode }) {
  const navigate = useNavigate()
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.draft
  const StatusIcon = status.icon

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-4 bg-zh-card border border-zh-border rounded-xl hover:border-zh-border2 transition-all duration-200 group"
      >
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zh-card2 relative">
          {project.thumbnailUrl ? (
            <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film size={20} className="text-zh-subtle" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <Play size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-zh-text truncate">{project.title}</h3>
          <p className="text-xs text-zh-muted truncate mt-0.5">{project.prompt}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-zh-subtle">{project.aspectRatio}</span>
            <span className="text-[10px] text-zh-subtle">·</span>
            <span className="text-[10px] text-zh-subtle">{project.duration}s</span>
            <span className="text-[10px] text-zh-subtle">·</span>
            <span className="text-[10px] text-zh-subtle">{project.resolution}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium ${status.bg} ${status.color}`}>
            <StatusIcon size={10} className={project.status === 'generating' ? 'animate-spin' : ''} />
            {status.label}
          </div>
          <div className="flex items-center gap-2 text-zh-muted">
            <span className="flex items-center gap-1 text-xs"><Eye size={12} />{project.views.toLocaleString()}</span>
            <span className="flex items-center gap-1 text-xs"><Heart size={12} />{project.likes}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => navigate(`/studio/${project.id}`)}
              className="p-1.5 rounded-lg text-zh-muted hover:text-zh-teal hover:bg-zh-teal/10 transition-all"
            >
              <Pencil size={14} />
            </button>
            <button className="p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card2 transition-all">
              <Download size={14} />
            </button>
            <button className="p-1.5 rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card2 transition-all">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div
        className="relative rounded-2xl overflow-hidden bg-zh-card border border-zh-border group-hover:border-zh-border2 transition-all duration-200"
        style={{ aspectRatio: project.aspectRatio.replace(':', '/') }}
      >
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-dark flex items-center justify-center">
            <Film size={32} className="text-zh-subtle" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Play size={16} className="ml-0.5" />
            </button>
            <button
              onClick={() => navigate(`/studio/${project.id}`)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Pencil size={14} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded-md text-[9px] font-bold text-white">
            {project.aspectRatio}
          </span>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] font-medium ${status.bg} ${status.color} backdrop-blur-sm`}>
            <StatusIcon size={8} className={project.status === 'generating' ? 'animate-spin' : ''} />
            {status.label}
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2">
          <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded-md text-[9px] text-white">
            {project.duration}s
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-medium text-zh-text truncate">{project.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2 text-zh-muted">
            <span className="flex items-center gap-1 text-[11px]">
              <Eye size={11} />{project.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Heart size={11} />{project.likes}
            </span>
          </div>
          <span className="text-[11px] text-zh-subtle">{project.resolution}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { projects } = useProjectStore()

  const filtered = projects.filter((p) => {
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="h-full flex flex-col bg-zh-bg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zh-border flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zh-text">My Library</h1>
          <p className="text-[11px] text-zh-muted">{projects.length} projects</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-zh-teal text-black text-sm font-medium rounded-full hover:bg-opacity-90 transition-all active:scale-95"
        >
          <Plus size={16} />
          New Ad
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-zh-border flex-shrink-0">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zh-subtle" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 bg-zh-card border border-zh-border rounded-xl text-sm text-zh-text placeholder:text-zh-subtle outline-none focus:border-zh-teal transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-zh-card border border-zh-border rounded-xl p-1">
          {(['all', 'ready', 'generating', 'draft'] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                filterStatus === s
                  ? 'bg-zh-teal text-black'
                  : 'text-zh-muted hover:text-zh-text'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1 bg-zh-card border border-zh-border rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-zh-card2 text-zh-text' : 'text-zh-muted hover:text-zh-text'}`}
          >
            <Grid3x3 size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-zh-card2 text-zh-text' : 'text-zh-muted hover:text-zh-text'}`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Film size={40} className="text-zh-subtle" />
            <p className="text-zh-muted text-sm">No projects found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} view="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-w-4xl">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} view="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
