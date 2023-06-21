"use client" 
import { CustomThemeContext } from "@/context/theme"
import { useState } from "react"
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 

  return (
    <html lang="en">
      <body>
        <CustomThemeContext.Provider value={themeState}>
          {children}
        </CustomThemeContext.Provider>
      </body>
    </html>
  )
}
