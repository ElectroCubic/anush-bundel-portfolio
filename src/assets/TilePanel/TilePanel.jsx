
import styles from "./TilePanel.module.css"
import PropTypes from "prop-types";

function TilePanel({text=""})
{
    return(
        <div className={styles.tilePanel}>
            <h3> {text} </h3>
        </div>
    );

}

TilePanel.propTypes = {
    text: PropTypes.string
}

export default TilePanel