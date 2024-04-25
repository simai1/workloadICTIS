import React from "react";
import TableTh from "./TableTh";
import TableTd from "./TableTd";

function Table(props) {
  return (
    <table>
      <thead>
        <tr>
          {props.tableHeaders.map((item) => (
            <TableTh item={item} />
          ))}
        </tr>
      </thead>
      <tbody>
        {props.workloadData.map((item) => (
          <tr key={item.id}>
            {props.tableHeaders.map((itemKey) => {
              return <TableTd item={item} itemKey={itemKey} />;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
