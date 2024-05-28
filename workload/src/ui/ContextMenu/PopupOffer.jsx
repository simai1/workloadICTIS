import React from "react";
import styles from "./ContextMenu.module.scss";
import DataContext from "../../context";
function PopupOffer(props) {
  const { tabPar } = React.useContext(DataContext);

  return (
    <div
      className={styles.blockMenuRight}
      style={
        tabPar.contextPosition.x + 280 + 180 > window.innerWidth
          ? {
              position: "fixed",
              top: tabPar.contextPosition.y,
              left: tabPar.contextPosition.x - 150,
            }
          : {
              position: "fixed",
              top: tabPar.contextPosition.y,
              left: tabPar.contextPosition.x + 280,
            }
      }
    >
      <div className={styles.PopupOfferBox}>
        <div className={styles.text}>{props.title}</div>
        <div className={styles.btn}>
          <button
            className={styles.btn_left}
            onClick={() => props.onClickOfferPopup(false)}
          >
            Отменить
          </button>
          <button
            className={styles.btn_rig}
            onClick={() => props.onClickOfferPopup(true)}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupOffer;
