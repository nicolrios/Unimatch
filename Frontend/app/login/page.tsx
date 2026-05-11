"use client"

import { SignIn } from "@clerk/nextjs"
import { LandingNavbar } from "../../components/landing/navbar"
import { Footer } from "../../components/landing/footer"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />
      
      <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <SignIn 
          appearance={{
            elements: {
              card: "shadow-2xl border border-border",
              headerTitle: "text-2xl font-bold text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
            }
          }}
          signUpUrl="/register"
        />
      </div>

      <Footer />
    </main>
  )
}