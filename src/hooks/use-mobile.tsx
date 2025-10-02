
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add event listener
    window.addEventListener("resize", handleResize, { passive: true })
    
    // Set initial value
    handleResize()
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<string>(
    typeof window !== 'undefined' 
      ? getBreakpoint(window.innerWidth) 
      : 'md'
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth))
    }

    // Add event listener
    window.addEventListener("resize", handleResize, { passive: true })
    
    // Set initial value
    handleResize()
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return breakpoint
}

function getBreakpoint(width: number): string {
  if (width < 640) return 'xs'
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1280) return 'lg'
  if (width < 1536) return 'xl'
  return '2xl'
}
