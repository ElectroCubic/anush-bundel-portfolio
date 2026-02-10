import styles from "./SkillsSection.module.css";

function SkillTreeSvg({
    nodes,
    edges,
    centers,
    layout,
    viewW,
    viewH,
    isNarrow,
    activeId,
    isDimNode,
    isPathEdge,
    onEnter,
    onLeave,
    onTap,
    svgRef,
}) {
    const arrowSize = isNarrow ? 3 : 4;
    const baseWireW = isNarrow ? 3.4 : 4.4;
    const glowWireW = isNarrow ? 7.5 : 9.5;
    const arrowOffset = isNarrow ? 45 : 90;

    const renderLabel = (label, x, y, hasIcon, type) => {
        const lines = String(label).split("\n");
        const lineH = isNarrow ? 12 : 16;
        const yOffset = hasIcon
            ? (type === "core"
                ? (isNarrow ? 10 : 16)
                : (isNarrow ? 10 : 14))
            : 0;

        const totalH = (lines.length - 1) * lineH;
        const startY = (y + yOffset) - totalH / 2;

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
        <svg
            ref={svgRef}
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
                    <feGaussianBlur stdDeviation={isNarrow ? 2.8 : 4.2} result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow
                        dx="0"
                        dy={isNarrow ? 6 : 10}
                        stdDeviation={isNarrow ? 9 : 14}
                        floodColor="rgba(0,0,0,0.55)"
                    />
                </filter>

                <filter id="coreGlow" x="-70%" y="-70%" width="240%" height="240%">
                    <feGaussianBlur stdDeviation={isNarrow ? 9 : 12} result="cblur" />
                    <feMerge>
                        <feMergeNode in="cblur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <linearGradient id="coreFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5EEB8A" />
                    <stop offset="100%" stopColor="#7AA2F7" />
                </linearGradient>

                <marker
                    id="arrowHead"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth={arrowSize}
                    markerHeight={arrowSize}
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" className={styles.arrowHead} />
                </marker>
            </defs>

            {/* WIRES */}
            <g>
                {edges.map(([a, b]) => {
                    const p1 = centers.get(a);
                    const p2 = centers.get(b);
                    if (!p1 || !p2) return null;

                    const onPath = isPathEdge(a, b);
                    const dim = activeId ? !onPath : false;

                    const glowOpacity = onPath ? 0.38 : 0;
                    const baseOpacity = dim ? 0.10 : onPath ? 0.90 : 0.58;

                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const len = Math.hypot(dx, dy) || 1;
                    const ux = dx / len;
                    const uy = dy / len;

                    const x2 = p2.x - ux * arrowOffset;
                    const y2 = p2.y - uy * arrowOffset;

                    return (
                        <g key={`${a}->${b}`}>
                            {onPath && (
                                <line
                                    x1={p1.x}
                                    y1={p1.y}
                                    x2={x2}
                                    y2={y2}
                                    vectorEffect="non-scaling-stroke"
                                    filter="url(#wireGlow)"
                                    style={{
                                        stroke: "var(--accent-color2)",
                                        strokeWidth: glowWireW,
                                        strokeLinecap: "round",
                                        opacity: glowOpacity,
                                    }}
                                />
                            )}

                            <line
                                x1={p1.x}
                                y1={p1.y}
                                x2={x2}
                                y2={y2}
                                vectorEffect="non-scaling-stroke"
                                markerEnd="url(#arrowHead)"
                                style={{
                                    stroke: "var(--accent-color2)",
                                    strokeWidth: baseWireW,
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

                    const hasIcon = !!n.icon;

                    const handlers = {
                        onMouseEnter: () => onEnter(n.id),
                        onMouseLeave: onLeave,
                        onFocus: () => onEnter(n.id),
                        onBlur: onLeave,
                        onClick: (e) => {
                            e.stopPropagation();
                            onTap(n.id);
                        },
                    };

                    const iconSize = type === "core"
                        ? (isNarrow ? 26 : 40)
                        : (isNarrow ? 20 : 32);

                    const iconY = type === "core"
                        ? c.y - (isNarrow ? 18 : 26)
                        : c.y - (isNarrow ? 16 : 26);

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

                                {hasIcon && (
                                    <image
                                        href={n.icon}
                                        x={c.x - iconSize / 2}
                                        y={iconY - iconSize / 2}
                                        width={iconSize}
                                        height={iconSize}
                                        className={styles.nodeIcon}
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                )}

                                {renderLabel(n.label, c.x, c.y, hasIcon, type)}
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

                            {hasIcon && (
                                <image
                                    href={n.icon}
                                    x={c.x - iconSize / 2}
                                    y={iconY - iconSize / 2}
                                    width={iconSize}
                                    height={iconSize}
                                    className={styles.nodeIcon}
                                    preserveAspectRatio="xMidYMid meet"
                                />
                            )}

                            {renderLabel(n.label, c.x, c.y, hasIcon, type)}
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}

export default SkillTreeSvg