import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LubeTrack Pro - Sistema de Seguimiento de Lubricación',
  description: 'Sistema profesional de gestión y seguimiento de lubricación industrial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
