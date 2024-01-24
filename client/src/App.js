import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import ProductCreate from "./pages/ProductCreate";
import ProductList from "./pages/ProductList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        {/* <Route path="/create" element={<ProductCreate />} /> */}
      </Routes>
    </Router>
  );
};
export default App;
