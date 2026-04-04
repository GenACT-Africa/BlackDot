'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Mic, Globe } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

const floatIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-black">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />

      {/* Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/5 blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-4xl">
          {/* Top pill */}
          <motion.div
            custom={0}
            variants={floatIn}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-8"
          >
            <div className="flex gap-0.5">
              {[10, 18, 14, 20, 12, 16, 8, 15].map((h, i) => (
                <div
                  key={i}
                  className="waveform-bar w-0.5 rounded-full bg-purple-400"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-purple-300">
              World-Class Studio · Dar es Salaam
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={0.1}
            variants={floatIn}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-white">Create </span>
            <span className="gradient-text">World-Class</span>
            <br />
            <span className="text-white">Music. </span>
            <span className="text-white/40">From Anywhere.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            custom={0.2}
            variants={floatIn}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-white/50 max-w-2xl leading-relaxed mb-10"
          >
            Premium recording, mixing, mastering and production — delivered since 2016.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={0.3}
            variants={floatIn}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4"
          >
            <ButtonLink href="/book" size="lg" glow className="group">
              Book a Session
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary" size="lg" className="group">
              <Play size={16} className="text-purple-400" />
              Watch Our Work
            </ButtonLink>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            custom={0.45}
            variants={floatIn}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-6 mt-14"
          >
            {[
              { icon: Mic, label: 'Studio Recording', sub: 'From TZS 50K/hr' },
              { icon: Globe, label: 'Remote Sessions', sub: 'Available 24/7' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass-purple flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-white/40">{sub}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-brand-black -ml-2 first:ml-0" />
              ))}
              <p className="text-xs text-white/50 ml-1">200+ artists served</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
        <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
