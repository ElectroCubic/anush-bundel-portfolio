import { useMemo, useState } from "react";
import styles from "./SkillsSection.module.css";

const ROOT_ID = "core";

/**
 * Tree definition (parent -> children).
 * Positions still live here so you can move stuff freely.
 */
const TREE = {
    id: "core",
    label: "Core",
    type: "core",
    col: 9,
    row: 4,
    children: [
        {
            id: "python",
            label: "Python",
            col: 9,
            row: 2,
            children: [
                { id: "pygame", label: "Pygame", col: 7, row: 2, children: [] },
            ],
        },
        {
            id: "git",
            label: "Git",
            col: 6,
            row: 4,
            children: [
                { id: "github", label: "GitHub", col: 3, row: 4, children: [] },
            ],
        },
        {
            id: "gdscript",
            label: "GDScript",
            col: 11,
            row: 4,
            children: [
                {
                    id: "godot",
                    label: "Godot",
                    col: 13,
                    row: 4,
                    children: [
                        { id: "fl", label: "FL\nStudio", col: 13, row: 2, children: [] },
                        {
                            id: "aseprite",
                            label: "Aseprite",
                            col: 15,
                            row: 4,
                            children: [
                                { id: "figma", label: "Figma", col: 17, row: 4, children: [] },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "vsc",
            label: "VSC",
            col: 9,
            row: 6,
            children: [
                {
                    id: "html",
                    label: "HTML",
                    col: 7,
                    row: 6,
                    children: [
                        {
                            id: "css",
                            label: "CSS",
                            col: 5,
                            row: 6,
                            children: [
                                {
                                    id: "js",
                                    label: "JS",
                                    col: 3,
                                    row: 6,
                                    children: [
                                        { id: "react", label: "React", col: 1, row: 6, children: [] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "csharp",
                    label: "C#",
                    col: 11,
                    row: 6,
                    children: [
                        { id: "unity", label: "Unity", col: 13, row: 6, children: [] },
                    ],
                },
            ],
        },
    ],
};

// Layout constants (deterministic)
const COLS = 17;
const ROWS = 6;

const PITCH_X = 160;
const PITCH_Y = 170;

const PAD_X = 110;
const PAD_Y = 90;

const NODE_W = 118;
const NODE_H = 118;
const NODE_R = 22;

const CORE_D = 140;

function flattenTree(root) {
    const nodes = [];
    const edges = [];
    const parentById = new Map();

    const stack = [{ node: root, parent: null }];

    while (stack.length) {
        const { node, parent } = stack.pop();

        nodes.push(node);
        if (parent) {
            edges.push([parent.id, node.id]); // directed edge parent -> child
            parentById.set(node.id, parent.id);
        } else {
            parentById.set(node.id, null);
        }

        const children = node.children ?? [];
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push({ node: children[i], parent: node });
        }
    }

    return { nodes, edges, parentById };
}

function SkillsSection() {
    const [activeId, setActiveId] = useState(null);

    const { nodes, edges, parentById } = useMemo(() => flattenTree(TREE), []);

    const centers = useMemo(() => {
        const m = new Map();
        nodes.forEach((n) => {
            const x = PAD_X + (n.col - 1) * PITCH_X;
            const y = PAD_Y + (n.row - 1) * PITCH_Y;
            m.set(n.id, { x, y });
        });
        return m;
    }, [nodes]);

    const viewW = PAD_X * 2 + (COLS - 1) * PITCH_X;
    const viewH = PAD_Y * 2 + (ROWS - 1) * PITCH_Y;

    /**
     * Compute the PATH from ROOT -> activeId (unique in a tree).
     */
    const { pathNodes, pathEdges } = useMemo(() => {
        const pn = new Set();
        const pe = new Set();

        if (!activeId) {
            return { pathNodes: pn, pathEdges: pe };
        }

        // Walk upward from active to root using parent pointers
        let cur = activeId;
        pn.add(cur);

        while (cur && cur !== ROOT_ID) {
            const parent = parentById.get(cur);
            if (!parent) break;

            pn.add(parent);
            pe.add(`${parent}->${cur}`);
            cur = parent;
        }

        return { pathNodes: pn, pathEdges: pe };
    }, [activeId, parentById]);

    const isDimNode = (id) => {
        if (!activeId) return false;
        return !pathNodes.has(id);
    };

    const isPathEdge = (a, b) => {
        if (!activeId) return false;
        return pathEdges.has(`${a}->${b}`);
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
                        <filter id="wireGlow" x="-60%" y="-60%" width="220%" height="220%">
                            <feGaussianBlur stdDeviation="4.0" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="rgba(0,0,0,0.55)" />
                        </filter>

                        <filter id="coreGlow" x="-70%" y="-70%" width="240%" height="240%">
                            <feGaussianBlur stdDeviation="12" result="cblur" />
                            <feMerge>
                                <feMergeNode in="cblur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <radialGradient id="coreFill" cx="50%" cy="50%" r="60%">
                            <stop offset="0%" stopColor="rgba(94,235,138,0.38)" />
                            <stop offset="100%" stopColor="rgba(14,11,39,0.65)" />
                        </radialGradient>
                    </defs>

                    {/* WIRES */}
                    <g>
                        {edges.map(([a, b]) => {
                            const p1 = centers.get(a);
                            const p2 = centers.get(b);
                            if (!p1 || !p2) return null;

                            const onPath = isPathEdge(a, b);
                            const dim = activeId ? !onPath : false;

                            // Glow ONLY for path edges
                            const glowOpacity = onPath ? 0.35 : 0;
                            const baseOpacity = dim ? 0.10 : onPath ? 0.85 : 0.55;

                            return (
                                <g key={`${a}->${b}`}>
                                    {onPath && (
                                        <line
                                            x1={p1.x}
                                            y1={p1.y}
                                            x2={p2.x}
                                            y2={p2.y}
                                            vectorEffect="non-scaling-stroke"
                                            filter="url(#wireGlow)"
                                            style={{
                                                stroke: "rgba(9, 230, 246, 0.95)",
                                                strokeWidth: 7,
                                                strokeLinecap: "round",
                                                opacity: glowOpacity,
                                            }}
                                        />
                                    )}

                                    <line
                                        x1={p1.x}
                                        y1={p1.y}
                                        x2={p2.x}
                                        y2={p2.y}
                                        vectorEffect="non-scaling-stroke"
                                        style={{
                                            stroke: "rgba(9, 230, 246, 0.90)",
                                            strokeWidth: 3.0,
                                            strokeLinecap: "round",
                                            opacity: baseOpacity,
                                        }}
                                    />
                                </g>
                            );
                        })}
                    </g>

                    {/* NODES */}
                    <g>
                        {nodes.map((n) => {
                            const c = centers.get(n.id);
                            if (!c) return null;

                            const dim = isDimNode(n.id);

                            const handlers = {
                                onMouseEnter: () => setActiveId(n.id),
                                onMouseLeave: () => setActiveId(null),
                                onFocus: () => setActiveId(n.id),
                                onBlur: () => setActiveId(null),
                            };

                            if (n.type === "core") {
                                return (
                                    <g
                                        key={n.id}
                                        className={`${styles.node} ${styles.coreNode} ${dim ? styles.dim : ""}`}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={n.label}
                                        {...handlers}
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
                                    tabIndex={0}
                                    role="button"
                                    aria-label={n.label}
                                    {...handlers}
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
