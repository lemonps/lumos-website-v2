import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__card">
        <p className="not-found__eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The requested page does not exist in the imported HTML export.</p>
        <Link href="/">Return home</Link>
      </div>
    </main>
  );
}
