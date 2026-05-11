"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser, UserButton } from "@clerk/nextjs"

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn, user } = useUser()

  const navLinks = [
    { href: "#how-it-works", label: "Como funciona" },
    { href: "#benefits", label: "Beneficios" },
    { href: "#features", label: "Funciones" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Uni<span className="text-primary">Match</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">
                  Hola, {user?.firstName}
                </span>
                {/* Se eliminó afterSignOutUrl porque ahora se maneja en el .env */}
                <UserButton />
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Iniciar sesion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border space-y-2">
                {isSignedIn ? (
                  <div className="flex items-center justify-between px-2 py-2">
                    <span className="text-sm font-medium text-foreground">
                      {user?.firstName}
                    </span>
                    <UserButton />
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        Iniciar sesion
                      </Button>
                    </Link>
                    <Link href="/register" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}