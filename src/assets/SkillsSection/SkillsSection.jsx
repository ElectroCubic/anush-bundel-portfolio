import { useEffect, useMemo, useState } from "react";
import styles from "./SkillsSection.module.css";

const ROOT_ID = "core";

const TREE = {
    id: "core",
    label: "Core",
    type: "core",
    children: [
        {
            id: "python",
            label: "Python",
            children: [
                { id: "pygame", label: "Pygame", children: [] },
            ],
        },
        {
            id: "git",
            label: "Git",
            children: [
                { id: "github", label: "GitHub", children: [] },
            ],
        },
        {
            id: "gdscript",
            label: "GDScript",
            children: [
                {
                    id: "godot",
                    label: "Godot",
                    children: [
                        { id: "fl", label: "FL Studio", children: [] },
                        {
                            id: "aseprite",
                            label: "Aseprite",
                            children: [
                                { id: "figma", label: "Figma", children: [] },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "vsc",
            label: "VSC",
            children: [
                {
                    id: "html",
                    label: "HTML",
                    children: [
                        {
                            id: "css",
                            label: "CSS",
                            children: [
                                {
                                    id: "js",
                                    label: "JS",
                                    children: [
                                        { id: "react", label: "React", children: [] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "csharp",
                    label: "C#",
                    children: [
                        { id: "unity", label: "Unity", children: [] },
                    ],
                },
            ],
        },
    ],
};

const POS_DESKTOP = {
    core: { col: 9, row: 4, type: "core" },

    pygame: { col: 7, row: 2 },
    python: { col: 9, row: 2 },
    fl: { col: 13, row: 2 },

    github: { col: 5, row: 4 },
    git: { col: 7, row: 4 },
    gdscript: { col: 11, row: 4 },
    godot: { col: 13, row: 4 },
    aseprite: { col: 15, row: 4 },
    figma: { col: 17, row: 4 },

    react: { col: 1, row: 6 },
    js: { col: 3, row: 6 },
    css: { col: 5, row: 6 },
    html: { col: 7, row: 6 },
    vsc: { col: 9, row: 6 },
    csharp: { col: 11, row: 6 },
    unity: { col: 13, row: 6 },
};

const POS_MOBILE = {
    core: { col: 4, row: 2, type: "core" },

    python: { col: 6, row: 2 },
    pygame: { col: 6, row: 4 },

    gdscript: { col: 6, row: 6 },
    godot: { col: 6, row: 8 },
    fl: { col: 6, row: 12 },
    aseprite: { col: 4, row: 10 },
    figma: { col: 4, row: 12 },

    git: { col: 2, row: 2 },
    github: { col: 2, row: 4 },

    vsc: { col: 4, row: 4 },
    html: { col: 2, row: 6 },
    css: { col: 2, row: 8 },
    js: { col: 2, row: 10 },
    react: { col: 2, row: 12 },

    csharp: { col: 4, row: 6 },
    unity: { col: 4, row: 8 },
};

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = (e) => setMatches(e.matches);

        if (mql.addEventListener) {
            mql.addEventListener("change", onChange);
        } else {
            mql.addListener(onChange);
        }

        setMatches(mql.matches);

        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener("change", onChange);
            } else {
                mql.removeListener(onChange);
            }
        };
    }, [query]);

    return matches;
}

function flattenTree(root) {
    const nodes = [];
    const edges = [];
    const parentById = new Map();

    const stack = [{ node: root, parent: null }];

    while (stack.length) {
        const { node, parent } = stack.pop();

        nodes.push(node);
        if (parent) {
            edges.push([parent.id, node.id]);
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
    const isMobile = useMediaQuery("(max-width: 650px)");
    const [activeId, setActiveId] = useState(null);

    const { nodes, edges, parentById } = useMemo(() => flattenTree(TREE), []);

    const layout = useMemo(() => {
        if (isMobile) {
            return {
                cols: 7,
                rows: 12,
                pitchX: 92,
                pitchY: 92,
                padX: 26,
                padY: 26,
                nodeW: 78,
                nodeH: 78,
                nodeR: 16,
                coreD: 96,
                pos: POS_MOBILE,
            };
        }

        return {
            cols: 17,
            rows: 6,
            pitchX: 115,
            pitchY: 125,
            padX: 70,
            padY: 60,
            nodeW: 160,
            nodeH: 160,
            nodeR: 26,
            coreD: 150,
            pos: POS_DESKTOP,
        };
    }, [isMobile]);

    const centers = useMemo(() => {
        const m = new Map();

        nodes.forEach((n) => {
            const p = layout.pos[n.id];
            if (!p) return;

            const x = layout.padX + (p.col - 1) * layout.pitchX;
            const y = layout.padY + (p.row - 1) * layout.pitchY;

            m.set(n.id, { x, y });
        });

        return m;
    }, [nodes, layout]);

    const viewW = layout.padX * 2 + (layout.cols - 1) * layout.pitchX;
    const viewH = layout.padY * 2 + (layout.rows - 1) * layout.pitchY;

    const { pathNodes, pathEdges } = useMemo(() => {
        const pn = new Set();
        const pe = new Set();

        if (!activeId) {
            return { pathNodes: pn, pathEdges: pe };
        }

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
        const lineH = isMobile ? 12 : 16;
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

    const onEnter = (id) => setActiveId(id);
    const onLeave = () => setActiveId(null);

    return (
        <div className={styles.skillsSection}>
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
                        <filter id="strokeGlow" x="-60%" y="-60%" width="220%" height="220%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="wireGlow" x="-60%" y="-60%" width="220%" height="220%">
                            <feGaussianBlur stdDeviation={isMobile ? 2.6 : 4.0} result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy={isMobile ? 6 : 10} stdDeviation={isMobile ? 9 : 14} floodColor="rgba(0,0,0,0.55)" />
                        </filter>

                        <filter id="coreGlow" x="-70%" y="-70%" width="240%" height="240%">
                            <feGaussianBlur stdDeviation={isMobile ? 9 : 12} result="cblur" />
                            <feMerge>
                                <feMergeNode in="cblur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="coreFill" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5EEB8A" />
                            <stop offset="100%" stopColor="#7AA2F7" />
                        </linearGradient>
                    </defs>

                    {/* WIRES */}
                    <g>
                        {edges.map(([a, b]) => {
                            const p1 = centers.get(a);
                            const p2 = centers.get(b);
                            if (!p1 || !p2) return null;

                            const onPath = isPathEdge(a, b);
                            const dim = activeId ? !onPath : false;

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
                                                stroke: "var(--accent-color2)",
                                                strokeWidth: isMobile ? 6 : 7,
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
                                            stroke: "var(--accent-color2)",
                                            strokeWidth: isMobile ? 2.4 : 3.0,
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

                            const p = layout.pos[n.id] ?? {};
                            const type = p.type ?? n.type;
                            const dim = isDimNode(n.id);

                            const handlers = {
                                onMouseEnter: () => onEnter(n.id),
                                onMouseLeave: onLeave,
                                onFocus: () => onEnter(n.id),
                                onBlur: onLeave,
                            };

                            if (type === "core") {
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
                                            r={layout.coreD / 2}
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
                                        x={c.x - layout.nodeW / 2}
                                        y={c.y - layout.nodeH / 2}
                                        width={layout.nodeW}
                                        height={layout.nodeH}
                                        rx={layout.nodeR}
                                        ry={layout.nodeR}
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
        </div>
    );
}

export default SkillsSection;
