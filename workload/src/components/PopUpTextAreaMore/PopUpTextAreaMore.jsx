import React, { useState } from "react";
import styles from "./PopUpTextAreaMore.module.scss";
import TextArea from "../../ui/TextArea/TextArea";
import DataContext from "../../context";
import { apiNotecAddMaterials } from "../../api/services/ApiRequest";
import { useDispatch } from "react-redux";
import {
  cancleEditTd,
  onTextareaShow,
  resetStatus,
  resetTheValue,
  setTextAreaValue,
} from "../../store/popup/textareaData.slice";
function PopUpTextAreaMore(props) {
  const { appData, tabPar } = React.useContext(DataContext);
  const [textAreaText, SetTextAreaText] = useState("");
  const dispatch = useDispatch();

  //! изменение textarea
  const onChange = (e) => {
    const query = e.target.value;
    SetTextAreaText(query);
  };

  //   //! закрытие попапа
  //   const exitPopup = () => {
  //   };

  //! сброс значения попапа
  const resetValue = () => {
    SetTextAreaText("");
  };

  //! отмена редактирования
  const cancleEdit = () => {
    appData.SetPopUpTextArea("");
    SetTextAreaText("");
  };

  //! приемнить изменения
  const applyChang = () => {
    const data = {
      [appData.popUpTextArea]: textAreaText || "",
      ids: tabPar.selectedTr,
    };
    apiNotecAddMaterials(data).then((req) => {
      if (req?.status === 200) {
        appData.SetPopUpTextArea("");
        // appData.setPopApCloseSttatus(true);
        dispatch(resetStatus({ value: 200 }));
      }
    });
  };

  const getEditName = () => {
    if (appData.popUpTextArea === "groups") {
      return "групп";
    } else if (appData.popUpTextArea === "audiences") {
      return "аудиторий";
    } else if (appData.popUpTextArea === "notes") {
      return "примечаний";
    }
  };

  return (
    <div className={styles.PopupTextArea}>
      <div className={styles.PopupTextAreaBox}>
        <div className={styles.exit}>
          <img onClick={cancleEdit} src="./img/x.svg" />
        </div>
        <h2>Редактирование {getEditName()}</h2>
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
