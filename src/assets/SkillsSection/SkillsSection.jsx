import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SkillsSection.module.css";

import useMediaQuery from "./useMediaQuery.js";
import flattenTree from "./flattenTree.js";
import useSkillTreeLayout from "./useSkillTreeLayout.js";
import useSkillPathHighlight from "./useSkillPathHighlight.js";
import SkillTreeSvg from "./SkillTreeSvg.jsx";
import SkillTooltip from "./SkillTooltip.jsx";
import { TREE } from "./treeData.js";

function SkillsSection() {
  const isNarrow = useMediaQuery("(max-width: 1100px)");

  const [activeId, setActiveId] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  // Smooth tracking
  const rafRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const { nodes, edges, parentById } = useMemo(() => flattenTree(TREE), []);
  const { layout, centers, viewW, viewH } = useSkillTreeLayout({ nodes, isNarrow });
  const { isDimNode, isPathEdge } = useSkillPathHighlight({ activeId, parentById });

  const getNodeMeta = (id) => nodes.find((n) => n.id === id) ?? null;

  const svgToStageXY = (x, y) => {
    const stageEl = stageRef.current;
    const svgEl = svgRef.current;
    if (!stageEl || !svgEl) return { left: 0, top: 0 };

    const stageRect = stageEl.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();

    const scaleX = svgRect.width / viewW;
    const scaleY = svgRect.height / viewH;

    const screenX = svgRect.left + x * scaleX;
    const screenY = svgRect.top + y * scaleY;

    return {
      left: screenX - stageRect.left,
      top: screenY - stageRect.top,
    };
  };

  const clientToStageXY = (clientX, clientY) => {
    const stageEl = stageRef.current;
    if (!stageEl) return { left: 0, top: 0 };

    const stageRect = stageEl.getBoundingClientRect();
    return {
      left: clientX - stageRect.left,
      top: clientY - stageRect.top,
    };
  };

  // Position tooltip near cursor + flip/clamp
  const positionTooltipAtClient = (clientX, clientY) => {
    const stageEl = stageRef.current;
    const tipEl = tooltipRef.current;
    if (!stageEl || !tipEl) return;

    const stageRect = stageEl.getBoundingClientRect();
    const tipRect = tipEl.getBoundingClientRect();

    const margin = 14;
    const pad = 10;

    let { left: x, top: y } = clientToStageXY(clientX, clientY);

    const spaceRight = stageRect.right - clientX;
    const spaceBottom = stageRect.bottom - clientY;

    const ox = spaceRight < tipRect.width + margin ? -(tipRect.width + margin) : margin;
    const oy = spaceBottom < tipRect.height + margin ? -(tipRect.height + margin) : margin;

    tipEl.style.setProperty("--ox", `${ox}px`);
    tipEl.style.setProperty("--oy", `${oy}px`);

    tipEl.style.left = `${x}px`;
    tipEl.style.top = `${y}px`;

    const afterRect = tipEl.getBoundingClientRect();

    let nudgeX = 0;
    let nudgeY = 0;

    if (afterRect.right > stageRect.right) nudgeX -= (afterRect.right - stageRect.right) + pad;
    if (afterRect.left < stageRect.left) nudgeX += (stageRect.left - afterRect.left) + pad;

    if (afterRect.bottom > stageRect.bottom) nudgeY -= (afterRect.bottom - stageRect.bottom) + pad;
    if (afterRect.top < stageRect.top) nudgeY += (stageRect.top - afterRect.top) + pad;

    if (nudgeX !== 0) tipEl.style.left = `${x + nudgeX}px`;
    if (nudgeY !== 0) tipEl.style.top = `${y + nudgeY}px`;
  };

  const scheduleTooltipTrack = (clientX, clientY) => {
    lastPointerRef.current = { x: clientX, y: clientY };
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const { x, y } = lastPointerRef.current;
      positionTooltipAtClient(x, y);
    });
  };

  const showTooltipFor = (id, evt) => {
    const meta = getNodeMeta(id);
    const title = meta?.label ?? id;
    const desc = meta?.desc ?? "";

    // Desktop: show near cursor
    if (!isNarrow && evt?.clientX != null && evt?.clientY != null) {
      setTooltip({ id, title, desc });
      requestAnimationFrame(() => scheduleTooltipTrack(evt.clientX, evt.clientY));
      return;
    }

    // Narrow: anchor to node
    const c = centers.get(id);
    if (!c) return;
    const pos = svgToStageXY(c.x, c.y);
    setTooltip({ id, title, desc, x: pos.left, y: pos.top });
  };

  const hideTooltip = () => setTooltip(null);

  const onEnter = (id, evt) => {
    setActiveId(id);
    if (!isNarrow) showTooltipFor(id, evt);
  };

  const onLeave = () => {
    setActiveId(null);
    hideTooltip();
  };

  const onTap = (id) => {
    if (!isNarrow) return;

    setActiveId(id);
    setTooltip((prev) => (prev?.id === id ? null : prev));
    showTooltipFor(id);
  };

  // Desktop tracking while tooltip open
  useEffect(() => {
    if (isNarrow) return;
    if (!tooltip?.id) return;

    const stageEl = stageRef.current;
    if (!stageEl) return;

    const onMove = (e) => {
      if (!tooltipRef.current) return;
      scheduleTooltipTrack(e.clientX, e.clientY);
    };

    stageEl.addEventListener("pointermove", onMove);
    return () => stageEl.removeEventListener("pointermove", onMove);
  }, [isNarrow, tooltip?.id]);

  // Narrow: click outside closes
  useEffect(() => {
    if (!isNarrow) return;

    const onDocDown = (e) => {
      const stageEl = stageRef.current;
      if (!stageEl) return;

      if (tooltip && !stageEl.contains(e.target)) {
        setActiveId(null);
        hideTooltip();
      }
    };

    document.addEventListener("pointerdown", onDocDown);
    return () => document.removeEventListener("pointerdown", onDocDown);
  }, [isNarrow, tooltip]);

  // Reposition on resize
  useEffect(() => {
    if (!tooltip?.id) return;

    const onResize = () => {
      if (!isNarrow) {
        const { x, y } = lastPointerRef.current;
        if (x && y) scheduleTooltipTrack(x, y);
      } else {
        const c = centers.get(tooltip.id);
        if (!c) return;
        const pos = svgToStageXY(c.x, c.y);
        setTooltip((t) => (t ? { ...t, x: pos.left, y: pos.top } : t));
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [tooltip?.id, isNarrow, centers]);

  return (
    <div className={styles.skillsSection}>
      <div className={styles.heading}>
        <h1>My Skill Tree</h1>
        <p>Levelling Up <span className="hl2">My Expertise</span> Everyday</p>
      </div>

      <div
        className={styles.stage}
        ref={stageRef}
        onClick={() => {
          if (isNarrow) {
            setActiveId(null);
            hideTooltip();
          }
        }}
      >
        <SkillTreeSvg
          nodes={nodes}
          edges={edges}
          centers={centers}
          layout={layout}
          viewW={viewW}
          viewH={viewH}
          isNarrow={isNarrow}
          activeId={activeId}
          isDimNode={isDimNode}
          isPathEdge={isPathEdge}
          onEnter={onEnter}
          onLeave={onLeave}
          onTap={onTap}
          svgRef={svgRef}
        />

        <SkillTooltip
          tooltip={tooltip}
          isNarrow={isNarrow}
          onClick={(e) => e.stopPropagation()}
          tooltipRef={tooltipRef}
        />
      </div>
    </div>
  );
}

export default SkillsSection;
