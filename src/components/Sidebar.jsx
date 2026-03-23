import React from 'react'

const S = {
  aside: {
    background: 'var(--panel)',
    borderRight: '1px solid var(--border)',
    padding: '18px 14px',
    overflowY: 'auto',
    backdropFilter: 'blur(12px)',
    zIndex: 5,
  },
  secTitle: {
    fontFamily: 'Syne Mono,monospace',
    fontSize: 9, textTransform: 'uppercase',
    letterSpacing: '2.5px', color: 'var(--textD)',
    marginBottom: 11, paddingBottom: 6,
    borderBottom: '1px solid var(--border)',
  },
  sec: { marginBottom: 22 },
}

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      width:34, height:17,
      background: on ? 'rgba(0,200,255,.22)' : 'rgba(0,200,255,.1)',
      border: `1px solid ${on ? 'var(--cyan)' : 'var(--border)'}`,
      borderRadius:9, position:'relative', cursor:'pointer', transition:'all .2s', flexShrink:0,
    }}>
      <div style={{
        width:11, height:11, borderRadius:'50%',
        background: on ? 'var(--cyan)' : 'var(--textD)',
        boxShadow: on ? '0 0 5px var(--cyan)' : 'none',
        position:'absolute', top:2,
        left: on ? 19 : 2, transition:'all .2s',
      }} />
    </div>
  )
}

function SliderRow({ label, value, min, max, unit='%', onChange }) {
  return (
    <div style={{ marginBottom:13 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--textD)', marginBottom:5 }}>
        <span>{label}</span>
        <span style={{ fontFamily:'Syne Mono,monospace', color:'var(--cyan)' }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))} />
    </div>
  )
}

const MODES   = ['solid','wire','xray']
const REGIONS = [
  { label:'Frontal Lobe',  color:'#ff7b7b', idx:0 },
  { label:'Parietal Lobe', color:'#ffe07b', idx:1 },
  { label:'Temporal Lobe', color:'#7bcfff', idx:2 },
  { label:'Occipital Lobe',color:'#9effb8', idx:3 },
  { label:'Cerebellum',    color:'#c07bff', idx:4 },
  { label:'Full Brain',    color:'#c49a8a', idx:-1 },
]

const STATS = [
  ['Volume','1247','cm³'],['Surface','1820','cm²'],
  ['Gray Matter','687','cm³'],['Ctx Thickness','2.4','mm'],
]

export default function Sidebar(props) {
  const {
    mode, setMode, clipOn, setClipOn, clipVal, setClipVal,
    opacity, setOpacity, lighting, setLighting,
    autoRot, setAutoRot, showLabels, setShowLabels,
    showGrid, setShowGrid, region, setRegion,
  } = props

  return (
    <aside style={S.aside}>

      {/* Render Mode */}
      <div style={S.sec}>
        <div style={S.secTitle}>Render Mode</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:5 }}>
          {MODES.map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              background: mode===m ? 'rgba(0,200,255,.07)' : 'transparent',
              border: `1px solid ${mode===m ? 'var(--cyan)' : 'var(--border)'}`,
              color: mode===m ? 'var(--cyan)' : 'var(--textD)',
              padding:'7px 2px', borderRadius:3,
              fontFamily:'Outfit,sans-serif', fontSize:11, cursor:'pointer',
              textTransform:'capitalize', transition:'all .18s',
            }}>{m}</button>
          ))}
        </div>
      </div>

      {/* Cross-Section */}
      <div style={S.sec}>
        <div style={S.secTitle}>Cross-Section</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <span style={{ fontSize:11, color:'var(--textD)' }}>Clipping Plane</span>
          <Toggle on={clipOn} onToggle={() => setClipOn(v => !v)} />
        </div>
        <SliderRow label="Coronal Position" value={clipVal} min={-100} max={100} unit=" %"
          onChange={v => { setClipVal(v); setClipOn(true) }} />
      </div>

      {/* Display */}
      <div style={S.sec}>
        <div style={S.secTitle}>Display</div>
        <SliderRow label="Opacity"           value={opacity}  min={10} max={100} onChange={setOpacity} />
        <SliderRow label="Lighting Intensity" value={lighting} min={20} max={200} onChange={setLighting} />
        {[
          ['Auto-Rotate', autoRot,    setAutoRot],
          ['Labels',      showLabels, setShowLabels],
          ['Reference Grid', showGrid, setShowGrid],
        ].map(([label, val, setter]) => (
          <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <span style={{ fontSize:11, color:'var(--textD)' }}>{label}</span>
            <Toggle on={val} onToggle={() => setter(v => !v)} />
          </div>
        ))}
      </div>

      {/* Anatomical Regions */}
      <div style={S.sec}>
        <div style={S.secTitle}>Anatomical Regions</div>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {REGIONS.map(({ label, color, idx }) => (
            <div key={label} onClick={() => setRegion(idx)} style={{
              display:'flex', alignItems:'center', gap:8, fontSize:11,
              cursor:'pointer', padding:'5px 6px', borderRadius:3,
              border: `1px solid ${region===idx ? 'var(--borderB)' : 'transparent'}`,
              background: region===idx ? 'rgba(0,200,255,.06)' : 'transparent',
              transition:'all .15s',
            }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:color, flexShrink:0 }} />
              <span style={{ color: region===idx ? 'var(--text)' : 'var(--textD)', transition:'color .15s' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Volumetrics */}
      <div style={S.sec}>
        <div style={S.secTitle}>Volumetrics</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
          {STATS.map(([label, val, unit]) => (
            <div key={label} style={{
              background:'rgba(0,200,255,.03)', border:'1px solid var(--border)',
              borderRadius:4, padding:'9px 10px',
            }}>
              <div style={{ fontSize:9, fontFamily:'Syne Mono,monospace', textTransform:'uppercase', letterSpacing:'1px', color:'var(--textD)' }}>{label}</div>
              <div style={{ fontFamily:'Syne Mono,monospace', fontSize:17, color:'var(--cyan)', marginTop:3 }}>
                {val}<span style={{ fontSize:9, color:'var(--textD)' }}> {unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  )
}
