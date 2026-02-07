import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Lights from "./Components/Lights"
import Experience from "./Components/Experience"


const App = () => {
  return (
    <>
      <Canvas>
        <color attach="background" args={['#cccccc']} />
        <OrbitControls />
        <Lights />
        <Experience />
      </Canvas >
    </>
  )
}

export default App
