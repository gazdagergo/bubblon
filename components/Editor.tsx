'use client';

import { useState } from 'react';
import * as Babel from '@babel/standalone';
import React from 'react';

function RenderJSX({ jsx }: { jsx: string }) {
  try {
    const code = Babel.transform(jsx, { presets: ['react'] }).code ?? '';
    return new Function('React', `return ${code}`)(React);
  } catch (e) {
    return <pre className="text-red-600">Error rendering JSX: {(e as Error).message}</pre>;
  }
}

export default function Editor() {
  const [code, setCode] = useState('<div><h2>Hello world</h2></div>');
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  async function handlePublish() {
    setIsPublishing(true);
    const contentBase64 = Buffer.from(code).toString('base64');
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: contentBase64 }),
    });
    setIsPublishing(false);
    alert(await res.text());
  }

  return (
    <div>
      <textarea
        className="w-full h-60 p-2 border rounded font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div className="mt-4 flex gap-2">
        <button onClick={() => setPreviewCode(code)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Preview
        </button>
        <button onClick={handlePublish} className="bg-green-600 text-white px-4 py-2 rounded">
          {isPublishing ? 'Publishing…' : 'Publish'}
        </button>
      </div>
      <div className="mt-6 p-4 border rounded bg-gray-50">
        {previewCode ? <RenderJSX jsx={previewCode} /> : <em>No preview yet.</em>}
      </div>
    </div>
  );
}
