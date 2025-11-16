import { createContext, useState, useCallback } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, spotsCount, spotName) => {
    setNotification({
      id: Date.now(),
      message,
      spotsCount,
      spotName,
      timestamp: new Date(),
    });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const value = {
    notification,
    showNotification,
    dismissNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
