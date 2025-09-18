'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function TiptapEditor({ content, onChange, placeholder = "Escribe aquí...", disabled = false }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled,
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false)
    }
  }, [content, editor])

  if (!editor) {
    return <div>Cargando editor...</div>
  }

  return (
    <div className="border rounded p-2">
      <div className="mb-2 space-x-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
          className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-gray-200'}`}
        >
          Negrita
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          type="button"  
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : 'bg-gray-200'}`}
        >
          Título H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
          className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-black text-white' : 'bg-gray-200'}`}
        >
          Lista
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="border p-3 min-h-[150px]"
        style={{
          /* Estilos específicos para el contenido del editor */
        }}
      />
      
      <style jsx>{`
        :global(.ProseMirror h2) {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          line-height: 1.2;
        }
        
        :global(.ProseMirror ul) {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        
        :global(.ProseMirror li) {
          margin: 0.5em 0;
        }
        
        :global(.ProseMirror strong) {
          font-weight: bold;
        }
        
        :global(.ProseMirror p) {
          margin: 0.5em 0;
        }
        
        :global(.ProseMirror) {
          outline: none;
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}
