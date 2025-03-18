import PropTypes from "prop-types";
import "./CustomMenuItem.css";

const CustomMenuItem = ({ icon, label, selected, onClick }) => {
  return (
    <div
      className={`custom-menu-item ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <span className="menu-icon">{icon}</span>
      <span className="menu-label">{label}</span>

      {selected && <div className="left-indicator" />}
      {selected && <div className="right-arrow" />}
    </div>
  );
};

CustomMenuItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default CustomMenuItem;
