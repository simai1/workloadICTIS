import { apiDeleteMyComment } from "../../api/services/ApiRequest";
import styles from "./DeletPointComments.module.scss";

function DeletPointComments(props) {
  const delComment = () => {
    apiDeleteMyComment(props.itemId).then((req) => {
      if (req?.status === 200) {
        console.log(req);
        props.funUpdComment();
      }
    });
  };

  return (
    <div className={styles.DeletPointComments}>
      <img
        onClick={delComment}
        title="Удалить свой комментарий"
        src="./img/x.svg"
        alt="x"
      />
    </div>
  );
}

export default DeletPointComments;
