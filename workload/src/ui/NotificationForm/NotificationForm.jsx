import React, { useEffect, useState } from "react";
import styles from "./NotificationForm.module.scss";
import DataContext from "../../context";
import { Comment } from "../../api/services/ApiGetData";

export function NotificationForm(props) {
  const [isNoticeIndex, setNoticeIndex] = useState(0);
  const [isCommentsSheetOpen, setCommentsSheetOpen] = useState(false);
  const { appData } = React.useContext(DataContext);
  const [isError, setError] = useState(false);

  useEffect(() => {
    Comment().then((data) => {
      console.log("comment", data);
    });
  }, []);
  const onCheckmarkClick = () => {
    // let a = isNoticeIndex + 1;
    // if (a !== props.notice.length) {
    //   setNoticeIndex(a);
    // }
    setError(true);
  };

  const [isComment, setIsComment] = useState(false);
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
          {isCommentsSheetOpen && props.notice.length > 1 ? (
            <div className={styles.CommentsSheet}>
              <div className={styles.container}>
                {props.notice.map((item) => (
                  <div key={item.id}>
                    <h4>{item.name}</h4>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h4>{props.notice[isNoticeIndex].name}</h4>
              <p>{props.notice[isNoticeIndex].text}</p>
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
              <span>{props.notice.length}</span>
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
            <textarea id="textareaNotificationForm" type="text" />
            <span>Заполните текстовое поле</span>
            <button onClick={onCheckmarkClick}>Отправать</button>
          </div>
        }
      </div>
    </main>
  );
}
