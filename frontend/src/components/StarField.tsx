import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Создаём звёзды
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }))

    // Несколько более ярких звёзд
    const brightStars = Array.from({ length: 15 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }))

    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Обычные звёзды
      stars.forEach(star => {
        const alpha = 0.2 + 0.6 * Math.abs(Math.sin(t * star.speed + star.phase))
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
      })

      // Яркие звёзды с крестиком
      brightStars.forEach(star => {
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * star.speed + star.phase))
        ctx.save()
        ctx.translate(star.x, star.y)

        // Крестик свечение
        ctx.strokeStyle = `rgba(167, 139, 250, ${alpha * 0.6})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(-star.r * 3, 0)
        ctx.lineTo(star.r * 3, 0)
        ctx.moveTo(0, -star.r * 3)
        ctx.lineTo(0, star.r * 3)
        ctx.stroke()

        // Точка
        ctx.beginPath()
        ctx.arc(0, 0, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 210, 255, ${alpha})`
        ctx.fill()
        ctx.restore()
      })

      t++
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}