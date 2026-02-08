import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import SkillNode from "../SkillNode/SkillNode.jsx";
import styles from "./SkillsSection.module.css";

const NODES = [
    { id: "core", label: "Core", col: 6, row: 1, type: "core" },

    { id: "html", label: "HTML", col: 4, row: 3 },
    { id: "css", label: "CSS", col: 6, row: 3 },
    { id: "js", label: "JS", col: 8, row: 3 },

    { id: "react", label: "React", col: 8, row: 5 },
    { id: "vsc", label: "VS Code", col: 6, row: 5 },

    { id: "python", label: "Python", col: 11, row: 4 },
    { id: "godot", label: "Godot", col: 10, row: 6 },
    { id: "gdscript", label: "GDScript", col: 12, row: 6 },
];

const EDGES = [
    ["core", "html"],
    ["core", "css"],
    ["core", "js"],
    ["js", "react"],
    ["html", "vsc"],
    ["css", "vsc"],
    ["python", "godot"],
    ["python", "gdscript"],
];

function SkillsSection() {
    const nodes = useMemo(() => NODES, []);
    const edges = useMemo(() => EDGES, []);

    const wrapRef = useRef(null);

    const [pointsById, setPointsById] = useState(() => new Map());

    const measurePoints = () => {
        const wrapEl = wrapRef.current;
        if (!wrapEl) return;

        const wrapRect = wrapEl.getBoundingClientRect();
        const map = new Map();

        const nodeEls = wrapEl.querySelectorAll("[data-node-id]");
        nodeEls.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left - wrapRect.left + rect.width / 2;
            const cy = rect.top - wrapRect.top + rect.height / 2;
            const id = el.getAttribute("data-node-id");
            map.set(id, { x: cx, y: cy });
        });

        setPointsById(map);
    };

    // Measure after paint/layout
    useLayoutEffect(() => {
        measurePoints();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-measure on resize (responsive)
    useEffect(() => {
        if (!wrapRef.current) return;

        const onResize = () => measurePoints();
        window.addEventListener("resize", onResize);

        // Also observe size changes of the wrapper itself
        const ro = new ResizeObserver(() => measurePoints());
        ro.observe(wrapRef.current);

        return () => {
            window.removeEventListener("resize", onResize);
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If you later animate / move nodes, you can call measurePoints() again.

    return (
        <section className={styles.skillsSection} id="skills">
            <div className={styles.heading}>
                <h1>My Skill Tree</h1>
                <p>Levelling Up My Expertise Everyday</p>
            </div>

            <div ref={wrapRef} className={styles.treeWrap}>
                {/* SVG UNDER nodes (so nodes sit on top) */}
                <svg className={styles.wires} aria-hidden="true">
                    <defs>
                        {/* Subtle glow */}
                        <filter id="wireGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Optional arrowhead (if you want it) */}
                        <marker
                            id="arrowHead"
                            viewBox="0 0 10 10"
                            refX="8.5"
                            refY="5"
                            markerWidth="7"
                            markerHeight="7"
                            orient="auto"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" className={styles.arrowHead} />
                        </marker>
                    </defs>

                    {edges.map(([a, b]) => {
                        const p1 = pointsById.get(a);
                        const p2 = pointsById.get(b);

                        if (!p1 || !p2) return null;

                        return (
                            <line
                                key={`${a}-${b}`}
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                className={styles.wire}
                                filter="url(#wireGlow)"
                                // Uncomment if you want arrowheads:
                                // markerEnd="url(#arrowHead)"
                            />
                        );
                    })}
                </svg>

                <div className={styles.grid}>
                    {nodes.map((n) => (
                        <SkillNode
                            key={n.id}
                            id={n.id}
                            text={n.label}
                            type={n.type}
                            style={{
                                gridColumn: n.col,
                                gridRow: n.row,
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SkillsSection;
