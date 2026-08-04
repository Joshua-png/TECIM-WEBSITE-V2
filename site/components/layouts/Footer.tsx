import type { FooterData } from "@/lib/chrome";

const DEFAULT_DATA: FooterData = {
  siteName: "The Eagle Centre for International Ministries",
  shortName: "TECIM",
  tagline:
    "Equipping a generation of kingdom-minded people of integrity and the Word — as Light, Trumpets and Swords.",
  email: "theeaglecenter1@gmail.com",
  phones: ["+233 271 503 760"],
};

export default function Footer({ data = DEFAULT_DATA }: { data?: FooterData }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#" className="logo">
            {data.shortName}<span>.</span>
          </a>
          <p>{data.tagline}</p>
        </div>
        <div className="f-col">
          <h4>Events</h4>
          <ul>
            <li>
              <a href="#events">Hadassah Fellowship Conference</a>
            </li>
            <li>
              <a href="#events">Wise Master Builders Conference</a>
            </li>
          </ul>
        </div>
        <div className="f-col">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#values">Core Values</a>
            </li>
            <li>
              <a href="#vision">Vision &amp; Mission</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
          </ul>
        </div>
        <div className="f-col">
          <h4>Have a Question?</h4>
          <ul>
            {data.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
            ))}
            <li>
              <a href={`mailto:${data.email}`}>{data.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 {data.siteName}</span>
        <span>Light · Trumpets · Swords</span>
      </div>
    </footer>
  );
}
