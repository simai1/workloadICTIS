import React, {useState} from 'react';
import styles from "./Warnings.module.scss";
import arrow from "./../../img/arrow.svg"
import WarningMessage from '../../ui/WarningMessage/WarningMessage';
function Warnings() {
  const [isListOpen, setListOpen] = useState(false);
  const toggleList = () => {
    setListOpen(!isListOpen);
  }
  return (
    <div className={styles.Warnings}> 
     {!isListOpen && (
      <div onClick={toggleList} className={styles.WarningsButton}>
          <p className={styles.circlesbuttonWarn}><span>1</span></p>
          <p>Предупреждения</p>
          <img src={arrow} alt='arrow'></img>
      </div>
     )}
    {isListOpen && (
        <div className={styles.WarningsOpen}>
          <div onClick={toggleList} className={styles.WarningsButtonOpen}>
              <p className={styles.circlesbuttonWarn}><span>1</span></p>
              <p>Предупреждения</p>
              <img src={arrow} alt='arrow'></img>
          </div>
          <div className={styles.WarningsList}>
            <ul>
             <WarningMessage/>
             <WarningMessage/>
             <WarningMessage/>
             <WarningMessage/>
             <WarningMessage/>
            </ul>
          </div>
        </div>
      )}
    </div>
    
  );
}

export default Warnings;