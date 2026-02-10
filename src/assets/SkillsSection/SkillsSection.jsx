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
    const isNarrow = useMediaQuery("(max-width: 900px)");

    const [activeId, setActiveId] = useState(null);
    const [tooltip, setTooltip] = useState(null);

    const stageRef = useRef(null);
    const svgRef = useRef(null);

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

    const showTooltipFor = (id) => {
        const c = centers.get(id);
        if (!c) return;

        const meta = getNodeMeta(id);
        const title = meta?.label ?? id;
        const desc = meta?.desc ?? "";

        const pos = svgToStageXY(c.x, c.y);

        setTooltip({
            id,
            title,
            desc,
            x: pos.left,
            y: pos.top,
        });
    };

    const hideTooltip = () => {
        setTooltip(null);
    };

    const onEnter = (id) => {
        setActiveId(id);

        // Desktop: hover/focus shows tooltip
        if (!isNarrow) {
            showTooltipFor(id);
        }
    };

    const onLeave = () => {
        // Desktop: leaving clears both
        if (!isNarrow) {
            setActiveId(null);
            hideTooltip();
        }
    };

    const onTap = (id) => {
        // Mobile/tablet: tap toggles tooltip
        if (!isNarrow) return;

        setActiveId(id);
        setTooltip((prev) => {
            if (prev?.id === id) return null;
            return prev;
        });

        showTooltipFor(id);
    };

    // Close tooltip when tapping outside (mobile/tablet)
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

    // Keep tooltip positioned on resize/orientation
    useEffect(() => {
        if (!tooltip?.id) return;

        const onResize = () => {
            showTooltipFor(tooltip.id);
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [tooltip?.id]);

    return (
        <div className={styles.skillsSection}>
            <div className={styles.heading}>
                <h1>My Skill Tree</h1>
                <p>Levelling Up My Expertise Everyday</p>
            </div>

            <div
                className={styles.stage}
                ref={stageRef}
                onClick={() => {
                    // Mobile/tablet: tap empty space closes
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
                />
            </div>
        </div>
    );
}

export default SkillsSection