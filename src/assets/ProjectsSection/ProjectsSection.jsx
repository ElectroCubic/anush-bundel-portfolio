import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import ProjectCard from "../ProjectCard/ProjectCard.jsx";
import profilePic from "../ElectroCubicLogo_New.png";
import styles from "./ProjectsSection.module.css";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function getWindowCircular(list, start, k) {
  const out = [];
  const n = list.length;
  for (let i = 0; i < k; i++) {
    out.push(list[(start + i) % n]);
  }
  return out;
}

function ProjectsSection() {
  const projects = useMemo(
    () => [
      {
        id: "p1",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Godot", "FL Studio", "Solo", "Game Jam", "Puzzle"],
      },
      {
        id: "p2",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Godot", "FL Studio", "Android", "Prototype", "Puzzle"],
      },
      {
        id: "p3",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Python", "Pygame", "Software", "Simulator"],
      },
      {
        id: "p4",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Godot", "Puzzle", "Programmer", "GDScript"],
      },
      {
        id: "p5",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Unity", "C#", "Prototype", "Designer", "Puzzle"],
      },
            {
        id: "p6",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Godot", "FL Studio", "Solo", "Game Jam", "Puzzle"],
      },
      {
        id: "p7",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Godot", "FL Studio", "Android", "Prototype", "Puzzle"],
      },
      {
        id: "p8",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Python", "Pygame", "Software", "Simulator"],
      },
      {
        id: "p9",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Godot", "Puzzle", "Programmer", "GDScript"],
      },
      {
        id: "p10",
        title: "Project Title",
        description: "One line description about the Project...",
        tags: ["Unity", "C#", "Prototype", "Designer", "Puzzle"],
      },
    ],
    []
  );

  const sectionRef = useRef(null);
  const deckRef = useRef(null);
  const carouselRef = useRef(null);

  const cardRefs = useRef([]);
  const raf1 = useRef(0);
  const raf2 = useRef(0);
  const settleTimeoutRef = useRef(null);

  const [triggered, setTriggered] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | prep | dealing | settled
  const [poppedId, setPoppedId] = useState(null);

  const [shuffledProjects, setShuffledProjects] = useState(() => projects);

  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [wobblePhaseById, setWobblePhaseById] = useState(() => new Map());

  const dealDelay = 140;

  const tapDeck = () => {
    const el = deckRef.current;
    if (!el) return;

    el.classList.remove(styles.deckTap);
    void el.offsetWidth;
    el.classList.add(styles.deckTap);
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const shuffled = shuffleArray(projects);
        setShuffledProjects(shuffled);

        const duration = 4.5;
        const m = new Map();
        shuffled.forEach((p) =>
          m.set(p.id, `-${(Math.random() * duration).toFixed(3)}s`)
        );
        setWobblePhaseById(m);

        setTriggered(true);
        setPhase("prep");
        setPageStart(0);
        setPoppedId(null);

        io.disconnect();
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [projects]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const arrowW = 44;          // From CSS
    const gap = 10;
    const minCardWidth = 250;
    const maxCards = 5;

    const ro = new ResizeObserver(([entry]) => {
      const fullW = entry.contentRect.width;

      const cardsAreaW = Math.max(0, fullW - (arrowW * 2 + gap * 2));
      const raw = Math.floor((cardsAreaW + gap) / (minCardWidth + gap));
      const k = clamp(raw || 1, 1, maxCards);

      setCardsPerPage(k);

      // snap start to multiple of k
      setPageStart((s) => {
        const n = shuffledProjects.length || 1;
        const snapped = Math.floor(s / k) * k;
        return ((snapped % n) + n) % n;
      });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [shuffledProjects.length]);

  const visible = useMemo(() => {
    const n = shuffledProjects.length;
    if (n === 0) {
      return [];
    }
    const k = Math.min(cardsPerPage, n);
    return getWindowCircular(shuffledProjects, pageStart, k);
  }, [shuffledProjects, pageStart, cardsPerPage]);

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

  const scheduleSettle = () => {
    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);

    const k = visible.length || 1;
    const total = 440 + (k - 1) * 140 + 80; // Small time buffer for dealing cards

    settleTimeoutRef.current = setTimeout(() => setPhase("settled"), total);
  };

  // Deal whenever page changes OR cardsPerPage changes
  useLayoutEffect(() => {
    if (!triggered) return;
    if (!visible.length) return;

    setPhase("prep");

    raf1.current = requestAnimationFrame(() => {
      visible.forEach((_, i) => setOffsets(cardRefs.current[i]));
      cardRefs.current.forEach((el) => el?.getBoundingClientRect());
      sectionRef.current?.getBoundingClientRect();

      raf2.current = requestAnimationFrame(() => {
        setPhase("dealing");
        scheduleSettle();
      });
    });

    return () => {
      cancelAnimationFrame(raf1.current);
      cancelAnimationFrame(raf2.current);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    };
  }, [triggered, pageStart, cardsPerPage, visible.length]);

  const prev = () => {
    tapDeck();
    setPoppedId(null);
    setPageStart((s) => {
      const n = shuffledProjects.length || 1;
      const k = Math.min(cardsPerPage, n);
      return (s - k + n) % n;
    });
  };

  const next = () => {
    tapDeck();
    setPoppedId(null);
    setPageStart((s) => {
      const n = shuffledProjects.length || 1;
      const k = Math.min(cardsPerPage, n);
      return (s + k) % n;
    });
  };

  const onCardTap = (id) => {
    setPoppedId((cur) => (cur === id ? null : id));
  };

  const phaseClass =
    phase === "prep" ? styles.prep : 
        phase === "dealing" ? styles.dealing : 
            phase === "settled" ? styles.settled : "";

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
        <div ref={carouselRef} className={styles.carousel}>
          <button
            type="button"
            className={styles.arrow}
            onClick={prev}
            aria-label="Previous projects"
            disabled={!triggered || shuffledProjects.length <= 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
          </button>

          <div
            className={styles.cardsRow}
            style={{ "--cols": visible.length }}
          >
            {visible.map((p, i) => (
              <ProjectCard
                key={p.id}
                ref={(el) => (cardRefs.current[i] = el)}
                title={p.title}
                description={p.description}
                tags={p.tags}
                onClick={(e) => { e.stopPropagation(); onCardTap(p.id);}}
                className={[
                  styles.dealCard,
                  phaseClass,
                  poppedId === p.id ? styles.popped : "",
                ].join(" ")}
                style={{
                  "--deal-delay": `${i * dealDelay}ms`,
                  "--wobble-phase": wobblePhaseById.get(p.id) ?? "0s",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.arrow}
            onClick={next}
            aria-label="Next projects"
            disabled={!triggered || shuffledProjects.length <= 1}
          >
            <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
          </button>
        </div>

        <div ref={deckRef} className={styles.deck} aria-hidden="true">
          <img src={profilePic} alt="ElectroCubic Logo" />
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;