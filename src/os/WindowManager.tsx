import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { WindowId } from '@/os/windowIds'
import { getWindowDefinitions, type WindowDefinition } from '@/os/windowDefaults'

export type ManagedWindow = WindowDefinition & {
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  /** Snapshot before maximize */
  preMax?: { position: { x: number; y: number }; size: { width: number; height: number } }
}

export type DockTargetRect = { x: number; y: number; width: number; height: number }

type State = {
  windows: ManagedWindow[]
  topZ: number
  activeTitle: string
  dockTargets: Partial<Record<WindowId, DockTargetRect>>
}

type Action =
  | { type: 'OPEN_WINDOW'; id: WindowId }
  | { type: 'CLOSE_WINDOW'; id: WindowId }
  | { type: 'MINIMIZE_WINDOW'; id: WindowId }
  | { type: 'RESTORE_WINDOW'; id: WindowId }
  | { type: 'FOCUS_WINDOW'; id: WindowId }
  | { type: 'MAXIMIZE_WINDOW'; id: WindowId }
  | { type: 'UPDATE_POSITION'; id: WindowId; position: { x: number; y: number } }
  | { type: 'UPDATE_SIZE'; id: WindowId; size: { width: number; height: number } }
  | { type: 'SET_DOCK_TARGET'; id: WindowId; rect: DockTargetRect | null }
  | { type: 'SYNC_DEFINITIONS'; defs: WindowDefinition[] }

function definitionsToManaged(defs: WindowDefinition[]): ManagedWindow[] {
  return defs.map((d, i) => ({
    ...d,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex: 20 + i,
    position: { ...d.defaultPosition },
    size: { ...d.defaultSize },
    preMax: undefined,
  }))
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SYNC_DEFINITIONS': {
      const merged = action.defs.map((def) => {
        const prev = state.windows.find((w) => w.id === def.id)
        if (!prev) {
          return {
            ...def,
            isOpen: false,
            isMinimized: false,
            isMaximized: false,
            isFocused: false,
            zIndex: 20,
            position: { ...def.defaultPosition },
            size: { ...def.defaultSize },
            preMax: undefined,
          } satisfies ManagedWindow
        }
        return {
          ...def,
          isOpen: prev.isOpen,
          isMinimized: prev.isMinimized,
          isMaximized: prev.isMaximized,
          isFocused: prev.isFocused,
          zIndex: prev.zIndex,
          position: { ...prev.position },
          size: { ...prev.size },
          preMax: prev.preMax,
        }
      })
      const focused = merged.find((w) => w.isFocused)
      return {
        ...state,
        windows: merged,
        activeTitle: focused?.title ?? '',
      }
    }
    case 'OPEN_WINDOW': {
      const topZ = state.topZ + 1
      const windows = state.windows.map((w) => {
        if (w.id !== action.id) return { ...w, isFocused: false }
        return {
          ...w,
          isOpen: true,
          isMinimized: false,
          isFocused: true,
          zIndex: topZ,
          position: { ...w.position },
        }
      })
      const w = windows.find((x) => x.id === action.id)
      return { ...state, windows, topZ, activeTitle: w?.title ?? state.activeTitle }
    }
    case 'CLOSE_WINDOW': {
      const windows = state.windows.map((w) =>
        w.id === action.id
          ? { ...w, isOpen: false, isMinimized: false, isMaximized: false, isFocused: false }
          : w,
      )
      const focused = windows.find((x) => x.isFocused)
      const fallback = windows.find((x) => x.isOpen && !x.isMinimized)
      return {
        ...state,
        windows,
        activeTitle: focused?.title ?? fallback?.title ?? '',
      }
    }
    case 'MINIMIZE_WINDOW': {
      const windows = state.windows.map((w) =>
        w.id === action.id ? { ...w, isMinimized: true, isFocused: false, isMaximized: false } : w,
      )
      const next =
        windows.find((x) => x.isOpen && !x.isMinimized && x.isFocused)
        ?? windows.find((x) => x.isOpen && !x.isMinimized)
      const topZ = next ? state.topZ + 1 : state.topZ
      const windows2 = next
        ? windows.map((w) => (w.id === next.id ? { ...w, isFocused: true, zIndex: topZ } : w))
        : windows
      return {
        ...state,
        windows: windows2,
        topZ: next ? topZ : state.topZ,
        activeTitle: windows2.find((w) => w.isFocused)?.title ?? '',
      }
    }
    case 'RESTORE_WINDOW': {
      const topZ = state.topZ + 1
      const windows = state.windows.map((w) => {
        if (w.id !== action.id) return { ...w, isFocused: false }
        return {
          ...w,
          isOpen: true,
          isMinimized: false,
          isFocused: true,
          zIndex: topZ,
        }
      })
      const w = windows.find((x) => x.id === action.id)
      return { ...state, windows, topZ, activeTitle: w?.title ?? '' }
    }
    case 'FOCUS_WINDOW': {
      if (!state.windows.find((w) => w.id === action.id)?.isOpen) return state
      const topZ = state.topZ + 1
      const windows = state.windows.map((w) => {
        if (w.id === action.id) return { ...w, isFocused: true, zIndex: topZ, isMinimized: false }
        return { ...w, isFocused: false }
      })
      const w = windows.find((x) => x.id === action.id)
      return { ...state, windows, topZ, activeTitle: w?.title ?? '' }
    }
    case 'MAXIMIZE_WINDOW': {
      const topZ = state.topZ + 1
      const windows = state.windows.map((w) => {
        if (w.id !== action.id) return w
        if (!w.isMaximized) {
          return {
            ...w,
            isMaximized: true,
            isFocused: true,
            zIndex: topZ,
            preMax: { position: { ...w.position }, size: { ...w.size } },
          }
        }
        const pre = w.preMax ?? { position: { ...w.defaultPosition }, size: { ...w.defaultSize } }
        return {
          ...w,
          isMaximized: false,
          isFocused: true,
          zIndex: topZ,
          position: pre.position,
          size: pre.size,
          preMax: undefined,
        }
      })
      return { ...state, windows, topZ }
    }
    case 'UPDATE_POSITION': {
      const windows = state.windows.map((w) =>
        w.id === action.id ? { ...w, position: action.position } : w,
      )
      return { ...state, windows }
    }
    case 'UPDATE_SIZE': {
      const windows = state.windows.map((w) =>
        w.id === action.id ? { ...w, size: action.size } : w,
      )
      return { ...state, windows }
    }
    case 'SET_DOCK_TARGET': {
      const dockTargets = { ...state.dockTargets }
      if (action.rect == null) delete dockTargets[action.id]
      else dockTargets[action.id] = action.rect
      return { ...state, dockTargets }
    }
    default:
      return state
  }
}

