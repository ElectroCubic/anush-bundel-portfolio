import { useState } from "react"
import styles from "./ProfilePic.module.css"

import logoPic from "../ElectroCubicLogo_New.png"
import realPic from "../AnushBundel.png" 

function ProfilePic() {
    const [showReal, setShowReal] = useState(true);

    return (
        <button
            type="button"
            className={styles.profileContainer}
            onClick={() => setShowReal((v) => !v)}
            aria-label={showReal ? "Show logo" : "Show profile photo"}
        >
            <img
                src={logoPic}
                alt="ElectroCubic logo"
                className={`${styles.pic} ${styles.logo} ${!showReal ? styles.visible : ""}`}
                draggable="false"
            />
            <img
                src={realPic}
                alt="Profile photo"
                className={`${styles.pic} ${styles.photo} ${showReal ? styles.visible : ""}`}
                draggable="false"
            />
        </button>
    );
}

export default ProfilePic