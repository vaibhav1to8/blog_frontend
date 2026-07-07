import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about-col">
          <Link to="/" className="footer-brand">
            Blog
          </Link>

          <h4>About</h4>
          <p>
          This is about the blog platform.
          </p>
        </div>

        <div className="footer-contact-col">
          <p>
            <strong>Email :</strong> vaibhavbhana@gmail.com
          </p>
          <p>
            <strong>Phone :</strong> 880 123 456 789
          </p>
        </div>

        <div className="footer-newsletter-col">
          <div className="newsletter-card">
            <h4>Weekly Newsletter</h4>
            <p>Get blog articles and offers via email</p>
            <div className="newsletter-input">
              <input type="email" placeholder="Your Email" aria-label="Email" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 6H20V18H4V6Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <button type="button" className="btn-subscribe">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-links">
          <span>Terms of Use</span>
          <span>Privacy Policy</span>
          <span>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
