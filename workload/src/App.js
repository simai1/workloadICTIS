import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";
import Authorization from "./pages/Authorization/Authorization";
import { bufferRequestToApi } from "./bufferFunction";
import { headers } from "./components/TableWorkload/Data";
import {
  Comment,
  Workload,
  apiGetUser,
  apiGetWorkloadDepartment,
  getAllAttaches,
  getAllColors,
  getOffers,
} from "./api/services/ApiRequest";
import {
  funFilterSelected,
  funFixEducator,
  funSortedFastened,
  funSplitData,
} from "./components/TableWorkload/Function";

function App() {
  const [educator, setEducator] = useState([]); // преподаватели
  const [positions, setPositions] = useState([]); // должности
  const [workload, setWorkload] = useState([]); // данные о нагрузках
  const [allWarningMessage, setAllWarningMessage] = useState([]);
  const [individualCheckboxes, setIndividualCheckboxes] = useState([]); //чекбоксы таблицы
  const [fileData, setFileData] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  //! в файле RoleMetods можно посмотреть назание метода и их id
  const metodRole = {
    METHODIST: [1, 3, 8, 9, 10, 13, 14, 17, 20, 21],
    LECTURER: [2, 8, 15, 18, 22],
    DEPARTMENT_HEAD: [2, 3, 8, 9, 10, 11, 12, 13, 15, 17, 18, 22],
    DIRECTORATE: [1, 3, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21],
    EDUCATOR: [15],
  };
  // appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)

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
    metodRole,
  };

  // ! параметры таблицы
  const [tableHeaders, setTableHeaders] = useState(headers);
  const [workloadData, setWorkloadData] = useState([]); // данные с бд нагрузок
  const [workloadDataFix, setWorkloadDataFix] = useState([]); //данные с убранным массиовм преподавателя

  const [filtredData, setFiltredData] = useState([]); // фильтрованные данные
  const [allCommentsData, setAllCommentsData] = useState([]); // все комментарии
  const [allOffersData, setAllOffersData] = useState([]); // предложения

  const [coloredData, setColoredData] = useState([]); // выделенные цветом
  const [fastenedData, setFastenedData] = useState([]); // закрепленные строки (храним их id)
  const [selectedTable, setSelectedTable] = useState("Disciplines");
  const [dataIsOid, setDataIsOid] = useState(false); // состояние при котором открываются общеинститутские или кафедральные
  const [selectedFilter, setSelectedFilter] = useState("Все дисциплины"); // текст в FiltredRows
  const [selectedTr, setSelectedTr] = useState([]); //выбранные tr
  const [onCheckBoxAll, setOnCheckBoxAll] = useState(false); //выбранные tr
  const [isSamplePointsData, setSamplePointsData] = useState([]); // данные фильтрации по th
  const [spShow, setSpShow] = useState(null); // отображение модального окна th
  const [contextMenuShow, setContextMenuShow] = useState(false); // показать скрыть контекст меню
  const [contextPosition, setContextPosition] = useState({ x: 300, y: 300 }); // позиция контекст меню в таблице
  const [changedData, setChangedData] = useState({
    // храним id и ключь измененных td для подсвечивания
    splitjoin: [],
    educator: [],
    hours: [],
    numberOfStudents: [],
    deleted: [],
  });
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
    selectedTable,
    setSelectedTable,
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

  //! функция обновления комментаривев
  const funUpdateAllComments = () => {
    Comment().then((data) => {
      console.log("comments", data);
      setAllCommentsData(data);
    });
  };

  //! функция обновления предложений преподавателей
  const funUpdateOffers = () => {
    getOffers().then((data) => {
      console.log("предложения", data);
      setAllOffersData(data);
    });
  };

  //! функция получения закрепленных строк
  const funUpdateFastenedData = () => {
    getAllAttaches().then((data) => {
      console.log("закрепленные", data);
      setFastenedData(data);
    });
  };

  //! функция получения выделенных цветом строк
  const funUpdateAllColors = () => {
    getAllColors().then((data) => {
      console.log("выделенные", data);
      setColoredData(data);
    });
  };

  //! функция обновления таблицы
  const funUpdateTable = () => {
    if (metodRole[myProfile?.role]?.some((el) => el === 15)) {
      apiGetWorkloadDepartment().then((data) => {
        console.log("нагрузки по кафедре", data);
        const dataBd = [...data];
        setWorkloadData(dataBd);
        // зменяем массив преподавателя на его имя
        const fixData = funFixEducator(dataBd);
        setWorkloadDataFix(fixData);
        setFiltredData(fixData);
      });
    }
    if (metodRole[myProfile?.role]?.some((el) => el === 14)) {
      Workload().then((data) => {
        console.log("нагрузки", data);
        const dataBd = [...data];
        setWorkloadData(dataBd);
        // зменяем массив преподавателя на его имя
        const fixData = funFixEducator(dataBd);
        setWorkloadDataFix(fixData);
        setFiltredData(fixData);
      });
    }
  };

  //! функция обновления всех данных
  const updateAlldata = () => {
    // получаем данные таблицы
    funUpdateTable();
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 20)) {
      // получаем все комментарии
      funUpdateAllComments();
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 17)) {
      // получение предложений
      funUpdateOffers();
    }
    // получение закрепленных строк
    funUpdateFastenedData();
    // получение выделенных строк
    funUpdateAllColors();
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
    allCommentsData,
    allOffersData,
    setAllCommentsData,
    funUpdateAllComments,
    funUpdateOffers,
    funUpdateTable,
    funUpdateFastenedData,
    funUpdateAllColors,
  };

  //! получаем и записываем данные usera
  useEffect(() => {
    apiGetUser().then((data) => {
      console.log("user", data);
      setMyProfile(data);
    });
  }, []);

  //! получаем данные нагрузок с бд
  useEffect(() => {
    updateAlldata();
  }, [myProfile]);

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
    // setFiltredData(filterSelected);
    setFiltredData(funSortedFastened(filterSelected, fastenedData));
    setSelectedTr([]);
    setOnCheckBoxAll(false);
  }, [dataIsOid, selectedFilter, workloadDataFix, selectedTable]);

  //! обновляем вертуальный скролл при переходе на другуюс таблицу
  useEffect(() => {
    setStartData(0);
  }, [dataIsOid, selectedFilter, selectedTable]);

  // useEffect(() => {
  //   setFiltredData([...workloadDataFix]);
  // }, [workloadDataFix]);

  //! при изменении закрпеленных перемещаем их наверх и сортируем массив
  useEffect(() => {
    setFiltredData(funSortedFastened(filtredData, fastenedData));
  }, [fastenedData, filtredData]);

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
