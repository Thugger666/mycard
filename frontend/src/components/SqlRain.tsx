import { useEffect, useRef } from 'react'

type TokenType = 'kw' | 'fn' | 'str' | 'num' | 'comment' | 'id'
interface Token { t: string; c: TokenType }

const SNIPPETS: Token[][] = [
  [
    { t: 'WITH sessions AS (', c: 'kw' },
    { t: '  SELECT user_id,', c: 'id' },
    { t: '    MIN(ts) AS start,', c: 'fn' },
    { t: '    MAX(ts) AS end_ts', c: 'fn' },
    { t: '  FROM events', c: 'kw' },
    { t: '  GROUP BY 1, 2', c: 'kw' },
    { t: ')', c: 'id' },
    { t: 'SELECT * FROM sessions', c: 'kw' },
    { t: 'WHERE duration > 30', c: 'kw' },
  ],
  [
    { t: 'SELECT', c: 'kw' },
    { t: '  user_id,', c: 'id' },
    { t: '  revenue,', c: 'id' },
    { t: '  ROW_NUMBER() OVER (', c: 'fn' },
    { t: '    PARTITION BY cohort', c: 'kw' },
    { t: '    ORDER BY revenue DESC', c: 'kw' },
    { t: '  ) AS rank', c: 'id' },
    { t: 'FROM analytics.orders', c: 'id' },
    { t: 'WHERE rank <= 10', c: 'kw' },
  ],
  [
    { t: 'SELECT', c: 'kw' },
    { t: '  u.user_id,', c: 'id' },
    { t: '  u.segment,', c: 'id' },
    { t: '  SUM(o.amount) AS ltv', c: 'fn' },
    { t: 'FROM dim_users u', c: 'kw' },
    { t: 'INNER JOIN fact_orders o', c: 'kw' },
    { t: '  ON u.id = o.user_id', c: 'id' },
    { t: 'WHERE u.is_active = TRUE', c: 'str' },
    { t: 'GROUP BY 1, 2', c: 'kw' },
    { t: 'ORDER BY ltv DESC', c: 'kw' },
  ],
  [
    { t: 'SELECT', c: 'kw' },
    { t: "  DATE_TRUNC('month',", c: 'fn' },
    { t: '    created_at) AS mo,', c: 'id' },
    { t: '  COUNT(*) AS users,', c: 'fn' },
    { t: '  AVG(score) AS nps', c: 'fn' },
    { t: 'FROM feedback', c: 'kw' },
    { t: "WHERE channel = 'email'", c: 'str' },
    { t: 'GROUP BY 1', c: 'kw' },
    { t: 'ORDER BY 1', c: 'kw' },
  ],
  [
    { t: 'SELECT', c: 'kw' },
    { t: '  CASE', c: 'kw' },
    { t: '    WHEN ltv > 1000', c: 'kw' },
    { t: "      THEN 'whale'", c: 'str' },
    { t: '    WHEN ltv > 100', c: 'kw' },
    { t: "      THEN 'mid'", c: 'str' },
    { t: "    ELSE 'low'", c: 'str' },
    { t: '  END AS tier,', c: 'kw' },
    { t: '  COUNT(*) AS n', c: 'fn' },
    { t: 'FROM user_stats', c: 'kw' },
  ],
  [
    { t: '-- dbt model', c: 'comment' },
    { t: "-- {{ ref('users') }}", c: 'comment' },
    { t: 'SELECT', c: 'kw' },
    { t: '  user_id,', c: 'id' },
    { t: '  COALESCE(name,', c: 'fn' },
    { t: "    'Unknown') AS name", c: 'str' },
    { t: '  ,email', c: 'id' },
    { t: 'FROM {{ source(', c: 'fn' },
    { t: "  'raw', 'users') }}", c: 'str' },
    { t: "WHERE deleted_at IS NULL", c: 'kw' },
  ],
  [
    { t: 'SELECT', c: 'kw' },
    { t: '  week,', c: 'id' },
    { t: '  revenue,', c: 'id' },
    { t: '  LAG(revenue, 1)', c: 'fn' },
    { t: '  OVER (ORDER BY week)', c: 'kw' },
    { t: '  AS prev_revenue,', c: 'id' },
    { t: '  ROUND(revenue /', c: 'fn' },
    { t: '    NULLIF(prev, 0)-1, 2)', c: 'fn' },
    { t: '  AS wow_growth', c: 'id' },
    { t: 'FROM weekly_metrics', c: 'kw' },
  ],
  [
    { t: 'CREATE OR REPLACE VIEW', c: 'kw' },
    { t: '  metrics.daily_kpi AS', c: 'id' },
    { t: 'SELECT', c: 'kw' },
    { t: '  dt,', c: 'id' },
    { t: '  SUM(revenue) AS rev,', c: 'fn' },
    { t: '  COUNT(DISTINCT uid)', c: 'fn' },
    { t: '    AS dau', c: 'id' },
    { t: 'FROM fact_events', c: 'kw' },
    { t: 'GROUP BY dt', c: 'kw' },
    { t: 'ORDER BY dt DESC', c: 'kw' },
  ],
  [
    { t: '-- Funnel analysis', c: 'comment' },
    { t: 'SELECT', c: 'kw' },
    { t: '  step,', c: 'id' },
    { t: '  COUNT(*) AS users,', c: 'fn' },
    { t: '  COUNT(*) * 100.0 /', c: 'fn' },
    { t: '  FIRST_VALUE(COUNT(*))', c: 'fn' },
    { t: '  OVER (ORDER BY step)', c: 'kw' },
    { t: '  AS conversion_pct', c: 'id' },
    { t: 'FROM funnel_events', c: 'kw' },
    { t: 'GROUP BY step', c: 'kw' },
  ],
  [
    { t: 'INSERT INTO staging.log', c: 'kw' },
    { t: 'SELECT', c: 'kw' },
    { t: '  CURRENT_TIMESTAMP,', c: 'fn' },
    { t: '  pipeline_id,', c: 'id' },
    { t: "  'success' AS status,", c: 'str' },
    { t: '  rows_processed', c: 'id' },
    { t: 'FROM pipeline_run', c: 'kw' },
    { t: 'WHERE run_id = $1', c: 'num' },
  ],
]

