
import React, { useState } from 'react';
import { AppTheme, GenerationState, ImageData } from './types';
import ImageUploader from './components/ImageUploader';
import { generateScene } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GenerationState>({
    pedestalImage: null,
    productImage: null,
    resultImage: null,
    isGenerating: false,
    error: null,
    theme: AppTheme.TV_SHELF_SIDE,
    addFlowers: false,
    includePerson: false
  });

  const [pedestalData, setPedestalData] = useState<ImageData | null>(null);
  const [productData, setProductData] = useState<ImageData | null>(null);

  const handleGenerate = async () => {
    if (!pedestalData || !productData) {
      setState(prev => ({ ...prev, error: "Vui lòng tải lên cả ảnh đôn gỗ và sản phẩm." }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, resultImage: null }));

    try {
      const result = await generateScene(
        pedestalData, 
        productData, 
        state.theme as AppTheme,
        state.addFlowers,
        state.includePerson
      );
      setState(prev => ({ ...prev, resultImage: result, isGenerating: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: "Không thể hoàn thành thiết kế. Vui lòng thử lại với ảnh rõ nét hơn." 
      }));
    }
  };

  const handleReset = () => {
    setState({
      pedestalImage: null,
      productImage: null,
      resultImage: null,
      isGenerating: false,
      error: null,
      theme: AppTheme.TV_SHELF_SIDE,
      addFlowers: false,
      includePerson: false
    });
    setPedestalData(null);
    setProductData(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="max-w-4xl w-full text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>Interior AI Decor Engine v2.4</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter gradient-text">ZenStudio</h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Phối cảnh đôn gỗ & sản phẩm **Tỷ Lệ Vàng**. 
          <span className="text-amber-500/80 font-medium"> Tự động cân bằng kích thước, ánh sáng & bóng đổ vật lý.</span>
        </p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6 glass-card p-6 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl sticky top-8">
          <div className="grid grid-cols-2 gap-5">
            <ImageUploader 
              label="1. Ảnh Đôn Gỗ"
              image={state.pedestalImage}
              onImageSelect={(base64, mimeType) => {
                setPedestalData({ data: base64, mimeType });
                setState(prev => ({ ...prev, pedestalImage: base64 }));
              }}
              icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            />
            <ImageUploader 
              label="2. Ảnh Sản Phẩm"
              image={state.productImage}
              onImageSelect={(base64, mimeType) => {
                setProductData({ data: base64, mimeType });
                setState(prev => ({ ...prev, productImage: base64 }));
              }}
              icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0c1 0 1 1 1 1v2l-1 1" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Option: Add Flowers */}
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between group cursor-pointer" onClick={() => setState(prev => ({ ...prev, addFlowers: !prev.addFlowers }))}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${state.addFlowers ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-200">Cắm hoa nghệ thuật</h4>
                  <p className="text-[9px] text-slate-500">Tự động trang trí thêm hoa</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full p-1 transition-colors ${state.addFlowers ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${state.addFlowers ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>

            {/* Option: Include Person */}
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center justify-between group cursor-pointer" onClick={() => setState(prev => ({ ...prev, includePerson: !prev.includePerson }))}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${state.includePerson ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' : 'bg-slate-800 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-200">Xuất hiện con người</h4>
                  <p className="text-[9px] text-slate-500">Tăng tính sống động cho ảnh</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full p-1 transition-colors ${state.includePerson ? 'bg-blue-500' : 'bg-slate-700'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${state.includePerson ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Bố cục không gian</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(AppTheme).map((t) => (
                <button
                  key={t}
                  onClick={() => setState(prev => ({ ...prev, theme: t }))}
                  className={`px-4 py-3 rounded-xl text-[10px] font-bold transition-all duration-300 text-center border ${
                    state.theme === t 
                      ? 'bg-amber-500 border-amber-400 text-white shadow-lg' 
                      : 'bg-slate-800/30 border-slate-800 text-slate-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest">Cân bằng tỷ lệ thông minh</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Hệ thống tự động tính toán đường kính sản phẩm để khớp hoàn hảo với mặt đôn gỗ.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={state.isGenerating || !pedestalData || !productData}
              className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.1em] transition-all duration-500 shadow-2xl ${
                state.isGenerating 
                  ? 'bg-slate-800 text-slate-600 cursor-wait' 
                  : 'bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-white active:scale-95 shadow-amber-900/20'
              }`}
            >
              {state.isGenerating ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                  </div>
                  <span>Đang tính toán tỷ lệ</span>
                </div>
              ) : "Xuất File Thiết Kế (1:1)"}
            </button>
          </div>

          {state.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-bold text-center">
              {state.error}
            </div>
          )}
        </div>

        {/* Right Column: Result */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="glass-card rounded-[3rem] overflow-hidden min-h-[650px] flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-white/5">
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Scale-Balanced Rendering</span>
              </div>
              {state.resultImage && (
                <button 
                  onClick={handleReset}
                  className="group flex items-center space-x-2 text-[10px] font-black text-slate-500 hover:text-amber-500 transition-all uppercase tracking-widest"
                >
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span>Làm mới</span>
                </button>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center relative p-8 bg-[#080c14]">
              {state.isGenerating ? (
                <div className="text-center space-y-8 max-w-xs">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-[6px] border-amber-500/5 rounded-full"></div>
                    <div className="absolute inset-0 border-[6px] border-t-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-[1px] border-white/10 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-black text-white tracking-tighter italic">AI đang xử lý vật lý...</p>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Căn chỉnh sản phẩm khớp với đường kính mặt đôn gỗ và điều chỉnh hướng bóng đổ...
                    </p>
                  </div>
                </div>
              ) : state.resultImage ? (
                <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                  <div className="relative group max-w-full aspect-square w-full">
                    <img 
                      src={state.resultImage} 
                      alt="ZenStudio Design" 
                      className="w-full h-full object-contain rounded-3xl shadow-[0_30px_90px_-15px_rgba(0,0,0,0.9)] border border-white/10"
                    />
                  </div>
                  <div className="mt-8 flex space-x-5">
                    <a 
                      href={state.resultImage} 
                      download="zenstudio-decor.png"
                      className="px-10 py-4 bg-white text-black hover:bg-amber-400 hover:scale-105 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center space-x-3 transition-all shadow-2xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      <span>Tải Ảnh Thiết Kế</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-10 group">
                  <div className="w-24 h-24 bg-slate-900/80 rounded-[2.5rem] border border-white/5 flex items-center justify-center mx-auto mb-8 transform transition-transform group-hover:scale-110">
                    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-200 mb-4 tracking-tighter italic">Preview 1:1 Square</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                    Hệ thống sẽ tự động phóng to/thu nhỏ sản phẩm để đảm bảo tính thẩm mỹ và thực tế so với đôn gỗ.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
