import React from "react";

function TableTh(props) {
  return <td key={props.item.key}>{props.item.label}</td>;
}

export default TableTh;
