import { useEffect, useRef } from 'react'

interface Point3D { x: number; y: number; z: number }
interface Point2D { x: number; y: number }

function project(p: Point3D, cx: number, cy: number, fov: number): Point2D {
  const z = p.z + fov
  return {
    x: cx + (p.x * fov) / z,
    y: cy + (p.y * fov) / z,
  }
}

function rotateY(p: Point3D, angle: number): Point3D {
  return {
    x: p.x * Math.cos(angle) - p.z * Math.sin(angle),
    y: p.y,
    z: p.x * Math.sin(angle) + p.z * Math.cos(angle),
  }
}

function rotateX(p: Point3D, angle: number): Point3D {
  return {
    x: p.x,
    y: p.y * Math.cos(angle) - p.z * Math.sin(angle),
    z: p.y * Math.sin(angle) + p.z * Math.cos(angle),
  }
}

export default function WireframeGlobe({ size = 220 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const angleRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const R = size * 0.36
    const cx = size / 2
    const cy = size / 2
    const fov = size * 1.4
    const lats = 10
    const lons = 14

    // Generate sphere points
    const getPoints = (): Point3D[] => {
      const pts: Point3D[] = []
      for (let la = 0; la <= lats; la++) {
        const phi = (la / lats) * Math.PI
        for (let lo = 0; lo < lons; lo++) {
          const theta = (lo / lons) * 2 * Math.PI
          pts.push({
            x: R * Math.sin(phi) * Math.cos(theta),
            y: R * Math.cos(phi),
            z: R * Math.sin(phi) * Math.sin(theta),
          })
        }
      }
      return pts
    }

    const draw = () => {
      ctx.clearRect(0, 0, size, size)
      angleRef.current += 0.008

      const ay = angleRef.current
      const ax = Math.PI / 8

      // Draw latitude circles
      for (let la = 0; la <= lats; la++) {
        const phi = (la / lats) * Math.PI
        const latitude = (la / lats - 0.5) * 2 // -1 to 1

        // Color based on latitude: green (bottom) -> yellow (mid) -> red (top)
        let r: number, g: number, b: number
        if (latitude < 0) {
          r = Math.floor(255 * (1 + latitude))
          g = 200
          b = 60
        } else {
          r = 220
          g = Math.floor(200 * (1 - latitude))
          b = 60
        }

        const alpha = 0.5 + 0.3 * Math.abs(latitude)
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.lineWidth = 0.8
        ctx.beginPath()

        let first = true
        const steps = 48
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * 2 * Math.PI
          let p: Point3D = {
            x: R * Math.sin(phi) * Math.cos(theta),
            y: R * Math.cos(phi),
            z: R * Math.sin(phi) * Math.sin(theta),
          }
          p = rotateX(rotateY(p, ay), ax)
          const proj = project(p, cx, cy, fov)
          if (first) { ctx.moveTo(proj.x, proj.y); first = false }
          else ctx.lineTo(proj.x, proj.y)
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Draw longitude lines
      for (let lo = 0; lo < lons; lo++) {
        const theta = (lo / lons) * 2 * Math.PI
        ctx.strokeStyle = 'rgba(100, 180, 120, 0.25)'
        ctx.lineWidth = 0.6
        ctx.beginPath()
        let first = true
        const steps = 32
        for (let i = 0; i <= steps; i++) {
          const phi = (i / steps) * Math.PI
          let p: Point3D = {
            x: R * Math.sin(phi) * Math.cos(theta),
            y: R * Math.cos(phi),
            z: R * Math.sin(phi) * Math.sin(theta),
          }
          p = rotateX(rotateY(p, ay), ax)
          const proj = project(p, cx, cy, fov)
          if (first) { ctx.moveTo(proj.x, proj.y); first = false }
          else ctx.lineTo(proj.x, proj.y)
        }
        ctx.stroke()
      }

      // Draw vertex dots
      const pts = getPoints()
      pts.forEach((p) => {
        const rp = rotateX(rotateY(p, ay), ax)
        const proj = project(rp, cx, cy, fov)
        const lat = p.y / R
        let dotR: number, dotG: number, dotB: number
        if (lat > 0) {
          dotR = 220; dotG = Math.floor(150 * (1 - lat)); dotB = 50
        } else {
          dotR = Math.floor(80 * (1 + lat * 2) + 100); dotG = 200; dotB = 80
        }
        const isVisible = rp.z < fov * 0.7
        if (isVisible) {
          ctx.beginPath()
          ctx.arc(proj.x, proj.y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${dotR},${dotG},${dotB},0.7)`
          ctx.fill()
        }
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block"
      style={{ imageRendering: 'crisp-edges' }}
    />
  )
}
