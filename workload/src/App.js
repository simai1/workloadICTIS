import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";

function App() {
  const [educator, setEducator] = useState(null); // преподаватели

  return (
    <DataContext.Provider value={{ educator, setEducator }}>
      <BrowserRouter>
        <div className="Container">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
