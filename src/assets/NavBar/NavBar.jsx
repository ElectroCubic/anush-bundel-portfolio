import { useEffect, useState } from "react"
import styles from "./NavBar.module.css"

const SECTIONS = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
];

function NavBar() {
    const [active, setActive] = useState("home");

    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (hash) setActive(hash);
    }, []);

        useEffect(() => {
        const els = SECTIONS
            .map((s) => document.getElementById(s.id))
            .filter(Boolean);

        if (!els.length) return;

        const obs = new IntersectionObserver(
            (entries) => {
            const candidates = entries
                .filter((e) => e.isIntersecting)
                .map((e) => ({
                id: e.target.id,
                top: e.boundingClientRect.top,
                }))
                .sort((a, b) => Math.abs(a.top) - Math.abs(b.top));

            if (candidates[0]?.id) setActive(candidates[0].id);
            },
            {
            threshold: 0.15,
            rootMargin: "-20% 0px -60% 0px",
            }
        );

        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
        }, []);


    return (
        <nav className={styles.navbar}>
        <div className={styles.brand}>
            <div className={styles.hero}>
            <a href="https://anushbundel.com">Anush Bundel</a>
            </div>
            <div className={styles.alias}>@ElectroCubic</div>
        </div>

        <ul className={styles.links}>
            {SECTIONS.map((s) => (
            <li key={s.id} className={active === s.id ? styles.active : ""}>
                
                <a href={`#${s.id}`} onClick={() => setActive(s.id)}>
                {s.label}
                </a>
            </li>
            ))}
        </ul>
        </nav>
    );
}
export default NavBar