import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Html } from '@react-three/drei'
import * as THREE from 'three'
import Brain from './Brain'

// Lights component — updates intensity from props
function Lights({ lighting }) {
  const f = lighting / 100
  return (
    <>
      <ambientLight      color={0x112233} intensity={0.9 * f} />
      <directionalLight  color={0xfff5ee} intensity={1.4 * f} position={[4, 9, 5]} castShadow
        shadow-mapSize={[1024,1024]} />
      <directionalLight  color={0x004466} intensity={0.7 * f} position={[-5, 1, -4]} />
      <pointLight        color={0x0088cc} intensity={0.5 * f} distance={18} position={[0, -3, 4]} />
      <pointLight        color={0x00c8ff} intensity={0.18 * f} distance={12} position={[0, 6, 0]} />
    </>
  )
}

// Auto-rotate controller
function AutoRotate({ enabled }) {
  const { camera } = useThree()
  const theta = useRef(0.4)
  const phi   = useRef(1.35)
  const r     = useRef(5.6)

  useFrame(() => {
    if (!enabled) return
    theta.current += 0.0035
    camera.position.set(
      r.current * Math.sin(phi.current) * Math.sin(theta.current),
      r.current * Math.cos(phi.current),
      r.current * Math.sin(phi.current) * Math.cos(theta.current)
    )
    camera.lookAt(0, 0.1, 0)
  })
  return null
}

// Anatomical HTML labels
const LABEL_POSITIONS = [
  { pos: [0.0,  0.6,  1.6], text: 'Frontal Lobe'  },
  { pos: [0.0,  1.3, -0.5], text: 'Parietal Lobe' },
  { pos: [1.8, -0.3,  0.2], text: 'Temporal Lobe' },
  { pos: [0.0,  0.2, -1.8], text: 'Occipital Lobe'},
  { pos: [0.0, -0.9, -1.3], text: 'Cerebellum'    },
  { pos: [0.2, -1.65, 0.0], text: 'Brain Stem'    },
]

function AnatomicalLabels({ visible }) {
  const { camera } = useThree()
  const _dir = new THREE.Vector3()

  if (!visible) return null

  return LABEL_POSITIONS.map(({ pos, text }) => {
    const normal = new THREE.Vector3(...pos).normalize()
    return (
      <Html key={text} position={pos} style={{ pointerEvents:'none' }}>
        <LabelItem text={text} normal={normal} camera={camera} />
      </Html>
    )
  })
}

function LabelItem({ text, normal, camera }) {
  const [opacity, setOpacity] = useState(1)
  const _dir = useRef(new THREE.Vector3())

  useFrame(() => {
    camera.getWorldDirection(_dir.current)
    const dot = normal.dot(_dir.current)
    const op = dot > -0.08 ? 0 : Math.min(1, (-dot - 0.08) / 0.18)
    setOpacity(op)
  })

  return (
    <div style={{
      fontFamily: 'Syne Mono, monospace',
      fontSize: 9, color: 'rgba(0,200,255,0.8)',
      letterSpacing: '.8px', whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', gap: 5,
      opacity, transition: 'opacity 0.1s',
    }}>
      <div style={{
        width:4, height:4, borderRadius:'50%',
        background:'#00c8ff', boxShadow:'0 0 5px #00c8ff'
      }} />
      {text}
    </div>
  )
}

// Scanline overlay
const scanlineStyle = {
  position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
  background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,.013) 3px,rgba(0,200,255,.013) 4px)',
}

// Corner bracket helper
function Corner({ style }) {
  return (
    <div style={{ position:'absolute', width:22, height:22, zIndex:2, pointerEvents:'none', ...style }}>
      <div style={{ position:'absolute', width:'100%', height:1, background:'rgba(0,200,255,.5)', top:0, left:0 }} />
      <div style={{ position:'absolute', width:1, height:'100%', background:'rgba(0,200,255,.5)', top:0, left:0 }} />
    </div>
  )
}
function CornerBR({ style }) {
  return (
    <div style={{ position:'absolute', width:22, height:22, zIndex:2, pointerEvents:'none', ...style }}>
      <div style={{ position:'absolute', width:'100%', height:1, background:'rgba(0,200,255,.5)', bottom:0, right:0 }} />
      <div style={{ position:'absolute', width:1, height:'100%', background:'rgba(0,200,255,.5)', bottom:0, right:0 }} />
    </div>
  )
}

export default function Viewer(props) {
  const { mode, clipOn, clipVal, opacity, lighting, autoRot, showLabels, showGrid, region } = props

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 40% 35%, #071828 0%, #040810 70%)',
    }}>
      {/* Scan-line overlay */}
      <div style={scanlineStyle} />

      {/* Corner brackets */}
      <Corner style={{ top:14, left:14 }} />
      <div style={{ position:'absolute', top:14, right:14, width:22, height:22, zIndex:2, pointerEvents:'none' }}>
        <div style={{ position:'absolute', width:'100%', height:1, background:'rgba(0,200,255,.5)', top:0, right:0 }} />
        <div style={{ position:'absolute', width:1, height:'100%', background:'rgba(0,200,255,.5)', top:0, right:0 }} />
      </div>
      <CornerBR style={{ bottom:14, left:14 }} />
      <CornerBR style={{ bottom:14, right:14 }} />

      {/* Scale bar */}
      <div style={{
        position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)',
        zIndex:4, pointerEvents:'none', display:'flex', flexDirection:'column',
        alignItems:'center', gap:3,
      }}>
        <span style={{ fontFamily:'Syne Mono,monospace', fontSize:9, color:'rgba(0,200,255,.55)', letterSpacing:'1px' }}>10 mm</span>
        <div style={{ width:80, height:2, background:'rgba(0,200,255,.55)', position:'relative' }}>
          <div style={{ position:'absolute', width:1, height:7, background:'rgba(0,200,255,.55)', bottom:0, left:0 }} />
          <div style={{ position:'absolute', width:1, height:7, background:'rgba(0,200,255,.55)', bottom:0, right:0 }} />
        </div>
      </div>

      {/* R3F Canvas */}
      <Canvas
        gl={{ antialias: true, localClippingEnabled: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
        shadows
        camera={{ fov: 44, near: 0.05, far: 100, position: [2.2, 1.8, 4.4] }}
        style={{ position:'absolute', inset:0 }}
      >
        <fog attach="fog" args={['#040810', 0, 28]} />

        <Lights lighting={lighting} />
        {autoRot && <AutoRotate enabled={autoRot} />}

        <Brain
          mode={mode} clipOn={clipOn} clipVal={clipVal}
          opacity={opacity} region={region}
        />

        {showGrid && (
          <Grid
            position={[0, -1.9, 0]}
            args={[8, 8]}
            cellSize={0.36}
            cellThickness={0.5}
            cellColor="#002233"
            sectionSize={1.8}
            sectionThickness={0.8}
            sectionColor="#001520"
            fadeDistance={14}
            infiniteGrid
          />
        )}

        <AnatomicalLabels visible={showLabels} />

        {!autoRot && (
          <OrbitControls
            enablePan={false}
            minDistance={2.4}
            maxDistance={13}
            target={[0, 0.1, 0]}
          />
        )}
      </Canvas>
    </div>
  )
}
