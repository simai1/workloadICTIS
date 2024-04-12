import React from "react";
import styles from "./ContextMenu.module.scss";

export function Highlight(props) {
  return (
    <div
      className={styles.blockHighlight}
      style={{
        position: "fixed",
        top: props.menuPosition.y + 144,
        left: props.menuPosition.x + 280,
      }}
    >
      <div   onClick={() => props.SetColor(1)}>
        <button
          className={styles.Group1}
        
        >
         Группа 1
        </button>
      </div>
      <div onClick={() => props.SetColor(2)}>
        <button
          className={styles.Group2}
        >
          Группа 2
        </button>
      </div>
      <div onClick={() => props.SetColor(3)} >
        <button
          className={styles.Group3}
        >
          Группа 3
        </button>
      </div>
    </div>
  );
}
