interface AuthProps {
  onSignIn: () => void
}

export function Auth({ onSignIn }: AuthProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Tracker</h1>
        <p className="text-gray-600 mb-8">Track your Spanish lesson attendance</p>
        <button
          onClick={onSignIn}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
