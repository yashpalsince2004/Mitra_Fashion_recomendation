import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Sparkles } from "lucide-react";

export function ImageUploader({ onImageSelect, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      // Pass back base64 and mime type, strip the data URI prefix for Gemini
      const base64Data = base64String.split(",")[1];
      onImageSelect({ base64Data, mimeType: file.type, previewUrl: base64String });
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }, [processFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClear?.();
  };

  return (
    <AnimatePresence mode="wait">
      {preview ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-2xl overflow-hidden border border-white/15 group"
        >
          <img
            src={preview}
            alt="Uploaded look"
            className="w-full max-h-72 object-cover object-top"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Analysis badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-white/90 text-xs font-medium tracking-wide">Ready for AI analysis</span>
          </div>

          {/* Remove button */}
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500/50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="dropzone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            cursor-pointer rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3
            transition-all duration-300 select-none
            ${isDragging
              ? "border-accent bg-accent/10 scale-[1.01]"
              : "border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5"
            }
          `}
        >
          <motion.div
            animate={isDragging ? { y: [-4, 4, -4], transition: { repeat: Infinity, duration: 0.8 } } : { y: 0 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? "bg-accent/20" : "bg-white/5"} border border-white/10`}
          >
            {isDragging ? (
              <ImageIcon className="w-5 h-5 text-accent" />
            ) : (
              <Upload className="w-5 h-5 text-white/50" />
            )}
          </motion.div>
          <div className="text-center">
            <p className="text-white/70 text-sm font-medium">
              {isDragging ? "Drop to upload" : "Upload your photo"}
            </p>
            <p className="text-white/30 text-xs mt-1">
              Drag & drop or <span className="text-accent/80 underline underline-offset-2">browse</span> · JPG, PNG, WEBP
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
