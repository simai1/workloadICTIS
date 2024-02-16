import React, { useState } from 'react';

const ContextMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMenuClick = () => {
    // Обработка действий при выборе пункта меню
    // ...
    // Закрытие контекстного меню
    setShowMenu(false);
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {showMenu && (
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
          <button onClick={handleMenuClick}>Пункт меню 1</button>
          <button onClick={handleMenuClick}>Пункт меню 2</button>
          <button onClick={handleMenuClick}>Пункт меню 3</button>
          <button onClick={handleMenuClick}>Пункт меню 4</button>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
