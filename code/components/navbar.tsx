"use client"

import { Mic2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onGetStarted: () => void
}

export default function Navbar({ onGetStarted }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform duration-300">
              <Mic2 className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              souprec
            </span>
          </div>

          {/* Get Started Button */}
          <Button
            onClick={onGetStarted}
            className="bg-primary hover:bg-secondary text-primary-foreground rounded-full px-6 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  )
}
