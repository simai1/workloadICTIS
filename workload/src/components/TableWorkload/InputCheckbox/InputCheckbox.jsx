import React from "react";
import styles from "./../TableWorkload.module.scss";
import DataContext from "../../../context";
import OverlapWindow from "./OverlapWindow";
import Comments from "./Comments";
function InputCheckbox(props) {
  const { tabPar, basicTabData } = React.useContext(DataContext);

  //! функция определения есть ли комментарии к строке
  const getComment = () => {
    return basicTabData.allCommentsData.filter(
      (item) => item.workloadId === props.itid
    );
  };
  const stylesTh = { backgroundColor: props.bgColor, zIndex: "31" };
  const stylesTd = {
    zIndex: `${10 - props.number}`,
    backgroundColor: props.bgColor,
  };

  return (
    <>
      {props.th ? (
        <th style={stylesTh} className={styles.InputCheckbox}>
          <div className={styles.Comments}></div>
          <input
            onChange={() => props.clickTr(props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </th>
      ) : (
        <td style={stylesTd} className={styles.InputCheckbox}>
          {tabPar.fastenedData.includes(props.itid) && ( //отмечаем закрепленные
            <img
              className={styles.fastenedImg}
              src="./img/fastened.svg"
              alt="fastened"
            ></img>
          )}
          {props.getConfirmation.blocked && (
            <OverlapWindow
              getConfirmation={props.getConfirmation}
              itid={props.itid}
            />
          )}
          <Comments commentData={getComment().reverse()} />
          <input
            onChange={() => props.clickTr(props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </td>
      )}
    </>
  );
}

export default InputCheckbox;
