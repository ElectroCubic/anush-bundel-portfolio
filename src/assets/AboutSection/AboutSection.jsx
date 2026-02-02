import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./AboutSection.module.css";
import TilePanel from "../TilePanel/TilePanel.jsx";

const words = [
    { id: "design", label: "Design" },
    { id: "mechanics", label: "Mechanics" },
    { id: "systems", label: "Systems" },
    { id: "build", label: "Build" },
    { id: "gameplay", label: "Gameplay" },
    { id: "loops", label: "Loops" },
    { id: "iterate", label: "Iterate" },
    { id: "player", label: "Player" },
    { id: "feedback", label: "Feedback" },
];

const RELATIONS = [
    ["design", "gameplay"],
    ["gameplay", "loops"],
    ["build", "mechanics"],
    ["mechanics", "systems"],
    ["player", "feedback"],
    ["iterate", "player"],
];

const SOLUTION = [
    "design", "gameplay", "loops",
    "build", "mechanics", "systems",
    "iterate", "player", "feedback",
];

const COLS = 3;
const DURATION = 400;

function isAdjacent(i, j) {
    const r1 = Math.floor(i / COLS);
    const c1 = i % COLS;

    const r2 = Math.floor(j / COLS);
    const c2 = j % COLS;

    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

function shuffleArray(originalArr) {
    const arr = [...originalArr];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

export default function AboutSection() {
    const [tiles, setTiles] = useState(() => shuffleArray(words));

    const [drag, setDrag] = useState({
        active: false,
        from: null,
        over: null,
        dx: 0,
        dy: 0,
    });

    const dragRef = useRef({
        pointerId: null,
        startX: 0,
        startY: 0,
        from: null,
    });

    const tileRefs = useRef(new Map());

    const flipRef = useRef({
        pending: false,
        ids: [],
        firstRects: new Map(),
    });

    useEffect(() => {
        setTiles(shuffleArray(words));
    }, []);

    const solutionIndexById = useMemo(() => {
        return new Map(SOLUTION.map((id, idx) => [id, idx]));
    }, []);

    const idToIndex = useMemo(() => {
        return new Map(tiles.map((t, idx) => [t.id, idx]));
    }, [tiles]);

    const solved = useMemo(() => {
        return (
            tiles.length === SOLUTION.length &&
            tiles.every((t, idx) => t.id === SOLUTION[idx])
        );
    }, [tiles]);

    const correctPlacedIds = useMemo(() => {
        const set = new Set();

        tiles.forEach((t, idx) => {
            const correctIdx = solutionIndexById.get(t.id);
            if (correctIdx === idx) {
                set.add(t.id);
            }
        });

        return set;
    }, [tiles, solutionIndexById]);

    const connectedIds = useMemo(() => {
        const set = new Set();

        for (const [a, b] of RELATIONS) {
            const ia = idToIndex.get(a);
            const ib = idToIndex.get(b);

            if (ia == null || ib == null) {
                continue;
            }

            if (isAdjacent(ia, ib)) {
                set.add(a);
                set.add(b);
            }
        }

        return set;
    }, [idToIndex, correctPlacedIds]);

    const findTileIndexFromPoint = (x, y) => {
        const els = document.elementsFromPoint(x, y);

        const tileEl = els
            .find((el) => el?.closest?.("[data-tile]"))
            ?.closest?.("[data-tile]");

        if (!tileEl) {
            return null;
        }

        const idx = Number(tileEl.getAttribute("data-index"));
        return Number.isFinite(idx) ? idx : null;
    };

    const swap = (i, j) => {
        if (i == null || j == null || i === j) {
            return;
        }

        setTiles((prev) => {
            const a = prev[i];
            const b = prev[j];

            if (!a || !b) {
                return prev;
            }

            const ids = [a.id, b.id];
            const firstRects = new Map();

            ids.forEach((id) => {
                const el = tileRefs.current.get(id);
                if (el) {
                    firstRects.set(id, el.getBoundingClientRect());
                }
            });

            flipRef.current = {
                pending: true,
                ids,
                firstRects,
            };

            const next = [...prev];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
        });
    };

    useLayoutEffect(() => {
        const flip = flipRef.current;
        if (!flip.pending) {
            return;
        }

        const { ids, firstRects } = flip;
        const animations = [];

        ids.forEach((id) => {
            const el = tileRefs.current.get(id);
            const first = firstRects.get(id);

            if (!el || !first) {
                return;
            }

            const last = el.getBoundingClientRect();
            const dx = first.left - last.left;
            const dy = first.top - last.top;

            if (dx === 0 && dy === 0) {
                return;
            }

            el.style.transition = "transform 0s";
            el.style.transform = `translate(${dx}px, ${dy}px)`;

            animations.push(el);
        });

        requestAnimationFrame(() => {
            animations.forEach((el) => {
                el.style.willChange = "transform";
                el.style.transition = `transform ${DURATION}ms cubic-bezier(.2,.9,.2,1)`;
                el.style.transform = "translate(0px, 0px)";
            });

            const t = setTimeout(() => {
                animations.forEach((el) => {
                    el.style.transition = "";
                    el.style.transform = "";
                    el.style.willChange = "auto";
                });
            }, DURATION + 40);

            flipRef.current.pending = false;

            return () => clearTimeout(t);
        });
    }, [tiles]);

    const onPointerDown = (e, index) => {
        if (e.pointerType === "mouse" && e.button !== 0) {
            return;
        }

        e.preventDefault();

        dragRef.current.pointerId = e.pointerId;
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
        dragRef.current.from = index;

        e.currentTarget.setPointerCapture(e.pointerId);

        setDrag({
            active: true,
            from: index,
            over: index,
            dx: 0,
            dy: 0,
        });
    };

    const onPointerMove = (e) => {
        if (
            !dragRef.current.pointerId ||
            e.pointerId !== dragRef.current.pointerId
        ) {
            return;
        }

        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const overIndex = findTileIndexFromPoint(e.clientX, e.clientY);

        setDrag((prev) => ({
            ...prev,
            dx,
            dy,
            over: overIndex ?? null,
        }));
    };

    const onPointerUpOrCancel = (e) => {
        if (
            !dragRef.current.pointerId ||
            e.pointerId !== dragRef.current.pointerId
        ) {
            return;
        }

        const from = dragRef.current.from;
        const to = findTileIndexFromPoint(e.clientX, e.clientY);

        setDrag({
            active: false,
            from: null,
            over: null,
            dx: 0,
            dy: 0,
        });

        swap(from, to);

        try {
            e.currentTarget.releasePointerCapture(
                dragRef.current.pointerId
            );
        } catch (_) {}

        dragRef.current.pointerId = null;
        dragRef.current.from = null;
    };

    return (
        <div className={styles.aboutSection}>
            <div className={styles.textBlock}>
                <h1>Who Am I?</h1>
                <p>
                    I'm a game developer passionate about building interactive systems and 
                    unique gameplay mechanics. I take ideas and turn them into engaging gameplay experiences.
                    <br/><br/>
                    I enjoy participating in game jams and pushing myself to learn new tools and techniques through 
                    hands-on experimentation and rapid prototyping.
                </p>
            </div>

            <div className={styles.wordGridContainer}>
                <div
                    className={[
                        styles.wordGrid,
                        solved ? styles.solved : "",
                    ].join(" ")}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUpOrCancel}
                    onPointerCancel={onPointerUpOrCancel}
                >
                    {tiles.map((t, idx) => {
                        const isConnected =
                            !solved && connectedIds.has(t.id);
                        const isDragging =
                            drag.active && drag.from === idx;
                        const isOver =
                            drag.active &&
                            drag.over === idx &&
                            drag.from !== idx;

                        const className = [
                            isDragging ? `${styles.dragging} isActive` : "",
                            isOver ? styles.over : "",
                            isConnected ? styles.connected : "",
                            solved ? styles.solved : "",
                        ].join(" ");


                        const style = isDragging
                            ? {
                                  transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.05)`,
                                  cursor: "grabbing",
                                  transition: "transform 0s",
                                  zIndex: 10,
                              }
                            : undefined;

                        return (
                            <TilePanel
                                key={t.id}
                                ref={(el) => {
                                    if (el) {
                                        tileRefs.current.set(t.id, el);
                                    } else {
                                        tileRefs.current.delete(t.id);
                                    }
                                }}
                                text={t.label}
                                data-tile
                                data-index={idx}
                                className={className}
                                style={style}
                                onPointerDown={(e) =>
                                    onPointerDown(e, idx)
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
