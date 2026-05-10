"use client"

// 1. Los imports van arriba de todo, FUERA de la función
import { LandingNavbar } from "../../components/landing/navbar"
import { Footer } from "../../components/landing/footer"

// 2. La función va después
export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-32 pb-12 flex flex-col items-center justify-center text-center">
         <h1 className="text-5xl font-bold text-white mb-6">Únete a UniMatch</h1>
         <p className="text-xl text-muted-foreground px-4">
           La página de registro se está cargando correctamente.
         </p>
      </div>
      <Footer />
    </main>
  )
}
