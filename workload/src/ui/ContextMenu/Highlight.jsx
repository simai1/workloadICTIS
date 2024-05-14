import React from "react";
import styles from "./ContextMenu.module.scss";
import DataContext from "../../context";
import { apiAddColored, apiDelColors } from "../../api/services/ApiRequest";

export function Highlight() {
  const { tabPar, basicTabData } = React.useContext(DataContext);
  //! функция занесения выбранных цветов в состояние
  const SetColor = (colorNumber) => {
    let mass = [...tabPar.coloredData];

    if (colorNumber === 0) {
      const coloerd = tabPar.coloredData
        .filter((item) =>
          tabPar.selectedTr.find((el) => el === item.workloadId)
        )
        .map((item) => item.id);
      const data = {
        workloadIds: coloerd,
      };
      apiDelColors(data).then(() => {
        mass = mass.filter(
          (item) => !tabPar.selectedTr.includes(item.id) && item
        );
      });
    } else {
      tabPar.selectedTr.map((item) => {
        let ind = null;
        if (
          mass.some((el, index) => {
            ind = index;
            return el.id === item;
          })
        ) {
          mass[ind].color = colorNumber;
        } else {
          mass.push({ id: item, color: colorNumber });
        }
      });
    }
    tabPar.setColoredData(mass);

    const colored = tabPar.coloredData
      .filter((item) => !tabPar.selectedTr.some((e) => e === item.workloadId))
      .map((el) => el.id);
    const data = {
      color: colorNumber,
      workloadIds: colored,
    };
    console.log(colored);
    if (colored.length > 0) {
      apiAddColored(data).then(() => {
        basicTabData.funUpdateAllColors();
      });
    }

    tabPar.setContextMenuShow(false);
    tabPar.setSelectedTr([]);
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
      <div onClick={() => SetColor(0)}>
        <button className={styles.Group0}>Убрать</button>
      </div>
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
