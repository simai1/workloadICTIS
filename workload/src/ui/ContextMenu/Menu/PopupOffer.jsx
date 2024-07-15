import React, { useEffect, useRef, useState } from "react";
import styles from "./../ContextMenu.module.scss";
import DataContext from "../../../context";
import { getStylePosition } from "../Function";
function PopupOffer(props) {
  const { tabPar } = React.useContext(DataContext);

  //! переменная которая хранит ширину данного меню
  const [menuWidth, setMenuWidth] = useState(262);
  const menuRef = useRef(null);
  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.clientWidth);
    }
  }, [menuRef.current]);

  return (
    <div
      className={styles.blockMenuRight}
      ref={menuRef}
      style={getStylePosition(
        tabPar.contextPosition,
        window.innerWidth,
        menuWidth,
        props.conxextMenuRefBlock
      )}
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
