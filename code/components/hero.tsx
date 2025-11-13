"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Zap, Radio } from "lucide-react"

export default function Hero() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [waves, setWaves] = useState<number[]>([])

  useEffect(() => {
    // Generate wave animations
    setWaves(Array.from({ length: 4 }, (_, i) => i))

    const interval = setInterval(() => {
      setWaves((prev) => [...prev.slice(1), (prev[prev.length - 1] || 0) + 1])
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                  🎙️ Podcast Made Easy
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance leading-tight">
                Record your voice & video ,
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent block">
                  share your story
                </span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Souprec is your all-in-one podcast platform. Record on the go with our powerful MediaRecorder, create
                professional content instantly, and share with your audience worldwide.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Radio, label: "Record Anywhere", desc: "Capture your podcast on any device" },
                { icon: Zap, label: "Lightning Fast", desc: "Professional quality in seconds" },
                { icon: Play, label: "Share Instantly", desc: "Publish to your audience immediately" },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{feature.label}</p>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Audio visualization */}
          <div className="relative h-96 flex items-center justify-center animate-in fade-in slide-in-from-right duration-1000">
            {/* Animated microphone icon with waves */}
            <div className="relative">
              {/* Wave circles */}
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="absolute inset-0 border-2 border-primary/40 rounded-full animate-pulse"
                  style={{
                    width: `${100 + index * 80}px`,
                    height: `${100 + index * 80}px`,
                    animationDelay: `${index * 0.2}s`,
                    transform: "translate(-50%, -50%)",
                    left: "50%",
                    top: "50%",
                  }}
                />
              ))}

              {/* Center microphone circle */}
              <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-primary-foreground animate-float"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.77 2.36-2.26 0-4.29-.9-5.77-2.36l-1.1 1.1c1.86 1.86 4.41 3 7.07 3s5.21-1.14 7.07-3l-1.1-1.1z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Audio visualization bars */}
            <div className="absolute bottom-0 flex gap-1 justify-center w-full">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-primary to-accent rounded-full"
                  style={{
                    height: `${20 + Math.sin(i) * 20 + 20}px`,
                    animation: `pulse 0.6s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 pt-16 border-t border-border/50">
          <p className="text-center text-muted-foreground mb-6">
            Join thousands of creators already podcasting with Souprec
          </p>
          <div className="flex justify-center gap-4">
            {["Indie Creators", "Journalists", "Educators", "Entrepreneurs"].map((category) => (
              <div key={category} className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
