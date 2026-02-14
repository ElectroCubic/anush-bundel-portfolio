import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import ProfilePic from "../ProfilePic/ProfilePic.jsx"
import Button from "../Button/Button.jsx"
import styles from "./HeroSection.module.css"

const resumeName = "Anush Bundel Resume Game Dev.pdf";

function HeroSection() 
{
    return(
        <div className={styles.heroSection}>
            <ProfilePic />

            <div className={styles.headline}>
                <h1> Building Worlds Never Imagined Before. </h1>
                <p> Designing games and interactive systems with a focus on 
                    mechanics, feedback, and player experience. </p>

                <div className={styles.ctaButton}>
                    <Button className={styles.heroCta} onClick={() => scrollTo("projects", 150)}>
                        Explore Projects
                        <FontAwesomeIcon icon={faForward} className={styles.icon} />
                    </Button>
                    
                    <Button className={styles.resume} 
                      onClick={() => downloadResume()}>
                        Download Resume
                        <FontAwesomeIcon icon={faFileArrowDown} className={styles.dlIcon} />
                    </Button>
                    
                </div>
            </div>
        </div>
    );
}

function downloadResume() {
    const link = document.createElement("a");
    link.href = "/" + resumeName;
    link.download = resumeName;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function scrollTo(id, delay=0) {
    setTimeout(() => { 
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, delay);
}

export default HeroSection