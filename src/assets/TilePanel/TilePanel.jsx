import styles from "./TilePanel.module.css";
import PropTypes from "prop-types";
import { forwardRef } from "react";

const TilePanel = forwardRef(function TilePanel(
  { text = "", className = "", style, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`tilePanel ${styles.tilePanel} ${className}`}
      style={style}
      {...props}
    >
      <h3>{text}</h3>
    </div>
  );
});

TilePanel.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TilePanel;
