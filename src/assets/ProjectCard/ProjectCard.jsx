
import placeholderPic from "../Placeholder.png"
import styles from "./ProjectCard.module.css"

function ProjectCard()
{
    return(
        <div className={styles.card}>
            <img src={placeholderPic}></img>
            <h1> Project Title </h1>
            <p> Description </p>
        </div>
    );
}
export default ProjectCard