const PALETTE: Record<TokenType, [number, number, number]> = {
  kw:      [79,  142, 255],
  fn:      [0,   212, 255],
  str:     [0,   210, 140],
  num:     [255, 185,  80],
  comment: [80,   95, 120],
  id:      [155, 170, 195],
}

const LINE_H = 16
const FONT_PX = 10

interface Col {
  x: number
  y: number
  lines: Token[]
  speed: number
  alpha: number
  fade: number
}

function mkCol(x: number, y: number): Col {
  const lines = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
  return { x, y, lines, speed: 0.1 + Math.random() * 0.2, alpha: 0.045 + Math.random() * 0.09, fade: 0 }
}

export default function SqlRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0
    let cols: Col[] = []
    let raf: number

    const initCols = () => {
      cols = []
      const spacing = 185
      const n = Math.ceil(W / spacing) + 2
      for (let i = 0; i < n; i++) {
        const x = i * spacing - 20 + Math.random() * 50
        cols.push(mkCol(x, -Math.random() * H))
      }
    }

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      initCols()
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.font = `${FONT_PX}px 'JetBrains Mono', monospace`
      ctx.textBaseline = 'top'

      for (const col of cols) {
        col.y += col.speed
        col.fade = Math.min(1, col.fade + 0.006)

        const baseA = col.alpha * col.fade
        const totalH = col.lines.length * LINE_H

        for (let i = 0; i < col.lines.length; i++) {
          const ly = col.y + i * LINE_H
          if (ly < -LINE_H || ly > H + LINE_H) continue

          const edgeFade = 1 - Math.max(0, (ly - H * 0.72) / (H * 0.28))
          const a = baseA * Math.max(0, Math.min(1, edgeFade))

          const { t, c } = col.lines[i]
          const [r, g, b] = PALETTE[c]
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`
          ctx.fillText(t, col.x, ly)
        }

        if (col.y > H + totalH + 60) {
          col.lines = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
          col.y = -(col.lines.length * LINE_H) - Math.random() * H * 0.5
          col.x = Math.random() * W
          col.speed = 0.1 + Math.random() * 0.2
          col.alpha = 0.045 + Math.random() * 0.09
          col.fade = 0
        }
      }

      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    document.fonts.ready.then(() => { resize(); draw() })

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas id="bg-canvas" ref={canvasRef} />
}
