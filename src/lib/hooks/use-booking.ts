'use client'

import { useState, useCallback, useEffect } from 'react'
import type { BookingFormState, Service } from '@/types'

const INITIAL_STATE: BookingFormState = {
  step: 1,
  service: null,
  talentId: null,
  projectTitle: '',
  projectNotes: '',
  referenceLinks: [],
  sessionDate: null,
  startTime: null,
  durationHours: 1,
}

export function useBooking() {
  const [state, setState] = useState<BookingFormState>(INITIAL_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('booking_draft')
      if (saved) setState(JSON.parse(saved))
    } catch {}
    setHydrated(true)
  }, [])

  const save = useCallback((next: BookingFormState) => {
    setState(next)
    try {
      sessionStorage.setItem('booking_draft', JSON.stringify(next))
    } catch {}
  }, [])

  const setService = useCallback((service: Service) => {
    save({ ...state, service, step: 2 })
  }, [state, save])

  const setDetails = useCallback((
    data: Pick<BookingFormState, 'projectTitle' | 'projectNotes' | 'referenceLinks' | 'talentId'>
  ) => {
    save({ ...state, ...data, step: 3 })
  }, [state, save])

  const setSchedule = useCallback((
    data: Pick<BookingFormState, 'sessionDate' | 'startTime' | 'durationHours'>
  ) => {
    save({ ...state, ...data, step: 4 })
  }, [state, save])

  const goBack = useCallback(() => {
    if (state.step > 1) {
      save({ ...state, step: (state.step - 1) as BookingFormState['step'] })
    }
  }, [state, save])

  const reset = useCallback(() => {
    sessionStorage.removeItem('booking_draft')
    setState(INITIAL_STATE)
  }, [])

  const totalPrice = state.service
    ? state.service.billing_unit === 'hour'
      ? state.service.price_tzs * state.durationHours
      : state.service.price_tzs
    : 0

  return { state, hydrated, setService, setDetails, setSchedule, goBack, reset, totalPrice }
}
