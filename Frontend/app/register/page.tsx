"use client"

import { SignUp } from "@clerk/nextjs"
import { LandingNavbar } from "../../components/landing/navbar"
import { Footer } from "../../components/landing/footer"

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />
      
      <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <SignUp 
          appearance={{
            elements: {
              card: "shadow-2xl border border-border",
              headerTitle: "text-2xl font-bold text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border text-foreground hover:bg-muted",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              footerActionLink: "text-primary hover:text-primary/80"
            }
          }}
          signInUrl="/login"
        />
      </div>

      <Footer />
    </main>
  )
}
