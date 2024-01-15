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
  { id: '1', x: 0, y: 0 },
  { id: '2', x: 0, y: 0 },
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

  const updateCoordinates = (itemId: UniqueIdentifier, delta: Coordinates) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          console.log({
            ...item,
            x: item.x + delta.x,
            y: item.y + delta.y,
          })
          return {
            ...item,
            x: item.x + delta.x,
            y: item.y + delta.y,
          }
        }
        return item
      })
    })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={event => {
        updateCoordinates(event.active.id, event.delta)
      }}
      modifiers={modifiers}
    >
      <div className="w-screen h-screen">
        {items.map(item => {
          return (
            <DraggableItem
              id={item.id}
              key={item.id}
              axis={axis}
              label={label}
              handle={handle}
              top={item.y}
              left={item.x}
              style={style}
              buttonStyle={buttonStyle}
            />
          )
        })}
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
}

function DraggableItem({
  id,
  axis,
  label,
  style,
  top,
  left,
  handle,
  buttonStyle,
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
      style={{ ...style, top, left }}
      buttonStyle={buttonStyle}
      transform={transform}
      axis={axis}
      resizable={true}
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
