import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const Pagination = ({
  pageChangeHandler,
  totalRows = 0,
  rowsPerPage,
  currentPage,
  rowsPerPageHandler,
  category,
  minPrice,
  maxPrice,
}) => {
  const noOfPages = Math.ceil(totalRows / rowsPerPage);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  const [pageFirstRecord, setPageFirstRecord] = useState(1);
  const [pageLastRecord, setPageLastRecord] = useState(rowsPerPage);

  const onNextPage = () => pageChangeHandler(currentPage + 1);
  const onPrevPage = () => pageChangeHandler(currentPage - 1);
  const onPageSelect = (pageNo) => {
    pageChangeHandler(pageNo);
    window.history.pushState(
      null,
      null,
      `?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${pageNo}&pageSize=${rowsPerPage}`
    );
  };

  useEffect(() => {
    setCanGoNext(currentPage < noOfPages);
    setCanGoBack(currentPage > 1);
  }, [noOfPages, currentPage]);

  useEffect(() => {
    const skipFactor = (currentPage - 1) * rowsPerPage;
    setPageFirstRecord(skipFactor + 1);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    const count = pageFirstRecord + rowsPerPage;
    setPageLastRecord(count > totalRows ? totalRows : count - 1);
  }, [pageFirstRecord, rowsPerPage, totalRows]);

  const getPaginationNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(noOfPages, currentPage + 2);

    if (currentPage <= 2) {
      end = Math.min(noOfPages, 5);
    }

    if (currentPage > noOfPages - 2) {
      start = Math.max(1, noOfPages - 4);
    }

    const result = Array.from({ length: end - start + 1 }, (v, k) => k + start);
    return result;
  };

  return (
    <>
      {noOfPages > 1 ? (
        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            Showing {pageFirstRecord} - {pageLastRecord} of {totalRows}
            &nbsp;&nbsp; Show Per Page:
            <select
              value={rowsPerPage}
              style={{ marginLeft: "10px" }}
              onChange={(e) => rowsPerPageHandler(Number(e.target.value))}
            >
              <option value={24}>24</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className={styles.pagebuttons}>
            <button
              className={styles.pageBtn}
              onClick={() => onPageSelect(1)}
              disabled={!canGoBack}
            >
              &#171;
            </button>
            <button
              className={styles.pageBtn}
              onClick={onPrevPage}
              disabled={!canGoBack}
            >
              &#8249;
            </button>
            {getPaginationNumbers()[0] > 1 && <>...</>}
            {getPaginationNumbers().map((num, index) => (
              <button
                key={num}
                onClick={() => onPageSelect(num)}
                className={`${styles.pageBtn} ${
                  num === currentPage ? styles.activeBtn : ""
                }`}
              >
                {num}
              </button>
            ))}
            {getPaginationNumbers()[getPaginationNumbers().length - 1] <
              noOfPages && <>...</>}
            <button
              className={styles.pageBtn}
              onClick={onNextPage}
              disabled={!canGoNext}
            >
              &#8250;
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => onPageSelect(noOfPages)}
              disabled={!canGoNext}
            >
              &#187;
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Pagination;
