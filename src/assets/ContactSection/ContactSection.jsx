
import Button from "../Button/Button.jsx"
import styles from "./ContactSection.module.css"

function ContactSection()
{
    return(
        <div className={styles.contactSection}>
            <div className={styles.contactText}>
                <h1> Let's Connect! </h1>
                <p> I enjoy talking about game design, systems, mechanics, and ideas in progress. <br/><br/>
                    If you're curious about my work, want to exchange thoughts, or explore a collaboration, 
                    feel free to reach out. <br/><br/> You can even just say Hi!
                </p>
            </div>

            <div className={styles.contactBlock}>
                <div className={styles.contactBtns}>
                    <Button className={styles.mailBtn} onClick={() => openMail()}>
                        Email Me
                    </Button>
                    <Button className={styles.githubBtn} onClick={() => openGitHub()}>
                        Github
                    </Button>
                    <Button className={styles.linkedInBtn} onClick={() => openLinkedIn()}>
                        LinkedIn
                    </Button>
                    <Button className={styles.itchioBtn} onClick={() => openItchio()}>
                        Itch.io
                    </Button>
                </div>
            </div>
        </div>
    );
}

function openMail()
{

}

function openGitHub()
{

}

function openLinkedIn()
{

}

function openItchio()
{
    
}

export default ContactSection