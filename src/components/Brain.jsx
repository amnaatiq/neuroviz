import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural cortical surface via sphere vertex displacement
function makeBrainGeo(segments = 128) {
  const geo = new THREE.SphereGeometry(1.52, segments, segments)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const len = Math.sqrt(x*x + y*y + z*z)
    const nx = x/len, ny = y/len, nz = z/len
    // Multi-frequency gyri / sulci
    let d = 0
    d += 0.090 * Math.sin(6.8*nx + 2.4)  * Math.cos(6.8*ny + 1.2)
    d += 0.072 * Math.sin(10.5*ny + 3.8) * Math.cos(10.5*nz + 0.8)
    d += 0.055 * Math.sin(14.0*nz + 1.3) * Math.cos(14.0*nx + 4.0)
    d += 0.042 * Math.sin(4.5*nx*ny+2.1) * Math.cos(4.5*ny*nz+0.9)
    d += 0.028 * Math.cos(18.0*nx + ny*1.8 + 0.6)
    d += 0.018 * Math.sin(22.0*ny*nz + 3.1)
    d += 0.012 * Math.cos(28.0*nz*nx + 1.7)
    let r = len + d
    r += 0.06 * (nx * nx - 0.33)
    if (ny < -0.38) r *= 0.82 + 0.06*Math.abs(nz)
    if (ny >  0.82) r *= 0.94
    // Interhemispheric fissure
    const fissW = Math.exp(-nz*nz * 60)
    if (ny > -0.1) r *= 1 - 0.055 * fissW
    // Sylvian fissure
    const sylH = Math.exp(-(ny + 0.06)*(ny + 0.06) * 28)
    const sylX = Math.exp(-(Math.abs(nx) - 0.72)*(Math.abs(nx) - 0.72) * 18)
    r *= 1 - 0.048 * sylH * sylX
    pos.setXYZ(i, nx*r, ny*r, nz*r)
  }
  geo.computeVertexNormals()
  return geo
}

function makeCerebGeo() {
  const g = new THREE.SphereGeometry(0.68, 64, 64)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const l = Math.sqrt(x*x+y*y+z*z)
    const nx=x/l, ny=y/l, nz=z/l
    let r = l
    r += 0.06 * Math.sin(18*ny + 1.2)
    r += 0.03 * Math.sin(26*nx*nz + 0.7)
    p.setXYZ(i, nx*r, ny*r, nz*r)
  }
  g.computeVertexNormals()
  return g
}

const REGION_COLORS = {
  0: '#ff7b7b', 1: '#ffe07b', 2: '#7bcfff',
  3: '#9effb8', 4: '#c07bff', '-1': '#c49a8a',
}

export default function Brain({ mode, clipOn, clipVal, opacity, region }) {
  const brainRef  = useRef()
  const innerRef  = useRef()
  const cerebRef  = useRef()
  const stemRef   = useRef()

  const brainGeo  = useMemo(() => makeBrainGeo(), [])
  const cerebGeo  = useMemo(() => makeCerebGeo(), [])
  const stemGeo   = useMemo(() => new THREE.CylinderGeometry(0.18, 0.23, 0.95, 14), [])

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])

  // Update clip plane constant from slider value
  clipPlane.constant = (clipVal / 100) * 1.9

  const planes    = clipOn ? [clipPlane] : []
  const op        = opacity / 100
  const isXray    = mode === 'xray'
  const isWire    = mode === 'wire'

  const brainColor  = REGION_COLORS[String(region)] ?? '#c49a8a'
  const cerebColor  = region === 4 ? REGION_COLORS[4] : (isWire ? '#0099cc' : '#b58878')
  const stemColor   = isWire ? '#0077aa' : '#a87868'
  const brainCol    = isWire ? '#00c8ff' : isXray ? '#88ddff' : brainColor

  const matProps = (col) => ({
    color: col,
    transparent: isXray || op < 1,
    opacity: isXray ? 0.22 : op,
    blending: isXray ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: !isXray,
    wireframe: isWire,
    clippingPlanes: planes,
    side: THREE.FrontSide,
  })

  return (
    <group>
      {/* Outer brain */}
      <mesh ref={brainRef} geometry={brainGeo} castShadow>
        <meshPhongMaterial {...matProps(brainCol)}
          specular={new THREE.Color(0x2a1010)} shininess={28} />
      </mesh>

      {/* Inner cut face */}
      {clipOn && (
        <mesh ref={innerRef} geometry={brainGeo} scale={[0.978,0.978,0.978]}>
          <meshPhongMaterial
            color="#e2c4b0" side={THREE.BackSide}
            clippingPlanes={planes}
            specular={new THREE.Color(0x110808)} shininess={8} />
        </mesh>
      )}

      {/* Cerebellum */}
      <mesh ref={cerebRef} geometry={cerebGeo} castShadow
        position={[0, -1.02, -0.88]} scale={[1.28, 0.68, 0.82]}>
        <meshPhongMaterial {...matProps(cerebColor)}
          specular={new THREE.Color(0x1a0808)} shininess={20} />
      </mesh>

      {/* Brain stem */}
      <mesh ref={stemRef} geometry={stemGeo} castShadow
        position={[0, -1.65, -0.22]} rotation={[0, 0, 0.08]}>
        <meshPhongMaterial {...matProps(stemColor)}
          specular={new THREE.Color(0x110808)} shininess={14} />
      </mesh>
    </group>
  )
}
