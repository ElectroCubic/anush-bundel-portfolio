
import styles from "./ProfilePic.module.css"
import profilePic from "../ElectroCubicLogo_New.png"

function ProfilePic()
{
    return(
        <div className={styles.profileContainer}>
            <img src={profilePic} alt="Profile Picture"></img>
        </div>
    );
}
export default ProfilePic