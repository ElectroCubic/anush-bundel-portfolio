import { useMemo, useState } from "react";
import styles from "./SkillsSection.module.css";

const NODES = [
    { id: "pygame", label: "Pygame", col: 7, row: 2 },
    { id: "python", label: "Python", col: 9, row: 2 },
    { id: "fl", label: "FL\nStudio", col: 13, row: 2 },

    { id: "github", label: "GitHub", col: 3, row: 4 },
    { id: "git", label: "Git", col: 6, row: 4 },
    { id: "core", label: "Core", col: 9, row: 4, type: "core" },
    { id: "gdscript", label: "GDScript", col: 11, row: 4 },
    { id: "godot", label: "Godot", col: 13, row: 4 },
    { id: "aseprite", label: "Aseprite", col: 15, row: 4 },
    { id: "figma", label: "Figma", col: 17, row: 4 },

    { id: "react", label: "React", col: 1, row: 6 },
    { id: "js", label: "JS", col: 3, row: 6 },
    { id: "css", label: "CSS", col: 5, row: 6 },
    { id: "html", label: "HTML", col: 7, row: 6 },
    { id: "vsc", label: "VSC", col: 9, row: 6 },
    { id: "csharp", label: "C#", col: 11, row: 6 },
    { id: "unity", label: "Unity", col: 13, row: 6 },
];

const EDGES = [
    ["pygame", "python"],
    ["python", "core"],
    ["godot", "fl"],

    ["github", "git"],
    ["git", "core"],
    ["core", "gdscript"],
    ["gdscript", "godot"],
    ["godot", "aseprite"],
    ["aseprite", "figma"],

    ["core", "vsc"],
    ["vsc", "html"],
    ["html", "css"],
    ["css", "js"],
    ["js", "react"],

    ["vsc", "csharp"],
    ["csharp", "unity"],
];

// Layout constants (deterministic)
const COLS = 17;
const ROWS = 6;

// Center-to-center spacing in SVG units (not pixels on screen; SVG scales)
const PITCH_X = 160;
const PITCH_Y = 170;

// Outer padding inside the SVG viewBox
const PAD_X = 110;
const PAD_Y = 90;

// Node sizes in SVG units
const NODE_W = 118;
const NODE_H = 118;
const NODE_R = 22;

const CORE_D = 140;

