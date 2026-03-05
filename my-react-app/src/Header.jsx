import "./header.css";
import logo from "../motosport_icon.png";

function Header() {
  return (
    <header
      className="header"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div className="header-title">Moto Aware</div>
      <img src={logo} width="50" alt="motorcylce icon" />
      <div className="header-actions"></div>
    </header>
  );
}

export default Header;
