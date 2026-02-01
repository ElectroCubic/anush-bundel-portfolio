
// import PropTypes from "prop-types"
// import styles from "./Button.module.css"

// function Button({text="Click Me", className="", ...props }) {
//   return (
//     <button className={`${styles.button} ${className}`}{...props}> {text} </button>
//   );
// }

// Button.propTypes = {
//     text: PropTypes.string,
//     className: PropTypes.string,
// };

// export default Button

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