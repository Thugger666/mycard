import { useEffect, useState } from 'react'

export function useViewCounter() {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/views', { method: 'POST' })
      .then(r => r.json())
      .then(d => setViews(d.views))
      .catch(() => setViews(null))
  }, [])

  return views
}
