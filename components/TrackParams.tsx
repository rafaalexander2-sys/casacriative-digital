'use client'

import { useEffect } from 'react'
import { captureAdParams } from '@/lib/track'

// Captura gclid/fbclid/UTM assim que o visitante chega (qualquer página).
export default function TrackParams() {
  useEffect(() => { captureAdParams() }, [])
  return null
}
