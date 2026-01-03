import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { ArrowLeft, Download } from 'lucide-react'
import { Badge } from '@/components/Badge'
import { moduleData } from '@/lib/moduleContent'

export default function BadgePage() {
  const router = useRouter()
  const { moduleId } = router.query
  const [badge, setBadge] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBadge = async () => {
      if (!moduleId || !auth.currentUser) return

      try {
        const userRef = doc(db, 'users', auth.currentUser.uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          const moduleBadge = userData.badges?.[moduleId as string]

          if (moduleBadge) {
            setBadge(moduleBadge)
          } else {
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.error('Error loading badge:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadBadge()
  }, [moduleId, router])

  const handleDownload = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Badge...</p>
        </div>
      </div>
    )
  }

  if (!badge) {
    return null
  }

  const module = moduleData[moduleId as string]
  const moduleName = module?.title || 'Modul'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header - hidden when printing */}
      <div className="print:hidden bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Zurück zum Dashboard</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            <Download className="h-5 w-5" />
            Als PDF herunterladen
          </button>
        </div>
      </div>

      {/* Badge Display */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Badge
          moduleName={moduleName}
          lerncode={badge.lerncode}
          date={new Date(badge.issuedAt).toLocaleDateString('de-CH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        />
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
