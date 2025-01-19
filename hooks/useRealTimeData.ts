import { useState, useEffect } from 'react'

export function useRealTimeData() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const eventSource = new EventSource('/api/real-time-data')

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data)
      setData(newData)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return data
}

