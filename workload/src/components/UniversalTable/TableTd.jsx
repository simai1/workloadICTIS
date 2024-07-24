import React, { useState } from "react";
import styles from "./UniversalTable.module.scss";
import DataContext from "../../context";
import { ReactComponent as SvgChackmark } from "./../../img/checkmark.svg";
import { ReactComponent as SvgCross } from "./../../img/cross.svg";
import TextArea from "../../ui/TextArea/TextArea";
import { apiNotecAddMaterials } from "../../api/services/ApiRequest";

function TableTd(props) {
  const { tabPar, basicTabData, appData } = React.useContext(DataContext);
  const [onTextArea, setOnTextArea] = useState(false);
  const [textareaTd, setTextareaTd] = useState(
    props.item[props.itemKey.key] || ""
  );

  //определение каласса td
  const getClassNameTr = () => {
    const changedData = tabPar.changedData[props.itemKey.key];
    if (!changedData) return null;
    return changedData.find((el) => el === props.item.id)
      ? styles.tdChanged
      : null;
  };

  const getTextAreaOn = () => {
    if (
      //! проверяем роль
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 8) &&
      props.itemKey.key === "notes"
    ) {
      return onTextArea;
    } else if (
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 8.1)
    ) {
      return onTextArea;
    }
  };

  const onChangeTextareaTd = (e, type) => {
    const query = e.target.value;
    if (type === "text") {
      console.log(query);
      setTextareaTd(query);
    } else {
      console.log(Number(query));
      if (query === "") {
        setTextareaTd(query);
      } else if (query === "0") {
        setTextareaTd(query);
      } else if (Number(query)) {
        setTextareaTd(query);
      }
    }
  };

  //! при двойном клике на td открываем textarea
  const funDubleClick = () => {
    setOnTextArea(!onTextArea);
  };

  //! при клтике отмена техтаре
  const crossClick = (e) => {
    setTextareaTd(props.item[props.itemKey.key]);
    setOnTextArea(false);
  };

  const defineFunction = (action) => {
    if (action === "headerSchedule") {
      onClicNotic();
    } else {
      onClickButton();
    }
  };

  //! сохраниени примечаний
  const onClicNotic = () => {
    const data = {
      notes: textareaTd,
    };
    console.log("props.item", props.item.id);
    apiNotecAddMaterials(props.item?.id, data).then((req) => {
      console.log(req);
      if (req.status === 200) {
        setOnTextArea(false);
        props.tabDat.funUpdateTabDat();
      }
    });
  };

  //! при клике применить изменения textArea
  const onClickButton = () => {
    let parsedValue = parseFloat(textareaTd);
    let numberValue = isNaN(parsedValue) ? textareaTd : parsedValue;
    //! параметры запроса на изменение данных
    const data = {
      id: props.item.id,
      key: props.itemKey.key,
      value: numberValue,
    };
    if (numberValue || textareaTd === "0") {
      const updatedArray = props.tabDat.tableDataFix.map((item) => {
        if (item.id === props.item.id) {
          return { ...item, [props.itemKey.key]: numberValue };
        }
        return item;
      });
      props.tabDat.setTableDataFix(updatedArray);
      props.tabDat.setFiltredData(updatedArray);
      const workloadId = data.id;
      //! буфер
      appData.setBufferAction([
        {
          request: "workloadUpdata",
          data: data,
          prevState: props.item[props.itemKey.key],
          workloadId,
        },
        ...appData.bufferAction,
      ]);
      let cd = { ...tabPar.changedData };
      console.log("props.itemKey.key", cd);
      cd[props.itemKey.key] = [...cd[props.itemKey.key], props.item.id];
      tabPar.setChangedData(cd);
      setOnTextArea(false);
    }
    // setTextareaTd(props.item[props.itemKey.key]);
  };

  const [showFullText, setShowFullText] = useState(false); // при наведении на td показывает весь текст ячейки
  const lenSlice = props.itemKey.key === "groups" ? 50 : 70;
  //! фуункция котороя определяет какой формат текста выводить
  const gettdInnerText = () => {
    if (showFullText) {
      if (
        props.item[props.itemKey.key] === null ||
        props.item[props.itemKey.key] === undefined ||
        props.item[props.itemKey.key] === ""
      ) {
        return "___";
      }
      if (props.itemKey.key === "id") {
        return props.index + 1;
      } else {
        return props.item[props.itemKey.key];
      }
    } else {
      if (props.itemKey.key === "id") {
        return props.index + 1;
      } else if (
        props.item[props.itemKey.key] === null ||
        props.item[props.itemKey.key] === undefined ||
        props.item[props.itemKey.key] === ""
      ) {
        return "___";
      } else if (
        typeof props.item[props.itemKey.key] === "string" &&
        props.item[props.itemKey.key].length > lenSlice
      ) {
        return props.item[props.itemKey.key].slice(0, lenSlice) + "...";
      } else {
        return props.item[props.itemKey.key];
      }
    }
  };
  const ClickName = () => {
    tabPar.setContextMenuShow(true);
  };
  //! функция определения класса td для открытия длинного текста в попап со скролом
  const getClassNameTdInner = () => {
    let text = styles.tdInner;
    if (showFullText && props.item[props.itemKey.key]?.length > lenSlice) {
      text = `${text} ${styles.gettdInner}`;
    }
    if (props.item.isSplitArrow === true) {
      text = `${text} ${styles.tdInnerIsSplitArrow}`;
    }
    return text;
  };

  return (
    <td
      onMouseEnter={() => setShowFullText(true)}
      onMouseLeave={() => setShowFullText(false)}
      name={props.itemKey.key}
      key={props.item.id + "_" + props.itemKey.key + "_" + props.ind}
      className={getClassNameTr()}
      style={
        showFullText && props.item[props.itemKey.key]?.length > lenSlice
          ? props.itemKey.key === "discipline" ||
            props.itemKey.key === "workload"
            ? { position: "sticky" }
            : { position: "relative" }
          : null
      }
      onClick={props.itemKey.key === "educator" ? ClickName : null}
    >
      <div
        name={props.itemKey.key}
        key={props.item.id + "div" + props.itemKey.key + "_" + props.ind}
        className={getClassNameTdInner()}
        onDoubleClick={funDubleClick}
        style={
          showFullText && props.item[props.itemKey.key]?.length > lenSlice
            ? {
                position: "absolute",
                backgroundColor: "inherit",
                width: "90%",
                top: "10px",
                padding: "4px",
                boxShadow: "0px 3px 18px rgba(0, 0, 0, 0.15)",
                zIndex: "10",
              }
            : null
        }
      >
        {getTextAreaOn() ? (
          <div>
            <TextArea
              defaultValue={""}
              value={textareaTd}
              onChange={(e) => onChangeTextareaTd(e, "text")}
            />
            <div className={styles.svg_textarea}>
              {((textareaTd !== "" && Number(textareaTd) <= 2000) ||
                props.tabDat.ssHeader === "headerSchedule") && (
                <SvgChackmark
                  onClick={() => defineFunction(props.tabDat.ssHeader)}
                  className={styles.SvgChackmark_green}
                />
              )}

              <SvgCross onClick={crossClick} />
            </div>
          </div>
        ) : (
          gettdInnerText()
        )}
      </div>
    </td>
  );
}

export default TableTd;
