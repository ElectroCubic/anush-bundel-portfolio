import PropTypes from "prop-types";
import styles from "./SkillNode.module.css";

function SkillNode({ id, text, type = "normal", style }) {
    return (
        <button
            type="button"
            className={`${styles.node} ${type === "core" ? styles.core : ""}`}
            data-node-id={id}
            style={style}
        >
            <span className={styles.label}>{text}</span>
        </button>
    );
}

SkillNode.propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    style: PropTypes.object,
};

export default SkillNode;
