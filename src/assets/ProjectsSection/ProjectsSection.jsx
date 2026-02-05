import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import ProjectCard from "../ProjectCard/ProjectCard.jsx"
import styles from "./ProjectsSection.module.css"
import profilePic from "../ElectroCubicLogo_New.png"

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange) ?? mql.addListener(onChange);
    return () => mql.removeEventListener?.("change", onChange) ?? mql.removeListener(onChange);
  }, [query]);

  return matches;
}

function ProjectsSection() {
  const projects = useMemo(
    () => [
      {
        id: "p1",
        title: "Project Title",
        description:
          "One line description about the Project. It can be about the genre and/or the hook of the project, etc.",
        tags: ["Godot", "FL Studio", "Solo", "Game Jam", "Puzzle"],
      },
      {
        id: "p2",
        title: "Project Title",
        description:
          "One line description about the Project. It can be about the genre and/or the hook of the project, etc.",
        tags: ["Godot", "FL Studio", "Android", "Prototype", "Puzzle"],
      },
      {
        id: "p3",
        title: "Project Title",
        description:
          "One line description about the Project. It can be about the genre and/or the hook of the project, etc.",
        tags: ["Python", "Pygame", "Software", "Simulator"],
      },
      {
        id: "p4",
        title: "Project Title",
        description:
          "One line description about the Project. It can be about the genre and/or the hook of the project, etc.",
        tags: ["Godot", "Puzzle", "Programmer", "GDScript"],
      },
      {
        id: "p5",
        title: "Project Title",
        description:
          "One line description about the Project. It can be about the genre and/or the hook of the project, etc.",
        tags: ["Unity", "C#", "Prototype", "Designer", "Puzzle"],
      },
    ],
    []
  );

  const isMobile = useMediaQuery("(max-width: 640px)");

  const sectionRef = useRef(null);
  const deckRef = useRef(null);
  const desktopCardRefs = useRef([]);
  const mobileCardRef = useRef(null);

  const [triggered, setTriggered] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | prep | deal
  const [activeIndex, setActiveIndex] = useState(0);

  // Trigger once on reach
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          setPhase("prep");
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const setOffsets = (cardEl) => {
    const deckEl = deckRef.current;
    if (!deckEl || !cardEl) return;

    const deck = deckEl.getBoundingClientRect();
    const card = cardEl.getBoundingClientRect();

    const dx = (deck.left + deck.width / 2) - (card.left + card.width / 2);
    const dy = (deck.top + deck.height / 2) - (card.top + card.height / 2);

    cardEl.style.setProperty("--deal-x", `${dx}px`);
    cardEl.style.setProperty("--deal-y", `${dy}px`);
  };

    useLayoutEffect(() => {
    if (!triggered) return;
    if (isMobile) return;
    if (phase !== "prep") return;

    projects.forEach((_, i) => setOffsets(desktopCardRefs.current[i]));
    desktopCardRefs.current.forEach((el) => el?.getBoundingClientRect());
    sectionRef.current?.getBoundingClientRect(); // extra commit

    let raf1 = requestAnimationFrame(() => {
        let raf2 = requestAnimationFrame(() => setPhase("deal"));
        desktopCardRefs.current._raf2 = raf2;
    });
    desktopCardRefs.current._raf1 = raf1;

    return () => {
        cancelAnimationFrame(desktopCardRefs.current._raf1);
        cancelAnimationFrame(desktopCardRefs.current._raf2);
    };
    }, [triggered, isMobile, phase, projects]);


  // Mobile: whenever activeIndex changes, re-deal that single card
    useLayoutEffect(() => {
    if (!triggered) return;
    if (!isMobile) return;

    setPhase("prep");

    let raf1 = requestAnimationFrame(() => {
        setOffsets(mobileCardRef.current);
        mobileCardRef.current?.getBoundingClientRect();
        sectionRef.current?.getBoundingClientRect();

        let raf2 = requestAnimationFrame(() => setPhase("deal"));
        mobileCardRef.current._raf2 = raf2;
    });

    mobileCardRef.current._raf1 = raf1;

    return () => {
        cancelAnimationFrame(mobileCardRef.current._raf1);
        cancelAnimationFrame(mobileCardRef.current._raf2);
    };
    }, [activeIndex, triggered, isMobile]);


  const prev = () => setActiveIndex((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setActiveIndex((i) => (i + 1) % projects.length);

  const active = projects[activeIndex];

  return (
    <section ref={sectionRef} id="projects" className={styles.projectsSection}>
      <div className={styles.headingBar}>
        <h1 className={styles.heading}>Explore My Worlds</h1>
        <p className={styles.subheading}>The Cool Stuff I’ve Worked Upon</p>
      </div>

      <div className={styles.cardsViewport}>
        {/* DESKTOP/TABLET */}
        {!isMobile && (
          <div className={styles.cardsScroller}>
            <div className={styles.cardsRow}>
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  ref={(el) => (desktopCardRefs.current[i] = el)}
                  title={p.title}
                  description={p.description}
                  tags={p.tags}
                  className={[
                    styles.dealCard,
                    phase === "prep" ? styles.prep : "",
                    phase === "deal" ? styles.deal : "",
                  ].join(" ")}
                  style={{
                    "--deal-delay": `${i * 140}ms`,
                    "--wobble-phase": `${i * 0.13}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {isMobile && (
          <div className={styles.mobileWrap}>
            <button
              type="button"
              className={styles.arrow}
              onClick={prev}
              aria-label="Previous project"
              disabled={!triggered}
            >
              &lt;
            </button>

            <div className={styles.mobileCardSlot}>
              <ProjectCard
                key={active.id}
                ref={mobileCardRef}
                title={active.title}
                description={active.description}
                tags={active.tags}
                className={[
                  styles.dealCard,
                  styles.mobileCard,
                  phase === "prep" ? styles.prep : "",
                  phase === "deal" ? styles.deal : "",
                ].join(" ")}
                style={{
                  "--deal-delay": `0ms`,
                  "--wobble-phase": `${activeIndex * 0.17}s`,
                }}
              />
            </div>

            <button
              type="button"
              className={styles.arrow}
              onClick={next}
              aria-label="Next project"
              disabled={!triggered}
            >
              &gt;
            </button>

            <div className={styles.dots} aria-hidden="true">
              {projects.map((p, i) => (
                <span
                  key={p.id}
                  className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                />
              ))}
            </div>
          </div>
        )}

        <div
          ref={deckRef}
          className={styles.deck}
          aria-hidden="true"
        > 
            <img src={profilePic}></img>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
