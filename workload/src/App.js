import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";
import Authorization from "./pages/Authorization/Authorization";
import { bufferRequestToApi, returnPrevState } from "./bufferFunction";
import { headers } from "./components/TableWorkload/Data";
import { Comment, Workload } from "./api/services/ApiRequest";
import {
  funFilterSelected,
  funFixEducator,
  funSplitData,
} from "./components/TableWorkload/Function";

function App() {
  const [educator, setEducator] = useState([]); // преподаватели
  const [positions, setPositions] = useState([]); // должности
  const [workload, setWorkload] = useState([]); // данные о нагрузках
  const [allWarningMessage, setAllWarningMessage] = useState([]);
  const [individualCheckboxes, setIndividualCheckboxes] = useState([]); //чекбоксы таблицы
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
  // const [workloadDataFixIsOid, setWorkloadDataFixIsOid] = useState([])
  const [filtredData, setFiltredData] = useState([]); // фильтрованные данные
  const [allCommentsData, setAllCommentsData] = useState([]); // все комментарии
  const [allOffersData, setAllOffersData] = useState([]); // предложения

  const [coloredData, setColoredData] = useState([]); // выделенные цветом
  const [fastenedData, setFastenedData] = useState([]); // закрепленные строки (храним их id)
  const [dataIsOid, setDataIsOid] = useState(false); // состояние при котором открываются общеинститутские или кафедральные
  const [selectedFilter, setSelectedFilter] = useState("Все дисциплины"); // текст в FiltredRows
  const [selectedTr, setSelectedTr] = useState([]); //выбранные tr
  const [onCheckBoxAll, setOnCheckBoxAll] = useState(false); //выбранные tr
  const [isSamplePointsData, setSamplePointsData] = useState([]); // данные фильтрации по th
  const [spShow, setSpShow] = useState(null); // отображение модального окна th
  const [contextMenuShow, setContextMenuShow] = useState(false); // показать скрыть контекст меню
  const [contextPosition, setContextPosition] = useState({ x: 300, y: 300 }); // позиция контекст меню в таблице
  const [changedData, setChangedData] = useState({
    splitjoin: [],
    educator: [],
    hours: [],
    numberOfStudents: [],
    deleted: [],
  }); // храним id и ключь измененных td для подсвечивания
  const [isChecked, setIsChecked] = useState([]); // состояние инпутов в SamplePoints
  const [isAllChecked, setAllChecked] = useState(true); // инпут все в SamplePoints
  const checkPar = {
    isChecked,
    setIsChecked,
    isAllChecked,
    setAllChecked,
  };
  //! для виртуального скролла
  const [startData, setStartData] = useState(0); // индекс элемента с которого показывается таблица
  const visibleData = filtredData.length > 10 ? 10 : filtredData.length; // кооличество данных которые мы видим в таблице
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
    fastenedData,
    setFastenedData,
    coloredData,
    setColoredData,
    changedData,
    setChangedData,
    selectedFilter,
    setSelectedFilter,
  };

  //! функция обновления всех данных
  const updateAlldata = () => {
    Workload().then((data) => {
      console.log(data);
      const dataBd = [...data];
      setWorkloadData(dataBd);
      // зменяем массив преподавателя на его имя
      const fixData = funFixEducator(dataBd);
      // разделяем на общеинституские и кафедральные и сортируем
      // const splitData = funSplitData(fixData, dataIsOid);
      setWorkloadDataFix(fixData);
      setFiltredData(fixData);
      // получаем все комментарии
      Comment().then((data) => {
        setAllCommentsData(data);
      });
    });
  };
  const basicTabData = {
    updateAlldata,
    tableHeaders,
    setTableHeaders,
    workloadData,
    setWorkloadData,
    workloadDataFix,
    setWorkloadDataFix,
    filtredData,
    setFiltredData,
  };
  //! получаем данные нагрузок с бд
  useEffect(() => {
    updateAlldata();
  }, []);

  //! при зменении основынх данных записываем их в фильтрованные
  // useEffect(() => {
  //   setFiltredData([...workloadDataFix]);
  // }, [workloadDataFix]);

  //! при переходе с кафедральных на общеинституские и обратно фильтруем основные
  //! фильтруем по FiltredRows
  useEffect(() => {
    const splitData = funSplitData(workloadDataFix, dataIsOid);
    const filterSelected = funFilterSelected(
      splitData,
      selectedFilter,
      coloredData,
      changedData,
      fastenedData
    );
    setFiltredData(filterSelected);
    setSelectedTr([]);
    setOnCheckBoxAll(false);
    setStartData(0);
  }, [dataIsOid, selectedFilter, workloadDataFix]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      //! следим за нажатием ctrl + s для сохранения изменений
      if (event.ctrlKey && (event.key === "s" || event.key === "ы")) {
        event.preventDefault();
        console.log("Сохранено", bufferAction);
        bufferRequestToApi(bufferAction).then(() => {
          setBufferAction([0]);
          updateAlldata();
        });
        setSelectedTr([]);
        setChangedData({
          splitjoin: [],
          educator: [],
          hours: [],
          numberOfStudents: [],
          deleted: [],
        });
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
      <BrowserRouter basename="/client">
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
