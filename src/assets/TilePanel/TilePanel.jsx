import styles from "./TilePanel.module.css";
import PropTypes from "prop-types";

function TilePanel({ text = "", className = "", style, ...props }) {
  return (
    <div className={`${styles.tilePanel} ${className}`} style={style} {...props}>
      <h3>{text}</h3>
    </div>
  );
}

TilePanel.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TilePanel;
