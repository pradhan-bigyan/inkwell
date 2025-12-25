import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isShown, onClose]);

  if (!isShown) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
        isShown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`min-w-72 bg-white border-l-4 ${
          type === "delete"
            ? "border-red-500 bg-red-50"
            : "border-green-500 bg-green-50"
        } shadow-lg rounded-lg p-4`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500" />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>

          <p className="text-sm text-gray-800 flex-1">{message}</p>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
