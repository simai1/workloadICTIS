import React from "react";
import styles from "./ContextMenu.module.scss";
import arrow from "./../../img/arrow.svg";

function MenuPop(props) {
  return (
    <div className={styles.blockMenuPop} onClick={props.func}>
      <button className={styles.activeStylePointer}>{props.btnText}</button>
      {props.img && (
        <img
          src={arrow}
          alt=">"
          className={props.menuShow ? styles.imgOpen : styles.imgClose}
        />
      )}
    </div>
  );
}

export default MenuPop;
