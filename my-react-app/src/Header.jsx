import "./header.css";

function Header() {
  return (
    <header
      className="header"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div className="header-title">Moto Aware</div>
      <img src="../motosport_icon.png" width="50" alt="motorcylce icon" />
      <div className="header-actions"></div>
    </header>
  );
}

export default Header;
