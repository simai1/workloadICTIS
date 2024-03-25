//? модальное окно предложений
import { AcceptOffer } from "../../api/services/ApiRequest";
import styles from "./OfferModalWindow.module.scss";
import React, { useState } from "react";
function OfferModalWindow(props) {
  console.log(props.allOffersDataItem);
  const [itemIndex, setItemIndex] = useState(0); // изменять при листании
  const onClickAcceptOffer = () => {
    console.log("Принято", props.workloadId);
    AcceptOffer(props.workloadId, "принято").then(() => {
      props.getDataTableAll();
    });
    props.setModalWindowOffer({ id: props.modalWindowOffer.id, flag: false });
  };
  const onClickAcceptOfferRejected = () => {
    console.log("Отклонено", props.workloadId);
    AcceptOffer(props.workloadId, "отклонено").then(() => {
      props.getDataTableAll();
    });
    props.setModalWindowOffer({ id: props.modalWindowOffer.id, flag: false });
  };
  return (
    <div
      className={styles.OfferModalWindow}
      ref={props.refOffer}
      style={{
        top: props.position.y + 65,
        left: props.position.x + 70,
      }}
    >
      <div className={styles.container}>
        <span className={styles.name_top}>
          {props.allOffersDataItem[itemIndex].Educator.name}
        </span>
        <span className={styles.inner}>Предложил</span>
        <span className={styles.name_bottom}>
          {props.allOffersDataItem[itemIndex].educatorId}
        </span>
        <div className={styles.button_box}>
          <button
            className={styles.button_left}
            onClick={onClickAcceptOfferRejected}
          >
            Отклонить
          </button>
          <button className={styles.button_rigth} onClick={onClickAcceptOffer}>
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferModalWindow;
