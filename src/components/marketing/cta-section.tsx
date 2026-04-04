'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

export function CTASection() {
  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Pill */}
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-8">
            <Zap size={12} className="text-purple-400 fill-purple-400" />
            <span className="text-xs font-medium text-purple-300">
              Start your project today
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Your Sound Deserves{' '}
            <span className="gradient-text">The Best.</span>
          </h2>

          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            Join 200+ artists who have trusted BlackDot Music to bring their vision to life.
            Book your session — it takes under 3 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink href="/book" size="xl" glow className="group min-w-[200px]">
              Book a Session
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="xl" className="min-w-[200px]">
              Talk to Us First
            </ButtonLink>
          </div>

          {/* Micro trust */}
          <p className="text-xs text-white/30 mt-8">
            No commitment required · Transparent pricing · Response within 24hrs
          </p>
        </motion.div>
      </div>
    </section>
  )
}
