interface Contact {
  name: string
  handle: string
  href: string
  icon: React.ReactNode
}

const CONTACTS: Contact[] = [
  {
    name: 'Telegram',
    handle: '@your_handle',
    href: 'https://t.me/your_handle',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 4.5L2.5 10.5l6 2 2 6 3-4 5 4 3-14z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    handle: '@your_handle',
    href: 'https://instagram.com/your_handle',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#e879f9" strokeWidth="1.7" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="#e879f9" stroke="none"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    handle: 'your@email.com',
    href: 'mailto:your@email.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'your_handle',
    href: 'https://linkedin.com/in/your_handle',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="4"/>
        <path d="M7 10v7M7 7v.01M12 10v7M12 13a3 3 0 016 0v4"/>
      </svg>
    ),
  },
]

export default function Contacts() {
  return (
    <section className="section s3">
      <div className="sec-head">
        <span className="sec-num">02</span>
        <span className="sec-title">Контакты</span>
        <div className="sec-line" />
      </div>

      <div className="contacts-grid">
        {CONTACTS.map(c => (
          <a key={c.name} href={c.href} className="c-card">
            <div className="c-icon">{c.icon}</div>
            <div className="c-info">
              <div className="c-name">{c.name}</div>
              <div className="c-handle">{c.handle}</div>
            </div>
            <span className="c-arr">↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}
