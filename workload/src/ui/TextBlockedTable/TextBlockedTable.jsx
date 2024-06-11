import React from "react";

export function TextBlockedTable(){
    
    return(
        <div className={styles.blockedTextTable}>
              <div>
                <img src="./img/errorTreangle.svg" />
              </div>
              <div>
                <p>
                  Таблица находится в состоянии "Блокированные", редактирование
                  временно отключено!
                </p>
              </div>
            </div>
    )
}