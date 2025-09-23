'use client'

import React, { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Heading from '@tiptap/extension-heading'
import EditiorExtension from './EditiorExtension'
import { useQueries, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function TextEditior({fileId}) {
  const notes=useQuery(api.notes.GetNotes,{
    fileId:fileId
  })
  console.log(notes);
  const editor = useEditor({
   
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start taking notes here…' }),
    ],
    editorProps: {
      attributes: {
        class:
          'focus:outline-none h-screen p-5 text-black prose prose-lg max-w-none',
      },
    },
    content: '',
    immediatelyRender: false,
  })

  useEffect(()=>{
    editor&&editor.commands.insertContent(notes)
  },[notes&&editor])

  if (!editor) return null

  return (
    <div>
      <EditiorExtension editor={editor} />
      <div className='overflow-scroll h-[88vh]'>
      <EditorContent editor={editor} />
    </div>
    </div>
  )
} 