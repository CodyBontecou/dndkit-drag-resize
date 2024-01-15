import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'

import { Handle } from '../Item/components/Handle'

import {
  draggable,
  draggableHorizontal,
  draggableVertical,
} from './draggable-svg'
import styles from './Draggable.module.scss'

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

interface Props {
  axis?: Axis
  dragOverlay?: boolean
  dragging?: boolean
  handle?: boolean
  label?: string
  listeners?: DraggableSyntheticListeners
  style?: React.CSSProperties
  buttonStyle?: React.CSSProperties
  transform?: Transform | null
  resizable?: boolean
  onResize: any
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(
  function Draggable(
    {
      axis,
      dragOverlay,
      dragging,
      handle,
      label,
      listeners,
      transform,
      style,
      buttonStyle,
      resizable,
      onResize,
      ...props
    },
    ref
  ) {
    console.log(style)
    const [size, setSize] = useState({
      width: style?.width || 200,
      height: style?.height || 200,
    })
    const [isResizing, setIsResizing] = useState(false)
    const [startSize, setStartSize] = useState({ width: 0, height: 0 })
    const [startPos, setStartPos] = useState({ x: 0, y: 0 })

    const handleMouseDown = e => {
      e.preventDefault()
      setIsResizing(true)
      setStartSize(size)
      setStartPos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseMove = useCallback(
      e => {
        if (!isResizing) return

        const newWidth = startSize.width + e.clientX - startPos.x
        const newHeight = startSize.height + e.clientY - startPos.y

        setSize({ width: newWidth, height: newHeight })
      },
      [isResizing, startSize, startPos]
    )

    const handleMouseUp = () => {
      setIsResizing(false)
      onResize && onResize(size) // Call onResize when resizing ends
    }

    useEffect(() => {
      if (isResizing) {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
      } else {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }, [isResizing, handleMouseMove, handleMouseUp])

    useEffect(() => {
      if (style?.width && style?.height) {
        setSize({ width: style.width, height: style.height })
      }
    }, [style])

    return (
      <div
        className={classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging,
          handle && styles.handle
        )}
        style={
          {
            ...style,
            width: `${size.width}px`,
            height: `${size.height}px`,
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
      >
        <button
          {...props}
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...(handle ? {} : listeners)}
          tabIndex={handle ? -1 : undefined}
          ref={ref}
          style={{
            ...buttonStyle,
            width: `${size.width}px`,
            height: `${size.height}px`,
          }}
        >
          {axis === Axis.Vertical
            ? draggableVertical
            : axis === Axis.Horizontal
            ? draggableHorizontal
            : draggable}
          {handle ? <Handle {...(handle ? listeners : {})} /> : null}
        </button>
        {resizable && (
          <div
            className="resize-handle"
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '10px',
              height: '10px',
              backgroundColor: 'grey',
              cursor: 'nwse-resize',
            }}
          ></div>
        )}
      </div>
    )
  }
)
