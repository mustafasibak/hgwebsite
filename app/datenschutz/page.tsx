import { site } from '@/lib/site'

export const metadata = {
  title: 'Datenschutzerklärung – HHanse Grill',
  description: 'Datenschutzerklärung (DSGVO) der HHansegrill GbR.',
}

const h3Style: React.CSSProperties = {
  fontSize: '1.05rem',
  color: 'var(--accent-dark)',
  marginTop: 28,
  marginBottom: 8,
}

const pStyle: React.CSSProperties = {
  fontSize: '0.92rem',
  lineHeight: 1.8,
  marginBottom: 10,
}

const ulStyle: React.CSSProperties = {
  fontSize: '0.92rem',
  lineHeight: 1.8,
  marginBottom: 10,
  paddingLeft: 22,
}

export default function DatenschutzPage() {
  return (
    <div className="container" style={{ padding: '32px 20px 48px', maxWidth: 760 }}>
      <div className="section-title">Datenschutzerklärung (DSGVO)</div>

      <div className="info-box" style={{ borderTop: 'none' }}>
        <p style={pStyle}>
          Verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere der
          EU-Datenschutzgrundverordnung (DSGVO), ist:
        </p>

        <h3 style={h3Style}>Angaben gemäß § 5 TMG</h3>
        <p style={pStyle}>HHansegrill GbR</p>
        <p style={pStyle}>
          <b>Postanschrift:</b><br />
          {site.address}<br />
          21035 Hamburg
        </p>
        <p style={pStyle}>
          <b>Kontakt:</b><br />
          Telefon: 040 - 60 17 49 90<br />
          E-Mail: {site.email}
        </p>
        <p style={pStyle}>
          <b>Vertreten durch:</b><br />
          Fr. Mohamed Hnan
        </p>

        <h3 style={h3Style}>Umsatzsteuer-Identifikationsnummer</h3>
        <p style={pStyle}>44 / 627 / 00607</p>

        <h3 style={h3Style}>Ihre Betroffenenrechte</h3>
        <p style={pStyle}>
          Unter den angegebenen Kontaktdaten unseres Datenschutzbeauftragten können Sie
          jederzeit folgende Rechte ausüben:
        </p>
        <ul style={ulStyle}>
          <li>Auskunft über Ihre bei uns gespeicherten Daten und deren Verarbeitung,</li>
          <li>Berichtigung unrichtiger personenbezogener Daten,</li>
          <li>Löschung Ihrer bei uns gespeicherten Daten,</li>
          <li>Einschränkung der Datenverarbeitung, sofern wir Ihre Daten aufgrund gesetzlicher Pflichten noch nicht löschen dürfen,</li>
          <li>Widerspruch gegen die Verarbeitung Ihrer Daten bei uns und</li>
          <li>Datenübertragbarkeit, sofern Sie in die Datenverarbeitung eingewilligt haben oder einen Vertrag mit uns abgeschlossen haben.</li>
        </ul>
        <p style={pStyle}>
          Sofern Sie uns eine Einwilligung erteilt haben, können Sie diese jederzeit mit
          Wirkung für die Zukunft widerrufen.
        </p>
        <p style={pStyle}>
          Sie können sich jederzeit mit einer Beschwerde an die für Sie zuständige
          Aufsichtsbehörde wenden. Ihre zuständige Aufsichtsbehörde richtet sich nach
          dem Bundesland Ihres Wohnsitzes, Ihrer Arbeit oder der mutmaßlichen Verletzung.
          Eine Liste der Aufsichtsbehörden (für den nichtöffentlichen Bereich) mit
          Anschrift finden Sie unter:{' '}
          <a href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html" target="_blank" rel="noopener noreferrer">
            https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html
          </a>.
        </p>

        <h3 style={h3Style}>Zwecke der Datenverarbeitung durch die verantwortliche Stelle und Dritte</h3>
        <p style={pStyle}>
          Wir verarbeiten Ihre personenbezogenen Daten nur zu den in dieser
          Datenschutzerklärung genannten Zwecken. Eine Übermittlung Ihrer persönlichen
          Daten an Dritte zu anderen als den genannten Zwecken findet nicht statt.
          Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
        </p>
        <ul style={ulStyle}>
          <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben,</li>
          <li>die Verarbeitung zur Abwicklung eines Vertrags mit Ihnen erforderlich ist,</li>
          <li>die Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist,</li>
          <li>die Verarbeitung zur Wahrung berechtigter Interessen erforderlich ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe Ihrer Daten haben.</li>
        </ul>

        <h3 style={h3Style}>Löschung bzw. Sperrung der Daten</h3>
        <p style={pStyle}>
          Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit.
          Wir speichern Ihre personenbezogenen Daten daher nur so lange, wie dies zur
          Erreichung der hier genannten Zwecke erforderlich ist oder wie es die vom
          Gesetzgeber vorgesehenen vielfältigen Speicherfristen vorsehen. Nach Fortfall
          des jeweiligen Zweckes bzw. Ablauf dieser Fristen werden die entsprechenden
          Daten routinemäßig und entsprechend den gesetzlichen Vorschriften gesperrt
          oder gelöscht.
        </p>

        <h3 style={h3Style}>Erfassung allgemeiner Informationen beim Besuch unserer Website</h3>
        <p style={pStyle}>
          Wenn Sie auf unsere Website zugreifen, werden automatisch mittels eines
          Cookies Informationen allgemeiner Natur erfasst. Diese Informationen
          (Server-Logfiles) beinhalten etwa die Art des Webbrowsers, das verwendete
          Betriebssystem, den Domainnamen Ihres Internet-Service-Providers und
          ähnliches. Hierbei handelt es sich ausschließlich um Informationen, welche
          keine Rückschlüsse auf Ihre Person zulassen.
        </p>
        <p style={pStyle}>
          Diese Informationen sind technisch notwendig, um von Ihnen angeforderte
          Inhalte von Webseiten korrekt auszuliefern und fallen bei Nutzung des
          Internets zwingend an. Sie werden insbesondere zu folgenden Zwecken
          verarbeitet:
        </p>
        <ul style={ulStyle}>
          <li>Sicherstellung eines problemlosen Verbindungsaufbaus der Website,</li>
          <li>Sicherstellung einer reibungslosen Nutzung unserer Website,</li>
          <li>Auswertung der Systemsicherheit und -stabilität sowie</li>
          <li>zu weiteren administrativen Zwecken.</li>
        </ul>
        <p style={pStyle}>
          Die Verarbeitung Ihrer personenbezogenen Daten basiert auf unserem
          berechtigten Interesse aus den vorgenannten Zwecken zur Datenerhebung.
          Wir verwenden Ihre Daten nicht, um Rückschlüsse auf Ihre Person zu ziehen.
          Empfänger der Daten sind nur die verantwortliche Stelle und ggf.
          Auftragsverarbeiter.
        </p>
        <p style={pStyle}>
          Anonyme Informationen dieser Art werden von uns ggfs. statistisch
          ausgewertet, um unseren Internetauftritt und die dahinterstehende Technik
          zu optimieren.
        </p>

        <h3 style={h3Style}>Kommentarfunktion</h3>
        <p style={pStyle}>
          Wenn Nutzer Kommentare auf unserer Website hinterlassen, werden neben diesen
          Angaben auch der Zeitpunkt ihrer Erstellung und der zuvor durch den
          Websitebesucher gewählte Nutzername gespeichert. Dies dient unserer
          Sicherheit, da wir für widerrechtliche Inhalte auf unserer Webseite belangt
          werden können, auch wenn diese durch Benutzer erstellt wurden.
        </p>

        <h3 style={h3Style}>Kontaktformular</h3>
        <p style={pStyle}>
          Treten Sie bzgl. Fragen jeglicher Art per E-Mail oder Kontaktformular mit
          uns in Kontakt, erteilen Sie uns zum Zwecke der Kontaktaufnahme Ihre
          freiwillige Einwilligung. Hierfür ist die Angabe einer validen
          E-Mail-Adresse erforderlich. Diese dient der Zuordnung der Anfrage und der
          anschließenden Beantwortung derselben. Die Angabe weiterer Daten ist
          optional. Die von Ihnen gemachten Angaben werden zum Zwecke der Bearbeitung
          der Anfrage sowie für mögliche Anschlussfragen gespeichert. Nach Erledigung
          der von Ihnen gestellten Anfrage werden personenbezogene Daten automatisch
          gelöscht.
        </p>

        <h3 style={h3Style}>Änderung unserer Datenschutzbestimmungen</h3>
        <p style={pStyle}>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie
          stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen
          unserer Leistungen in der Datenschutzerklärung umzusetzen, z.B. bei der
          Einführung neuer Services. Für Ihren erneuten Besuch gilt dann die neue
          Datenschutzerklärung.
        </p>

        <h3 style={h3Style}>Fragen an den Datenschutzbeauftragten</h3>
        <p style={pStyle}>
          Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail
          oder wenden Sie sich direkt an die für den Datenschutz verantwortliche
          Person in unserer Organisation:
        </p>
        <p style={pStyle}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>
    </div>
  )
}
