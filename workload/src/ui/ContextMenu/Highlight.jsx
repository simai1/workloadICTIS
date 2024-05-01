import React from "react";
import styles from "./ContextMenu.module.scss";
import DataContext from "../../context";

export function Highlight(props) {
  const { tabPar } = React.useContext(DataContext);
  const SetColor = (colorNumber) => {
    console.log(colorNumber);
  };

  const divStyle =
    tabPar.contextPosition.x + 280 + 180 > window.innerWidth
      ? {
          position: "fixed",
          top: tabPar.contextPosition.y,
          left: tabPar.contextPosition.x - 130,
        }
      : {
          position: "fixed",
          top: tabPar.contextPosition.y,
          left: tabPar.contextPosition.x + 280,
        };

  return (
    <div className={styles.blockHighlight} style={divStyle}>
      <div onClick={() => SetColor(1)}>
        <button className={styles.Group1}>Группа 1</button>
      </div>
      <div onClick={() => SetColor(2)}>
        <button className={styles.Group2}>Группа 2</button>
      </div>
      <div onClick={() => SetColor(3)}>
        <button className={styles.Group3}>Группа 3</button>
      </div>
    </div>
  );
}
