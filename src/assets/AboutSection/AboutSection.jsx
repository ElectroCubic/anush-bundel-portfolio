
import styles from "./AboutSection.module.css"
import TilePanel from "../TilePanel/TilePanel.jsx";

function AboutSection()
{
    return(
        <div className={styles.aboutSection}>
            <div className={styles.aboutText}>
                <h1> Who Am I? </h1>
                <p> I'm a game developer passionate about building interactive 
                    systems and improving how games feel to play. </p>
            </div>

            <div className={styles.wordGridContainer}>
                <div className={styles.wordGrid}>
                    <TilePanel text="Design" />
                    <TilePanel text="Mechanic" />
                    <TilePanel text="Systems" />
                    <TilePanel text="Build" />
                    <TilePanel text="Gameplay" />
                    <TilePanel text="Loops" />
                    <TilePanel text="Iterate" />
                    <TilePanel text="Player" />
                    <TilePanel text="Feedback" />
                </div>
            </div>
        </div>
    );
}
export default AboutSection