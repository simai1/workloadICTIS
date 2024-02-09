import React from 'react';
import styles from "./Warnings.module.scss";
import arrow from "./../../img/arrow.svg"
function Warnings() {
 
  return (
    <div className={styles.Warnings}> 
         <span>13</span>
         <p>Предупреждения</p>
         <img src={arrow}></img>
    </div>
  );
}

export default Warnings;