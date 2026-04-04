'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mic, Globe, Music, SlidersHorizontal, Check } from 'lucide-react'
import { useBooking } from '@/lib/hooks/use-booking'
import { formatTZS } from '@/lib/utils/currency'
import { createClient } from '@/lib/supabase/client'
import type { Service } from '@/types'

const ICONS: Record<string, React.ReactNode> = {
  Mic: <Mic size={22} />,
  Globe: <Globe size={22} />,
  Music: <Music size={22} />,
  Sliders: <SlidersHorizontal size={22} />,
}

const STEPS = ['Service', 'Details', 'Schedule', 'Review']

function BookStep1Content() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselect = searchParams.get('service')
  const { state, setService } = useBooking()
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      if (data) setServices(data)
      setLoadingServices(false)
    }
    fetchServices()
  }, [])

  const handleSelect = (service: Service) => {
    setService(service)
    router.push('/book/details')
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i === 0 ? 'text-purple-400' : 'text-white/30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i === 0
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : i < 0
                    ? 'bg-purple-600/20 border-purple-500/30 text-purple-400'
                    : 'border-white/20 text-white/30'
                }`}>
                  {i < 0 ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${i < 0 ? 'bg-purple-500/40' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black text-white mb-2">Choose a Service</h1>
        <p className="text-white/50">Select the service that best fits your project.</p>
      </motion.div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loadingServices ? (
          <div className="col-span-2 h-40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : null}
        {services.map((service, i) => {
          const isSelected = state.service?.id === service.id || preselect === service.slug
          const billingLabel = { hour: '/ hr', track: '/ track', project: '/ project' }[service.billing_unit]

          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleSelect(service)}
              className={`text-left glass rounded-2xl p-6 border transition-all duration-200 w-full group ${
                isSelected
                  ? 'border-purple-500/50 shadow-glow-purple-sm bg-purple-500/5'
                  : 'border-white/8 hover:border-purple-500/30 hover:shadow-glow-purple-sm'
              }`}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                isSelected ? 'bg-purple-500/30 text-purple-300' : 'bg-purple-500/15 text-purple-400 group-hover:bg-purple-500/25'
              }`}>
                {ICONS[service.icon || 'Mic']}
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-white">{service.name}</h3>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">{service.description}</p>

              <div>
                <span className="text-lg font-black gradient-text">{formatTZS(service.price_tzs)}</span>
                <span className="text-xs text-white/40 ml-1">{billingLabel}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default function BookStep1() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" /></div>}>
      <BookStep1Content />
    </Suspense>
  )
}
