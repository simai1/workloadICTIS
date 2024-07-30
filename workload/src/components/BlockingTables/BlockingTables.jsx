import React from "react";
import styles from "./BlockingTables.module.scss";
import ConfirmSaving from "../../ui/ConfirmSaving/ConfirmSaving";

function BlockingTables(props) {
  return (
    <div
      className={styles.BlockingTables}
      style={props.nameKaf === "Все" ? { display: "none" } : null}
    >
      <div
        style={{ marginRight: "15px" }}
        className={styles.btnMenuBox}
        onClick={props.clickFun}
        title="Выгрузка таблицы для методистов"
      >
        <img className={styles.btnLeft} src="./img/export.svg" alt="i" />
        {props.popupExport && (
          <ConfirmSaving
            title={`Вы уверены, что хотите отправить таблицу ${props.nameKaf}?`}
            confirmClick={props.confirmClick}
            setShow={props.setShow}
          />
        )}
      </div>
    </div>
  );
}

export default BlockingTables;
