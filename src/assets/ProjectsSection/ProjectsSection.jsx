import ProjectCard from "../ProjectCard/ProjectCard.jsx";
import styles from "./ProjectsSection.module.css";

function ProjectsSection() {
    return (
        <section id="projects" className={styles.projectsSection}>
            <div className={styles.headingBar}>
                <h1 className={styles.heading}>Explore My Worlds</h1>
                <p className={styles.subheading}>The Cool Stuff I’ve Worked Upon</p>
            </div>

            <div className={styles.cardsViewport}>
                <div className={styles.cardsRow}>
                    <ProjectCard
                        title="Project Title"
                        description="One line description about the Project. It can be about the genre and/or the hook of the project, etc."
                        tags={["Godot", "FL Studio", "Solo", "Game Jam", "Puzzle"]}
                    />
                    <ProjectCard
                        title="Project Title"
                        description="One line description about the Project. It can be about the genre and/or the hook of the project, etc."
                        tags={["Godot", "FL Studio", "Android", "Prototype", "Puzzle"]}
                    />
                    <ProjectCard
                        title="Project Title"
                        description="One line description about the Project. It can be about the genre and/or the hook of the project, etc."
                        tags={["Python", "Pygame", "Software", "Simulator"]}
                    />
                    <ProjectCard
                        title="Project Title"
                        description="One line description about the Project. It can be about the genre and/or the hook of the project, etc."
                        tags={["Godot", "Puzzle", "Programmer", "GDScript"]}
                    />
                    <ProjectCard
                        title="Project Title"
                        description="One line description about the Project. It can be about the genre and/or the hook of the project, etc."
                        tags={["Unity", "C#", "Prototype", "Designer", "Puzzle"]}
                    />
                </div>
            </div>
        </section>
    );
}

export default ProjectsSection;
