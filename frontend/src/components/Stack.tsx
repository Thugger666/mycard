const ROWS = [
  { ru: 'Трекинг',           en: 'Tracking',          tags: ['Renta', 'Avo', 'Segment'] },
  { ru: 'Сбор · Интеграция', en: 'Collection · ETL',  tags: ['Renta', 'Fivetran', 'Stitch', 'Singer'] },
  { ru: 'Хранилище',         en: 'Warehousing',        tags: ['BigQuery', 'Snowflake', 'Redshift', 'ClickHouse', 'Databricks'] },
  { ru: 'Трансформация',     en: 'Transformation',     tags: ['dbt', 'Airflow'] },
  { ru: 'Отчётность',        en: 'Reporting & BI',     tags: ['Tableau', 'Looker', 'Power BI', 'Metabase', 'Mode'] },
]

const CONNECTORS = ['↓ сбор и интеграция', '↓ хранилище', '↓ трансформация', '↓ визуализация']

export default function Stack() {
  return (
    <section className="section s2">
      <div className="sec-head">
        <span className="sec-num">01</span>
        <span className="sec-title">Технологический стек</span>
        <div className="sec-line" />
        <span className="sec-badge">14 инструментов</span>
      </div>

      <div className="pipeline">
        {ROWS.map((row, i) => (
          <>
            <div className="pipe-row" key={row.en}>
              <div className="pipe-label">
                <span className="pipe-label-ru">{row.ru}</span>
                <span className="pipe-label-en">{row.en}</span>
              </div>
              <div className="pipe-tags-wrap">
                {row.tags.map(tag => (
                  <span key={tag} className="ptag">{tag}</span>
                ))}
              </div>
            </div>
            {i < CONNECTORS.length && (
              <div className="pipe-connector" key={`c-${i}`}>{CONNECTORS[i]}</div>
            )}
          </>
        ))}
      </div>
    </section>
  )
}
