import React from "react";

function TableTd(props) {
  console.log(props.item);
  return <td key={props.item.id}>td</td>;
}

export default TableTd;
