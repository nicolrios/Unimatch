"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// --- ESTA ES LA SECCIÓN QUE IMPORTA LOS COMPONENTES ---
import { LandingNavbar } from "../components/landing/navbar"
import { HeroSection } from "../components/landing/hero-section"
import { HowItWorks } from "../components/landing/how-it-works"
import { BenefitsSection } from "../components/landing/benefits-section"
import { FeaturesGrid } from "../components/landing/features-grid"
import { CTASection } from "../components/landing/cta-section"
import { Footer } from "../components/landing/footer"

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  // Redirección automática si ya estás logueado
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard/search")
    }
  }, [isSignedIn, isLoaded, router])

  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection /> {/* Ahora sí va a saber qué es esto */}
      <HowItWorks />
      <BenefitsSection />
      <FeaturesGrid />
      <CTASection />
      <Footer />
    </main>
  )
}