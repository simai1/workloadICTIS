import React from "react";
import styles from "./TableDisciplines.module.scss";
import DataContext from "../../context";
import TableTd from "./TableTd";

function Table(props) {
  const { appData } = React.useContext(DataContext);

  return (
    <div>
      <table className={styles.taleDestiplinesMainTable}>
        <thead>
          <tr ref={props.trRef} className={styles.tr_thead}>
            <th className={styles.checkboxHeader} style={{ left: "0" }}>
              <div className={styles.input_left}></div>
              <input
                type="checkbox"
                className={styles.custom__checkbox}
                id="dataRowGlobal"
                name="dataRowGlobal"
                checked={props.isCheckedGlobal}
                onChange={props.handleGlobalCheckboxChange}
              />
              <label htmlFor="dataRowGlobal"></label>
            </th>
            {props.updatedHeader.map((header, index) => (
              <th
                key={header.key}
                onClick={(event) => props.clickFigth(event, index)}
                className={
                  header.key === "discipline" ||
                  header.key === "id" ||
                  header.key === "workload"
                    ? styles.stytic_th
                    : null
                }
                style={{ left: props.arrLeft[index] || "0" }}
              >
                <div className={styles.th_inner}>
                  {header.label}
                  <img src="./img/th_fight.svg" alt=">"></img>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {props.filteredData.map((row, index) => {
            const checkValues = Object.values(row).some((value) =>
              props.isChecked?.includes(value)
            );
            if (!checkValues) {
              return (
                <tr
                  key={row.id}
                  onContextMenu={(e) => props.handleContextMenu(e, index)}
                  className={`
                          ${
                            appData.individualCheckboxes.includes(
                              props.filteredData[index].id
                            )
                              ? styles.colorChecked
                              : ""
                          }
                          ${
                            appData.blockedCheckboxes.includes(
                              props.filteredData[index].id
                            )
                              ? styles.clorBlocked
                              : ""
                          }
                          ${
                            !props.Highlight?.some((item) =>
                              item.id.includes(props.filteredData[index].id)
                            )
                              ? ""
                              : props.Highlight.find((item) =>
                                  item.id.includes(props.filteredData[index].id)
                                ).color === 1
                              ? styles.colorBlue
                              : props.Highlight.find((item) =>
                                  item.id.includes(props.filteredData[index].id)
                                ).color === 2
                              ? styles.colorGreen
                              : props.Highlight.find((item) =>
                                  item.id.includes(props.filteredData[index].id)
                                ).color === 3
                              ? styles.colorYellow
                              : ""
                          }
                        `}
                  onClick={(el) =>
                    props.handleIndividualCheckboxChange(el, index)
                  }
                >
                  <td className={styles.checkbox} style={{ left: "0" }}>
                    {/* //!вывод комментарие  */}
                    {props.commentAllData.map(
                      (item) =>
                        item.workloadId === props.filteredData[index].id && (
                          <div
                            key={item.id}
                            className={styles.notice}
                            onClick={(el) => props.handleClicNotice(el, index)}
                            style={
                              props.allOffersData.some(
                                (el) => el.workloadId === item.workloadId
                              )
                                ? {
                                    transform: "translateY(+18px)",
                                  }
                                : null
                            }
                          >
                            {
                              props.commentAllData.filter(
                                (item) =>
                                  item.workloadId ===
                                  props.filteredData[index].id
                              ).length
                            }
                            <div
                              className={
                                props.allOffersData.some(
                                  (el) => el.workloadId === item.workloadId
                                )
                                  ? styles.notis_rigth_two
                                  : styles.notis_rigth_one
                              }
                            ></div>
                          </div>
                        )
                    )}

                    {/* //! вывод предложений */}

                    {props.allOffersData.map(
                      (item) =>
                        item.workloadId === props.filteredData[index].id && (
                          <div
                            key={item.id}
                            className={styles.notice}
                            style={
                              props.commentAllData.some(
                                (el) => el.workloadId === item.workloadId
                              )
                                ? {
                                    backgroundColor: "#FFD600",
                                    transform: "translateY(-18px)",
                                  }
                                : {
                                    backgroundColor: "#FFD600",
                                  }
                            }
                            onClick={(el, item) =>
                              props.handleClicOffer(
                                el,
                                props.filteredData[index].id,
                                index
                              )
                            }
                          >
                            {
                              props.allOffersData.filter(
                                (item) =>
                                  item.workloadId ===
                                  props.filteredData[index].id
                              ).length
                            }
                            <div
                              className={
                                props.commentAllData.some(
                                  (el) => el.workloadId === item.workloadId
                                )
                                  ? styles.notis_rigth_two
                                  : styles.notis_rigth_one
                              }
                            ></div>
                          </div>
                        )
                    )}

                    <input
                      type="checkbox"
                      className={styles.custom__checkbox}
                      name="dataRow"
                      id={`dataRow-${index}`}
                      checked={()=>{
                        appData.individualCheckboxes.includes(props.filteredData[index].id)? true: false
                      }

                      }

                      onChange={(el) =>
                        props.handleIndividualCheckboxChange(el, index)
                      }
                    />
                    <label htmlFor={`dataRow-${index}`}></label>
                  </td>
                  {props.updatedHeader.map((item, ind) => (
                    <TableTd
                      item={item}
                      ind={ind}
                      index={index}
                      row={row}
                      arrLeft={props.arrLeft}
                      changeValueTd={props.changeValueTd}
                      changeNumberOfStudents={props.changeNumberOfStudents}
                      changeHours={props.changeHours}
                      changeEducator={props.changeEducator}
                      cellNumber={props.cellNumber}
                      onChangeTextareaTd={props.onChangeTextareaTd}
                      textareaTd={props.textareaTd}
                      onClickButton={props.onClickButton}
                      setCellNumber={props.setCellNumber}
                    />
                  ))}
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
