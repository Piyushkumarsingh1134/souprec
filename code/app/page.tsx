"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import AuthModal from "@/components/auth-modal"

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar
        onGetStarted={() => {
          setIsLogin(true)
          setShowAuthModal(true)
        }}
      />
      <Hero />
      <Footer />
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        isLogin={isLogin}
        onToggleMode={() => setIsLogin(!isLogin)}
      />
    </main>
  )
}
