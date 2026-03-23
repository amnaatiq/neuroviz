import React, { useState } from 'react'
import Viewer from './components/Viewer'
import Sidebar from './components/Sidebar'

export default function App() {
  const [mode, setMode]           = useState('solid')
  const [clipOn, setClipOn]       = useState(false)
  const [clipVal, setClipVal]     = useState(0)
  const [opacity, setOpacity]     = useState(100)
  const [lighting, setLighting]   = useState(100)
  const [autoRot, setAutoRot]     = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showGrid, setShowGrid]   = useState(true)
  const [region, setRegion]       = useState(-1)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '274px 1fr',
      gridTemplateRows: '54px 1fr 38px',
      height: '100vh',
      background: 'var(--bg)'
    }}>
      {/* HEADER */}
      <header style={{
        gridColumn: '1/-1',
        background: 'var(--panel)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 22px', gap: '18px',
        backdropFilter: 'blur(12px)', zIndex: 10,
      }}>
        <div>
          <div style={{ fontFamily:'Syne Mono,monospace', fontSize:17, color:'var(--cyan)', letterSpacing:3 }}>
            NEUROVIZ
          </div>
          <div style={{ fontFamily:'Syne Mono,monospace', fontSize:9, color:'var(--textD)', letterSpacing:2 }}>
            Surgical Planning System · v2.1
          </div>
        </div>
        <div style={{ width:1, height:28, background:'var(--border)', margin:'0 4px' }} />
        {[
          ['Patient ID','PT-2024-0847'],
          ['Modality','MRI T1-w'],
          ['Resolution','1.0mm ISO'],
          ['Study Date','2024-03-18'],
        ].map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize:9, fontFamily:'Syne Mono,monospace', textTransform:'uppercase', letterSpacing:'1.2px', color:'var(--textD)' }}>{label}</div>
            <div style={{ fontSize:12, color:'var(--text)', marginTop:1 }}>{val}</div>
          </div>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:7, height:7, borderRadius:'50%', background:'var(--green)',
            boxShadow:'0 0 8px var(--green)',
            animation:'blink 2.4s ease-in-out infinite'
          }} />
          <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
          <span style={{ fontFamily:'Syne Mono,monospace', fontSize:10, color:'var(--green)', letterSpacing:'1.5px' }}>
            SYSTEM READY
          </span>
        </div>
      </header>

      {/* SIDEBAR */}
      <Sidebar
        mode={mode}         setMode={setMode}
        clipOn={clipOn}     setClipOn={setClipOn}
        clipVal={clipVal}   setClipVal={setClipVal}
        opacity={opacity}   setOpacity={setOpacity}
        lighting={lighting} setLighting={setLighting}
        autoRot={autoRot}   setAutoRot={setAutoRot}
        showLabels={showLabels} setShowLabels={setShowLabels}
        showGrid={showGrid} setShowGrid={setShowGrid}
        region={region}     setRegion={setRegion}
      />

      {/* 3D VIEWER */}
      <Viewer
        mode={mode}
        clipOn={clipOn}
        clipVal={clipVal}
        opacity={opacity}
        lighting={lighting}
        autoRot={autoRot}
        showLabels={showLabels}
        showGrid={showGrid}
        region={region}
      />

      {/* FOOTER */}
      <footer style={{
        gridColumn:'1/-1',
        background:'var(--panel)',
        borderTop:'1px solid var(--border)',
        display:'flex', alignItems:'center',
        padding:'0 18px', gap:20,
        fontFamily:'Syne Mono,monospace', fontSize:9, color:'var(--textD)',
        letterSpacing:'.6px', backdropFilter:'blur(12px)', zIndex:10,
      }}>
        <span>VOXELS: 256×256×180</span>
        <span style={{color:'var(--border)'}}>|</span>
        <span>THREE.JS · REACT THREE FIBER · WebGL 2.0</span>
        <span style={{color:'var(--border)'}}>|</span>
        <span>MODE: {mode.toUpperCase()}</span>
      </footer>
    </div>
  )
}
