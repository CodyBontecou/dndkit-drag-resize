'use client'

import {
  DndContext,
  KeyboardSensor,
  useSensor,
  useSensors,
  PointerActivationConstraint,
  Modifiers,
  MouseSensor,
  TouchSensor,
  useDraggable,
  UniqueIdentifier,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Coordinates } from '@dnd-kit/utilities'
import { useOrientation, useWindowSize } from 'react-use'

import { Draggable, OverflowWrapper } from '@/components'
import useLocalStorage from '@/lib/useLocalStorage'

interface Props {
  activationConstraint?: PointerActivationConstraint
  axis?: any
  handle?: boolean
  modifiers?: Modifiers
  buttonStyle?: React.CSSProperties
  style?: React.CSSProperties
  label?: string
}

const objList = [
  { id: '1', x: 0, y: 0, height: 200, width: 200 },
  { id: '2', x: 0, y: 0, height: 200, width: 200 },
  { id: '3', x: 0, y: 0, height: 200, width: 200 },
]

const DraggableStory = ({
  activationConstraint,
  axis,
  handle,
  label = 'Go ahead, drag me.',
  modifiers,
  style,
  buttonStyle,
}: Props) => {
  const [items, setItems] = useLocalStorage('costream-layout', objList)
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  })
  const keyboardSensor = useSensor(KeyboardSensor, {})
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)
  const state = useOrientation()
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  const updateCoordinates = (
    itemId: UniqueIdentifier,
    delta: Coordinates,
    newSize?: { width: number; height: number }
  ) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            x: item.x + delta.x,
            y: item.y + delta.y,
            width: newSize ? newSize.width : item.width,
            height: newSize ? newSize.height : item.height,
          }
        }
        return item
      })
    })
  }

  const windowOne = {
    landscape: {
      x: 0,
      y: 0,
      width: windowWidth * 0.7,
      height: windowHeight,
    },
    portrait: {
      x: 0,
      y: 0,
      width: windowWidth,
      height: windowHeight * 0.5,
    },
    src: `https://player.twitch.tv/?channel=b0aty&parent=localhost}`,
  }

  const windowTwo = {
    landscape: {
      x: windowOne.landscape.width,
      y: 0,
      width: windowWidth * 0.3,
      height: windowHeight * 0.4,
    },
    portrait: {
      x: 0,
      y: windowOne.portrait.height,
      width: windowWidth * 0.5,
      height: windowHeight * 0.5,
    },
    src: `https://player.twitch.tv/?channel=ibai&parent=localhost}`,
  }

  const windowThree = {
    landscape: {
      x: windowOne.landscape.width,
      y: windowTwo.landscape.height,
      width: windowWidth * 0.3,
      height: windowHeight * 0.6,
    },
    portrait: {
      x: windowTwo.portrait.width,
      y: windowOne.portrait.height,
      width: windowWidth * 0.5,
      height: windowHeight * 0.5,
    },
    src: `https://player.twitch.tv/?channel=thebausffs&parent=localhost}`,
  }

  const windows = [windowOne, windowTwo, windowThree]

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={event => {
        updateCoordinates(event.active.id, event.delta)
      }}
      modifiers={modifiers}
    >
      <div className="w-screen h-screen">
        <pre>{JSON.stringify(state, null, 2)}</pre>
        {/* {items.map(item => {
          return (
            <DraggableItem
              id={item.id}
              key={item.id}
              axis={axis}
              label={label}
              handle={handle}
              top={item.y}
              left={item.x}
              height={item.height}
              width={item.width}
              setSize={(id, newSize) => {
                updateCoordinates(id, { x: 0, y: 0 }, newSize)
              }}
              style={style}
              buttonStyle={buttonStyle}
            />
          )
        })} */}
      </div>
    </DndContext>
  )
}

interface DraggableItemProps {
  id: string
  label: string
  handle?: boolean
  style?: React.CSSProperties
  buttonStyle?: React.CSSProperties
  axis?: any
  top?: number
  left?: number
  height: number
  width: number
  setSize: any
}

function DraggableItem({
  id,
  axis,
  label,
  style,
  top,
  left,
  height,
  width,
  handle,
  buttonStyle,
  setSize,
}: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({ id })

  return (
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      handle={handle}
      label={label}
      listeners={listeners}
      style={{ ...style, top, left, height, width }}
      buttonStyle={buttonStyle}
      transform={transform}
      axis={axis}
      resizable={true}
      onResize={newSize => setSize(id, newSize)} // Handle resize
      {...attributes}
    />
  )
}

interface HomeProps {
  // You can add any additional props if needed
}

const Home: React.FC<HomeProps> = () => {
  return (
    <main className="flex justify-center items-center px-2 mx-auto w-screen h-screen select-none">
      <OverflowWrapper>
        <DraggableStory modifiers={[restrictToWindowEdges]} />
      </OverflowWrapper>
    </main>
  )
}

export default Home
