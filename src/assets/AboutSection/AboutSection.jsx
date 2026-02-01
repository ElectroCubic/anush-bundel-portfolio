import { useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./AboutSection.module.css";
import TilePanel from "../TilePanel/TilePanel.jsx";

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
  const arr = [...originalArr];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function AboutSection() {
  const [tiles, setTiles] = useState(() => shuffleArray(words));

  // DOM refs for every tile (keyed by tile.id)
  const tileRefs = useRef(new Map());

  // FLIP storage for the *two* tiles being swapped
  const flipRef = useRef({
    pending: false,
    ids: [],
    firstRects: new Map(),
  });

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
    setTiles(shuffleArray(words));
  }, []);

  const findTileIndexFromPoint = (x, y) => {
    const els = document.elementsFromPoint(x, y);
    const tileEl = els
      .find((el) => el?.closest?.("[data-tile]"))
      ?.closest?.("[data-tile]");
    if (!tileEl) return null;

    const idx = Number(tileEl.getAttribute("data-index"));
    return Number.isFinite(idx) ? idx : null;
  };

  const swap = (i, j) => {
    if (i == null || j == null || i === j) return;

    setTiles((prev) => {
      const a = prev[i];
      const b = prev[j];
      if (!a || !b) return prev;

      // 1) FIRST: store the current rects of the two tiles
      const ids = [a.id, b.id];
      const firstRects = new Map();

      ids.forEach((id) => {
        const el = tileRefs.current.get(id);
        if (el) firstRects.set(id, el.getBoundingClientRect());
      });

      flipRef.current = {
        pending: true,
        ids,
        firstRects,
      };

      // do the actual swap
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // 2) LAST + INVERT + PLAY: after tiles state changes (re-render happened)
  useLayoutEffect(() => {
    const flip = flipRef.current;
    if (!flip.pending) return;

    const { ids, firstRects } = flip;
    const animations = [];

    ids.forEach((id) => {
      const el = tileRefs.current.get(id);
      const first = firstRects.get(id);
      if (!el || !first) return;

      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;

      // If it didn't move, skip
      if (dx === 0 && dy === 0) return;

      // INVERT: jump it back visually (no transition)
      el.style.transition = "transform 0s";
      el.style.transform = `translate(${dx}px, ${dy}px)`;

      animations.push(el);
    });

    // PLAY: next frame, transition to normal position
    requestAnimationFrame(() => {
      animations.forEach((el) => {
        el.style.transition = "transform 400ms cubic-bezier(.2,.9,.2,1)";
        el.style.transform = "translate(0px, 0px)";
      });

      // cleanup transition after it finishes
      const t = setTimeout(() => {
        animations.forEach((el) => {
          el.style.transition = "";
          el.style.transform = "";
        });
      }, 300);

      // reset pending
      flipRef.current.pending = false;

      return () => clearTimeout(t);
    });
  }, [tiles]);

  const onPointerDown = (e, index) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
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
    if (!dragRef.current.pointerId || e.pointerId !== dragRef.current.pointerId) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const overIndex = findTileIndexFromPoint(e.clientX, e.clientY);

    setDrag((prev) => ({ ...prev, dx, dy, over: overIndex }));
  };

  const onPointerUpOrCancel = (e) => {
    if (!dragRef.current.pointerId || e.pointerId !== dragRef.current.pointerId) return;

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
      e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    } catch (_) {}

    dragRef.current.pointerId = null;
    dragRef.current.from = null;
  };

  return (
    <div className={styles.aboutSection}>
      <div className={styles.textBlock}>
        <h1>Who Am I?</h1>
        <p>
          I'm a game developer passionate about building interactive systems and improving how games feel to play.
        </p>
      </div>

      <div className={styles.wordGridContainer}>
        <div
          className={styles.wordGrid}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
        >
          {tiles.map((t, idx) => {
            const isDragging = drag.active && drag.from === idx;
            const isOver = drag.active && drag.over === idx && drag.from !== idx;

            return (
              <TilePanel
                key={t.id}
                ref={(el) => {
                  if (el) tileRefs.current.set(t.id, el);
                  else tileRefs.current.delete(t.id);
                }}
                text={t.label}
                data-tile
                data-index={idx}
                className={`${isDragging ? styles.dragging : ""} ${isOver ? styles.over : ""}`}
                style={
                  isDragging
                    ? {
                        transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.05)`,
                        cursor: "grabbing",
                        transition: "transform 0s", // prevent weird blending during drag
                        zIndex: 10,
                      }
                    : undefined
                }
                onPointerDown={(e) => onPointerDown(e, idx)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
