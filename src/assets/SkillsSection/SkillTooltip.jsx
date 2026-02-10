import styles from "./SkillsSection.module.css";

function SkillTooltip({ tooltip, isNarrow, onClick }) {
  if (!tooltip) return null;

  return (
    <div
      className={styles.tooltip}
      style={{ left: tooltip.x, top: tooltip.y }}
      role="tooltip"
      onClick={onClick}
    >
      <div className={styles.tooltipTitle}>{tooltip.title}</div>
      {tooltip.desc && <div className={styles.tooltipDesc}>{tooltip.desc}</div>}
      {isNarrow && <div className={styles.tooltipHint}>Tap outside to close</div>}
    </div>
  );
}

export default SkillTooltip