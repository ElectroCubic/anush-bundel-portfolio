import { useEffect, useRef, useState } from "react";
import styles from "./NavBar.module.css";

const SECTIONS = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
];

const thresholdVal = 0.15;
const rootMarginVal = "-20% 0px -60% 0px";

function NavBar() {
    const [active, setActive] = useState("home");
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (hash) setActive(hash);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
    }, [menuOpen]);

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
                threshold: thresholdVal,
                rootMargin: rootMarginVal,
            }
        );

        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    // Close on Escape
    useEffect(() => {
        if (!menuOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);

    // Close on outside click/tap
    useEffect(() => {
        if (!menuOpen) return;

        const onPointerDown = (e) => {
            if (!navRef.current) return;
            if (!navRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        window.addEventListener("pointerdown", onPointerDown);
        return () => window.removeEventListener("pointerdown", onPointerDown);
    }, [menuOpen]);

    const handleLinkClick = (id) => {
        setActive(id);
        setMenuOpen(false);
    };

    return (
        <nav className={styles.navbar} ref={navRef}>
            <div className={styles.brand}>
                <div className={styles.hero}>
                    <a href="https://anushbundel.com">Anush Bundel</a>
                </div>
                <div className={styles.alias}>@ElectroCubic</div>
            </div>

            <button
                type="button"
                className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
                aria-controls="primary-navigation"
            >
                <span className={styles.hamburgerBar} />
                <span className={styles.hamburgerBar} />
                <span className={styles.hamburgerBar} />
            </button>

            <ul
                id="primary-navigation"
                className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}
            >
                {SECTIONS.map((s) => (
                    <li key={s.id} className={active === s.id ? styles.active : ""}>
                        <a href={`#${s.id}`} onClick={() => handleLinkClick(s.id)}>
                            <i className={styles.menuIcon} aria-hidden="true" />
                            {s.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;
