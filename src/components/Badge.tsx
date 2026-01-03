import React from 'react'
import { Award } from 'lucide-react'

interface BadgeProps {
  moduleName: string
  lerncode: string
  date: string
  compact?: boolean
}

export const Badge: React.FC<BadgeProps> = ({ moduleName, lerncode, date, compact = false }) => {
  if (compact) {
    // Compact version for dashboard list
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-md">
        <Award className="h-4 w-4 text-white" />
        <span className="text-white font-semibold text-sm">{moduleName}</span>
      </div>
    )
  }

  // Full version for badge page
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-8 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-20 h-20 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-4 right-4 w-32 h-32 bg-yellow-600 rounded-full opacity-20 blur-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Award Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Award className="h-14 w-14 text-yellow-500" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2">Lernbestätigung</h1>
          <div className="w-32 h-1 bg-white mx-auto mb-6 opacity-50"></div>
          
          {/* Module Name */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
            <p className="text-white text-sm font-medium mb-1">Modul erfolgreich abgeschlossen:</p>
            <h2 className="text-2xl font-bold text-white">{moduleName}</h2>
          </div>
          
          {/* Lerncode */}
          <div className="mb-4">
            <p className="text-white text-sm font-medium mb-1">Lerncode:</p>
            <p className="text-xl font-mono font-bold text-white tracking-wider">{lerncode}</p>
          </div>
          
          {/* Date */}
          <div className="text-white text-sm opacity-80">
            Ausgestellt am: {date}
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white border-opacity-30">
            <p className="text-white text-xs opacity-70">
              Diese Bestätigung dokumentiert die erfolgreiche Durchführung des Lernmoduls.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
