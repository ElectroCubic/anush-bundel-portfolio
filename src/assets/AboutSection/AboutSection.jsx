
import {useState, useEffect, useRef} from "react"
import styles from "./AboutSection.module.css"
import TilePanel from "../TilePanel/TilePanel.jsx"

const words = [
  { id: "design", label: "Design" },
  { id: "mechanic", label: "Mechanic" },
  { id: "systems", label: "Systems" },
  { id: "build", label: "Build" },
  { id: "gameplay", label: "Gameplay" },
  { id: "loops", label: "Loops" },
  { id: "iterate", label: "Iterate" },
  { id: "player", label: "Player" },
  { id: "feedback", label: "Feedback" },
];

function shuffleArray(originalArr) {
    const arr = [...originalArr];   // ... means copy

    for (let i = arr.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function AboutSection() {
    const [tiles, setTiles] = useState(() => shuffleArray(words));

    // drag UI state
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

    useEffect(() => {
        setTiles(shuffleArray(words));      // We shuffle when grid loads
    }, []);

    const swap = (i, j) => {
        if (i == null || j == null || i === j) 
        { // If either tile doesn't exist or same tile then return
            return;
        }
        setTiles((prev) => {
            const next = [...prev];
            [next[i], next[j]] = [next[j], next[i]];       // swap
            return next;
        });
    };

    const findTileIndexFromPoint = (x, y) => {
        const els = document.elementsFromPoint(x, y);
        const tileEl = els.find((el) => el?.closest?.("[data-tile]"))?.closest?.("[data-tile]");
        if (!tileEl) return null;

        const idx = Number(tileEl.getAttribute("data-index"));
        return Number.isFinite(idx) ? idx : null;
    };

    const onPointerDown = (e, index) => {
        // get input from mouse or touchscreen
        if (e.pointerType === "mouse" && e.button !== 0) return;

        e.preventDefault();     // Dont scroll while dragging please

        dragRef.current.pointerId = e.pointerId;
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
        dragRef.current.from = index;

        // capture so we still track even if pointer leaves tile
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
        if (!dragRef.current.pointerId || e.pointerId !== dragRef.current.pointerId) {
            return;
        }

        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        const overIndex = findTileIndexFromPoint(e.clientX, e.clientY);

        setDrag((prev) => ({
            ...prev,
            dx,
            dy,
            over: overIndex ?? prev.over,
        }));
    };

    const onPointerUpOrCancel = (e) => {
        if (!dragRef.current.pointerId || e.pointerId !== dragRef.current.pointerId) return;

        const from = dragRef.current.from;
        const to = findTileIndexFromPoint(e.clientX, e.clientY);
        swap(from, to);

        // release capture
        try {
            e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
        } catch (_) {}

        dragRef.current.pointerId = null;
        dragRef.current.from = null;

        setDrag({
            active: false,
            from: null,
            over: null,
            dx: 0,
            dy: 0,
        });
    };

    return (
    <div className={styles.aboutSection}>
        <div className={styles.textBlock}>
            <h1>Who Am I?</h1>
            <p>
                I'm a game developer passionate about building
                interactive systems and improving how games feel to play.
            </p>
        </div>

        <div className={styles.wordGridContainer}>
            <div
                className={styles.wordGrid}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUpOrCancel}
                onPointerCancel={onPointerUpOrCancel}>
                
                {tiles.map((t, idx) => {
                    const isDragging = drag.active && drag.from === idx;
                    const isOver = drag.active && drag.over === idx && drag.from !== idx;

                    return (
                        <TilePanel
                            key={t.id}
                            text={t.label}
                            data-tile
                            data-index={idx}
                            className={`${isDragging ? styles.dragging : ""} ${isOver ? styles.over : ""}`}
                            style={isDragging ? { transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.05)`, cursor: "grabbing"} : undefined}
                            onPointerDown={(e) => onPointerDown(e, idx)}
                        />
                    );
                })}
            </div>
        </div>
    </div>
    );

}
