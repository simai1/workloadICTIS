import React from "react";
import styles from "./PopupTextArea.module.scss";
import TextArea from "../../ui/TextArea/TextArea";
import { useDispatch, useSelector } from "react-redux";
import {
  cancleEditTd,
  onTextareaShow,
  resetStatus,
  resetTheValue,
  setTextAreaValue,
} from "../../store/popup/textareaData.slice";
import { apiNotecAddMaterials } from "../../api/services/ApiRequest";
import DataContext from "../../context";

function PopupTextArea(props) {
  const dispatch = useDispatch();
  const textareaStor = useSelector((state) => state.textAreaSlice);
  const { appData } = React.useContext(DataContext);

  //! изменение textarea
  const onChange = (e) => {
    const query = e.target.value;
    dispatch(setTextAreaValue({ value: query }));
  };

  //! закрытие попапа
  const exitPopup = () => {
    dispatch(onTextareaShow());
  };

  //! закрытие попапа
  const resetValue = () => {
    dispatch(resetTheValue());
  };

  //! отмена редактирования
  const cancleEdit = () => {
    dispatch(cancleEditTd());
  };

  //! приемнить изменения
  const applyChang = () => {
    const data = {
      [textareaStor.key]: textareaStor.taValue.trim() || "",
    };
    apiNotecAddMaterials(textareaStor.itemId, data).then((req) => {
      if (req.status === 200) {
        dispatch(onTextareaShow());
        appData.setPopApCloseSttatus(true);
      }
    });
  };

  return (
    <div className={styles.PopupTextArea}>
      <div className={styles.PopupTextAreaBox}>
        <div className={styles.exit}>
          <img onClick={exitPopup} src="./img/x.svg" />
        </div>
        <h2>Редактирование поля</h2>
        <div className={styles.TextAreaComponent}>
          <TextArea value={props.data?.taValue} onChange={onChange} />
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

export default PopupTextArea;
