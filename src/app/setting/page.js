export default function SettingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 text-[#333]">
        <div className="flex items-center justify-between">
          <span>Notifications</span>
          <span className="text-gray-500 text-sm">Coming soon</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Privacy</span>
          <span className="text-gray-500 text-sm">Coming soon</span>
        </div>
      </div>
    </div>
  );
}


