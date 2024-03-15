import React from "react";
import styles from "./ContextMenu.module.scss";

export function SubMenu(props) {
  return (
    <div
      className={styles.blockMenuRight}
      style={{
        position: "fixed",
        top: props.menuPosition.y,
        left: props.menuPosition.x + 280,
      }}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => props.handleSplitWorkload(2)}
        >
          На 2 потока
        </button>
      </div>
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => props.handleSplitWorkload(3)}
        >
          На 3 потока
        </button>
      </div>
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => props.handleSplitWorkload(4)}
        >
          На 4 потока
        </button>
      </div>
    </div>
  );
}