function SkillsSection() {
    const [activeId, setActiveId] = useState(null);

    const byId = useMemo(() => {
        const m = new Map();
        NODES.forEach((n) => m.set(n.id, n));
        return m;
    }, []);

    const centers = useMemo(() => {
        const m = new Map();
        NODES.forEach((n) => {
            const x = PAD_X + (n.col - 1) * PITCH_X;
            const y = PAD_Y + (n.row - 1) * PITCH_Y;
            m.set(n.id, { x, y });
        });
        return m;
    }, []);

    const viewW = PAD_X * 2 + (COLS - 1) * PITCH_X;
    const viewH = PAD_Y * 2 + (ROWS - 1) * PITCH_Y;

    const activeSet = useMemo(() => {
        if (!activeId) return new Set();

        const adj = new Map();
        for (const [a, b] of EDGES) {
            if (!adj.has(a)) adj.set(a, []);
            if (!adj.has(b)) adj.set(b, []);
            adj.get(a).push(b);
            adj.get(b).push(a);
        }

        const seen = new Set([activeId]);
        const q = [activeId];

        while (q.length) {
            const cur = q.shift();
            const nexts = adj.get(cur) ?? [];
            for (const nxt of nexts) {
                if (!seen.has(nxt)) {
                    seen.add(nxt);
                    q.push(nxt);
                }
            }
        }

        return seen;
    }, [activeId]);

    const isDimNode = (id) => {
        if (!activeId) return false;
        return !activeSet.has(id);
    };

    const isDimEdge = (a, b) => {
        if (!activeId) return false;
        return !(activeSet.has(a) && activeSet.has(b));
    };

    const renderLabel = (label, x, y) => {
        const lines = String(label).split("\n");
        const lineH = 16;
        const totalH = (lines.length - 1) * lineH;
        const startY = y - totalH / 2;

        return (
            <text
                x={x}
                y={startY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.nodeLabel}
            >
                {lines.map((line, i) => (
                    <tspan key={i} x={x} dy={i === 0 ? 0 : lineH}>
                        {line}
                    </tspan>
                ))}
            </text>
        );
    };

    return (
        <section className={styles.skillsSection} id="skills">
            <div className={styles.heading}>
                <h1>My Skill Tree</h1>
                <p>Levelling Up My Expertise Everyday</p>
            </div>

            <div className={styles.stage}>
                <svg
                    className={styles.treeSvg}
                    viewBox={`0 0 ${viewW} ${viewH}`}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label="Skill tree diagram"
                >
                    <defs>
                        {/* Wire glow */}
                        <filter id="wireGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.6" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Node shadow */}
                        <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="rgba(0,0,0,0.55)" />
                        </filter>

                        {/* Core glow */}
                        <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="10" result="cblur" />
                            <feMerge>
                                <feMergeNode in="cblur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <radialGradient id="coreFill" cx="50%" cy="50%" r="60%">
                            <stop offset="0%" stopColor="rgba(94,235,138,0.35)" />
                            <stop offset="100%" stopColor="rgba(14,11,39,0.65)" />
                        </radialGradient>
                    </defs>

                    {/* WIRES */}
                    <g>
                        {/* Hard proof line (should ALWAYS show) */}
                        <line
                            x1={40}
                            y1={40}
                            x2={300}
                            y2={40}
                            vectorEffect="non-scaling-stroke"
                            style={{
                                stroke: "magenta",
                                strokeWidth: 6,
                                strokeLinecap: "round",
                                opacity: 1,
                            }}
                        />

                        {EDGES.map(([a, b]) => {
                            const p1 = centers.get(a);
                            const p2 = centers.get(b);

                            if (!p1 || !p2) {
                                return null;
                            }

                            return (
                                <line
                                    key={`${a}-${b}`}
                                    x1={p1.x}
                                    y1={p1.y}
                                    x2={p2.x}
                                    y2={p2.y}
                                    vectorEffect="non-scaling-stroke"
                                    style={{
                                        stroke: "cyan",
                                        strokeWidth: 8,
                                        strokeLinecap: "round",
                                        opacity: 1,
                                    }}
                                />
                            );
                        })}
                    </g>

                    {/* NODES */}
                    <g className={styles.nodesGroup}>
                        {NODES.map((n) => {
                            const c = centers.get(n.id);
                            if (!c) return null;

                            const dim = isDimNode(n.id);

                            if (n.type === "core") {
                                return (
                                    <g
                                        key={n.id}
                                        className={`${styles.node} ${styles.coreNode} ${dim ? styles.dim : ""}`}
                                        onMouseEnter={() => setActiveId(n.id)}
                                        onMouseLeave={() => setActiveId(null)}
                                        onFocus={() => setActiveId(n.id)}
                                        onBlur={() => setActiveId(null)}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={n.label}
                                    >
                                        <circle
                                            cx={c.x}
                                            cy={c.y}
                                            r={CORE_D / 2}
                                            fill="url(#coreFill)"
                                            className={styles.coreCircle}
                                            filter="url(#coreGlow)"
                                        />
                                        {renderLabel(n.label, c.x, c.y)}
                                    </g>
                                );
                            }

                            return (
                                <g
                                    key={n.id}
                                    className={`${styles.node} ${dim ? styles.dim : ""}`}
                                    onMouseEnter={() => setActiveId(n.id)}
                                    onMouseLeave={() => setActiveId(null)}
                                    onFocus={() => setActiveId(n.id)}
                                    onBlur={() => setActiveId(null)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={n.label}
                                >
                                    <rect
                                        x={c.x - NODE_W / 2}
                                        y={c.y - NODE_H / 2}
                                        width={NODE_W}
                                        height={NODE_H}
                                        rx={NODE_R}
                                        ry={NODE_R}
                                        className={styles.nodeRect}
                                        filter="url(#nodeShadow)"
                                    />
                                    {renderLabel(n.label, c.x, c.y)}
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        </section>
    );
}

export default SkillsSection;
