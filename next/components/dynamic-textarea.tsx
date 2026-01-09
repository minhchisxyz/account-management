'use client'

import {useEffect, useRef} from "react";

export default function DynamicTextArea({ text }: { text: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }
  useEffect(() => adjustHeight(), [text])
  return (
      <textarea ref={textareaRef}
                readOnly
                value={text}
                placeholder={`Say something...`}
                className="w-full flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none overflow-hidden min-h-10 transition-[height] duration-100"
                rows={1}/>
  )
}