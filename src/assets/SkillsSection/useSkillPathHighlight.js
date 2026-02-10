import { useMemo } from "react";
import { ROOT_ID } from "./treeData";

function useSkillPathHighlight({ activeId, parentById }) {
  const { pathNodes, pathEdges } = useMemo(() => {
    const pn = new Set();
    const pe = new Set();
    if (!activeId) return { pathNodes: pn, pathEdges: pe };

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

  const isDimNode = (id) => activeId ? !pathNodes.has(id) : false;
  const isPathEdge = (a, b) => activeId ? pathEdges.has(`${a}->${b}`) : false;

  return { isDimNode, isPathEdge };
}

export default useSkillPathHighlight