import styles from "./TableNotice.module.scss";
export function TableNotice(props) {
  return (
    <table className={styles.TableDisciplines_circle}>
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {/* <tr>
          <th></th>
        </tr>    */}
        {props.filteredData.map((row, index) => {
          const checkValues = Object.values(row).some((value) =>
            props.isChecked.includes(value)
          );
          if (!checkValues) {
            return (
              <tr className={styles.notice} key={index}>
                <td
                  className={
                    props.notice.some((item) => item.id_row === index)
                      ? styles.notice_circle
                      : null
                  }
                >
                  <div
                    className={styles.notice_circle_inner}
                    onClick={(el) => props.handleClicNotice(el, index)}
                  >
                    {
                      props.notice.filter((item) => item.id_row === index)
                        .length
                    }
                  </div>
                </td>
              </tr>
            );
          }
          return null;
        })}
      </tbody>
    </table>
  );
}
