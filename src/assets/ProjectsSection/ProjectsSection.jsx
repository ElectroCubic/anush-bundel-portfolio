
import ProjectCard from "../ProjectCard/ProjectCard.jsx"
import styles from "./ProjectsSection.module.css"

function ProjectsSection()
{
    return(
        <div className={styles.projectsSection}>
            <div className={styles.headingBar}>
                <div className={styles.textBlock}>
                    <h1> Explore My Worlds </h1>
                    <p> The Cool Stuff I've Worked Upon </p>
                </div>
            </div>

            <div className={styles.cardsContainer}>
                <div className={styles.cardSlots}>
                    <ProjectCard 
                        title="Test Project 1" 
                        description="One liner description that makes absolutely no sense"
                        altDesc="lol"
                    />
                    <ProjectCard 
                        title="Test Project 2" 
                        description="One liner description that makes absolutely no sense"
                        altDesc="lol"
                    />
                </div>
            </div>
        </div>
    );
}
export default ProjectsSection