
import PropTypes from "prop-types"
import styles from "./Button.module.css"

function Button({ text = "Click Me", className = "", ...props }) {
  return (
    <button className={`${styles.button} ${className}`}{...props}> {text} </button>
  );
}

Button.propTypes = {
    text: PropTypes.string,
    className: PropTypes.string,
};

export default Button