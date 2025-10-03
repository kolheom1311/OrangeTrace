export default function VerifyErrorPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">❌ Link expired or invalid</h1>
      <p className="mt-4">Please request a new activation email.</p>
    </div>
  );
}
