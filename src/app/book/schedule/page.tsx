'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Clock, Minus, Plus } from 'lucide-react'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/lib/hooks/use-booking'

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
]

const STEPS = ['Service', 'Details', 'Schedule', 'Review']

export default function BookStep3() {
  const router = useRouter()
  const { state, hydrated, setSchedule, goBack } = useBooking()
  const [selectedDate, setSelectedDate] = useState<string | null>(state.sessionDate)
  const [selectedTime, setSelectedTime] = useState<string | null>(state.startTime)
  const [duration, setDuration] = useState(state.durationHours || 1)

  useEffect(() => {
    if (hydrated && !state.service) router.replace('/book')
  }, [hydrated, state.service, router])

  // Generate next 14 days
  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1))
  const isRecording = state.service?.category === 'recording'

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return
    setSchedule({
      sessionDate: selectedDate,
      startTime: selectedTime,
      durationHours: duration,
    })
    router.push('/book/review')
  }

  const canContinue = selectedDate && selectedTime

  return (
    <div>
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= 2 ? 'text-purple-400' : 'text-white/30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i < 2 ? 'bg-purple-600 border-purple-600 text-white'
                  : i === 2 ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-white/20 text-white/30'
                }`}>
                  {i < 2 ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${i < 2 ? 'bg-purple-500/40' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-2">Schedule</h1>
        <p className="text-white/50 mb-8">Pick your preferred date and time.</p>

        {/* Date picker */}
        <div className="mb-8">
          <p className="text-sm font-medium text-white/70 mb-3">Select Date</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const isSelected = selectedDate === dateStr
              const isPast = isBefore(day, startOfDay(new Date()))

              return (
                <button
                  key={dateStr}
                  disabled={isPast}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-purple-600 border-purple-500 shadow-glow-purple-sm'
                      : isPast
                      ? 'border-white/5 text-white/20 cursor-not-allowed'
                      : 'glass border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5'
                  }`}
                >
                  <span className={`text-[10px] font-semibold uppercase ${isSelected ? 'text-purple-200' : 'text-white/40'}`}>
                    {format(day, 'EEE')}
                  </span>
                  <span className={`text-xl font-black mt-0.5 ${isSelected ? 'text-white' : 'text-white'}`}>
                    {format(day, 'd')}
                  </span>
                  <span className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-white/40'}`}>
                    {format(day, 'MMM')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="mb-8">
          <p className="text-sm font-medium text-white/70 mb-3">Select Time</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedTime === time
                    ? 'bg-purple-600 border-purple-500 text-white shadow-glow-purple-sm'
                    : 'glass border-white/10 hover:border-purple-500/40 text-white/70 hover:text-white'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Duration (only for hourly) */}
        {isRecording && (
          <div className="mb-8">
            <p className="text-sm font-medium text-white/70 mb-3">Duration</p>
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <Clock size={16} />
                <span className="text-sm">Session hours</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  className="w-8 h-8 rounded-lg glass hover:border-purple-500/40 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="text-lg font-bold text-white w-6 text-center">{duration}</span>
                <button
                  type="button"
                  onClick={() => setDuration(Math.min(12, duration + 1))}
                  className="w-8 h-8 rounded-lg glass hover:border-purple-500/40 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={goBack}>
            <ArrowLeft size={14} />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            glow
            className="flex-1 group"
          >
            Review Booking
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
