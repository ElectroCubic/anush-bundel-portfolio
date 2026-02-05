import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard.jsx";
import styles from "./ProjectsSection.module.css";
import profilePic from "../ElectroCubicLogo_New.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    return () =>
      mql.removeEventListener?.("change", onChange) ?? mql.removeListener(onChange);
  }, [query]);

  return matches;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

  const desktopRaf1Ref = useRef(0);
  const desktopRaf2Ref = useRef(0);
  const mobileRaf1Ref = useRef(0);
  const mobileRaf2Ref = useRef(0);

  const settleTimeoutRef = useRef(null);

  // idle | prep | deal | settled
  const [phase, setPhase] = useState("idle");
  const [triggered, setTriggered] = useState(false);

  const [shuffledProjects, setShuffledProjects] = useState(() => projects);

  const [wobblePhaseByIndex, setWobblePhaseByIndex] = useState(() =>
    projects.map(() => "0s")
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const active = shuffledProjects[activeIndex];

  const [poppedId, setPoppedId] = useState(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setTriggered(true);
        setPhase("prep");

        const shuffled = shuffleArray(projects);
        setShuffledProjects(shuffled);

        // Keep this even if wobble is off; harmless.
        const duration = 7.5;
        setWobblePhaseByIndex(
          shuffled.map(() => `-${(Math.random() * duration).toFixed(3)}s`)
        );

        setActiveIndex(0);
        setPoppedId(null);

        io.disconnect();
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [projects]);

  const setOffsets = (cardEl) => {
    const deckEl = deckRef.current;
    if (!deckEl || !cardEl) return;

    const deck = deckEl.getBoundingClientRect();
    const card = cardEl.getBoundingClientRect();

    const dx = deck.left + deck.width / 2 - (card.left + card.width / 2);
    const dy = deck.top + deck.height / 2 - (card.top + card.height / 2);

    cardEl.style.setProperty("--deal-x", `${dx}px`);
    cardEl.style.setProperty("--deal-y", `${dy}px`);
  };

  const scheduleSettle = (isMobileNow) => {
    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);

    // Must match your CSS durations:
    // transform 440ms + stagger (i*140ms), 5 cards => max delay 560ms
    const desktopTotal = 440 + 560 + 60; // small buffer
    const mobileTotal = 440 + 60;

    settleTimeoutRef.current = setTimeout(
      () => setPhase("settled"),
      isMobileNow ? mobileTotal : desktopTotal
    );
  };

  // Desktop deal
  useLayoutEffect(() => {
    if (!triggered) return;
    if (isMobile) return;
    if (phase !== "prep") return;

    shuffledProjects.forEach((_, i) => setOffsets(desktopCardRefs.current[i]));
    desktopCardRefs.current.forEach((el) => el?.getBoundingClientRect());
    sectionRef.current?.getBoundingClientRect();

    desktopRaf1Ref.current = requestAnimationFrame(() => {
      desktopRaf2Ref.current = requestAnimationFrame(() => {
        setPhase("deal");
        scheduleSettle(false);
      });
    });

    return () => {
      cancelAnimationFrame(desktopRaf1Ref.current);
      cancelAnimationFrame(desktopRaf2Ref.current);
    };
  }, [triggered, isMobile, phase, shuffledProjects]);

  // Mobile re-deal on arrow taps
  useLayoutEffect(() => {
    if (!triggered) return;
    if (!isMobile) return;

    setPhase("prep");

    mobileRaf1Ref.current = requestAnimationFrame(() => {
      const cardEl = mobileCardRef.current;
      if (!cardEl) return;

      setOffsets(cardEl);
      cardEl.getBoundingClientRect();
      sectionRef.current?.getBoundingClientRect();

      mobileRaf2Ref.current = requestAnimationFrame(() => {
        setPhase("deal");
        scheduleSettle(true);
      });
    });

    return () => {
      cancelAnimationFrame(mobileRaf1Ref.current);
      cancelAnimationFrame(mobileRaf2Ref.current);
    };
  }, [activeIndex, triggered, isMobile]);

  useEffect(() => {
    return () => {
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    };
  }, []);

  const prev = () =>
    setActiveIndex((i) => (i - 1 + shuffledProjects.length) % shuffledProjects.length);
  const next = () =>
    setActiveIndex((i) => (i + 1) % shuffledProjects.length);

  const onCardTap = (id) => {
    setPoppedId((cur) => (cur === id ? null : id));
  };

  const cardPhaseClass =
    phase === "prep"
      ? styles.prep
      : phase === "deal"
      ? styles.dealing
      : phase === "settled"
      ? styles.settled
      : "";

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={styles.projectsSection}
      onClick={() => setPoppedId(null)}
    >
      <div className={styles.headingBar}>
        <h1 className={styles.heading}>Explore My Worlds</h1>
        <p className={styles.subheading}>The Cool Stuff I've Worked Upon</p>
      </div>

      <div className={styles.cardsViewport}>
        {!isMobile && (
          <div className={styles.cardsScroller}>
            <div className={styles.cardsRow}>
              {shuffledProjects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  ref={(el) => (desktopCardRefs.current[i] = el)}
                  title={p.title}
                  description={p.description}
                  tags={p.tags}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardTap(p.id);
                  }}
                  className={[
                    styles.dealCard,
                    cardPhaseClass,
                    poppedId === p.id ? styles.popped : "",
                  ].join(" ")}
                  style={{
                    "--deal-delay": `${i * 140}ms`,
                    "--wobble-phase": wobblePhaseByIndex[i] ?? "0s",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {isMobile && active && (
          <div className={styles.mobileWrap} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.arrow}
              onClick={prev}
              aria-label="Previous project"
              disabled={!triggered}
            >
              <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
            </button>

            <div className={styles.mobileCardSlot}>
              <ProjectCard
                key={active.id}
                ref={mobileCardRef}
                title={active.title}
                description={active.description}
                tags={active.tags}
                onClick={(e) => {
                  e.stopPropagation();
                  onCardTap(active.id);
                }}
                className={[
                  styles.dealCard,
                  styles.mobileCard,
                  cardPhaseClass,
                  poppedId === active.id ? styles.popped : "",
                ].join(" ")}
                style={{
                  "--deal-delay": `0ms`,
                  "--wobble-phase": wobblePhaseByIndex[activeIndex] ?? "0s",
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
              <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
            </button>

            <div className={styles.dots} aria-hidden="true">
              {shuffledProjects.map((p, i) => (
                <span
                  key={p.id}
                  className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={deckRef} className={styles.deck} aria-hidden="true">
          <img src={profilePic} alt="" />
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
