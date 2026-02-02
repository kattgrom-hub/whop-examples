import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome to SessionPro</h1>
            <p className="text-gray-400">Sign in to book sessions or manage your coaching business</p>
          </div>

          {/* Whop OAuth Button Placeholder */}
          <div className="space-y-4">
            <button className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Continue with Whop
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-500">or</span>
              </div>
            </div>

            <button className="w-full py-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold">
              Continue with Email
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Want to become a coach?{" "}
          <Link href="/auth/login?role=coach" className="text-blue-500 hover:text-blue-400">
            Apply here
          </Link>
        </p>
      </div>
    </div>
  );
}
