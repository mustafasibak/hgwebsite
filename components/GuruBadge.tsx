/**
 * Restaurant-Guru-Auszeichnung „Empfohlen 2021“ – Nachbau des Original-Widgets
 * von der alten Website als eigenständiges SVG (keine externen Skripte).
 * Hintergrundgrafik: awards.infcdn.net/img/bg.svg (lokal unter /restaurant-guru-bg.svg).
 */
export default function GuruBadge({ width = 174 }: { width?: number }) {
  return (
    <a
      href="https://de.restaurantguru.com/HHanse-Grill-Hamburg"
      target="_blank"
      rel="noopener noreferrer"
      title="HHanse Grill – empfohlen von Restaurant Guru 2021"
      style={{ display: 'inline-block', lineHeight: 0 }}
    >
      <svg
        width={width}
        height={Math.round(width * (140 / 174))}
        viewBox="0 0 174 140"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Restaurant Guru: Empfohlen 2021"
      >
        <image href="/restaurant-guru-bg.svg" x="0" y="3" width="174" height="134" />

        <defs>
          <path id="rg-arc-top" d="M 36 73 a 50 50 0 1 1 100 0" />
          <path id="rg-arc-bottom" d="M 38 89 a 48 48 0 0 0 96 0" />
        </defs>

        <g
          transform="rotate(-12 87 70)"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            textTransform: 'uppercase',
          }}
        >
          <text fill="#000" fontSize="15" fontWeight="700" textAnchor="middle">
            <textPath href="#rg-arc-top" startOffset="50%">Empfohlen</textPath>
          </text>

          <text
            x="86" y="64"
            fill="#000" fontSize="22" fontWeight="900" fontStyle="italic"
            textAnchor="middle" letterSpacing="0.6"
          >
            2021
          </text>

          <text
            x="86" y="86"
            fill="#fff" fontSize="14" fontWeight="700" fontStyle="italic"
            textAnchor="middle" letterSpacing="0.4"
          >
            HHanse Grill
          </text>

          <text fill="#000" fontSize="11" textAnchor="middle">
            <textPath href="#rg-arc-bottom" startOffset="50%">Restaurant Guru</textPath>
          </text>
        </g>
      </svg>
    </a>
  )
}
