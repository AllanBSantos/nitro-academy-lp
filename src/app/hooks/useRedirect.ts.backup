// useRedirect.ts
import { useEffect } from 'react'
import { useRouter } from 'next/compat/router'
import lngDetector from '../lib/lngDetector'
import { redirect } from "next/navigation";

export function useRedirect() {
  const router = useRouter()

  // language detection
  useEffect(() => {
    const detectedLng = lngDetector.detect();
    if (router?.route.includes(detectedLng as string)) return;

    if (router?.route === '/404') {
      redirect('/' + detectedLng + router?.route)
    }
    lngDetector.cache?.(detectedLng ?? 'pt');
    redirect('/' + detectedLng)
  })
}