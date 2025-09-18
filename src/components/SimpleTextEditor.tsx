'use client'
import { useState, useEffect } from 'react'

interface SimpleTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function SimpleTextEditor({ content, onChange, placeholder = "Escribe aquí...", disabled = false }: SimpleTextEditorProps) {
  const [localContent, setLocalContent] = useState(content)

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setLocalContent(newContent)
    onChange(newContent)
  }

  return (
    <div className="border border-gray-300 rounded-md bg-white">
      <div className="border-b border-gray-200 p-2 bg-gray-50">
        <span className="text-sm text-gray-600">Editor de texto simple</span>
      </div>
      <textarea
        value={localContent}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-3 min-h-[200px] resize-none focus:outline-none"
        rows={8}
      />
    </div>
  )
}