type Ctx = {
  state: State
  dispatch: React.Dispatch<Action>
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  restoreWindow: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  toggleMaximize: (id: WindowId) => void
  updatePosition: (id: WindowId, position: { x: number; y: number }) => void
  updateSize: (id: WindowId, size: { width: number; height: number }) => void
  setDockTarget: (id: WindowId, rect: DockTargetRect | null) => void
  syncDefinitions: (defs: WindowDefinition[]) => void
}

const WindowManagerCtx = createContext<Ctx | null>(null)

function buildInitial(): State {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const defs = getWindowDefinitions({ width: vw, height: vh })
  return {
    windows: definitionsToManaged(defs),
    topZ: 40,
    activeTitle: '',
    dockTargets: {},
  }
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial)

  const openWindow = useCallback((id: WindowId) => dispatch({ type: 'OPEN_WINDOW', id }), [])
  const closeWindow = useCallback((id: WindowId) => dispatch({ type: 'CLOSE_WINDOW', id }), [])
  const minimizeWindow = useCallback((id: WindowId) => dispatch({ type: 'MINIMIZE_WINDOW', id }), [])
  const restoreWindow = useCallback((id: WindowId) => dispatch({ type: 'RESTORE_WINDOW', id }), [])
  const focusWindow = useCallback((id: WindowId) => dispatch({ type: 'FOCUS_WINDOW', id }), [])
  const toggleMaximize = useCallback((id: WindowId) => dispatch({ type: 'MAXIMIZE_WINDOW', id }), [])
  const updatePosition = useCallback(
    (id: WindowId, position: { x: number; y: number }) =>
      dispatch({ type: 'UPDATE_POSITION', id, position }),
    [],
  )
  const updateSize = useCallback(
    (id: WindowId, size: { width: number; height: number }) => dispatch({ type: 'UPDATE_SIZE', id, size }),
    [],
  )
  const setDockTarget = useCallback(
    (id: WindowId, rect: DockTargetRect | null) => dispatch({ type: 'SET_DOCK_TARGET', id, rect }),
    [],
  )
  const syncDefinitions = useCallback(
    (defs: WindowDefinition[]) => dispatch({ type: 'SYNC_DEFINITIONS', defs }),
    [],
  )

  const value = useMemo(
    () => ({
      state,
      dispatch,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      focusWindow,
      toggleMaximize,
      updatePosition,
      updateSize,
      setDockTarget,
      syncDefinitions,
    }),
    [
      state,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      focusWindow,
      toggleMaximize,
      updatePosition,
      updateSize,
      setDockTarget,
      syncDefinitions,
    ],
  )

  return <WindowManagerCtx.Provider value={value}>{children}</WindowManagerCtx.Provider>
}

export function useWindowManager() {
  const v = useContext(WindowManagerCtx)
  if (!v) throw new Error('useWindowManager outside provider')
  return v
}
