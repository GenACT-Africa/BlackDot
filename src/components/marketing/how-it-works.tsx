'use client'

import { motion } from 'framer-motion'
import { Search, CreditCard, Headphones, Download } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Choose a Service',
    description: 'Select studio recording, remote session, beats, or mixing — pick the service that fits your project.',
    color: 'purple',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Book & Pay',
    description: 'Schedule your session, choose a producer, and complete payment securely in minutes.',
    color: 'blue',
  },
  {
    number: '03',
    icon: Headphones,
    title: 'Create Together',
    description: 'Collaborate in real-time through our dashboard — chat, share files, review progress.',
    color: 'purple',
  },
  {
    number: '04',
    icon: Download,
    title: 'Receive & Release',
    description: 'Get your studio-quality files delivered directly. WAV, MP3, stems — release-ready.',
    color: 'gold',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-brand-black-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">
            The Process
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple. Transparent. Fast.
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            From first click to final delivery — here&apos;s how every project unfolds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              const colorMap = {
                purple: { icon: 'text-purple-400 bg-purple-500/15', num: 'text-purple-500/30' },
                blue: { icon: 'text-blue-400 bg-blue-500/15', num: 'text-blue-500/30' },
                gold: { icon: 'text-amber-400 bg-amber-500/15', num: 'text-amber-500/30' },
              }
              const c = colorMap[step.color as keyof typeof colorMap]

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left"
                >
                  {/* Icon + Number */}
                  <div className="relative mb-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.icon}`}>
                      <Icon size={24} />
                    </div>
                    <span className={`absolute -top-2 -right-4 text-4xl font-black ${c.num} select-none`}>
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
