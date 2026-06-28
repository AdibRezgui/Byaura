import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropModal = ({ file, onConfirm, onCancel, aspect }) => {
  const cropperRef = useRef(null);
  const [ready, setReady] = useState(false);
  const srcUrl = useRef(URL.createObjectURL(file)).current;

  const getCropper = () => cropperRef.current?.cropper;

  const hasCropped = useRef(false);

  const handleConfirm = () => {
    const cropper = getCropper();
    if (!cropper) { onConfirm(file); return; }

    // Send original file if user never manually changed the crop
    const d = cropper.getData();
    if (!hasCropped.current && d.rotate === 0 && d.scaleX === 1 && d.scaleY === 1) {
      onConfirm(file);
      return;
    }

    // Use natural image dimensions for the output canvas
    const imgData = cropper.getImageData();
    const data = cropper.getData();
    const scaleX = imgData.naturalWidth / imgData.width;
    const scaleY = imgData.naturalHeight / imgData.height;

    const canvas = cropper.getCroppedCanvas({
      width: Math.round(Math.abs(data.width) * scaleX),
      height: Math.round(Math.abs(data.height) * scaleY),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    canvas.toBlob(
      (blob) => {
        if (!blob) { onConfirm(file); return; }
        onConfirm(new File([blob], file.name, { type: file.type || "image/jpeg" }));
      },
      file.type || "image/jpeg",
      0.97
    );
  };

  const tools = [
    { title: "Zoom +",    fn: () => getCropper()?.zoom(0.1),   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg> },
    { title: "Zoom -",    fn: () => getCropper()?.zoom(-0.1),  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35M8 11h6"/></svg> },
    { title: "↺",         fn: () => getCropper()?.rotate(-90), icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" d="M2.5 9.5A9 9 0 1 1 5 17M2.5 9.5V4M2.5 9.5H8"/></svg> },
    { title: "↻",         fn: () => getCropper()?.rotate(90),  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" d="M21.5 9.5A9 9 0 1 0 19 17M21.5 9.5V4M21.5 9.5H16"/></svg> },
    { title: "⟷",         fn: () => { const c = getCropper(); c?.scaleX(c.getData().scaleX === -1 ? 1 : -1); }, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18"/></svg> },
    { title: "↕",         fn: () => { const c = getCropper(); c?.scaleY(c.getData().scaleY === -1 ? 1 : -1); }, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" d="M8 7l4-4 4 4M16 17l-4 4-4-4M12 3v18"/></svg> },
    { title: "Reset",     fn: () => getCropper()?.reset(),     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" d="M4 4v5h.582M4.582 9A8 8 0 1 1 4 12"/></svg> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style={{ maxHeight: "92vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Ajuster l'image</h2>
            <p className="text-xs text-gray-400 mt-0.5">Déplacez et redimensionnez le cadre de sélection</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>

        {/* Cropper */}
        <div className="flex-1 min-h-0 bg-gray-900 overflow-hidden">
          <Cropper
            ref={cropperRef}
            src={srcUrl}
            style={{ height: "100%", width: "100%", minHeight: "380px" }}
            aspectRatio={aspect || NaN}
            viewMode={1}
            dragMode="move"
            autoCropArea={1}
            guides={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            toggleDragModeOnDblclick={false}
            cropend={() => { hasCropped.current = true; }}
            ready={() => setReady(true)}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-center gap-1 px-4 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          {tools.map(({ title, fn, icon }) => (
            <button key={title} title={title} onClick={fn}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
              {icon}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 justify-end flex-shrink-0">
          <button onClick={onCancel}
            className="px-5 py-2.5 text-xs tracking-wider text-gray-500 hover:text-black border border-gray-200 rounded-xl transition-colors">
            Annuler
          </button>
          <button onClick={handleConfirm} disabled={!ready}
            className="px-6 py-2.5 text-xs tracking-wider bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 transition-colors">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
