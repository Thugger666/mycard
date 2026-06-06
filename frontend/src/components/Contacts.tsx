interface Contact {
  name: string
  handle: string
  href: string
  icon: React.ReactNode
}

const CONTACTS: Contact[] = [
  {
    name: 'Telegram',
    handle: '@thuger6',
    href: 'https://t.me/thuger6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 4.5L2.5 10.5l6 2 2 6 3-4 5 4 3-14z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    handle: '@antoha.n_',
    href: 'https://instagram.com/antoha.n_',
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
    handle: 'toninuss@bk.ru',
    href: 'mailto:toninuss@bk.ru',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
  },
  {
    name: 'Сетка',
    handle: 'setka.ru',
    href: 'https://setka.ru/users/019d2a55-8f5a-7720-921e-aa7a98989813',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
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
