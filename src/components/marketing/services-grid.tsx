'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mic, Globe, Music, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { SERVICES } from '@/lib/constants/services'
import { formatTZS } from '@/lib/utils/currency'
import type { Service } from '@/types'

const ICONS: Record<string, React.ReactNode> = {
  Mic: <Mic size={24} />,
  Globe: <Globe size={24} />,
  Music: <Music size={24} />,
  Sliders: <SlidersHorizontal size={24} />,
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const billingLabel = {
    hour: '/ hour',
    track: '/ track',
    project: '/ project',
  }[service.billing_unit]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="group relative flex flex-col h-full glass rounded-2xl p-6 border border-white/8 hover:border-purple-500/30 transition-all duration-300 hover:shadow-glow-purple-sm">
        <Link href={`/book?service=${service.slug}`} className="absolute inset-0 rounded-2xl z-10" aria-label={`Book ${service.name}`} />
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-500/25 transition-colors">
          {ICONS[service.icon || 'Mic']}
        </div>

        {/* Service info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
          <p className="text-sm text-white/50 leading-relaxed">{service.description}</p>
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/8">
          <div>
            <span className="text-2xl font-black gradient-text">
              {formatTZS(service.price_tzs)}
            </span>
            <span className="text-xs text-white/40 ml-1">{billingLabel}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-purple-400 group-hover:gap-2 transition-all">
            Book <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ServicesGrid() {
  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">
            What We Offer
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Studio-Grade Services
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            From live studio sessions to remote collaboration — every service is
            engineered for the highest quality output.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors group"
          >
            View full service details
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
