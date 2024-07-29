import React, { useState } from "react";
import styles from "./PopUpTextAreaMore.module.scss";
import TextArea from "../../ui/TextArea/TextArea";
import DataContext from "../../context";

function PopUpTextAreaMore(props) {
  const { appData, tabPar } = React.useContext(DataContext);
  const [textAreaText, SetTextAreaText] = useState("");

  //! изменение textarea
  const onChange = (e) => {
    const query = e.target.value;
    SetTextAreaText(query)
  };

//   //! закрытие попапа
//   const exitPopup = () => {
//   };

  //! сброс значения попапа
  const resetValue = () => {
    SetTextAreaText("")
  };
  
  //! отмена редактирования
  const cancleEdit = () => {
    appData.SetPopUpTextArea(false);
    SetTextAreaText("");
  };

  //! приемнить изменения
  const applyChang = () => {
    const data = {
      nootes: textAreaText,
      ids: [tabPar.selectedTr]
    };
    console.log('data', data)
    // apiNotecAddMaterials(textareaStor.itemId, data).then((req) => {
    //   if (req.status === 200) {
    //     dispatch(onTextareaShow());
    //     appData.setPopApCloseSttatus(true);
    //   }
    // });
  };

  return (
    <div className={styles.PopupTextArea}>
      <div className={styles.PopupTextAreaBox}>
        <div className={styles.exit}>
          <img onClick={cancleEdit} src="./img/x.svg" />
        </div>
        <h2>Добавление примечания</h2>
        <div className={styles.TextAreaComponent}>
          <TextArea value={textAreaText} onChange={onChange} />
        </div>
        <div className={styles.btnBox}>
          <button className={styles.btn1} onClick={resetValue}>
            Сбросить
          </button>
          <button className={styles.btn1} onClick={cancleEdit}>
            Отменить
          </button>
          <button className={styles.btn3} onClick={applyChang}>
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopUpTextAreaMore;
