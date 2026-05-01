import type { WindowId } from '@/os/windowIds'

export type WindowDefinition = {
  id: WindowId
  title: string
  icon: string
  defaultSize: { width: number; height: number }
  defaultPosition: { x: number; y: number }
  minSize: { width: number; height: number }
}

export function getWindowDefinitions(viewport: { width: number; height: number }): WindowDefinition[] {
  const { width: w, height: h } = viewport
  const pad = 72
  const cx = (winW: number) => Math.max(24, w / 2 - winW / 2)
  const cy = (winH: number) => Math.max(pad + 28, h / 2 - winH / 2 - 24)

  return [
    {
      id: 'about',
      title: 'About',
      icon: 'user',
      defaultSize: { width: 560, height: 520 },
      defaultPosition: { x: Math.max(24, w * 0.06), y: pad },
      minSize: { width: 380, height: 320 },
    },
    {
      id: 'work',
      title: 'Work',
      icon: 'folder',
      defaultSize: { width: 640, height: 540 },
      defaultPosition: { x: cx(640) + 16, y: pad - 8 },
      minSize: { width: 400, height: 340 },
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: 'code',
      defaultSize: { width: 580, height: 480 },
      defaultPosition: { x: Math.max(24, w * 0.1), y: pad + 40 },
      minSize: { width: 420, height: 300 },
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: 'mail',
      defaultSize: { width: 520, height: 500 },
      defaultPosition: { x: cx(520), y: cy(500) },
      minSize: { width: 360, height: 380 },
    },
    {
      id: 'resume',
      title: 'Résumé',
      icon: 'file-text',
      defaultSize: { width: 560, height: 620 },
      defaultPosition: { x: cx(560) - 20, y: pad },
      minSize: { width: 400, height: 400 },
    },
    {
      id: 'terminal',
      title: 'Terminal',
      icon: 'terminal',
      defaultSize: { width: 480, height: 360 },
      defaultPosition: { x: Math.max(24, w - 480 - 40), y: Math.max(pad + 20, h - 360 - 100) },
      minSize: { width: 320, height: 240 },
    },
  ]
}
