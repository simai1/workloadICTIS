import React from "react";
import styles from "./../TableWorkload.module.scss";
import DataContext from "../../../context";
import OverlapWindow from "./OverlapWindow";
import Comments from "./Comments";
import Offers from "./Offers";
function InputCheckbox(props) {
  const { appData, tabPar, basicTabData } = React.useContext(DataContext);

  //! функция определения есть ли комментарии к строке
  const getComment = () => {
    return basicTabData.allCommentsData.filter(
      (item) => item.workloadId === props.itid
    );
  };
  //! функция получения предложений к строке
  const getOffers = () => {
    return basicTabData.allOffersData.filter(
      (item) => item.offer?.workloadId === props.itid
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
          <div className={styles.bacground}></div>
          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </th>
      ) : (
        <td style={stylesTd} className={styles.InputCheckbox}>
          {tabPar.fastenedData.some((el) => el.workloadId === props.itid) && ( //отмечаем закрепленные // сделать проверку на преподавателя который закрепляет
            <img
              className={styles.fastenedImg}
              src="./img/fastened.svg"
              alt="fastened"
            ></img>
          )}
          {/* //! перекрытие */}
          {props.getConfirmation.blocked && (
            <OverlapWindow
              getConfirmation={props.getConfirmation}
              itid={props.itid}
            />
          )}
          {
            //! определяем разделенная ли нагрузка
            props.workload?.isSplit === true && (
              <div className={styles.isSplit}>
                <span>Разделенная</span>
              </div>
            )
          }
          {
            //! после резделения или обьединения исходную помечаем
            props.workload?.isSplitArrow === true && (
              <div className={styles.isSplit}>
                <span>Исходная</span>
                <img src="img/Arrow.svg" alt=">" />
              </div>
            )
          }
          {
            //! определяем разделенная ли нагрузка
            props.workload?.isMerged === true && (
              <div className={styles.isSplit}>Объединенная</div>
            )
          }
          <div className={styles.bacground}>
            {getComment().length > 0 &&
              appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 20
              ) && <Comments commentData={getComment().reverse()} />}
            {getOffers().length > 0 && (
              <Offers offerData={getOffers().reverse()} />
            )}
          </div>

          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </td>
      )}
    </>
  );
}

export default InputCheckbox;
