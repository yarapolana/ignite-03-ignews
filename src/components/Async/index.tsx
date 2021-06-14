import { useState, useEffect } from 'react'

export const Async = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 1000)
  }, [])

  return (
    <div>
      <div>Hello Yara</div>
      {isVisible && <button>Button</button>}
    </div>
  )
}
