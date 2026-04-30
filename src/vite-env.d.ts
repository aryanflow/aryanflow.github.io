/// <reference types="vite/client" />

declare global {
  interface Window {
    /** Set when the opening IntroSequence finishes or is skipped (reduced motion). */
    __akIntroComplete?: boolean
  }
}

export {}
