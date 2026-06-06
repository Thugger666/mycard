import { useViewCounter } from '../hooks/useViewCounter'

export default function Hero() {
  const views = useViewCounter()

  return (
    <section className="hero">
      <div className="hero-accent" />
      <div className="hero-accent2" />

      <div className="hero-top">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span className="eyebrow-line" />
            аналитик данных · визитка
          </div>
          <h1 className="hero-name">
            <span className="glitch" data-text="Антон">Антон</span>
            <span className="glitch" data-text="Нусс">Нусс</span>
          </h1>
          <div className="hero-role">
            Ведущий аналитик данных<span className="cursor-blink" />
          </div>
        </div>

        <div className="hero-right">
          <div className="status-pill">
            <span className="status-dot" />
            Открыт к предложениям
          </div>
          <div className="year-badge">2026</div>
          {views !== null && (
            <div className="view-counter">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="view-counter-num">{views.toLocaleString('ru')}</span>
              просмотров
            </div>
          )}
        </div>
      </div>

      <div className="hero-divider">
        <div className="hero-block">
          <div className="hero-block-label">// О себе</div>
          <div className="hero-block-text">
            Строю data-пайплайны и аналитические дашборды.<br />
            Превращаю сырые данные в понятные инсайты — от сбора до визуализации.
            Работаю с облачными хранилищами, ETL-трансформациями и BI-инструментами.
          </div>
        </div>
        <div className="hero-divider-sep" />
        <div className="hero-block">
          <div className="hero-block-label">// Метрики</div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">3<span>+</span></div>
              <div className="stat-label">лет опыта</div>
            </div>
            <div className="stat">
              <div className="stat-num">14<span /></div>
              <div className="stat-label">инструментов</div>
            </div>
            <div className="stat">
              <div className="stat-num">∞</div>
              <div className="stat-label">запросов</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
