import React, { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  return (
    <Button onClick={() => setDark(d => !d)} variant="outline" size="sm">
      {dark ? '🌙 Dark' : '☀️ Light'}
    </Button>
  )
}

export default ThemeToggle
