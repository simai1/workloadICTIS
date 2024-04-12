import React, { useState, useEffect, useMemo } from "react";
import styles from "./TableLks.module.scss";
import EditInput from "../EditInput/EditInput";
import ArrowBack from "./../../img/arrow-back.svg";
import { useDispatch, useSelector } from "react-redux";
import { getDataEducatorLK } from "../../api/services/AssignApiData";

function TableLks(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [EducatorLkData, setEducatorLkData] = useState([]);

  const [tableData, setTableData] = useState([]);

  //! получаем данные личного кабинета преподавателя
  useEffect(() => {
    getDataEducatorLK(props.educatorIdforLk, setEducatorLkData, setTableData);
  }, [props.educatorIdforLk]);

  console.log("EducatorLkData", EducatorLkData);
  console.log("tableData", tableData);

  //! то что введено в поисковую строку, обновляет данные компонента
  useEffect(() => {
    setSearchTerm(props.searchTerm);
  }, [props.searchTerm]);

  const tableHeaders = useMemo(() => {
    return [
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
    ];
  }, []);

  //! клик на стрелку назад
  const handleNameClick = () => {
    props.setEducatorIdforLk("");
    props.changeInput();
  };

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    addHeadersTable(filters, tableHeaders, tableData);
  }, [filters, dispatch, tableHeaders, tableData]);

  function addHeadersTable(filters, tableHeaders, tableData) {
    const updatedHeader = tableHeaders.filter((header) =>
      filters.includes(header.key)
    );
    const updatedData = tableData.map((data) => {
      const updatedRow = {};
      Object.keys(data).forEach((key) => {
        if (filters.includes(key)) {
          updatedRow[key] = data[key];
        }
      });
      return updatedRow;
    });
    setUpdatedHeader(updatedHeader);
    setUpdatedData(updatedData);
  }

  const filteredData = updatedData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const AllHours = EducatorLkData?.totalHours;
  const OgranHours = "700";
  var BackgroundColorHours = WhyColor(AllHours, OgranHours);

  // Функция для определения цвета фона
  function WhyColor(AllHours, OgranHours) {
    let bg;
    if (AllHours <= OgranHours - 300) {
      bg = "#19C20A"; // Зеленый цвет
    } else if (OgranHours - 300 < AllHours && AllHours <= OgranHours - 100) {
      bg = "#FFD600"; // Желтый цвет
    } else {
      bg = "#E81414"; // Красный цвет
    }
    return bg;
  }

  console.log(BackgroundColorHours);

  return (
    <div>
      <button className={styles.buttonBack} onClick={handleNameClick}>
        <img src={ArrowBack} alt="arrow"></img>
        <p>Назад</p>
      </button>

      <div className={styles.DataLks}>
        <div className={styles.DataLksInner}>
          <div className={styles.DataLksHead}>
            <h1>{EducatorLkData?.name}</h1>
            <div
              className={styles.DataLksHeadSchet}
              style={{ backgroundColor: BackgroundColorHours }}
            >
              <p>
                <span>{AllHours}</span>/<span>{OgranHours}</span>
              </p>
            </div>
          </div>

          <p>{EducatorLkData?.department}</p>
          <p>{EducatorLkData?.position}</p>
          <p>Ставка: {EducatorLkData?.rate}</p>
        </div>
        {tableData[0] && (
          <div className={styles.EditInput}>
            <EditInput tableHeaders={tableHeaders} top={60.3} h={64} />
          </div>
        )}
      </div>

      {tableData[0] && (
        <div className={styles.TableLks__inner}>
          <table className={styles.TableLks}>
            <thead>
              <tr>
                {updatedHeader.map((header) => (
                  <th key={header.key}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((key) => (
                    <td key={key}>{key === "id" ? index + 1 : row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TableLks;
