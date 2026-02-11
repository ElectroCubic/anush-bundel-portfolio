import styles from "./SkillsSection.module.css"

function SkillTooltip({ tooltip, isNarrow, onClick, tooltipRef }) {
  if (!tooltip) return null;

  const cls = isNarrow ? `${styles.tooltip} ${styles.tooltipNarrow}` : styles.tooltip;

  const style = isNarrow
    ? { left: tooltip.x, top: tooltip.y }
    : undefined;

  return (
    <div ref={tooltipRef} className={cls} style={style} role="tooltip" onClick={onClick}>
      <div className={styles.tooltipTitle}>{tooltip.title}</div>
      {tooltip.desc && <div className={styles.tooltipDesc}>{tooltip.desc}</div>}
      {isNarrow && <div className={styles.tooltipHint}>Tap outside to close</div>}
    </div>
  );
}

export default SkillTooltip