"use client"

import { LandingNavbar } from "../../components/landing/navbar"
import { Footer } from "../../components/landing/footer"

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-24 pb-12 flex items-center justify-center">
         <h1 className="text-4xl font-bold text-white">Página de Registro</h1>
         {/* Aquí podés pegar tu formulario más tarde */}
      </div>
      <Footer />
    </main>
  )
}