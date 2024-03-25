//? модальное окно предложений
import { AcceptOffer } from "../../api/services/ApiRequest";
import styles from "./OfferModalWindow.module.scss";
import React from "react";
function OfferModalWindow(props) {
  const onClickAcceptOffer = () => {
    console.log("Принято", props.workloadId);
    AcceptOffer(props.workloadId).then(() => {
      props.getDataTableAll();
    });
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
        <span className={styles.name_top}>Иванов Иван Иванович</span>
        <span className={styles.inner}>Предложил</span>
        <span className={styles.name_bottom}>Петрова Петра Петряева</span>
        <div className={styles.button_box}>
          <button className={styles.button_left}>Отклонить</button>
          <button className={styles.button_rigth} onClick={onClickAcceptOffer}>
            {" "}
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferModalWindow;
