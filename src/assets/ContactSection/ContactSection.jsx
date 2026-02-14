import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane, faHandshake, faCode, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faItchIo, faDiscord, faYoutube } from "@fortawesome/free-brands-svg-icons";
import Button from "../Button/Button.jsx";
import styles from "./ContactSection.module.css";

const LINKS = {
    github: "https://github.com/ElectroCubic",
    linkedin: "https://www.linkedin.com/in/anush-bundel",
    itch: "https://electrocubic.itch.io",
    youtube: "https://www.youtube.com/@ElectroCubicYT",
    discord: "https://discord.com/users/806390493113614346",
}

function openExternal(url) 
{
    window.open(url, "_blank", "noopener,noreferrer");
}

function openMail() {
    const email = "anushbundel26@gmail.com";
    const subject = "Let's Connect";
    const body = "Hey Anush,";

    const gmailURL =
        `https://mail.google.com/mail/?view=cm&fs=1` +
        `&to=${encodeURIComponent(email)}` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

    openExternal(gmailURL);
}

    const openGitHub = () => openExternal(LINKS["github"]);
    const openLinkedIn = () => openExternal(LINKS["linkedin"]);
    const openItchio = () => openExternal(LINKS["itch"]);
    const openYouTube = () => openExternal(LINKS["youtube"]);
    const openDiscord = () => openExternal(LINKS["discord"]);


function ContactSection() 
{
    return (
        <div className={styles.contactSection}>
            <div className={styles.contactBlock}>
                <div className={styles.card}>
                    <div className={styles.contactBtns}>
                        <Button className={`${styles.brandBtn} ${styles.mailBtn}`} onClick={openMail}>
                            <span className={styles.iconWrapper} aria-hidden="true">
                                <FontAwesomeIcon icon={faEnvelope} className={styles.iconPrimary}/>
                                <FontAwesomeIcon icon={faPaperPlane} className={styles.iconSecondary}/>
                            </span>
                            <span>Email Me</span>
                        </Button>

                        <Button className={`${styles.brandBtn} ${styles.githubBtn}`} onClick={openGitHub}>
                            <span className={styles.iconWrapper} aria-hidden="true">
                                <FontAwesomeIcon icon={faGithub} className={styles.iconPrimary}/>
                                <FontAwesomeIcon icon={faCode} className={styles.iconSecondary}/>
                            </span>
                            <span>Github</span>
                        </Button>

                        <Button className={`${styles.brandBtn} ${styles.linkedInBtn}`} onClick={openLinkedIn}>
                            <span className={styles.iconWrapper} aria-hidden="true">
                                <FontAwesomeIcon icon={faLinkedin} className={styles.iconPrimary}/>
                                <FontAwesomeIcon icon={faHandshake} className={styles.iconSecondary}/>
                            </span>
                            <span>LinkedIn</span>
                        </Button>

                        <Button className={`${styles.brandBtn} ${styles.itchioBtn}`} onClick={openItchio}>
                            <span className={styles.iconWrapper} aria-hidden="true">
                                <FontAwesomeIcon icon={faItchIo} className={styles.iconPrimary}/>
                                <FontAwesomeIcon icon={faGamepad} className={styles.iconSecondary}/>
                            </span>
                            <span>Itch.io</span>
                        </Button>
                    </div>

                    <div className={styles.extraRow}>
                        <button
                            className={styles.extraPill}
                            onClick={openYouTube}
                            type="button"
                        >
                            <span className={styles.pillIcon} aria-hidden="true">
                                <FontAwesomeIcon icon={faYoutube} />
                            </span>
                            <span>ElectroCubicYT</span>
                        </button>

                        <button
                            className={styles.extraPill}
                            onClick={openDiscord}
                            type="button"
                        >
                            <span className={styles.pillIcon} aria-hidden="true">
                                <FontAwesomeIcon icon={faDiscord} />
                            </span>
                            <span>electrocubic</span>
                        </button>
                    </div>

                    <div className={styles.metaLine}>
                        <span className={styles.dot} aria-hidden="true" />
                        <span> Usually replies within 24-48hrs </span>
                    </div>
                </div>
            </div>

            <div className={styles.contactText}>
                <h1>Let's Connect!</h1>
                <p>
                    I enjoy talking about game design, systems, mechanics, and ideas in
                    progress.
                <br />
                <br />
                    If you're curious about my work, want to exchange thoughts, or
                    explore a collaboration, feel free to reach out.
                <br />
                <br />
                    You can even just say Hi! :D
                </p>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerText}>
                    &copy; {new Date().getFullYear()} Anush Bundel | ElectroCubic
                </div>
            </div>
        </div>
    );
}

export default ContactSection