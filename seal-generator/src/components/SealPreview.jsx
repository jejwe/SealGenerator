import React, { useEffect } from 'react'; // Removed own useRef
import { drawSeal } from '../utils/sealGenerator';

// Accept canvasRef as a prop
const SealPreview = ({ sealConfig, canvasRef }) => { 

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) { // Check the passed ref
      console.error("Canvas element not found or ref not passed");
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get 2D context");
      return;
    }

    canvas.width = sealConfig.sealSize;
    canvas.height = sealConfig.sealSize;

    const center = sealConfig.sealSize / 2;
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(sealConfig.rotation * (Math.PI / 180));
    ctx.translate(-center, -center);

    drawSeal(ctx, sealConfig);

    ctx.restore();

  }, [sealConfig, canvasRef]); // Add canvasRef to dependencies

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">印章预览 (Seal Preview)</h3>
      <div 
        className="border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 flex items-center justify-center"
        style={{ 
          width: `${sealConfig.sealSize + (sealConfig.margin || 0) * 2}px`, 
          height: `${sealConfig.sealSize + (sealConfig.margin || 0) * 2}px`,
          padding: `${sealConfig.margin || 0}px`
        }}
      >
        {/* Use the passed canvasRef here */}
        <canvas ref={canvasRef} />
      </div>
      <div className="text-xs text-gray-500 mt-2">
        <p>Size: {sealConfig.sealSize}px, Margin: {sealConfig.margin || 0}px, Rotation: {sealConfig.rotation}°</p>
        <p>Color: <span style={{color: sealConfig.color}}>{sealConfig.color}</span>, Opacity: {sealConfig.opacity}</p>
        {sealConfig.centerMark !== 'none' && <p>Center Mark: {sealConfig.centerMark}</p>}
      </div>
    </div>
  );
};

export default SealPreview;
