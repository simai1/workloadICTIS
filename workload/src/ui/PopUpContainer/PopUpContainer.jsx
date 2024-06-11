import React from "react";
import styles from "./PopUpContainer.module.scss";
import DataContext from "../../context";

function PopUpContainer({ children, title,mT }) {
    const { appData } = React.useContext(DataContext);
    const closePopUp = () =>{
       appData.setcreateEdicatorPopUp(false)
       appData.setgodPopUp(false)
    }
    return (
        <div style={{paddingTop:`${mT}px`}} className={styles.PopUpContainer}>
            <div className={styles.PopUpContainerflex}>
                <div className={styles.PopUpContainerInner}>
                    <div className={styles.HeaderPopUp}>
                        <div className={styles.HeaderPopUpTitle}>
                            <h2>{title}</h2>
                        </div>
                        <div>
                            <button  onClick={closePopUp}>X</button>
                        </div>
                    </div>

                    <div> 
                        {children}
                    </div>
                  
                </div>
            </div>
        </div>
    );
}

export default PopUpContainer;
