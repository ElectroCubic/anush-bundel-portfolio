
import styles from "./AboutSection.module.css"
import TilePanel from "../TilePanel/TilePanel.jsx";

function AboutSection()
{
    return(
        <div className={styles.aboutSection}>
            
            <h1> Who Am I? </h1>
            <p> A game developer focused on building interactive systems and refining how games feel to play. </p>

            <div className={styles.wordGridContainer}>
                <div className={styles.wordGrid}>
                    <TilePanel text="Design"/>
                    <TilePanel text="Mechanic"/>
                    <TilePanel text="Systems"/>
                    <TilePanel text="Build"/>
                    <TilePanel text="Gameplay"/>
                    <TilePanel text="Loops"/>
                    <TilePanel text="Iterate"/>
                    <TilePanel text="Player"/>
                    <TilePanel text="Feedback"/>
                </div>
            </div> 
        </div>
    );
}
export default AboutSection