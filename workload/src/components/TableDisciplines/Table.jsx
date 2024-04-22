import React from "react";
import styles from "./TableDisciplines.module.scss";
import DataContext from "../../context";
import { ReactComponent as SvgChackmark } from "./../../img/checkmark.svg";
import { ReactComponent as SvgCross } from "./../../img/cross.svg";

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
                  key={index}
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
                      checked={
                        appData.individualCheckboxes.includes(
                          props.filteredData[index].id
                        )
                          ? true
                          : false
                      }
                      onChange={(el) =>
                        props.handleIndividualCheckboxChange(el, index)
                      }
                    />
                    <label htmlFor={`dataRow-${index}`}></label>
                  </td>
                  {props.updatedHeader.map((key, ind) => (
                    <td
                      key={props.updatedHeader[ind].key}
                      className={
                        props.updatedHeader[ind].key === "discipline" ||
                        props.updatedHeader[ind].key === "id" ||
                        props.updatedHeader[ind].key === "workload"
                          ? styles.stytic_td
                          : null
                      }
                      style={{ left: props.arrLeft[ind] || "0" }}
                    >
                      <div
                        className={styles.td_inner}
                        onDoubleClick={() => props.changeValueTd(index, ind)}
                        style={
                          props.changeNumberOfStudents?.some(
                            (el) => el === row.id
                          ) &&
                          props.updatedHeader[ind].key === "numberOfStudents"
                            ? {
                                backgroundColor: "rgb(255 135 135)",
                                borderRadius: "8px",
                              }
                            : props.changeHours?.some((el) => el === row.id) &&
                              props.updatedHeader[ind].key === "hours"
                            ? {
                                backgroundColor: "rgb(255 135 135)",
                                borderRadius: "8px",
                              }
                            : props.changeEducator?.some(
                                (el) => el === row.id
                              ) && props.updatedHeader[ind].key === "educator"
                            ? {
                                backgroundColor: "rgb(255 135 135)",
                                borderRadius: "8px",
                              }
                            : null
                        }
                      >
                        {/* редактирование поля нагрузки при двойном клике на нее */}
                        {props.cellNumber &&
                        props.cellNumber.index === index &&
                        props.cellNumber.ind === ind ? (
                          <div
                            className={styles.textarea_title}
                            ref={props.refTextArea}
                          >
                            <textarea
                              className={styles.textarea}
                              type="text"
                              defaultValue={row[props.updatedHeader[ind].key]}
                              onChange={props.onChangeTextareaTd}
                            ></textarea>
                            <div className={styles.svg_textarea}>
                              {props.textareaTd?.trim() && (
                                <SvgChackmark
                                  className={styles.SvgChackmark_green}
                                  onClick={() =>
                                    props.onClickButton(row.id, key)
                                  }
                                />
                              )}
                              <SvgCross
                                onClick={() => {
                                  props.setCellNumber([]);
                                }}
                              />
                            </div>
                          </div>
                        ) : row[props.updatedHeader[ind].key] === null ? (
                          "0"
                        ) : props.updatedHeader[ind].key === "id" ? (
                          index + 1
                        ) : (
                          row[props.updatedHeader[ind].key]
                        )}
                      </div>
                    </td>
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
