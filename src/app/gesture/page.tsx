'use client'

/* TODOS:
  - persist
  - resize
  - iframe
  - edit
  - delete
*/
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useCallback, useEffect, useState } from 'react'

const Draggable = ({ className }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (down) {
      api.start({ x: mx + offset.x, y: my + offset.y })
    } else {
      setOffset({ x: mx + offset.x, y: my + offset.y })
    }
  })

  return (
    <animated.div
      {...bind()}
      style={{ x, y, touchAction: 'none' }}
      className={className}
    />
  )
}

const Page = () => {
  const [items, setItems] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      {items.map(item => (
        <Draggable
          key={item.id}
          className={`mr-10 w-10 h-10 bg-black rounded shadow-xl`}
        />
      ))}
      <button
        className="absolute right-5 bottom-5"
        onClick={() => setItems([...items, { id: items.length + 1 }])}
      >
        +
      </button>
    </div>
  )
}

export default Page
