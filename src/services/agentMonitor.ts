/**
 * 智能体性能监控
 */

interface PerformanceMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  cacheHitRate: number
  errorsByType: Record<string, number>
}

interface RequestLog {
  timestamp: number
  type: 'chat' | 'generate' | 'evaluate' | 'similar'
  duration: number
  success: boolean
  error?: string
  cached?: boolean
}

/**
 * 性能监控器
 */
export class AgentMonitor {
  private logs: RequestLog[] = []
  private maxLogs: number = 1000

  /**
   * 记录请求
   */
  logRequest(log: RequestLog): void {
    this.logs.push(log)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  /**
   * 获取性能指标
   */
  getMetrics(): PerformanceMetrics {
    const total = this.logs.length
    const successful = this.logs.filter((l) => l.success).length
    const failed = total - successful
    const cached = this.logs.filter((l) => l.cached).length

    const totalTime = this.logs.reduce((sum, l) => sum + l.duration, 0)
    const avgTime = total > 0 ? totalTime / total : 0

    const errorsByType: Record<string, number> = {}
    this.logs
      .filter((l) => !l.success && l.error)
      .forEach((l) => {
        const errorType = l.error || 'unknown'
        errorsByType[errorType] = (errorsByType[errorType] || 0) + 1
      })

    return {
      totalRequests: total,
      successfulRequests: successful,
      failedRequests: failed,
      averageResponseTime: Math.round(avgTime),
      cacheHitRate: total > 0 ? Math.round((cached / total) * 100) : 0,
      errorsByType,
    }
  }

  /**
   * 获取最近的日志
   */
  getRecentLogs(count: number = 10): RequestLog[] {
    return this.logs.slice(-count)
  }

  /**
   * 清空日志
   */
  clear(): void {
    this.logs = []
  }

  /**
   * 导出日志
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// 全局监控实例
export const agentMonitor = new AgentMonitor()
