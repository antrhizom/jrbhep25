import { useState } from 'react'
import { Info, X } from 'lucide-react'

interface AIDisclaimerProps {
  className?: string
}

export function AIDisclaimer({ className = '' }: AIDisclaimerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 ${className}`}
        title="KI-Informationen"
      >
        <Info className="h-6 w-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <Info className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold">KI-Unterstützung</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-blue-700">Diese Lernplattform wurde mit KI-Unterstützung erstellt.</strong>
                </p>
              </div>

              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Teile dieser Lernplattform wurden mithilfe von künstlicher Intelligenz (Claude von Anthropic) entwickelt:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Struktur und Organisation der Lerninhalte</li>
                  <li>Technische Implementierung der Plattform</li>
                  <li>Formatierung und Aufbereitung von Informationen</li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
                  <p className="text-sm text-gray-700">
                    <strong className="text-yellow-700">Wichtig:</strong> Alle Inhalte wurden von hep Verlag geprüft und freigegeben. 
                    Die sachliche Korrektheit und pädagogische Eignung sind sichergestellt.
                  </p>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  Die Verwendung von KI ermöglicht es uns, hochwertige Bildungsinhalte effizienter zu erstellen 
                  und kontinuierlich zu verbessern.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 rounded-b-xl">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
