import React from 'react';
import styles from "./EditInput.module.scss";
import arrow from "./../../img/arrow.svg"
function EditInput() {
 
  return (
    <div className={styles.EditInput}> 
         <p>Редактирование полей</p>
         <img src={arrow}></img>
    </div>
  );
}

export default EditInput;