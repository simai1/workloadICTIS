import React, { useState } from "react";
import styles from "./../TableWorkload.module.scss";
import DataContext from "../../../context";
// import { FilteredSample } from "../../../ui/SamplePoints/Function";
function InputCheckbox(props) {
  const { appData, checkPar } = React.useContext(DataContext);
  const [isHovered, setIsHovered] = useState(false);
  const stylesTh = { backgroundColor: props.bgColor, zIndex: "31" };
  const stylesTd = {
    zIndex: `${10 - props.number}`,
    backgroundColor: props.bgColor,
  };
  //!функция сброса фильтров
  const refreshFilters = () => {
    checkPar.setIsChecked([]);
    checkPar.setAllChecked([]);
    sessionStorage.setItem("isCheckedHistory", null);
    // const fdfix = FilteredSample(props.orighistoryData, [], "idasdasd");
    console.log("props.orighistoryData", props.orighistoryData);
    props.sethistoryData([...props.orighistoryData]);
    appData.setSortParamByColumn("");
  };

  return (
    <>
      {props.th ? (
        <th style={stylesTh} className={styles.InputCheckbox}>
          <div className={styles.bacground}>
            <img
              src="./img/ClearFilter.svg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={refreshFilters}
            />
            {isHovered && (
              <div className={styles.BlockTextFilter}>
                <div className={styles.triangle}></div>
                <p className={styles.textFilter}>Сбросить фильтры</p>
              </div>
            )}
          </div>
          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </th>
      ) : (
        <td style={stylesTd} className={styles.InputCheckbox}>
          <div className={styles.bacground}></div>

          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
          {(props.obj.action === "after" ||
            props.obj.type === "Обновленная") && (
            <>
              <div className={styles.arrow}>
                <img
                  style={{
                    transform:
                      props.obj.type === "Обновленная"
                        ? "rotate(-90deg)"
                        : "none",
                  }}
                  src="img/Arrow.svg"
                  alt=">"
                />

                <div className={styles.type}>{props.obj.type}</div>
              </div>
            </>
          )}
        </td>
      )}
    </>
  );
}

export default InputCheckbox;
