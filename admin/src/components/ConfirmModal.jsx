import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-5">
      <p className="text-sm text-gray-700 text-center leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          Annuler
        </button>
        <button onClick={onConfirm}
          className="flex-1 py-2.5 text-sm bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
          Confirmer
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
