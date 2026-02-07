import { useEffect, useRef } from "react"

const useMouse = () => {
  const mousePos = useRef({
    x: 0,
    y: 0
  })


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const posX = (e.clientX / window.innerWidth - 0.5) * 2
      const posY = (-e.clientY / window.innerHeight + 0.5) * 2
      mousePos.current = {
        x: posX,
        y: posY
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }

  }, [])

  return mousePos
}

export default useMouse
