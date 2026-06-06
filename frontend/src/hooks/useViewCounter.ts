import { useEffect, useState } from 'react'

const STORAGE_KEY = 'anton_card_viewed'

export function useViewCounter() {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    const alreadyCounted = localStorage.getItem(STORAGE_KEY)

    if (alreadyCounted) {
      fetch('/api/views')
        .then(r => r.json())
        .then(d => setViews(d.views))
        .catch(() => setViews(null))
    } else {
      fetch('/api/views', { method: 'POST' })
        .then(r => r.json())
        .then(d => {
          setViews(d.views)
          localStorage.setItem(STORAGE_KEY, '1')
        })
        .catch(() => setViews(null))
    }
  }, [])

  return views
}
