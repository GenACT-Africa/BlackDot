'use client'

import { useState, useCallback, useEffect } from 'react'
import type { BookingFormState, SelectedService, Service } from '@/types'

const INITIAL_STATE: BookingFormState = {
  step: 1,
  services: [],
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
      if (saved) {
        const parsed = JSON.parse(saved)
        // Migrate old drafts that used `service` (single) instead of `services` (array)
        if (!Array.isArray(parsed.services)) {
          parsed.services = parsed.service ? [{ service: parsed.service, quantity: 1 }] : []
          delete parsed.service
        }
        setState({ ...INITIAL_STATE, ...parsed })
      }
    } catch {}
    setHydrated(true)
  }, [])

  const save = useCallback((next: BookingFormState) => {
    setState(next)
    try {
      sessionStorage.setItem('booking_draft', JSON.stringify(next))
    } catch {}
  }, [])

  const toggleService = useCallback((service: Service) => {
    const exists = state.services.some(s => s.service.id === service.id)
    const updatedServices = exists
      ? state.services.filter(s => s.service.id !== service.id)
      : [...state.services, { service, quantity: 1 }]
    save({ ...state, services: updatedServices })
  }, [state, save])

  const proceedFromServices = useCallback(() => {
    if (state.services.length === 0) return
    save({ ...state, step: 2 })
  }, [state, save])

  const setDetails = useCallback((
    data: Pick<BookingFormState, 'projectTitle' | 'projectNotes' | 'referenceLinks' | 'talentId'>
  ) => {
    save({ ...state, ...data, step: 3 })
  }, [state, save])

  const setSchedule = useCallback((
    data: Pick<BookingFormState, 'sessionDate' | 'startTime' | 'durationHours'>,
    serviceQuantities?: Record<string, number>
  ) => {
    const updatedServices = serviceQuantities
      ? state.services.map(s => ({
          ...s,
          quantity: serviceQuantities[s.service.id] ?? s.quantity,
        }))
      : state.services
    save({ ...state, ...data, services: updatedServices, step: 4 })
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

  const totalPrice = state.services.reduce((sum, { service, quantity }) => {
    if (service.billing_unit === 'hour') {
      return sum + service.price_tzs * state.durationHours
    }
    return sum + service.price_tzs * quantity
  }, 0)

  return {
    state,
    hydrated,
    toggleService,
    proceedFromServices,
    setDetails,
    setSchedule,
    goBack,
    reset,
    totalPrice,
  }
}
