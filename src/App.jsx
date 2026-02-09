import { useRef } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { BannerGrid } from './components/Canvas/BannerGrid';
import { useBannerState } from './hooks/useBannerState';

function App() {
  const { banner, updateSize, updateContent, updateStyle, updateImage, setBannerState } = useBannerState();
  const bannerGridRef = useRef(null);
  const containerRef = useRef(null);

  /* handleBatchDownload removed - button now internal to BannerGrid */

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <aside style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-bg-panel)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        <Sidebar
          banner={banner}
          setBannerState={setBannerState}
          updateSize={updateSize}
          updateContent={updateContent}
          updateStyle={updateStyle}
          updateImage={updateImage}
          onSave={() => bannerGridRef.current?.downloadAll()}
        />
      </aside>

      <main
        ref={containerRef}
        style={{
          flex: 1,
          backgroundColor: 'var(--color-bg-main)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <BannerGrid ref={bannerGridRef} banner={banner} />
      </main>
    </div>
  )
}

export default App;
