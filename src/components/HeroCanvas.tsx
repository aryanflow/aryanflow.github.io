import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/** Lightweight particle field - GPU-friendly points, no post stack. */
export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.z = 2.8

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const count = 1400
    const positions = new Float32Array(count * 3)
    const rnd = () => (Math.random() - 0.5) * 2.4
    for (let i = 0; i < count; i++) {
      positions[i * 3] = rnd()
      positions[i * 3 + 1] = rnd()
      positions[i * 3 + 2] = rnd()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.012,
      color: 0xc4d4ff,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    let raf = 0
    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w < 1 || h < 1) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const t0 = performance.now()
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      const elapsed = (t - t0) * 0.00015
      points.rotation.y = elapsed * 0.35
      points.rotation.x = Math.sin(elapsed * 0.4) * 0.08
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.85] mix-blend-screen md:opacity-100"
      aria-hidden
    />
  )
}
