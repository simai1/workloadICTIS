import React from "react";
import styles from "./PopUpContainer.module.scss";
import DataContext from "../../context";

function PopUpContainer({ children, title, mT, setVizibleCont }) {
  const { appData } = React.useContext(DataContext);
  const closePopUp = () => {
    appData.setcreateEdicatorPopUp(false);
    appData.setgodPopUp(false);
    setVizibleCont && setVizibleCont(false);
  };
  return (
    <div style={{ paddingTop: `${mT}px` }} className={styles.PopUpContainer}>
      <div className={styles.PopUpContainerflex}>
        <div className={styles.PopUpContainerInner}>
          <div className={styles.HeaderPopUp}>
            <div className={styles.HeaderPopUpTitle}>
              <h2>{title}</h2>
            </div>
            <div>
              <button style={{ marginTop: "2px" }} onClick={closePopUp}>
                <img width={14} height={14} src="./img/x.svg" />
              </button>
            </div>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default PopUpContainer;
