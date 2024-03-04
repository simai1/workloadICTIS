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
          onClick={props.handleMenuClick}
        >
          На 2 потока
        </button>
      </div>
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={props.handleMenuClick}
        >
          На 3 потока
        </button>
      </div>
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={props.handleMenuClick}
        >
          На 4 потока
        </button>
      </div>
    </div>
  );
}
