"use client"

import React, { useEffect, useState } from 'react'
import type { HealthPayload } from '../api/health/route'

const formatBytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

const HealthPage = () => {
  const [health, setHealth] = useState<HealthPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json: HealthPayload = await res.json()
      setHealth(json)
      setError(null)
    } catch (err: any) {
      setError(err?.message || 'Unknown error')
    }
  }

  useEffect(() => {
    fetchHealth()
    const id = setInterval(fetchHealth, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <main className="p-5 font-sans text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Server Health</h1>

      {error && <p className="text-red-600">Error: {error}</p>}

      {health && (
        <>
          <section className="mb-6">
            <h2 className="text-lg font-medium mb-2">Overview</h2>
            <p>Status: <span className="font-mono">{health.status}</span></p>
            <p>Timestamp: <span className="font-mono">{health.timestamp}</span></p>
            <p>Uptime: <span className="font-mono">{health.uptimeSeconds} s</span></p>
            <p>Node: <span className="font-mono">{health.nodeVersion}</span></p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-medium mb-2">Memory</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>RSS: <span className="font-mono">{formatBytes(health.memory.rss)}</span></li>
              <li>Heap total: <span className="font-mono">{formatBytes(health.memory.heapTotal)}</span></li>
              <li>Heap used: <span className="font-mono">{formatBytes(health.memory.heapUsed)}</span></li>
              <li>External: <span className="font-mono">{formatBytes(health.memory.external)}</span></li>
              <li>ArrayBuffers: <span className="font-mono">{formatBytes(health.memory.arrayBuffers)}</span></li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-medium mb-2">System</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Hostname: <span className="font-mono">{health.system.hostname}</span></li>
              <li>Platform: <span className="font-mono">{health.system.platform}</span></li>
              <li>Arch: <span className="font-mono">{health.system.arch}</span></li>
              <li>CPU count: <span className="font-mono">{health.system.cpuCount}</span></li>
              <li>Load avg: <span className="font-mono">{health.system.loadAverage.join(', ')}</span></li>
              <li>Free: <span className="font-mono">{formatBytes(health.system.freeMemory)}</span></li>
              <li>Total: <span className="font-mono">{formatBytes(health.system.totalMemory)}</span></li>
            </ul>
          </section>
        </>
      )}
    </main>
  )
}

export default HealthPage
