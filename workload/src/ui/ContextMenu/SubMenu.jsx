import React from "react";
import styles from "./ContextMenu.module.scss";
import DataContext from "../../context";

export function SubMenu(props) {
  const { tabPar } = React.useContext(DataContext);
  return (
    <div
      className={styles.blockMenuRight}
      style={
        tabPar.contextPosition.x + 280 + 180 > window.innerWidth
          ? {
              position: "fixed",
              top: tabPar.contextPosition.y,
              left: tabPar.contextPosition.x - 150,
            }
          : {
              position: "fixed",
              top: tabPar.contextPosition.y,
              left: tabPar.contextPosition.x + 280,
            }
      }
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => props.handleSplitWorkload("2")}
        >
          На 2 потока
        </button>
      </div>
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => props.handleSplitWorkload("3")}
        >
          На 3 потока
        </button>
      </div>
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => props.handleSplitWorkload("4")}
        >
          На 4 потока
        </button>
      </div>
    </div>
  );
}
