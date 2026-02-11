import { useMemo } from "react";
import { POS_DESKTOP, POS_MOBILE } from "./treeData";

function useSkillTreeLayout({ nodes, isNarrow }) {
  const layout = useMemo(() => {
    if (isNarrow) {
      return {
        cols: 7, rows: 12,
        pitchX: 82, pitchY: 82,
        padX: 26, padY: 26,
        nodeW: 90, nodeH: 90, nodeR: 16,
        coreD: 80,
        pos: POS_MOBILE,
      };
    }
    return {
      cols: 17, rows: 6,
      pitchX: 115, pitchY: 125,
      padX: 70, padY: 60,
      nodeW: 160, nodeH: 160, nodeR: 26,
      coreD: 130,
      pos: POS_DESKTOP,
    };
  }, [isNarrow]);

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

  return { layout, centers, viewW, viewH };
}

export default useSkillTreeLayout