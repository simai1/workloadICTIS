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
      //! удаляем выделение
      const coloerd = mass
        .filter((item) =>
          tabPar.selectedTr.some((el) => el === item.workloadId)
        )
        .map((el) => el.id);
      const data = {
        colorIds: coloerd,
      };
      apiDelColors(data).then(() => {
        mass = mass.filter(
          (item) => !tabPar.selectedTr.includes(item.id) && item
        );
      });
    } else {
      //! добалвяем выделение
      const workloadIds = tabPar.selectedTr.filter(
        (item) => !tabPar.coloredData.some((el) => el.workloadId === item)
      );
      const data = {
        color: colorNumber,
        workloadIds: workloadIds,
      };
      console.log("data", data);

      if (workloadIds.length > 0) {
        apiAddColored(data).then(() => {
          basicTabData.funUpdateAllColors();
        });
      }
    }
    tabPar.setColoredData(mass);

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
