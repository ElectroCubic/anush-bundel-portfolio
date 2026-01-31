
import styles from "./NavBar.module.css"

function NavBar()
{
    return(
        <nav className={styles.navbar}>
            <div>
                <div className={styles.hero}> <a href="https://anushbundel.com"> Anush Bundel </a></div>
                <div className={styles.alias}> <a>@ElectroCubic </a> </div>
            </div>

            
            <ul className={styles.links}>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    );
}
export default NavBar