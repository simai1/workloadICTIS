import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
function App() {
  return (
    <BrowserRouter>
      <div className="Container">
        <Routes>
          <Route path="/" element={<HomePage />} />
    
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
