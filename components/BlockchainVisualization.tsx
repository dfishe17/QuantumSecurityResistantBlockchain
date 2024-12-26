import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Block {
  index: number
  hash: string
  previous_hash: string
  transactions: any[]
}

interface BlockchainVisualizationProps {
  blocks: Block[]
}

export const BlockchainVisualization: React.FC<BlockchainVisualizationProps> = ({ blocks }) => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(ambientLight)
    scene.add(directionalLight)

    // Create block meshes
    const blockGroup = new THREE.Group()
    blocks.forEach((block, index) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshPhongMaterial({
        color: block.index === blocks.length - 1 ? 0x9333ea : 0x6b21a8,
        transparent: true,
        opacity: 0.8,
      })
      const mesh = new THREE.Mesh(geometry, material)

      // Position blocks in a spiral
      const angle = index * 0.5
      const radius = 3
      mesh.position.x = Math.cos(angle) * radius
      mesh.position.y = index * 0.5
      mesh.position.z = Math.sin(angle) * radius

      blockGroup.add(mesh)

      // Add connections between blocks
      if (index > 0) {
        const lineGeometry = new THREE.BufferGeometry()
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4c1d95 })

        const previousMesh = blockGroup.children[index - 1]
        const positions = new Float32Array([
          previousMesh.position.x, previousMesh.position.y, previousMesh.position.z,
          mesh.position.x, mesh.position.y, mesh.position.z
        ])

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const line = new THREE.Line(lineGeometry, lineMaterial)
        blockGroup.add(line)
      }
    })

    scene.add(blockGroup)

    // Position camera
    camera.position.z = 10
    camera.position.y = 5
    camera.lookAt(blockGroup.position)

    // Animation
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      blockGroup.rotation.y += 0.005
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [blocks])

  return (
    <div ref={mountRef} className="h-[400px] w-full bg-gray-900/50 rounded-lg overflow-hidden" />
  )
}