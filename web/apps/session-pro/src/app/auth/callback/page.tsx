export default function AuthCallbackPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Signing you in...</h1>
        <p className="text-gray-400">Please wait while we complete authentication</p>

        {/* This page will handle OAuth callback and redirect */}
        <p className="text-gray-600 text-sm mt-8">
          Whop OAuth callback handler will process the response here
        </p>
      </div>
    </div>
  );
}
