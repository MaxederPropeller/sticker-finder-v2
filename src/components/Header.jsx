import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Logo</div>
      <div className="search">
        <input type="text" placeholder="Suchen..." />
        {/* Filter hier hinzufügen */}
      </div>
      <div className="menu">Menu</div>
    </header>
  );
};

export default Header;
