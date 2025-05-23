import { useState, useRef, useEffect } from 'react'; // Added useEffect
import './App.css';
import SealForm from './components/SealForm';
import SealPreview from './components/SealPreview';
import { generateSealSvg } from './utils/sealGenerator'; 

const LOCAL_STORAGE_KEY = 'userSealTemplate';

function App() {
  const [sealConfig, setSealConfig] = useState({
    companyName: '示例公司名称',
    sealName: '专用章',
    code: '1234567890',
    font: 'SimSun',
    fontSize: 24,
    fontHeight: 150,
    characterSpacing: 10,
    ringPadding: 3,
    borderWidth: 8,
    centerMark: 'star',
    signScale: 100,
    sealSize: 160,
    margin: 0,
    rotation: 0,
    color: '#FF0000',
    ringAntiCounterfeiting: false,
    noWhiteBackground: false,
    opacity: 100,
    effect: 'none',
  });

  const canvasRef = useRef(null);

  // Load template from localStorage on initial mount
  useEffect(() => {
    const savedTemplate = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTemplate) {
      try {
        const parsedTemplate = JSON.parse(savedTemplate);
        setSealConfig(parsedTemplate);
        console.log('Template loaded from localStorage.');
      } catch (error) {
        console.error('Error parsing saved template:', error);
      }
    }
  }, []);


  const handleSealConfigChange = (key, value) => {
    setSealConfig(prevConfig => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  const handleSaveAsPng = () => {
    if (!canvasRef.current) {
      console.error('Canvas reference is not set.');
      alert('错误：找不到画布。 (Error: Canvas not found.)');
      return;
    }
    const canvas = canvasRef.current;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${sealConfig.companyName || 'seal'}_${sealConfig.sealName || 'image'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error saving PNG:', error);
      alert('保存图片时出错。请查看控制台了解详情。 (Error saving image. See console for details.)');
    }
  };
  
  const handleSaveAsSvg = () => {
    try {
      const svgString = generateSealSvg(sealConfig);
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
      const link = document.createElement('a');
      link.href = svgDataUrl;
      link.download = `${sealConfig.companyName || 'seal'}_${sealConfig.sealName || 'image'}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error saving SVG:', error);
      alert('保存SVG时出错。请查看控制台了解详情。 (Error saving SVG. See console for details.)');
    }
  };

  const handleSaveTemplate = () => {
    try {
      const jsonConfig = JSON.stringify(sealConfig);
      localStorage.setItem(LOCAL_STORAGE_KEY, jsonConfig);
      alert('模板已保存！ (Template saved!)');
    } catch (error) {
      console.error('Error saving template to localStorage:', error);
      alert('保存模板失败。 (Failed to save template.)');
    }
  };

  const handleLoadTemplate = () => {
    const savedTemplate = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTemplate) {
      try {
        const parsedTemplate = JSON.parse(savedTemplate);
        setSealConfig(parsedTemplate);
        alert('模板已加载！ (Template loaded!)');
      } catch (error) {
        console.error('Error loading template from localStorage:', error);
        alert('加载模板失败。保存的模板可能已损坏。 (Failed to load template. Saved template might be corrupted.)');
      }
    } else {
      alert('未找到已保存的模板。 (No saved template found.)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">电子印章生成器 (Seal Generator)</h1>
      </header>

      {/* Responsive main content area: flex column on small, row on medium+ */}
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* SealForm container: takes more space on larger screens */}
        <div className="md:w-2/3 lg:w-3/4 bg-white p-6 rounded-lg shadow-lg order-2 md:order-1">
          <SealForm
            sealConfig={sealConfig}
            onConfigChange={handleSealConfigChange}
            onSaveAsPng={handleSaveAsPng}
            onSaveAsSvg={handleSaveAsSvg} 
            onSaveTemplate={handleSaveTemplate} // Pass save template function
            onLoadTemplate={handleLoadTemplate} // Pass load template function
          />
        </div>
        {/* SealPreview container: takes less space, centered */}
        <div className="md:w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center order-1 md:order-2">
          <SealPreview sealConfig={sealConfig} canvasRef={canvasRef} /> 
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Seal Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
