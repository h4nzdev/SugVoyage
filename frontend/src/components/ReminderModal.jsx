// components/ReminderModal.js
import React from "react";
import { X, Clock, MapPin, Calendar, Bell } from "lucide-react";
import { useReminder } from "../context/ReminderContext";

const ReminderModal = () => {
  const { currentReminder, showReminder, closeReminder, snoozeReminder } =
    useReminder();

  if (!showReminder || !currentReminder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <Bell className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">
              Activity Reminder! ⏰
            </h3>
            <p className="text-gray-600 text-sm">
              Time for your next adventure
            </p>
          </div>
          <button
            onClick={closeReminder}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Reminder Content */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-700">
              <strong>Day {currentReminder.day}:</strong>{" "}
              {currentReminder.theme}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-700">
              <strong>Time:</strong> {currentReminder.activityTime}
            </span>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-gray-900 text-center mb-2">
              {currentReminder.activityName}
            </h4>
            <p className="text-gray-600 text-sm text-center">
              from <strong>{currentReminder.tripTitle}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={snoozeReminder}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Snooze (5 min)
          </button>
          <button
            onClick={closeReminder}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
