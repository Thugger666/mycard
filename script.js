/* ── CUSTOM CURSOR ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
if (isTouch) {
  cur.style.display = 'none';
  ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}

document.addEventListener('mousemove', e => {
  if (isTouch) return;
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});

function lerp(a, b, t) { return a + (b - a) * t; }

(function tick() {
  if (!isTouch) {
    rx = lerp(rx, mx, .12); ry = lerp(ry, my, .12);
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  }
  requestAnimationFrame(tick);
})();

/* ── SQL RAIN BACKGROUND ── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, cols = [];

const SNIPPETS = [
  [
    { t: 'WITH sessions AS (', c: 'kw' },
    { t: '  SELECT user_id,', c: 'id' },
    { t: '    MIN(ts) AS start,', c: 'fn' },
    { t: '    MAX(ts) AS end_ts', c: 'fn' },
    { t: '  FROM events', c: 'kw' },
    { t: '  GROUP BY 1, 2', c: 'kw' },
    { t: ')', c: 'id' },
    { t: 'SELECT *', c: 'kw' },
    { t: 'FROM sessions', c: 'kw' },
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
    { t: 'GROUP BY tier', c: 'kw' },
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
    { t: 'SELECT', c: 'kw' },
    { t: '  segment,', c: 'id' },
    { t: '  COUNT(*) AS n,', c: 'fn' },
    { t: '  AVG(ltv) AS avg_ltv', c: 'fn' },
    { t: 'FROM customers', c: 'kw' },
    { t: "WHERE region = 'EU'", c: 'str' },
    { t: 'GROUP BY segment', c: 'kw' },
    { t: 'HAVING COUNT(*) > 50', c: 'kw' },
    { t: 'ORDER BY avg_ltv DESC', c: 'kw' },
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
    { t: 'SELECT', c: 'kw' },
    { t: '  JSON_EXTRACT_PATH(', c: 'fn' },
    { t: "    props, 'device')", c: 'str' },
    { t: '    AS device,', c: 'id' },
    { t: '  COUNT(*) AS events', c: 'fn' },
    { t: 'FROM raw.events', c: 'kw' },
    { t: 'WHERE event_type =', c: 'kw' },
    { t: "  'page_view'", c: 'str' },
    { t: 'GROUP BY 1', c: 'kw' },
    { t: 'ORDER BY 2 DESC', c: 'kw' },
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
];

const PALETTE = {
  kw:      [79,  142, 255],
  fn:      [0,   212, 255],
  str:     [0,   210, 140],
  num:     [255, 185,  80],
  comment: [80,   95, 120],
  id:      [155, 170, 195],
};

const LINE_H = 16;
const FONT_PX = 10;

function mkCol(x, y) {
  const snip = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
  return {
    x,
    y,
    lines: snip,
    speed: 0.1 + Math.random() * 0.2,
    alpha: 0.045 + Math.random() * 0.09,
    fade: 0,
  };
}

function initCols() {
  cols = [];
  const spacing = 185;
  const n = Math.ceil(W / spacing) + 2;
  for (let i = 0; i < n; i++) {
    const x = i * spacing - 20 + Math.random() * 50;
    cols.push(mkCol(x, -Math.random() * H));
  }
}

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initCols();
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.font = `${FONT_PX}px 'JetBrains Mono', monospace`;
  ctx.textBaseline = 'top';

  for (const col of cols) {
    col.y += col.speed;
    col.fade = Math.min(1, col.fade + 0.006);

    const baseA = col.alpha * col.fade;
    const totalH = col.lines.length * LINE_H;

    for (let i = 0; i < col.lines.length; i++) {
      const ly = col.y + i * LINE_H;
      if (ly < -LINE_H || ly > H + LINE_H) continue;

      // Soft fade-out near bottom
      const edgeFade = 1 - Math.max(0, (ly - H * 0.72) / (H * 0.28));
      const a = baseA * Math.max(0, Math.min(1, edgeFade));

      const { t, c } = col.lines[i];
      const [r, g, b] = PALETTE[c] || PALETTE.id;
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fillText(t, col.x, ly);
    }

    if (col.y > H + totalH + 60) {
      const snip = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
      col.lines = snip;
      col.y = -(snip.length * LINE_H) - Math.random() * H * 0.5;
      col.x = Math.random() * W;
      col.speed = 0.1 + Math.random() * 0.2;
      col.alpha = 0.045 + Math.random() * 0.09;
      col.fade = 0;
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
document.fonts.ready.then(() => { resize(); draw(); });

/* ── TAG HOVER HIGHLIGHT ── */
document.querySelectorAll('.ptag').forEach(t => {
  t.addEventListener('mouseenter', () => t.classList.add('active'));
  t.addEventListener('mouseleave', () => t.classList.remove('active'));
});
