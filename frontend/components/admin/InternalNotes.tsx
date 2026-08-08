import { LuMessageSquare, LuBold, LuItalic, LuList } from "react-icons/lu";

interface Note {
  id: string;
  author: string;
  role: string;
  date: string;
  content: string;
  initials: string;
}

export function InternalNotes({ notes }: { notes: Note[] }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-8 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <LuMessageSquare className="w-5 h-5 text-orange-500 fill-orange-100" />
        <h2 className="text-lg font-bold text-gray-900">Internal Notes</h2>
      </div>

      {/* Note Editor */}
      <div className="border border-gray-200 rounded-md mb-8 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-4 py-2">
          <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
            <LuBold className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
            <LuItalic className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
            <LuList className="w-4 h-4" />
          </button>
        </div>
        
        {/* Text Area */}
        <textarea 
          className="w-full p-4 min-h-[120px] text-sm text-gray-700 focus:outline-none resize-none"
          placeholder="Add feedback or assessment notes here... visible only to admins."
        ></textarea>
        
        {/* Action Footer */}
        <div className="flex justify-end p-3 border-t border-gray-100">
          <button className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded hover:bg-gray-200 transition-colors">
            Save Note
          </button>
        </div>
      </div>

      {/* Existing Notes */}
      <div className="space-y-6">
        {notes.map((note) => (
          <div key={note.id} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
              {note.initials}
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">{note.author}</span>
                <span className="text-xs font-medium text-gray-500">({note.role})</span>
                <span className="text-xs text-gray-400 ml-2">{note.date}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {note.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
