import React, { useState } from 'react';

const ContextMenu = (props) => {
  const [menuPosition, setMenuPosition] = useState(props.menuPosition);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };
  
  return (
    <div onContextMenu={handleContextMenu}>
        <div
          style={{
            position: 'fixed',
            top: menuPosition.y,
            left: menuPosition.x,
            background: 'white',
            border: '1px solid gray',
            padding: '8px',
          }}
        >
          <button onClick={props.handleMenuClick}>Пункт меню 1</button>
          <button onClick={props.handleMenuClick}>Пункт меню 2</button>
          <button onClick={props.handleMenuClick}>Пункт меню 3</button>
          <button onClick={props.handleMenuClick}>Пункт меню 4</button>
        </div>
      
    </div>
  );
};

export default ContextMenu;
