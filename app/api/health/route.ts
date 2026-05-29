import { NextResponse } from 'next/server'
import { loadavg, cpus, hostname, platform, arch, freemem, totalmem } from 'os'

export type HealthMemory = {
  rss: number
  heapTotal: number
  heapUsed: number
  external: number
  arrayBuffers: number
}

export type HealthSystem = {
  hostname: string
  platform: NodeJS.Platform
  arch: string
  cpuCount: number
  loadAverage: number[]
  freeMemory: number
  totalMemory: number
}

export type HealthPayload = {
  status: 'ok' | 'error'
  timestamp: string
  uptimeSeconds: number
  nodeVersion: string
  memory: HealthMemory
  system: HealthSystem
}

export const GET = async (): Promise<NextResponse> => {
  const uptimeSeconds = Math.floor(process.uptime())
  const memory = process.memoryUsage()
  const loadAverage = loadavg()
  const cpuCount = cpus().length

  const payload: HealthPayload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    nodeVersion: process.version,
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external ?? 0,
      arrayBuffers: (memory as any).arrayBuffers ?? 0,
    },
    system: {
      hostname: hostname(),
      platform: platform() as NodeJS.Platform,
      arch: arch(),
      cpuCount,
      loadAverage,
      freeMemory: freemem(),
      totalMemory: totalmem(),
    },
  }

  return NextResponse.json(payload)
}
