import React, { useEffect, useRef, useState } from "react";
import styles from "./HomePage.module.scss";
import TableDisciplines from "../../components/TableDisciplines/TableDisciplines";
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
import { getDataTable } from "../../api/services/AssignApiData";
import TableWorkload from "../../components/TableWorkload/TableWorkload";

function HomePage() {
  const { appData } = React.useContext(DataContext);

  const [selectedComponent, setSelectedComponent] = useState("Disciplines");
  const [tableMode, setTableMode] = useState("cathedrals"); //выбранный компонент

  const [educatorData, setEducatorData] = useState([]); // данные о преподавателе получаем в TableTeachers
  const [searchTerm, setSearchTerm] = useState(""); //поиск по таблице
  const [onenModalWind, setOpenModalWind] = useState(false); // переменная закрытия модального окна профиля
  const refProfile = React.useRef(null); // ссылка на модальное окно профиля
  const [educatorIdforLk, setEducatorIdforLk] = useState(""); // id для вывода LK, если пустое то LK не отображается
  const [SelectedText, setSelectedText] = useState("Все дисциплины"); // текст в FiltredRows
  const handleButtonClick = () => {
    setEducatorIdforLk("");
  };

  const tableHeaders2 = [
    { key: "id", label: "№" },
    { key: "name", label: "Преподователь" },
    { key: "position", label: "Должность" },
    { key: "typeOfEmployment", label: "Вид занятости" },
    { key: "department", label: "Кафедра" },
    { key: "rate", label: "Ставка" },
    { key: "maxHours", label: "Максимум часов" },
    { key: "recommendedMaxHours", label: "Рекомендуемый максимум часов" },
    { key: "minHours", label: "Минимум часов" },
  ];
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    if (component === "Disciplines") {
      setTableHeaders(tableHeaders);
    } else {
      setTableHeaders(tableHeaders2);
    }
  };

  const changeInput = () => {
    setTableHeaders(tableHeaders2);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const EditTableData = (selectedComponent) => {
    console.log(selectedComponent);
    //тут написать функцию которая будет подгружать нужное содержимое tableData и tableHeaders
  };
  const tableHeaders = [
    { key: "id", label: "№" },
    { key: "discipline", label: "Дисциплина" },
    { key: "workload", label: "Нагрузка" },
    { key: "groups", label: "Группа" },
    { key: "department", label: "Кафедра" },
    { key: "block", label: "Блок" },
    { key: "semester", label: "Семестр" },
    { key: "period", label: "Период" },
    { key: "curriculum", label: "Учебный план" },
    { key: "curriculumUnit", label: "Подразделение учебного плана" },
    { key: "formOfEducation", label: "Форма обучения" },
    { key: "levelOfTraining", label: "Уровень подготовки" },
    {
      key: "specialty",
      label: "Направление подготовки (специальность)",
    },
    { key: "core", label: "Профиль" },
    { key: "numberOfStudents", label: "Количество студентов" },
    { key: "hours", label: "Часы" },
    { key: "audienceHours", label: "Аудиторные часы" },
    { key: "ratingControlHours", label: "Часы рейтинг-контроль" },
    { key: "educator", label: "Преподаватель" },
  ];

  const [tableHeadersTeacher, setTableHeaders] = useState(tableHeaders);

  //! сохранение буфера
  const onSaveClick = () => {
    //! отправляем все запросы на обработку
    console.log("Сохранено", appData.bufferAction);
    bufferRequestToApi(appData.bufferAction).then(() => {
      appData.setBufferAction([0]);
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
    // Здесь можно выполнить дополнительную обработку загруженного файла
    console.log("Выбранный файл:", file);
    appData.setFileData(file);
  };

  return (
    <Layout>
      <div className={styles.HomePage}>
        <div className={styles.header}>
          <div className={styles.header_top}>
            <div>
              <button
                style={{
                  height: "45px",
                  backgroundColor: "#3b28cc",
                  color: "#fff",
                  borderRadius: " 8px",
                  border: "none",
                  fontSize: "18px",
                  padding: "10px 16px",
                }}
                onClick={onSaveClick}
              >
                Сохранить
              </button>
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
                  <Button
                    Bg={tableMode === "cathedrals" ? "#3B28CC" : "#efedf3"}
                    textColot={
                      tableMode === "cathedrals" ? "#efedf3" : "#000000"
                    }
                    text="Кафедральные"
                    onClick={() => {
                      setTableMode("cathedrals");
                      EditTableData(tableMode);
                    }}
                  />
                  <Button
                    Bg={tableMode === "genInstitute" ? "#3B28CC" : "#efedf3"}
                    textColot={
                      tableMode === "cathedrals" ? "#000000" : "#efedf3"
                    }
                    text="Общеинститутские"
                    onClick={() => {
                      setTableMode("genInstitute");
                      EditTableData(tableMode);
                    }}
                  />
                </>
              )}
              <FiltredRows
                SelectedText={SelectedText}
                setSelectedText={setSelectedText}
              />
            </div>

            <div className={styles.right_button}>
              <div className={styles.EditInput}>
                {educatorIdforLk === "" && (
                  <EditInput
                    selectedComponent={selectedComponent} //! исправить не обновляется
                    tableHeaders={tableHeadersTeacher}
                  />
                )}
              </div>
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
            </div>
          </div>
        </div>

        <div className={styles.Block__tables}>
          {selectedComponent === "Disciplines" ? (
            <TableDisciplines
              handleFileClear={handleFileClear}
              tableMode={tableMode}
              tableHeaders={tableHeaders}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
              SelectedText={SelectedText}
            />
          ) : // <TableWorkload
          //   handleFileClear={handleFileClear}
          //   tableMode={tableMode}
          //   tableHeaders={tableHeaders}
          //   searchTerm={searchTerm}
          //   setSearchTerm={setSearchTerm}
          //   refProfile={refProfile}
          //   setOpenModalWind={setOpenModalWind}
          //   SelectedText={SelectedText}
          // />
          selectedComponent === "Teachers" && educatorIdforLk === "" ? (
            <TableTeachers
              setEducatorIdforLk={setEducatorIdforLk}
              changeInput={changeInput}
              setTableHeaders={setTableHeaders}
              tableHeaders={tableHeadersTeacher}
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
        <a href="#">
          <div className={styles.rocket}>
            <img
              className={styles.rocket_img}
              src="./img/rocket.png"
              alt="up"
            />
          </div>
        </a>
      </div>
    </Layout>
  );
}

export default HomePage;
