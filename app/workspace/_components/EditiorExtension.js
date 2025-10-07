'use client';

import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { useAction, useMutation } from 'convex/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from "sonner";
import { useUser } from '@clerk/nextjs';

function EditiorExtension({ editor }) {

  const [showHighlightOptions, setShowHighlightOptions] = useState(false);

  const { fileId } = useParams();
  const SearchAI = useAction(api.myAction.search);
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  const onAiClick = async () => {
    toast("AI is generating your answer...");

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ''
    );

    console.log("Selected text:", selectedText);

    if (!selectedText || selectedText.trim().length === 0) {
      toast.error("Please select some text before asking AI.");
      return;
    }

    // Search context from your Convex vector store
    const result = await SearchAI({
      query: selectedText,
      fileId: fileId
    });

    let UnformatedAns = [];
    try {
      UnformatedAns = JSON.parse(result);
    } catch (err) {
      console.error("Failed to parse Convex result:", err, result);
      toast.error("Error parsing search results.");
      return;
    }

    let AllUnformatedAns = '';
    UnformatedAns?.forEach(item => {
      AllUnformatedAns += item.pageContent || '';
    });

    const PROMPT = `
    For the question: "${selectedText}"
    and with the given content as context,
    please provide an appropriate answer in clean HTML format.
    The answer content is: ${AllUnformatedAns}
    `;

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: PROMPT }),
      });

      const data = await response.json();
      console.log("Gemini API response:", data);

      // Safely access result
      const resultText = data.result || data.message || data.text || '';

      if (!resultText) {
        toast.error("AI failed to generate a response.");
        return;
      }

      const FinalAns = resultText
        .replace(/```/g, '')
        .replace(/html/g, '')
        .trim();

      editor.commands.insertContent(`<p><strong>Answer:</strong> ${FinalAns}</p>`);

      // Save notes to Convex
      await saveNotes({
        notes: FinalAns,
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      toast.success("AI answer added and saved successfully!");

    } catch (err) {
      console.error("Error during AI call:", err);
      toast.error("Something went wrong while generating AI answer.");
    }
  };

  if (!editor) return null;

  const buttonClass = (active) =>
    `p-2 rounded-md border text-sm transition-all duration-150 ${
      active
        ? 'bg-blue-100 text-blue-600 border-blue-300'
        : 'text-gray-700 border-transparent'
    } hover:bg-gray-100 hover:border-gray-300 focus:outline-none`;

  const highlightColors = [
    { name: 'Red', color: '#f87171' },
    { name: 'Green', color: '#4ade80' },
    { name: 'Blue', color: '#60a5fa' },
    { name: 'Purple', color: '#a78bfa' },
    { name: 'Orange', color: '#fb923c' },
    { name: 'Yellow', color: '#fde047' },
  ];

  const handleHighlightClick = (color) => {
    const isActive = editor.isActive('highlight', { color });

    if (isActive) {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }

    setShowHighlightOptions(false);
  };

  return (
    <div className="relative p-4 border-b flex gap-2 flex-wrap items-center bg-white shadow-sm">

      {/* Heading Buttons */}
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={buttonClass(editor.isActive('heading', { level }))}
        >
          H{level}
        </button>
      ))}

      {/* Text Format Buttons */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))}>
        <Bold size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))}>
        <Italic size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass(editor.isActive('underline'))}>
        <UnderlineIcon size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))}>
        <Strikethrough size={18} />
      </button>
      <button onClick={() => setShowHighlightOptions((prev) => !prev)} className={buttonClass(editor.isActive('highlight'))}>
        <Highlighter size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} className={buttonClass(editor.isActive('code'))}>
        <Code size={18} />
      </button>

      {/* Highlight Palette */}
      {showHighlightOptions && (
        <div className="absolute z-50 top-14 left-40 bg-white p-3 border rounded shadow-md flex flex-wrap gap-2 w-52">
          {highlightColors.map(({ name, color }) => (
            <div key={name} className="relative group">
              <button
                onClick={() => handleHighlightClick(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${
                  editor.isActive('highlight', { color })
                    ? 'border-black scale-110'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-xs rounded px-2 py-1 z-50">
                {name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Text Alignment */}
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonClass(editor.isActive({ textAlign: 'left' }))}>
        <AlignLeft size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonClass(editor.isActive({ textAlign: 'center' }))}>
        <AlignCenter size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonClass(editor.isActive({ textAlign: 'right' }))}>
        <AlignRight size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={buttonClass(editor.isActive({ textAlign: 'justify' }))}>
        <AlignJustify size={18} />
      </button>

      {/* AI Button */}
      <button onClick={onAiClick} className="hover:text-blue-500">
        <Sparkles size={18} />
      </button>
    </div>
  );
}

export default EditiorExtension;
