import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryFromUrl = location.pathname === "/" ? searchParams.get("q") || "" : "";
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);

  useEffect(() => {
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();

    if (trimmed) {
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
      return;
    }

    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="site-logo">
          Blog
        </Link>

        <div className="header-actions">
          <form className="search-box" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" className="search-submit" aria-label="Search posts">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </form>

          <Link to="/create" className="btn-create">
            + Create Blog
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
