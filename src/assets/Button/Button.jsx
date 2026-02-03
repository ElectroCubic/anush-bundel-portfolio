
import PropTypes from "prop-types";
import styles from "./Button.module.css";

function Button({ children, className = "", onClick }) {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick} >
      {children}
    </button>
  );
}

Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;