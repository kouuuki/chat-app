export function MyMessage({ text }: { text: string }) {
  return (
    <li className="flex justify-end">
      <div className="relative max-w-xl rounded bg-gray-100 px-4 py-2 text-gray-700 shadow">
        <span className="block">{text}</span>
      </div>
    </li>
  );
}

export function OtherMessage({ text }: { text: string }) {
  return (
    <li className="flex justify-start">
      <div className="relative max-w-xl rounded px-4 py-2 text-gray-700 shadow">
        <span className="block">{text}</span>
      </div>
    </li>
  );
}
