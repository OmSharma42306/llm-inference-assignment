let totalRequests = 0;
let latencies: number[] = [];

export function recordLatency(ms: number) {
  totalRequests++;
  latencies.push(ms);

  // keep only last 1000 to avoid memory leak
  if (latencies.length > 1000) {
    latencies.shift();
  }
}

export function getMetrics() {
  const avg =
    latencies.reduce((a, b) => a + b, 0) / latencies.length || 0;

  const sorted = [...latencies].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(0.95 * sorted.length)] || 0;

  return {
    totalRequests,
    avgLatency: avg,
    p95Latency: p95,
  };
}