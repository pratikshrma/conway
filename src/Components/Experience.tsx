import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import vertexShader from './Shaders/FBO/vert.glsl?raw'
import fragmentShader from './Shaders/FBO/frag.glsl?raw'
import useMouse from '../Hooks/useMouse'


const Experience = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const ballRef = useRef<THREE.Mesh>(null!)
  const { gl, camera } = useThree()
  const mouse = useMouse()
  const mousePos: THREE.Vector2 = useMemo(() => {
    return new THREE.Vector2(0, 0)
  }, [])
  const intersectionUV: THREE.Vector2 = useMemo(() => {
    return new THREE.Vector2(0, 0)
  }, [])
  const raycaster = new THREE.Raycaster()



  const fbo = useMemo(() => {
    const target1 = new THREE.WebGLRenderTarget(1024, 1024)
    console.log(target1.height, target1.width)
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
    return { scene, camera, material, target1, target2 }
  }, [])

  useFrame(() => {
    if (raycaster) {
      raycaster.setFromCamera(mousePos.set(mouse.current.x, mouse.current.y), camera)
      const intersects = raycaster.intersectObject(meshRef.current)
      if (intersects.length > 0 && intersects[0].uv) {
        intersectionUV.set(intersects[0]?.uv.x, intersects[0]?.uv.y)
        fbo.material.uniforms.uMousePos.value = intersectionUV
        // if (ballRef.current) {
        //   ballRef.current.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
        // }
      }
    }

    if (!meshRef.current) return
    fbo.material.uniforms.uPrevTexture.value = fbo.target2.texture
    gl.setRenderTarget(fbo.target1)
    gl.render(fbo.scene, fbo.camera)


    const temp = fbo.target1
    fbo.target1 = fbo.target2
    fbo.target2 = temp

    gl.setRenderTarget(null)
    meshRef.current.material.map = fbo.target1.texture
  })


  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
      {/* <mesh ref={ballRef}> */}
      {/*   <sphereGeometry args={[0.2]} /> */}
      {/*   <meshStandardMaterial color={'#eeeeee'} /> */}
      {/* </mesh> */}
    </>
  )
}

export default Experience
