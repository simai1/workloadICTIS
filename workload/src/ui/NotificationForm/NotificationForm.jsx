import React, { useEffect, useState } from "react";
import styles from "./NotificationForm.module.scss";
import DataContext from "../../context";
import { Comment, createComment } from "../../api/services/ApiGetData";

export function NotificationForm(props) {
  const [isCommentsSheetOpen, setCommentsSheetOpen] = useState(false);
  const [isError, setError] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [textarea, setTextarea] = useState("");
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    Comment().then((data) => {
      console.log("comment", data);
      setCommentData(
        data.filter((item) => item.workloadId === props.workloadId)
      );
    });
  }, []);
  const onCheckmarkClick = () => {
    if (textarea === "") {
      setError(true);
    } else {
      const data = {
        educatorId: "3d3d0074-3697-42ea-90f4-e8c034376fcf",
        workloadId: props.workloadId,
        text: textarea,
      };
      createComment(data);
    }
  };

  const onChangeTextarea = (event) => {
    setError(false);
    setTextarea(event.target.value);
  };
  const handleClickComment = () => {
    setCommentsSheetOpen(false);
    setIsComment(!isComment);
  };
  return (
    <main ref={props.refHoverd} className={styles.notification}>
      <div
        className={styles.hovered_notice}
        style={{
          top: props.position.y,
          left: props.position.x + 70,
        }}
      >
        <div className={styles.comment_top}>
          {/* открыть все комментарии */}
          {isCommentsSheetOpen && commentData.length > 1 ? (
            <div className={styles.CommentsSheet}>
              <div className={styles.container}>
                {commentData.map((item) => (
                  <div key={item?.id}>
                    <h4>{item?.educator.name}</h4>
                    <p>{item?.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h4>{commentData[0]?.educator.name}</h4>
              <p>{commentData[0]?.text}</p>
            </>
          )}
          <div className={styles.hovered_notice_img}>
            <div
              className={styles.left}
              onClick={() => {
                setCommentsSheetOpen(!isCommentsSheetOpen);
                setIsComment(false);
              }}
            >
              <span>{commentData.length}</span>
              <img
                style={
                  isCommentsSheetOpen ? { transform: " rotate(180deg)" } : null
                }
                src="./img/arrow_down.svg"
                alt="^"
              ></img>
            </div>

            <div className={styles.left}>
              <img
                onClick={handleClickComment}
                src={isComment ? "./img/commentsOn.svg" : "./img/comments.svg"}
                alt="comments"
              ></img>
              <img
                onClick={onCheckmarkClick}
                src="./img/checkmark.svg"
                alt="checkmark"
              ></img>
            </div>
          </div>
        </div>

        {
          <div className={isComment ? styles.comment : styles.comment_show}>
            <textarea
              style={isError ? { borderColor: "red" } : null}
              id="textareaNotificationForm"
              type="text"
              onChange={onChangeTextarea}
            />
            {isError && <span>Заполните текстовое поле</span>}
            <button onClick={onCheckmarkClick}>Отправать</button>
          </div>
        }
      </div>
    </main>
  );
}
