
import placeholderPic from "../Placeholder.png"
import PropTypes from "prop-types"
import styles from "./ProjectCard.module.css"

function ProjectCard({imgUrl="", title="", description="", altDesc="Description"})
{
    return(
        <div className={styles.card}>
            <img src={imgUrl} alt={altDesc}></img>
            <h1> {title} </h1>
            <p> {description} </p>
        </div>
    );
}

ProjectCard.propTypes = {
    imgUrl: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    altDesc: PropTypes.string
}

export default ProjectCard