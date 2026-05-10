"use client"

import { LandingNavbar } from "../../components/landing/navbar"
import { Footer } from "../../components/landing/footer"

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-32 pb-12 flex flex-col items-center justify-center text-center">
         <h1 className="text-5xl font-bold text-white mb-6">Únete a UniMatch</h1>
         <p className="text-xl text-muted-foreground max-w-2xl px-4">
           Estamos preparando el formulario de registro para que encuentres a tu compañero de estudio ideal.
         </p>
      </div>
      <Footer />
    </main>
  )
}