import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default function DashboardChart({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Enrollments',
            data: data.values,
            borderColor: '#1e90ff',
            backgroundColor: 'rgba(30,144,255,0.12)',
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
        },
      },
    })

    return () => chart.destroy()
  }, [data])

  return <div className="h-52"><canvas ref={canvasRef} /></div>
}
