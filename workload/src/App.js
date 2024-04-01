import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";
import Authorization from "./pages/Authorization/Authorization";
import { bufferRequestToApi, returnPrevState } from "./bufferFunction";

function App() {
  const [educator, setEducator] = useState([]); // преподаватели
  const [positions, setPositions] = useState([]); // должности
  const [workload, setWorkload] = useState([]); // данные о нагрузках
  const [allWarningMessage, setAllWarningMessage] = useState([]);

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
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // //! следим за нажатием ctrl + z для отмены последнего действияы
      // if (event.ctrlKey && (event.key === "z" || event.key === "я")) {
      //   console.log("отеменено последнее действие");
      //   setBufferAction((prevItems) => prevItems.slice(1));
      //   //функция отмены последенего действия находится в TableDisciplines
      // }
      //! следим за нажатием ctrl + s для сохранения изменений
      if (event.ctrlKey && (event.key === "s" || event.key === "ы")) {
        event.preventDefault();
        console.log("Сохранено", bufferAction);
        bufferRequestToApi(bufferAction).then(() => {
          setBufferAction([0]);
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
