import React, { useState } from "react";
import styles from "./NotificationForm.module.scss";

export function NotificationForm(props) {
  const [isNoticeIndex, setNoticeIndex] = useState(0);
  const onCheckmarkClick = () => {
    let a = isNoticeIndex + 1;
    if (a !== props.notice.length) {
      setNoticeIndex(a);
    }
  };

  const [isComment, setIsComment] = useState(false);
  const handleClickComment = () => {
    setIsComment(!isComment);
  };
  return (
    <main ref={props.refHoverd} className={styles.notification}>
      <div
        className={styles.hovered_notice}
        style={{
          top: !isComment ? props.position.y : props.position.y - 180,
          left: props.position.x + 70,
        }}
      >
        <div className={styles.comment_top}>
          <h4>{props.notice[isNoticeIndex].name}</h4>
          <p>{props.notice[isNoticeIndex].text}</p>
          <div className={styles.hovered_notice_img}>
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

        {
          <div className={isComment ? styles.comment : styles.comment_show}>
            <textarea id="textareaNotificationForm" type="text" />
            <button onClick={onCheckmarkClick}>Отправать</button>
          </div>
        }
      </div>
    </main>
  );
}
