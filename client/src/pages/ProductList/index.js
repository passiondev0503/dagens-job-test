import React, { useState, useEffect } from "react";
import { getData, columns, formatRowData } from "../../utils/data";
import Pagination from "../../components/paginations";
import AppTable from "../../components/table";
import "./styles.module.css";
import axios from "axios";

const ProductList = () => {
  const [pageData, setPageData] = useState({
    rowData: [],
    isLoading: false,
    totalPages: 0,
    totalPassengers: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [maxPrice, setMaxPrice] = useState();
  const [minPrice, setMinPrice] = useState();
  const [category, setCategory] = useState("");

  const [insertCategory, setInsertCategory] = useState("");
  const [insertPrice, setInsertPrice] = useState();
  const [insertName, setInsertName] = useState("");
  const [nearestId, setNearestId] = useState("");

  useEffect(() => {
    setPageData((prevState) => ({
      ...prevState,
      rowData: [],
      isLoading: true,
    }));

    const urlParams = new URLSearchParams(window.location.search);

    const cat = urlParams.get("category");
    const min = urlParams.get("minPrice");
    const max = urlParams.get("maxPrice");
    const page = urlParams.get("page") || currentPage;
    const size = urlParams.get("pageSize") || pageSize;

    if (cat) setCategory(cat);
    if (min) setMinPrice(min);
    if (max) setMaxPrice(max);
    if (page) setCurrentPage(parseInt(page));
    if (size) setPageSize(parseInt(size));
    fetchProducts();
  }, [currentPage, pageSize, category, maxPrice, minPrice, nearestId]);

  const fetchProducts = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get("category");
    const min = urlParams.get("minPrice");
    const max = urlParams.get("maxPrice");
    const page = urlParams.get("page") || currentPage;
    const size = urlParams.get("pageSize") || pageSize;
    setCategory(cat || category);
    setMinPrice(min || minPrice);
    setMaxPrice(max || maxPrice);
    setCurrentPage(parseInt(page));
    setPageSize(parseInt(size));
    getData(
      currentPage,
      pageSize,
      category,
      maxPrice,
      minPrice,
      nearestId
    ).then((info) => {
      const { total, data } = info.data;
      setPageData({
        isLoading: false,
        rowData: formatRowData(data, pageSize, currentPage),
        totalPages: Math.ceil(total / pageSize),
        totalPassengers: total,
      });
    });
  };
  const handleInsertProduct = async () => {
    try {
      if (insertCategory && insertName && insertPrice > 0) {
        axios
          .post(`${process.env.REACT_APP_SERVER_URL}product/register`, {
            name: insertName,
            category: insertCategory,
            price: insertPrice,
          })
          .then((res) => {
            if (res.status === 201) {
              alert(res.data.message);
              fetchProducts();
              EmptyField();
            }
          })
          .catch((err) => alert(err.response.data.message));
      } else {
        alert("Invalid Field.");
      }
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  const EmptyField = () => {
    setInsertCategory("");
    setInsertName("");
    setInsertPrice(0);
  };

  const EmptyFilterField = () => {
    window.history.pushState(null, null, "?");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  const setRowPerPage = (count) => {
    const calculatedPage =
      Math.floor(((currentPage - 1) * pageSize) / count) + 1;
    setCurrentPage(calculatedPage);
    setPageSize(count);
    window.history.pushState(
      null,
      null,
      `?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${calculatedPage}&pageSize=${count}`
    );
    fetchProducts();
  };

  return (
    <div style={{ padding: "50px 100px" }}>
      <h1>Product List</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: "20px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        Name:{" "}
        <input
          type="text"
          value={insertName}
          onChange={(e) => setInsertName(e.target.value)}
        ></input>
        Category:{" "}
        <input
          type="text"
          value={insertCategory}
          onChange={(e) => setInsertCategory(e.target.value)}
        ></input>
        Price:{" "}
        <input
          type="number"
          value={insertPrice}
          onChange={(e) => setInsertPrice(parseInt(e.target.value))}
        ></input>
        <button onClick={handleInsertProduct}>Add Product</button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: "6px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "20px" }}>Filter : </span>
        Category:{" "}
        <input
          type="text"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            window.history.pushState(
              null,
              null,
              `?category=${e.target.value}&minPrice=${minPrice}&maxPrice=${maxPrice}`
            );
            setNearestId("");
          }}
        ></input>
        MinPrice:{" "}
        <input
          type="number"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            window.history.pushState(
              null,
              null,
              `?category=${category}&minPrice=${e.target.value}&maxPrice=${maxPrice}`
            );
            setNearestId("");
          }}
        ></input>
        MaxPrice:{" "}
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            window.history.pushState(
              null,
              null,
              `?category=${category}&minPrice=${minPrice}&maxPrice=${e.target.value}`
            );
            setNearestId("");
          }}
        ></input>
      </div>
      <div>
        Get Nearest Products by ID:{" "}
        <input
          value={nearestId}
          onChange={(e) => {
            setNearestId(e.target.value);
            EmptyFilterField();
          }}
          placeholder="input product ID"
        ></input>
      </div>
      <div style={{ height: "auto" }}>
        <AppTable
          columns={columns}
          data={pageData.rowData}
          isLoading={pageData.isLoading}
        />
      </div>

      <Pagination
        totalRows={pageData.totalPassengers}
        pageChangeHandler={setCurrentPage}
        rowsPerPage={pageSize}
        currentPage={currentPage}
        rowsPerPageHandler={setRowPerPage}
        category={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </div>
  );
};

export default ProductList;
