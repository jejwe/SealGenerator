import React from 'react';

// Add onSaveTemplate and onLoadTemplate to props
const SealForm = ({ sealConfig, onConfigChange, onSaveAsPng, onSaveAsSvg, onSaveTemplate, onLoadTemplate }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'number' || e.target.dataset.type === 'number') {
      processedValue = parseFloat(value);
      if (isNaN(processedValue)) {
        processedValue = 0; 
      }
    }
    onConfigChange(name, processedValue);
  };

  const genericOptions = (start, end, step = 1, suffix = '', precision = 0) =>
    Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => {
      const val = start + i * step;
      return { value: val.toFixed(precision), label: `${val.toFixed(precision)}${suffix}` };
    });
  
  const fontOptions = [
    { value: 'SimSun', label: '宋体 (SimSun)' },
    { value: 'Heiti', label: '黑体 (Heiti)' },
    { value: 'KaiTi', label: '楷体 (KaiTi)' },
    { value: 'FangSong', label: '仿宋 (FangSong)' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' },
  ];

  return (
    <form className="space-y-4 md:space-y-6"> {/* Adjusted spacing for responsiveness */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">印章参数配置</h2>
      </div>

      {/* Using sm:grid-cols-1, md:grid-cols-2, lg:grid-cols-3 for better responsiveness */}
      {/* Row 1: Company Name, Seal Name, Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">公司 (Company Name)</label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            value={sealConfig.companyName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="sealName" className="block text-sm font-medium text-gray-700">章名 (Seal Name)</label>
          <input
            type="text"
            name="sealName"
            id="sealName"
            value={sealConfig.sealName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">编码 (Code)</label>
          <input
            type="text"
            name="code"
            id="code"
            value={sealConfig.code}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Row 2: Font, Font Size (px), Font Height (%) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="font" className="block text-sm font-medium text-gray-700">字体 (Font)</label>
          <select
            name="font"
            id="font"
            value={sealConfig.font}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {fontOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">字号 (Font Size)</label>
          <select
            name="fontSize"
            id="fontSize"
            value={sealConfig.fontSize}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {genericOptions(10, 72, 2, 'px').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fontHeight" className="block text-sm font-medium text-gray-700">字高 (Font Height %)</label>
          <select
            name="fontHeight"
            id="fontHeight"
            value={sealConfig.fontHeight}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {genericOptions(50, 200, 5, '%').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      {/* Row 3: Character Spacing (unit), Ring Padding (px), Border Width (px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="characterSpacing" className="block text-sm font-medium text-gray-700">字间距 (Character Spacing)</label>
          <select
            name="characterSpacing"
            id="characterSpacing"
            value={sealConfig.characterSpacing}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {genericOptions(-20, 50, 2).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ringPadding" className="block text-sm font-medium text-gray-700">环边距 (Ring Padding)</label>
          <select
            name="ringPadding"
            id="ringPadding"
            value={sealConfig.ringPadding}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {genericOptions(0, 30, 1, 'px').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="borderWidth" className="block text-sm font-medium text-gray-700">边框线宽 (Border Width)</label>
          <select
            name="borderWidth"
            id="borderWidth"
            value={sealConfig.borderWidth}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {genericOptions(1, 20, 1, 'px').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      
      {/* Row 4: Center Mark, Sign Scale (Conditional), Seal Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="centerMark" className="block text-sm font-medium text-gray-700">中心标志 (Center Mark)</label>
          <select
            name="centerMark"
            id="centerMark"
            value={sealConfig.centerMark}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="none">无 (None)</option>
            <option value="star">★ (五角星)</option>
            <option value="party">党徽 (Party Emblem - Placeholder)</option>
          </select>
        </div>
        {sealConfig.centerMark !== 'none' && (
          <div>
            <label htmlFor="signScale" className="block text-sm font-medium text-gray-700">标志缩放 (Sign Scale %)</label>
            <select
              name="signScale"
              id="signScale"
              value={sealConfig.signScale}
              onChange={handleChange}
              data-type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {genericOptions(10, 200, 5, '%').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        )}
         <div className={sealConfig.centerMark === 'none' ? 'sm:col-span-2 lg:col-span-1' : ''}> {/* Adjust span if signScale is hidden */}
          <label htmlFor="sealSize" className="block text-sm font-medium text-gray-700">印章大小 (Seal Size)</label>
          <select
            name="sealSize"
            id="sealSize"
            value={sealConfig.sealSize}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {[100, 120, 150, 160, 180, 200, 220, 250, 300].map(s => ({ value: s, label: `${s}px` })).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      {/* Row 5: Margin, Rotation, Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="margin" className="block text-sm font-medium text-gray-700">外边距 (Margin)</label>
          <select
            name="margin"
            id="margin"
            value={sealConfig.margin}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {genericOptions(0, 50, 5, 'px').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="rotation" className="block text-sm font-medium text-gray-700">旋转 (Rotation °)</label>
          <select
            name="rotation"
            id="rotation"
            value={sealConfig.rotation}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {genericOptions(0, 359, 15, '°').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">颜色 (Color)</label>
          <input
            type="color"
            name="color"
            id="color"
            value={sealConfig.color}
            onChange={handleChange}
            className="mt-1 block w-full h-10 px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Row 6: Checkboxes, Opacity, Effect - Adjusted grid for better wrapping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div className="flex items-center space-x-2 pt-2 sm:pt-5"> {/* Reduced padding on small screens */}
          <input
            id="ringAntiCounterfeiting"
            name="ringAntiCounterfeiting"
            type="checkbox"
            checked={sealConfig.ringAntiCounterfeiting}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="ringAntiCounterfeiting" className="text-sm font-medium text-gray-700">外环防伪</label>
        </div>
        <div className="flex items-center space-x-2 pt-2 sm:pt-5">
          <input
            id="noWhiteBackground"
            name="noWhiteBackground"
            type="checkbox"
            checked={sealConfig.noWhiteBackground}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="noWhiteBackground" className="text-sm font-medium text-gray-700">无白底</label>
        </div>
        <div>
          <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">透明度 (Opacity %)</label>
          <select
            name="opacity"
            id="opacity"
            value={sealConfig.opacity}
            onChange={handleChange}
            data-type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {genericOptions(0, 100, 10, '%').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="effect" className="block text-sm font-medium text-gray-700">模拟仿真 (Effect)</label>
          <select
            name="effect"
            id="effect"
            value={sealConfig.effect}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="none">无效果 (None)</option>
            <option value="aging">做旧 (Aging - Placeholder)</option>
            <option value="inkSpread">印泥扩散 (Ink Spread - Placeholder)</option>
          </select>
        </div>
      </div>

      {/* Row 7: Action Buttons - Flex wrap for smaller screens */}
      <div className="flex flex-wrap justify-start gap-3 pt-4"> {/* Changed to gap-3 for spacing */}
        <button
          type="button"
          onClick={onSaveTemplate}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          保存模板 (Save Template)
        </button>
        <button
          type="button"
          onClick={onLoadTemplate}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          加载模板 (Load Template)
        </button>
        <button
          type="button"
          onClick={onSaveAsPng}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          保存 PNG (Save PNG)
        </button>
        <button
          type="button"
          onClick={onSaveAsSvg}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          保存 SVG (Save SVG)
        </button>
         {/* "Download Font" button can be removed if not planned, or kept as placeholder */}
         {/* <button
          type="button"
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          下载字体 (Download Font - Placeholder)
        </button> */}
      </div>
    </form>
  );
};

export default SealForm;
