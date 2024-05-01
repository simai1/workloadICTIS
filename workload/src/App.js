import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";
import Authorization from "./pages/Authorization/Authorization";
import { bufferRequestToApi, returnPrevState } from "./bufferFunction";
import { headers } from "./components/TableWorkload/Data";

function App() {
  const [educator, setEducator] = useState([]); // преподаватели
  const [positions, setPositions] = useState([]); // должности
  const [workload, setWorkload] = useState([]); // данные о нагрузках
  const [allWarningMessage, setAllWarningMessage] = useState([]);
  const [individualCheckboxes, setIndividualCheckboxes] = useState([]); //чекбоксы таблицы
  const [blockedCheckboxes, setBlockedCheckboxes] = useState([]); //чекбоксы таблицы
  const [fileData, setFileData] = useState(null);

  //! данные пользователя ! изменить
  const myProfile = {
    id: "7752d476-d998-48c5-bcb7-9a6ce385f743",
    name: "Админ Кирилл Николаевич",
    position: "Заведующий кафедры",
    mail: "ivanov@sfedu.ru",
  };

  //! буфер последних действий. Выполняется после кнопки сохранить
  const [bufferAction, setBufferAction] = useState([]);

  const appData = {
    individualCheckboxes,
    setIndividualCheckboxes,
    blockedCheckboxes,
    setBlockedCheckboxes,
    educator,
    setEducator,
    positions,
    setPositions,
    workload,
    setWorkload,
    allWarningMessage,
    setAllWarningMessage,
    bufferAction,
    setBufferAction,
    myProfile,
    fileData,
    setFileData,
  };

  // ! параметры таблицы
  const [tableHeaders, setTableHeaders] = useState(headers);
  const [workloadData, setWorkloadData] = useState([]); // данные с бд нагрузок
  const [workloadDataFix, setWorkloadDataFix] = useState([]); //данные с убранным массиовм преподавателя
  const [filtredData, setFiltredData] = useState([]); // фильтрованные данные
  const [allCommentsData, setAllCommentsData] = useState([]); // все комментарии
  const [allOffersData, setAllOffersData] = useState([]); // предложения

  const basicTabData = {
    tableHeaders,
    setTableHeaders,
    workloadData,
    setWorkloadData,
    workloadDataFix,
    setWorkloadDataFix,
    filtredData,
    setFiltredData,
  };

  const [coloredData, setColoredData] = useState([]); // выделенные цветом
  const [dataIsOid, setDataIsOid] = useState(false);
  const [selectedTr, setSelectedTr] = useState([]); //выбранные tr
  const [onCheckBoxAll, setOnCheckBoxAll] = useState(false); //выбранные tr
  const [isSamplePointsData, setSamplePointsData] = useState([]); // данные фильтрации по th
  const [spShow, setSpShow] = useState(null); // отображение модального окна th
  const [contextMenuShow, setContextMenuShow] = useState(false); // показать скрыть контекст меню
  const [contextPosition, setContextPosition] = useState({ x: 300, y: 300 }); // позиция контекст меню в таблице

  const [isChecked, setIsChecked] = useState([]);
  const [isAllChecked, setAllChecked] = useState(true);
  const checkPar = {
    isChecked,
    setIsChecked,
    isAllChecked,
    setAllChecked,
  };
  //! для виртуального скролла
  const [startData, setStartData] = useState(0); // индекс элемента с которого показывается таблица
  const visibleData = filtredData.length > 10 ? 10 : filtredData.length - 1; // кооличество данных которые мы видим в таблице
  const heightTd = 150; // высота td

  const visibleDataPar = {
    startData,
    setStartData,
    visibleData,
    heightTd,
  };

  const tabPar = {
    dataIsOid,
    setDataIsOid,
    selectedTr,
    setSelectedTr,
    setOnCheckBoxAll,
    onCheckBoxAll,
    isSamplePointsData,
    setSamplePointsData,
    spShow,
    setSpShow,
    contextMenuShow,
    setContextMenuShow,
    setContextPosition,
    contextPosition,
    allOffersData,
    setAllOffersData,
    allCommentsData,
    setAllCommentsData,
    coloredData,
    setColoredData,
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      //! следим за нажатием ctrl + s для сохранения изменений
      if (event.ctrlKey && (event.key === "s" || event.key === "ы")) {
        event.preventDefault();
        console.log("Сохранено", bufferAction);
        bufferRequestToApi(bufferAction).then(() => {
          setBufferAction([0]);
        });
        setSelectedTr([]);
        setBlockedCheckboxes([]);
        console.log("выполнено и очищено", bufferAction);
      }
    };
    // Назначьте обработчик события keydown при монтировании компонента
    document.addEventListener("keydown", handleKeyDown);
    // Удалите обработчик события keydown при размонтировании компонента
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [bufferAction]);

  return (
    <DataContext.Provider
      value={{
        appData,
        tabPar,
        visibleDataPar,
        checkPar,
        basicTabData,
      }}
    >
      <BrowserRouter>
        <div className="Container">
          <Routes>
            <Route path="/" element={<Authorization />}></Route>
            <Route path="/HomePage" element={<HomePage />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
