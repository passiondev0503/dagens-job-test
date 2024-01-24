export const columns = [
  {
    Header: "No",
    accessor: "no",
  },
  {
    Header: "Product ID",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "Price",
    accessor: "price",
  },
];

export const formatRowData = (rawData, page, pageNumber) =>
  rawData.map((info, index) => ({
    no: index + page * (pageNumber - 1) + 1,
    id: info.id,
    name: info.name,
    category: info.category,
    price: info.price,
  }));

export const getData = async (
  pageNo = 1,
  rowPerPage = 24,
  category = "",
  maxPrice,
  minPrice = 0,
  nearestId = ""
) => {
  if (nearestId) {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}product/nearest/${nearestId}`
    );
    const data = await response.json();
    return data;
  } else {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}product/get?page=${pageNo}&pageSize=${rowPerPage}&category=${category}&maxPrice=${maxPrice}&minPrice=${minPrice}`
    );
    const data = await response.json();
    return data;
  }
};
