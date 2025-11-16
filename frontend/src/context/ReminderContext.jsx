// contexts/ReminderContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const ReminderContext = createContext();

export const useReminder = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error("useReminder must be used within a ReminderProvider");
  }
  return context;
};

export const ReminderProvider = ({ children }) => {
  const [currentReminder, setCurrentReminder] = useState(null);
  const [showReminder, setShowReminder] = useState(false);

  // Simple function to check if it's time for an activity
  const checkActivityTime = (activityTime) => {
    if (!activityTime) return false;

    const now = new Date();
    const currentTimeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Simple string comparison (e.g., "9:00 AM" === "9:00 AM")
    return currentTimeString === activityTime;
  };

  // Monitor a trip for reminders
  const monitorTrip = (trip) => {
    if (!trip?.days) return;

    let foundReminder = null;

    // Check all activities in all days
    trip.days.forEach((day) => {
      day.activities.forEach((activity) => {
        // Only check activities that are not completed
        if (!activity.isCompleted && checkActivityTime(activity.time)) {
          foundReminder = {
            activityName: activity.name,
            activityTime: activity.time,
            day: day.dayNumber,
            theme: day.theme,
            tripTitle: trip.title,
          };
        }
      });
    });

    if (foundReminder) {
      setCurrentReminder(foundReminder);
      setShowReminder(true);
    }
  };

  // Close reminder
  const closeReminder = () => {
    setShowReminder(false);
    setCurrentReminder(null);
  };

  // Snooze reminder (close for 5 minutes)
  const snoozeReminder = () => {
    setShowReminder(false);
    // You could add snooze logic here if needed
  };

  const value = {
    currentReminder,
    showReminder,
    monitorTrip,
    closeReminder,
    snoozeReminder,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};
