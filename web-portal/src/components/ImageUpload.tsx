import React, { useEffect, useRef } from 'react';

interface Props {
  onUploadSuccess: (url: string) => void;
}

const ImageUpload: React.FC<Props> = ({ onUploadSuccess }) => {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: 'your_cloud_name', // Get this from Cloudinary Dashboard
        uploadPreset: 'your_preset', // Create an "Unsigned" preset in Settings -> Upload
        sources: ['local', 'url', 'camera'],
        multiple: false,
        theme: 'minimal', 
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onUploadSuccess(result.info.secure_url);
        }
      }
    );
  }, []);

  return (
    <button 
      type="button" 
      className="upload-btn" 
      onClick={() => widgetRef.current.open()}
    >
      Upload Image
    </button>
  );
};

export default ImageUpload;