import { LuQuote } from "react-icons/lu";

export function CoverNote({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-8 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <LuQuote className="w-5 h-5 text-blue-800 fill-current" />
        <h2 className="text-lg font-bold text-gray-900">Cover Note</h2>
      </div>
      
      <div className="bg-gray-50/50 p-6 rounded-md text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  );
}
