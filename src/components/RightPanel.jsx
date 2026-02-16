import React from 'react'

function Circle({ percent = 60 }) {
  return (
    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-sm">
      <div className="text-center">
        <div className="text-lg font-semibold">{percent}%</div>
        <div className="text-xs text-slate-400">Completed</div>
      </div>
    </div>
  )
}

export default function RightPanel({ friends = [] }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-sm">
        <div className="text-sm text-slate-400">Avg. Study Progress</div>
        <Circle percent={60} />
      </div>

      <div className="bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Friends</div>
          <div className="text-sm text-blue-600">See All</div>
        </div>
        <div className="space-y-2 max-h-60 overflow-auto">
          {friends.map((f) => (
            <div key={f.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div>
                  <div className="text-sm">{f.name}</div>
                  <div className="text-xs text-slate-400">{f.subject}</div>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
