import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import vertexShader from './Shaders/FBO/vert.glsl?raw'
import fragmentShader from './Shaders/FBO/frag.glsl?raw'
import useMouse from '../Hooks/useMouse'


const Experience = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { gl, camera } = useThree()
  const mouse = useMouse()
  const mousePos: THREE.Vector2 = useMemo(() => {
    return new THREE.Vector2(0, 0)
  }, [])
  const intersectionUV: THREE.Vector2 = useMemo(() => {
    return new THREE.Vector2(0, 0)
  }, [])
  const raycaster = new THREE.Raycaster()

  const fbo = useRef<{
    scene: THREE.Scene,
    camera: THREE.Camera,
    material: THREE.ShaderMaterial,
    target1: THREE.WebGLRenderTarget,
    target2: THREE.WebGLRenderTarget
  } | null>(null)

  if (fbo.current === null) {
    const target1 = new THREE.WebGLRenderTarget(1024, 1024)
    const target2 = target1.clone()

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevTexture: { value: null },
        uResolution: { value: new THREE.Vector2(target1.height, target1.width) }
      }
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(quad)
    fbo.current = { scene, camera, material, target1, target2 }
  }

  useFrame(() => {
    if (!fbo.current) return

    if (raycaster) {
      raycaster.setFromCamera(mousePos.set(mouse.current.x, mouse.current.y), camera)
      const intersects = raycaster.intersectObject(meshRef.current)
      if (intersects.length > 0 && intersects[0].uv) {
        intersectionUV.set(intersects[0]?.uv.x, intersects[0]?.uv.y)
        fbo.current.material.uniforms.uMousePos.value = intersectionUV
      }
    }

    if (!meshRef.current) return
    fbo.current.material.uniforms.uPrevTexture.value = fbo.current.target2.texture
    gl.setRenderTarget(fbo.current.target1)
    gl.render(fbo.current.scene, fbo.current.camera)


    const temp = fbo.current.target1
    fbo.current.target1 = fbo.current.target2
    fbo.current.target2 = temp

    gl.setRenderTarget(null)
    const material = meshRef.current.material as THREE.MeshBasicMaterial
    material.map = fbo.current.target1.texture
  })


  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

export default Experience
