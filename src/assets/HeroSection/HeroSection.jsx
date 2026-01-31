
import ProfilePic from "../ProfilePic/ProfilePic.jsx"
import Button from "../Button/Button.jsx"
import styles from "./HeroSection.module.css"

function HeroSection() 
{
    return(
        <div className={styles.heroSection}>
            <ProfilePic />

            <div className={styles.headline}>
                <h1> Building Worlds Never Imagined Before. </h1>
                <p> Designing games and interactive systems with a focus on mechanics, feedback, and player experience. </p>
                <div className={styles.ctaButton}>
                    <Button text="Explore Projects" className={styles.heroCta}
                    onClick={() => scrollTo("projects")} />
                    
                    <Button text="Dowload Resume" className={styles.resume} 
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = "/Anush Bundel Resume Game Dev.pdf";
                        link.download = "Anush Bundel Resume Game Dev.pdf";
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    }}/>
                    
                </div>
            </div>
        </div>
    );
}

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}


export default HeroSection