'use client'

import React, { createContext, useContext, useState } from 'react'

interface LayoutContextType {
  hideNavbar: boolean
  hideFooter: boolean
  setHideNavbar: (v: boolean) => void
  setHideFooter: (v: boolean) => void
}

const LayoutContext = createContext<LayoutContextType>({
  hideNavbar: false,
  hideFooter: false,
  setHideNavbar: () => {},
  setHideFooter: () => {},
})

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [hideNavbar, setHideNavbar] = useState(false)
  const [hideFooter, setHideFooter] = useState(false)

  return (
    <LayoutContext.Provider value={{ hideNavbar, hideFooter, setHideNavbar, setHideFooter }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  return useContext(LayoutContext)
}
