
import React from 'react';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  onImageSelect: (base64: string, mimeType: string) => void;
  icon: React.ReactNode;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageSelect, icon }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
        const base64 = result.split(',')[1];
        onImageSelect(base64, mimeType);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={`h-48 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
          image ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
        }`}>
          {image ? (
            <img 
              src={`data:image/png;base64,${image}`} 
              alt={label} 
              className="h-full w-full object-contain rounded-xl p-2"
            />
          ) : (
            <>
              <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
                {icon}
              </div>
              <p className="mt-2 text-xs text-slate-500 group-hover:text-slate-400">Tải ảnh lên</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
