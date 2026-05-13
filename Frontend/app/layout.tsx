import { ClerkProvider } from '@clerk/nextjs'
import { Viewport } from 'next'
import './globals.css'

// 1. Configuración del Viewport: Crucial para Apple y Android
// Esto evita que la página se vea "lejos" y bloquea el zoom molesto al escribir
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#05070a', // El color oscuro de tu estética futurista
}

export const metadata = {
  title: 'UniMatch',
  description: 'Aplicación Universitaria Futurista',
  manifest: '/manifest.json', // Para que sea instalable
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UniMatch',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" className="dark">
        <head>
          {/* Favicons y tags para iOS */}
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
        </head>
        <body className="antialiased overflow-x-hidden bg-[#05070a] text-white">
          {/* El contenedor principal evita desbordamientos horizontales en móviles */}
          <main className="min-h-screen w-full">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}