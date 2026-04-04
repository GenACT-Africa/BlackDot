'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import type { Testimonial } from '@/types'

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: '1', client_name: 'Эльдар Зекрист', client_role: 'Recording Artist – Moscow',
    body: 'Gachi is very big professional. I am glad, that I came to his studio to create my song. He is attentive to your idea, what you want to create and feels music, vibe very well. I love his style of work! He is very friendly and nice person. We created amazing song together with him and Annette.',
    rating: 5, is_active: true, display_order: 1, avatar_url: null, created_at: '',
  },
  {
    id: '2', client_name: 'Sean Kailembo', client_role: 'DJ – London',
    body: "Great hospitality and very good sound equipment, high quality!!! Definitely going again sometime soon!",
    rating: 5, is_active: true, display_order: 2, avatar_url: null, created_at: '',
  },
  {
    id: '3', client_name: 'Yesse Godfrey', client_role: 'Recording Artist – Iringa',
    body: 'I want to sincerely thank you for the excellence of your work. Your studio is a unique place with great beats, modern technology, and a fantastic environment for creating music. Since I started recording here, my songs have become stronger and better than ever. Thank you for bringing so much creativity to my work!',
    rating: 5, is_active: true, display_order: 3, avatar_url: null, created_at: '',
  },
  {
    id: '4', client_name: 'Bruno Onwukwe', client_role: 'Afrobeats Artist – Lagos',
    body: 'Produced, Mixed and Engineered songs for me. always feel at home, Highly Recommended',
    rating: 5, is_active: true, display_order: 4, avatar_url: null, created_at: '',
  },
]

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

export function Testimonials({ testimonials = PLACEHOLDER_TESTIMONIALS }: TestimonialsProps) {
  const items = testimonials.length > 0 ? testimonials : PLACEHOLDER_TESTIMONIALS
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length)
  const next = () => setCurrent((c) => (c + 1) % items.length)

  const item = items[current]

  return (
    <section className="py-24 bg-brand-black-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/8 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">
            Client Stories
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Artists Who Trust Us
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <div className="glass rounded-3xl p-8 sm:p-12 relative">
          <Quote
            className="absolute top-8 right-8 text-purple-500/15"
            size={64}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl sm:text-2xl font-medium text-white/90 leading-relaxed mb-8">
                &ldquo;{item.body}&rdquo;
              </p>

              {/* Client */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {item.client_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{item.client_name}</p>
                  {item.client_role && (
                    <p className="text-sm text-white/40">{item.client_role}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass hover:border-purple-500/40 text-white/50 hover:text-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-purple-500' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass hover:border-purple-500/40 text-white/50 hover:text-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
