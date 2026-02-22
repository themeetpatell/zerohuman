import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Check } from 'lucide-react'
import WireframeGlobe from './WireframeGlobe'
import { useProjectStore } from '@/store/projectStore'
import type { Resolution, AspectRatio } from '@/types'

const RESOLUTIONS: { label: Resolution; pro: boolean }[] = [
  { label: 'HD', pro: false },
  { label: '2K', pro: true },
  { label: '4K', pro: true },
  { label: '8K', pro: true },
]

const ASPECT_RATIOS: { label: AspectRatio; icon: string; desc: string }[] = [
  { label: '16:9', icon: '▬', desc: 'Landscape' },
  { label: '9:16', icon: '▮', desc: 'Portrait' },
  { label: '1:1', icon: '■', desc: 'Square' },
  { label: '4:5', icon: '▯', desc: 'Social' },
  { label: '16:10', icon: '▬', desc: 'Cinema' },
  { label: '5:2', icon: '▬', desc: 'Ultra' },
]

const CAMERA_ANGLES = ['FRONT', 'SIDE', 'TOP', 'ORBIT', '45°', 'LOW']

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useProjectStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-auto px-4"
          >
            <div className="bg-zh-card border border-zh-border rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zh-border">
                <h3 className="text-sm font-semibold text-zh-text">Generation Settings</h3>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zh-muted hover:text-zh-text hover:bg-zh-card2 transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex divide-x divide-zh-border">
                {/* Left panel */}
                <div className="flex-1 p-5 space-y-5">
                  {/* Duration */}
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-zh-muted uppercase mb-2 block">
                      Duration
                    </label>
                    <div className="flex gap-2">
                      {([5, 10, 15, 30] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => updateSettings({ duration: d })}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            settings.duration === d
                              ? 'bg-zh-teal text-black'
                              : 'bg-zh-card2 border border-zh-border text-zh-muted hover:border-zh-border2 hover:text-zh-text'
                          }`}
                        >
                          {d}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution */}
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-zh-muted uppercase mb-2 block">
                      Resolution
                    </label>
                    <div className="flex gap-2">
                      {RESOLUTIONS.map(({ label, pro }) => (
                        <button
                          key={label}
                          onClick={() => !pro && updateSettings({ resolution: label })}
                          className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            settings.resolution === label
                              ? 'bg-zh-teal text-black'
                              : 'bg-zh-card2 border border-zh-border text-zh-muted hover:border-zh-border2 hover:text-zh-text'
                          } ${pro ? 'opacity-60' : ''}`}
                        >
                          {label}
                          {pro && (
                            <Crown
                              size={9}
                              className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-zh-muted uppercase mb-2 block">
                      Options
                    </label>
                    <div className="flex items-center justify-between bg-zh-card2 border border-zh-border rounded-xl px-4 py-2.5">
                      <span className="text-sm text-zh-text">Public</span>
                      <button
                        onClick={() => updateSettings({ isPublic: !settings.isPublic })}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                          settings.isPublic ? 'bg-zh-teal' : 'bg-zh-border2'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                            settings.isPublic ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-zh-muted uppercase mb-2 block">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {ASPECT_RATIOS.map(({ label }) => {
                        const [w, h] = label.split(':').map(Number)
                        const isSelected = settings.aspectRatio === label
                        return (
                          <button
                            key={label}
                            onClick={() => updateSettings({ aspectRatio: label })}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200 ${
                              isSelected
                                ? 'border-zh-teal bg-zh-teal/10'
                                : 'border-zh-border bg-zh-card2 hover:border-zh-border2'
                            }`}
                          >
                            {/* Aspect ratio preview box */}
                            <div className="flex items-center justify-center w-8 h-8">
                              <div
                                className={`border-2 rounded-sm ${
                                  isSelected ? 'border-zh-teal' : 'border-zh-muted'
                                }`}
                                style={{
                                  width: `${Math.min(28, 28 * (w / Math.max(w, h)))}px`,
                                  height: `${Math.min(28, 28 * (h / Math.max(w, h)))}px`,
                                }}
                              />
                            </div>
                            <span className={`text-[10px] font-medium ${isSelected ? 'text-zh-teal' : 'text-zh-muted'}`}>
                              {label}
                            </span>
                            {isSelected && <Check size={8} className="text-zh-teal" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 py-2 text-xs text-zh-muted border border-zh-border rounded-lg hover:border-zh-border2 transition-all">
                      Reset All
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-gray-100 transition-all"
                    >
                      Apply Settings
                    </button>
                  </div>
                </div>

                {/* Right panel – Camera */}
                <div className="w-64 p-5">
                  <label className="text-[10px] font-bold tracking-widest text-zh-muted uppercase mb-4 block">
                    Camera
                  </label>

                  {/* Globe */}
                  <div className="bg-zh-card2 border border-zh-border rounded-2xl p-3 mb-4 flex items-center justify-center">
                    <WireframeGlobe size={180} />
                  </div>

                  {/* Camera angle label */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-widest text-zh-text uppercase">
                      {settings.cameraAngle}
                    </span>
                    <span className="text-[10px] text-zh-muted">Angle</span>
                  </div>

                  {/* Camera angle selector */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {CAMERA_ANGLES.map((angle) => (
                      <button
                        key={angle}
                        onClick={() => updateSettings({ cameraAngle: angle })}
                        className={`py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 ${
                          settings.cameraAngle === angle
                            ? 'bg-zh-teal text-black'
                            : 'bg-zh-card2 border border-zh-border text-zh-muted hover:border-zh-border2 hover:text-zh-text'
                        }`}
                      >
                        {angle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
