export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080A0F] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#F97316]/40 to-[#EF4444]/30 blur-[100px] rounded-full"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="text-gray-300">Loading...</p>
      </div>
    </div>
  )
} 