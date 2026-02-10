import styles from "./SkillsSection.module.css";

export default function SkillTooltip({ tooltip, isNarrow, onClick, tooltipRef }) {
  if (!tooltip) return null;

  const style =
    isNarrow && tooltip.x != null && tooltip.y != null
      ? { left: tooltip.x, top: tooltip.y }
      : undefined;

  return (
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${isNarrow ? styles.tooltipNarrow : ""}`}
      style={style}
      role="tooltip"
      onClick={onClick}
    >
      <div className={styles.tooltipTitle}>{tooltip.title}</div>
      {tooltip.desc && <div className={styles.tooltipDesc}>{tooltip.desc}</div>}
      {isNarrow && <div className={styles.tooltipHint}>Tap outside to close</div>}
    </div>
  );
}
