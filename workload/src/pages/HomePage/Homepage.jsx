import React, { useRef, useState } from "react";
import styles from "./HomePage.module.scss";
import TableTeachers from "../../components/TableTeachers/TableTeachers";
import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
import Warnings from "../../components/Warnings/Warnings";
import TableLks from "../../components/TableLks/TableLks";
import Profile from "../../components/Profile/Profile";
import EditInput from "../../components/EditInput/EditInput";
import DataContext from "../../context";
import { bufferRequestToApi } from "../../bufferFunction";
import FiltredRows from "../../ui/FiltredRows/FiltredRows";
import TableWorkload from "../../components/TableWorkload/TableWorkload";
import {
  headers,
  headersEducator,
  tableHeadersLks,
} from "../../components/TableWorkload/Data";
import { PopUpFile } from "../../ui/PopUpFile/PopUpFile";
import { PopUpError } from "../../ui/PopUp/PopUpError";
import List from "../../ui/List/List";
import ListKaf from "../../ui/ListKaf/ListKaf";
import { PopUpCreateEmploy } from "../../ui/PopUpCreateEmploy/PopUpCreateEmploy";

function HomePage() {
  const { appData, tabPar, visibleDataPar, basicTabData } =
    React.useContext(DataContext);
  //! заголовки таблиц
  const workloadTableHeaders = headers; // заголовок таблицы на главной странице
  const educatorTableHeaders = headersEducator; // заголовок таблтиц преподавателей
  const educatorLkHeaders = tableHeadersLks; // заголовок страницы личного кабинета
  const [tableHeaders, setTableHeaders] = useState(workloadTableHeaders);
  const [filePopUp, setfilePopUp] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Disciplines");
  const [tableMode, setTableMode] = useState("cathedrals"); //выбранный компонент
  const [educatorData, setEducatorData] = useState([]); // данные о преподавателе получаем в TableTeachers
  const [searchTerm, setSearchTerm] = useState(""); //поиск по таблице
  const [onenModalWind, setOpenModalWind] = useState(false); // переменная закрытия модального окна профиля
  const refProfile = React.useRef(null); // ссылка на модальное окно профиля
  const [educatorIdforLk, setEducatorIdforLk] = useState(""); // id для вывода LK, если пустое то LK не отображается
  const handleButtonClick = () => {
    setEducatorIdforLk("");
  };

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    tabPar.setSelectedTable(component);
    if (component === "Disciplines") {
      basicTabData.setTableHeaders(workloadTableHeaders);
    } else if (component === "Teachers") {
      console.log(component);
      basicTabData.setTableHeaders(educatorTableHeaders);
    } else {
      basicTabData.setTableHeaders(educatorLkHeaders);
    }
  };

  const changeInput = () => {
    setTableHeaders(educatorTableHeaders);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const EditTableData = (tableMode) => {
    tabPar.setDataIsOid(tableMode === "genInstitute");
    //тут написать функцию которая будет подгружать нужное содержимое tableData и tableHeaders
    // используется в TableWorkload
  };

  const dataList = [
    {
      id: 1,
      name: "БИТ",
    },
    {
      id: 2,
      name: "ВМ",
    },
    {
      id: 3,
      name: "ВТ",
    },
    {
      id: 4,
      name: "ИАСБ",
    },
    {
      id: 5,
      name: "ИБТКС",
    },
    {
      id: 6,
      name: "ИМС",
    },
    {
      id: 7,
      name: "МОП ЭВМ",
    },
    {
      id: 8,
      name: "ПиБЖ",
    },
    {
      id: 9,
      name: "САИТ",
    },
    {
      id: 10,
      name: "САПР",
    },
    {
      id: 11,
      name: "СиПУ",
    },
  ];

  // let dataList = [];
  // use
  // basicTabData.workloadData.map((item) => {
  //   if (!dataList.some((e) => e.name === item.department)) {
  //     dataList.push({
  //       id: dl.find((el) => el.name === item.department).id,
  //       name: item.department,
  //     });
  //   }
  // });
  // dataList = dataList.length > 0 ? dataList : dl;
  // console.log("dataList", dataList);

  //! сохранение буфера
  const onSaveClick = () => {
    //! отправляем все запросы на обработку
    console.log("Сохранено", appData.bufferAction);
    bufferRequestToApi(appData.bufferAction).then(() => {
      appData.setBufferAction([0]);
      basicTabData.updateAlldata();
    });
    tabPar.setSelectedTr([]);
    tabPar.setChangedData({
      splitjoin: [],
      educator: [],
      hours: [],
      numberOfStudents: [],
      deleted: [],
    });
    console.log("выполнено и очищено", appData.bufferAction);
  };

  const fileInputRef = useRef(null);
  //! функции для импорта файла
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };
  const handleFileClear = () => {
    fileInputRef.current.value = null;
  };
  const handleFileChange = () => {
    const file = fileInputRef.current.files[0];
    appData.setFileData(file);
    setfilePopUp(!filePopUp);
  };

  //! при нажатии на ракету
  const raketClick = () => {
    visibleDataPar.setStartData(0);
    const table = document.querySelector("table");
    table.scrollIntoView(true);
  };

  return (
    <Layout>
      <div className={styles.HomePage}>
        <div className={styles.header}>
          <div className={styles.header_top}>
            <div className={styles.header_top_save_search}>
              <div className={styles.saveBuffre}>
                <button onClick={onSaveClick}>Сохранить</button>
                <img src="./img/backBuffer.svg" onClick={appData.backBuffer} />
              </div>
              <div className={styles.header_search}>
                <input
                  type="text"
                  placeholder="Поиск"
                  id="search"
                  name="search"
                  onChange={handleSearch}
                  className={styles.hedaer_search_inner}
                />
                <img src="./img/search.svg"></img>
              </div>
            </div>
            <div className={styles.header_button}>
              <Button
                Bg={selectedComponent === "Disciplines" ? "#3B28CC" : "#efedf3"}
                textColot={
                  selectedComponent === "Disciplines" ? "#efedf3" : "#000000"
                }
                onClick={() => {
                  handleComponentChange("Disciplines");
                  handleButtonClick();
                }}
                text="Дисциплины"
              />

              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 3
              ) && (
                <Button
                  Bg={selectedComponent === "Teachers" ? "#3B28CC" : "#efedf3"}
                  textColot={
                    selectedComponent === "Disciplines" ? "#000000" : "#efedf3"
                  }
                  onClick={() => {
                    handleComponentChange("Teachers");
                    handleButtonClick();
                  }}
                  text="Преподователи"
                />
              )}
            </div>
            <div className={styles.header_left_component}>
              <Warnings
                setEducatorIdforLk={setEducatorIdforLk}
                educatorIdforLk={educatorIdforLk}
                className={styles.Warnings}
                setSelectedComponent={setSelectedComponent}
                setEducatorData={setEducatorData}
              />
              <Profile
                className={styles.Profile}
                setOpenModalWind={setOpenModalWind}
                onenModalWind={onenModalWind}
                refProfile={refProfile}
              />
            </div>
          </div>
          <div className={styles.header_bottom}>
            <div className={styles.header_bottom_button}>
              {selectedComponent === "Disciplines" && (
                <>
                  {/* <Button
                    Bg={tableMode === "cathedrals" ? "#3B28CC" : "#efedf3"}
                    textColot={
                      tableMode === "cathedrals" ? "#efedf3" : "#000000"
                    }
                    text="Кафедральные"
                    onClick={() => {
                      setTableMode("cathedrals");
                      EditTableData("cathedrals");
                    }}
                  /> */}
                  <ListKaf
                    dataList={dataList}
                    defaultValue="БИТ"
                    setTableMode={setTableMode}
                  />
                  <Button
                    Bg={tableMode === "genInstitute" ? "#3B28CC" : "#efedf3"}
                    textColot={
                      tableMode === "cathedrals" ? "#000000" : "#efedf3"
                    }
                    text="Общеинститутские"
                    onClick={() => {
                      setTableMode("genInstitute");
                      EditTableData("genInstitute");
                      basicTabData.funUpdateTable("0");
                    }}
                  />
                </>
              )}
              {selectedComponent === "Disciplines" && <FiltredRows />}
            </div>

            <div className={styles.right_button}>
              <div className={styles.EditInput}>
                {educatorIdforLk === "" && (
                  <EditInput
                    selectedComponent={selectedComponent}
                    originalHeader={
                      selectedComponent === "Disciplines"
                        ? workloadTableHeaders
                        : educatorTableHeaders
                    } //! исправить не обновляется
                  />
                )}
              </div>
              {selectedComponent === "Disciplines" && (
                <div className={styles.import}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <button onClick={handleFileUpload}>
                    <p>Импорт файла</p>
                    <img src="./img/import.svg" alt=">"></img>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.Block__tables}>
          {selectedComponent === "Disciplines" ? (
            // <TableDisciplines
            //   handleFileClear={handleFileClear}
            //   tableMode={tableMode}
            //   tableHeaders={tableHeaders}
            //   searchTerm={searchTerm}
            //   setSearchTerm={setSearchTerm}
            //   refProfile={refProfile}
            //   setOpenModalWind={setOpenModalWind}
            //   SelectedText={SelectedText}
            // />
            <TableWorkload
              handleFileClear={handleFileClear}
              tableMode={tableMode}
              tableHeaders={tableHeaders}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
            />
          ) : selectedComponent === "Teachers" && educatorIdforLk === "" ? (
            <TableTeachers
              setEducatorIdforLk={setEducatorIdforLk}
              changeInput={changeInput}
              setTableHeaders={setTableHeaders}
              tableHeaders={tableHeaders}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setEducatorData={setEducatorData}
            />
          ) : selectedComponent === "Teachers" && educatorIdforLk !== "" ? (
            <TableLks
              setEducatorIdforLk={setEducatorIdforLk}
              educatorIdforLk={educatorIdforLk}
              changeInput={changeInput}
              searchTerm={searchTerm}
              educatorData={educatorData}
            />
          ) : null}
        </div>
        <div onClick={raketClick}>
          <div className={styles.rocket}>
            <img
              className={styles.rocket_img}
              src="./img/rocket.png"
              alt="up"
            />
          </div>
        </div>
      </div>
      {filePopUp && (
        <PopUpFile
          setfilePopUp={setfilePopUp}
          handleFileClear={handleFileClear}
        />
      )}
      {appData.createEdicatorPopUp && <PopUpCreateEmploy />}
      {appData.errorPopUp && <PopUpError />}
    </Layout>
  );
}

export default HomePage;
