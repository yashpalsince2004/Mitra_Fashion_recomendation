import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Sparkles, Plus } from "lucide-react";

export function ImageUploader({ onImageSelect, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const processFiles = useCallback((files) => {
    if (!files || files.length === 0) return;

    const newPreviews = [];
    const imageSelections = [];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const base64Data = base64String.split(",")[1];
        
        newPreviews.push(base64String);
        imageSelections.push({ base64Data, mimeType: file.type, previewUrl: base64String });

        if (newPreviews.length === Array.from(files).filter(f => f.type.startsWith("image/")).length) {
          const updatedPreviews = [...previews, ...newPreviews].slice(0, 5); // Max 5 images
          const updatedSelections = [...imageSelections].slice(0, 5);
          
          setPreviews(updatedPreviews);
          onImageSelect(updatedSelections);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [onImageSelect, previews]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e) => {
    processFiles(e.target.files);
  };

  const handleRemove = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (updated.length === 0) onClear?.();
    else onImageSelect(updated.map(p => ({ base64Data: p.split(",")[1], previewUrl: p }))); // Simplification
  };

  const handleClear = () => {
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClear?.();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <AnimatePresence>
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-2">
            {previews.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden border ghost-border group"
              >
                <img src={src} className="w-full h-full object-cover" alt="Wardrobe item" />
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-main" />
                </button>
              </motion.div>
            ))}
            {previews.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed ghost-border hover:ghost-border hover:bg-surface-low border ghost-border flex items-center justify-center transition-all bg-surface-low border ghost-border"
              >
                <Plus className="w-5 h-5 text-muted" />
              </button>
            )}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {previews.length === 0 ? (
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
                : "ghost-border bg-surface-low border ghost-border hover:ghost-border hover:bg-surface-low border ghost-border"
              }
            `}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? "bg-accent/20" : "bg-surface-low border ghost-border"} border ghost-border`}>
              {isDragging ? <ImageIcon className="w-5 h-5 text-accent" /> : <Upload className="w-5 h-5 text-muted" />}
            </div>
            <div className="text-center">
              <p className="text-muted text-sm font-medium">Upload Wardrobe Photos</p>
              <p className="text-muted text-xs mt-1">Select up to 5 images of your clothes or yourself</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-surface-low border ghost-border border ghost-border px-4 py-3 rounded-2xl"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-muted text-xs font-medium">{previews.length} item(s) ready for analysis</span>
            </div>
            <button onClick={handleClear} className="text-muted hover:text-muted text-[10px] uppercase tracking-widest font-bold transition-colors">Clear All</button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
