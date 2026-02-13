import styles from "./SkillsSection.module.css"

const UI = {
  arrow: {
    size: { narrow: 3, wide: 4 },
    offset: { narrow: 50, wide: 90 },
  },
  wire: {
    baseWidth: { narrow: 3.4, wide: 4.4 },
    glowWidth: { narrow: 7.5, wide: 9.5 },
    glowOpacity: { onPath: 0.38, offPath: 0.0 },
    baseOpacity: { dim: 0.10, onPath: 0.90, idle: 0.58 },
    color: "var(--accent-color2)",
  },
  filters: {
    strokeGlowBlur: 6,
    wireGlowBlur: { narrow: 2.8, wide: 4.2 },
    nodeShadow: {
      dx: 0,
      dy: { narrow: 6, wide: 10 },
      stdDev: { narrow: 9, wide: 14 },
      color: "rgba(0,0,0,0.75)",
    },
    coreGlowBlur: { narrow: 9, wide: 12 },
  },
  text: {
    lineH: { narrow: 12, wide: 16 },
    bottomPadding: {
      normal: { narrow: 14, wide: 22 },
    },
  },
  icon: {
    size: {
      core: { narrow: 52, wide: 90 },
      normal: { narrow: 56, wide: 82 },
    },
    yOffsetFromCenter: {
      core: { narrow: 0, wide: 0 },
      normal: { narrow: 10, wide: 10 }, 
    },
  },
  coreFill: {
    from: "var(--accent-color1)",
    to: "var(--accent-color2)",
  },
};

function pick(narrowVal, wideVal, isNarrow) {
  return isNarrow ? narrowVal : wideVal;
}

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
  const arrowSize = pick(UI.arrow.size.narrow, UI.arrow.size.wide, isNarrow);
  const arrowOffset = pick(UI.arrow.offset.narrow, UI.arrow.offset.wide, isNarrow);

  const baseWireW = pick(UI.wire.baseWidth.narrow, UI.wire.baseWidth.wide, isNarrow);
  const glowWireW = pick(UI.wire.glowWidth.narrow, UI.wire.glowWidth.wide, isNarrow);

  const wireGlowBlur = pick(UI.filters.wireGlowBlur.narrow, UI.filters.wireGlowBlur.wide, isNarrow);
  const nodeShadowDy = pick(UI.filters.nodeShadow.dy.narrow, UI.filters.nodeShadow.dy.wide, isNarrow);
  const nodeShadowStd = pick(UI.filters.nodeShadow.stdDev.narrow, UI.filters.nodeShadow.stdDev.wide, isNarrow);
  const coreGlowBlur = pick(UI.filters.coreGlowBlur.narrow, UI.filters.coreGlowBlur.wide, isNarrow);

  const renderLabel = (label, x, y) => {
    const lines = String(label).split("\n");
    const lineH = pick(UI.text.lineH.narrow, UI.text.lineH.wide, isNarrow);

    const bottomPad = pick(
      UI.text.bottomPadding.normal.narrow,
      UI.text.bottomPadding.normal.wide,
      isNarrow
    );

    const nodeHalfH = layout.nodeH / 2;
    const blockH = (lines.length - 1) * lineH;
    const startY = y + nodeHalfH - bottomPad - blockH;

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
          <feGaussianBlur stdDeviation={UI.filters.strokeGlowBlur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="wireGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={wireGlowBlur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx={UI.filters.nodeShadow.dx}
            dy={nodeShadowDy}
            stdDeviation={nodeShadowStd}
            floodColor={UI.filters.nodeShadow.color}
          />
        </filter>

        <filter id="coreGlow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation={coreGlowBlur} result="cblur" />
          <feMerge>
            <feMergeNode in="cblur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="coreFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={UI.coreFill.from} />
          <stop offset="100%" stopColor={UI.coreFill.to} />
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

          const glowOpacity = onPath ? UI.wire.glowOpacity.onPath : UI.wire.glowOpacity.offPath;
          const baseOpacity = dim
            ? UI.wire.baseOpacity.dim
            : onPath
              ? UI.wire.baseOpacity.onPath
              : UI.wire.baseOpacity.idle;

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
                    stroke: UI.wire.color,
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
                  stroke: UI.wire.color,
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

          const handlers = {
            onMouseEnter: (e) => onEnter(n.id, e),
            onMouseLeave: onLeave,
            onFocus: () => onEnter(n.id),
            onBlur: onLeave,
            onClick: (e) => {
              e.stopPropagation();
              onTap(n.id);
            },
          };

          const hasIcon = !!n.icon;

          const iconSize =
            type === "core"
              ? pick(UI.icon.size.core.narrow, UI.icon.size.core.wide, isNarrow)
              : pick(UI.icon.size.normal.narrow, UI.icon.size.normal.wide, isNarrow);

          const iconOffset =
            type === "core"
              ? pick(UI.icon.yOffsetFromCenter.core.narrow, UI.icon.yOffsetFromCenter.core.wide, isNarrow)
              : pick(UI.icon.yOffsetFromCenter.normal.narrow, UI.icon.yOffsetFromCenter.normal.wide, isNarrow);

          const iconY = c.y - iconOffset;

          if (type === "core") {
            return (
              <g
                key={n.id}
                className={`${styles.node} ${dim ? styles.dim : ""}`}
                tabIndex={0}
                role="button"
                aria-label={n.label}
                {...handlers}
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={layout.coreD / 2}
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
                    className={`${styles.nodeIcon} ${styles.coreIcon}`}
                    preserveAspectRatio="xMidYMid meet"
                  />
                )}
              </g>
            );
          }

          // NORMAL (rect)
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

              {renderLabel(n.label, c.x, c.y)}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default SkillTreeSvg