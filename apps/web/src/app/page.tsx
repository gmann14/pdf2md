import { Converter } from "@/components/Converter";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Convert PDF to Markdown
        </h1>
        <p className="mt-2 text-gray-600">
          Free, fast, and private. File contents never leave your browser.
        </p>
      </div>
      <Converter />
    </main>
  );
}
