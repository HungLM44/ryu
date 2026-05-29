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
    <main style={{ padding: 20, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1>Server Health</h1>

      
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {health && (
        <>
          <section>
            <h2>Overview</h2>
            <p>Status: {health.status}</p>
            <p>Timestamp: {health.timestamp}</p>
            <p>Uptime: {health.uptimeSeconds} s</p>
            <p>Node: {health.nodeVersion}</p>
          </section>

          <section>
            <h2>Memory</h2>
            <ul>
              <li>RSS: {formatBytes(health.memory.rss)}</li>
              <li>Heap total: {formatBytes(health.memory.heapTotal)}</li>
              <li>Heap used: {formatBytes(health.memory.heapUsed)}</li>
              <li>External: {formatBytes(health.memory.external)}</li>
              <li>ArrayBuffers: {formatBytes(health.memory.arrayBuffers)}</li>
            </ul>
          </section>

          <section>
            <h2>System</h2>
            <ul>
              <li>Hostname: {health.system.hostname}</li>
              <li>Platform: {health.system.platform}</li>
              <li>Arch: {health.system.arch}</li>
              <li>CPU count: {health.system.cpuCount}</li>
              <li>Load avg: {health.system.loadAverage.join(', ')}</li>
              <li>Free: {formatBytes(health.system.freeMemory)}</li>
              <li>Total: {formatBytes(health.system.totalMemory)}</li>
            </ul>
          </section>
        </>
      )}
    </main>
  )
}

export default HealthPage
