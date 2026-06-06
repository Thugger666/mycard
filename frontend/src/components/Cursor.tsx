import { useEffect, useRef } from 'react'

export default function Cursor() {
  const curRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouch) return

    let mx = 0, my = 0, rx = 0, ry = 0
    const cur = curRef.current!
    const ring = ringRef.current!

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      cur.style.left = mx + 'px'
      cur.style.top = my + 'px'
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    let raf: number
    const tick = () => {
      rx = lerp(rx, mx, 0.12)
      ry = lerp(ry, my, 0.12)
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      raf = requestAnimationFrame(tick)
    }
    tick()

    document.addEventListener('mousemove', onMove)
    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div id="cursor" ref={curRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  )
}
