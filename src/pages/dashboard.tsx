import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { BookOpen, Trophy, LogOut, Award, ChevronRight, CheckCircle2, TrendingUp, Users, Star, Info } from 'lucide-react'
import { learningAreas, getAreaProgress, moduleData } from '@/lib/moduleContent'

interface UserData {
  lernname: string
  code: string
  totalPoints: number
  overallProgress: number
  modules: {
    [key: string]: { completed: boolean; score: number; progress: number }
  }
  badges?: {
    [moduleId: string]: {
      moduleId: string
      moduleName: string
      lerncode: string
      issuedAt: string
    }
  }
  overallFeedback?: {
    [areaId: string]: {
      overallSatisfaction: number
      favoriteModule: string
      wouldRecommend: number
      submittedAt: string
    }
  }
}

interface Statistics {
  avgPoints: number
  avgSatisfaction: number
  favoriteModule: string
  recommendRate: number
  totalUsers: number
}

interface RegistrationStats {
  totalRegistered: number
  totalBadges: number
  totalCertificates: number
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [registrationStats, setRegistrationStats] = useState<RegistrationStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser
      if (!user) {
        router.push('/')
        return
      }

      // Load user data
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData
        
        // Initialize modules if they don't exist
        if (!data.modules) {
          data.modules = {
            fotos2025: { completed: false, score: 0, progress: 0 },
            jahresanalyse: { completed: false, score: 0, progress: 0 },
            'ki-transformation': { completed: false, score: 0, progress: 0 },
            ausblick2026: { completed: false, score: 0, progress: 0 }
          }
        }
        
        // Ensure all required modules exist
        if (!data.modules.fotos2025) {
          data.modules.fotos2025 = { completed: false, score: 0, progress: 0 }
        }
        if (!data.modules.jahresanalyse) {
          data.modules.jahresanalyse = { completed: false, score: 0, progress: 0 }
        }
        if (!data.modules['ki-transformation']) {
          data.modules['ki-transformation'] = { completed: false, score: 0, progress: 0 }
        }
        if (!data.modules.ausblick2026) {
          data.modules.ausblick2026 = { completed: false, score: 0, progress: 0 }
        }
        
        setUserData(data)
        
        // Load statistics if user has given feedback
        if (data.overallFeedback?.jahresrueckblick2025) {
          await loadStatistics()
        }
        
        // Always load registration statistics
        await loadRegistrationStats()
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const loadRegistrationStats = async () => {
    try {
      // Count total registered users
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const totalRegistered = usersSnapshot.size
      
      // Count users who earned certificates (50% or more progress)
      const allUsers = usersSnapshot.docs.map(doc => doc.data() as UserData)
      const totalCertificates = allUsers.filter(
        user => (user.overallProgress || 0) >= 50
      ).length
      
      // Count total badges across all users
      let totalBadges = 0
      allUsers.forEach(user => {
        if (user.badges) {
          totalBadges += Object.keys(user.badges).length
        }
      })
      
      setRegistrationStats({
        totalRegistered,
        totalBadges,
        totalCertificates
      })
    } catch (error) {
      console.error('Error loading registration stats:', error)
    }
  }

  const loadStatistics = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const allUsers = usersSnapshot.docs.map(doc => doc.data() as UserData)
      
      // Filter users who completed feedback for jahresrueckblick2025
      const usersWithFeedback = allUsers.filter(
        u => u.overallFeedback?.jahresrueckblick2025
      )
      
      if (usersWithFeedback.length === 0) {
        return
      }

      // Calculate statistics
      const totalPoints = usersWithFeedback.reduce((sum, u) => sum + (u.totalPoints || 0), 0)
      const avgPoints = Math.round(totalPoints / usersWithFeedback.length)

      const totalSatisfaction = usersWithFeedback.reduce(
        (sum, u) => sum + (u.overallFeedback?.jahresrueckblick2025?.overallSatisfaction || 0),
        0
      )
      const avgSatisfaction = totalSatisfaction / usersWithFeedback.length

      // Count favorite modules
      const moduleCounts: { [key: string]: number } = {}
      usersWithFeedback.forEach(u => {
        const fav = u.overallFeedback?.jahresrueckblick2025?.favoriteModule
        if (fav) {
          moduleCounts[fav] = (moduleCounts[fav] || 0) + 1
        }
      })
      const favoriteModule = Object.keys(moduleCounts).reduce((a, b) =>
        moduleCounts[a] > moduleCounts[b] ? a : b
      , '')

      // Calculate recommendation rate
      const recommendCount = usersWithFeedback.filter(
        u => (u.overallFeedback?.jahresrueckblick2025?.wouldRecommend || 0) >= 4
      ).length
      const recommendRate = Math.round((recommendCount / usersWithFeedback.length) * 100)

      setStatistics({
        avgPoints,
        avgSatisfaction,
        favoriteModule,
        recommendRate,
        totalUsers: usersWithFeedback.length
      })
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  // Berechne Fortschritt für Jahresrückblick 2025
  const areaProgress = getAreaProgress('jahresrueckblick2025', userData.modules)

  // Gesamtfortschritt
  const totalPoints = areaProgress.points
  const totalMaxPoints = areaProgress.maxPoints
  const totalProgress = Math.round((totalPoints / totalMaxPoints) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Willkommen, {userData.lernname}!</h1>
              <p className="text-blue-100 mt-1">Ihr Lerncode: {userData.code}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* KI-Info Button */}
              <button
                onClick={() => {
                  const modal = document.createElement('div')
                  modal.innerHTML = `
                    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onclick="this.remove()">
                      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onclick="event.stopPropagation()">
                        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-xl">
                          <div class="flex items-center justify-between">
                            <h2 class="text-2xl font-bold">🤖 KI-Unterstützung</h2>
                            <button onclick="this.closest('.fixed').remove()" class="hover:bg-white hover:bg-opacity-20 rounded-full p-2">
                              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div class="p-6 space-y-4">
                          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <p class="text-gray-700 leading-relaxed">
                              <strong class="text-blue-700">Diese Lernplattform wurde mit KI-Unterstützung erstellt.</strong>
                            </p>
                          </div>
                          <p class="text-gray-700 leading-relaxed">
                            Teile dieser Lernplattform wurden mithilfe von künstlicher Intelligenz (Claude von Anthropic) entwickelt:
                          </p>
                          <ul class="list-disc list-inside space-y-2 ml-4 text-gray-700">
                            <li>Struktur und Organisation der Lerninhalte</li>
                            <li>Technische Implementierung der Plattform</li>
                            <li>Formatierung und Aufbereitung von Informationen</li>
                          </ul>
                          <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                            <p class="text-sm text-gray-700">
                              <strong class="text-yellow-700">Wichtig:</strong> Alle Inhalte wurden durch die Autoren geprüft und freigegeben. 
                              Die sachliche Korrektheit und pädagogische Eignung sind durch die Autoren sichergestellt.
                            </p>
                          </div>
                        </div>
                        <div class="bg-gray-50 p-6 rounded-b-xl">
                          <button onclick="this.closest('.fixed').remove()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
                            Verstanden
                          </button>
                        </div>
                      </div>
                    </div>
                  `
                  document.body.appendChild(modal)
                }}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
                title="KI-Informationen"
              >
                <Info className="h-5 w-5" />
                <span>KI-Info</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Registrierungsstatistik */}
        {registrationStats && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center justify-center gap-8 text-white">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Registriert: <strong className="text-lg">{registrationStats.totalRegistered}</strong>
                </span>
              </div>
              <div className="h-6 w-px bg-blue-400"></div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Badges: <strong className="text-lg">{registrationStats.totalBadges}</strong>
                </span>
              </div>
              <div className="h-6 w-px bg-blue-400"></div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Zertifikate: <strong className="text-lg">{registrationStats.totalCertificates}</strong>
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Gesamt-Fortschritt */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gesamtfortschritt</h2>
              <p className="text-gray-600 mt-1">Ihre Gesamtleistung über alle Lernbereiche</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{totalProgress}%</div>
              <div className="text-sm text-gray-600">{totalPoints} / {totalMaxPoints} Punkte</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <Trophy className="h-8 w-8 text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">{totalPoints}</div>
              <div className="text-sm text-gray-600 mt-1">Gesammelte Punkte</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {areaProgress.completed}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                von {areaProgress.total} Modulen abgeschlossen
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <Award className="h-8 w-8 text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {totalProgress >= 50 ? '1' : '0'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {totalProgress >= 50 ? 'Zertifikat verfügbar' : 'Zertifikat (ab 50%)'}
              </div>
            </div>
          </div>
        </div>

        {/* Statistik-Widget - nur wenn Feedback abgegeben */}
        {statistics && userData?.overallFeedback?.jahresrueckblick2025 && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md p-8 mb-8 border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-7 w-7 text-purple-600" />
                  Feedback-Auswertung
                </h2>
                <p className="text-gray-600 mt-1">Vergleich: Ihre Ergebnisse vs. Durchschnitt aller Teilnehmer</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-5 w-5" />
                  <span>{statistics.totalUsers} Teilnehmer</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Durchschnittliche Punkte */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Punktzahl</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ihre Punkte</div>
                    <div className="text-2xl font-bold text-blue-600">{totalPoints} / 400</div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Durchschnitt</div>
                    <div className="text-xl font-semibold text-gray-700">{statistics.avgPoints} / 400</div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    totalPoints >= statistics.avgPoints ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {totalPoints >= statistics.avgPoints ? '↑' : '↓'} {Math.abs(totalPoints - statistics.avgPoints)} Punkte {totalPoints >= statistics.avgPoints ? 'über' : 'unter'} Durchschnitt
                  </div>
                </div>
              </div>

              {/* Zufriedenheit */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Zufriedenheit</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ihre Bewertung</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {userData.overallFeedback.jahresrueckblick2025.overallSatisfaction}/5
                      <span className="text-lg ml-2">
                        {['😞','😕','😐','😊','😍'][userData.overallFeedback.jahresrueckblick2025.overallSatisfaction - 1]}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Durchschnitt</div>
                    <div className="text-xl font-semibold text-gray-700">
                      {statistics.avgSatisfaction.toFixed(1)}/5
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {statistics.avgSatisfaction >= 4 ? '😍 Sehr positiv' : statistics.avgSatisfaction >= 3 ? '😊 Positiv' : '😐 Gemischt'}
                  </div>
                </div>
              </div>

              {/* Beliebtestes Modul & Empfehlungsrate */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Beliebtheit</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Beliebtestes Modul</div>
                    <div className="text-sm font-semibold text-gray-900 bg-blue-50 px-3 py-2 rounded">
                      {moduleData[statistics.favoriteModule]?.title || statistics.favoriteModule}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {userData.overallFeedback.jahresrueckblick2025.favoriteModule === statistics.favoriteModule 
                        ? '✅ Stimmt mit Ihrer Wahl überein' 
                        : '→ Sie bevorzugen: ' + (moduleData[userData.overallFeedback.jahresrueckblick2025.favoriteModule]?.title || '')}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Weiterempfehlung</div>
                    <div className="text-2xl font-bold text-green-600">{statistics.recommendRate}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      würden weiterempfehlen
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-purple-100 text-center text-sm text-gray-600">
              💬 Vielen Dank für Ihr Feedback! Diese Statistiken helfen uns, die Lernplattform zu verbessern.
            </div>
          </div>
        )}

        {/* Lernbereich: Jahresrückblick 2025 */}
        <div className="max-w-4xl mx-auto">
          <LearningAreaCard
            area={learningAreas.jahresrueckblick2025}
            progress={areaProgress}
            modules={userData.modules}
            userData={userData}
            onModuleClick={(moduleId) => router.push(`/modules/${moduleId}`)}
            onCertificateClick={() => router.push('/certificate/jahresrueckblick2025')}
            router={router}
          />
        </div>
      </main>
    </div>
  )
}

// Komponente für Lernbereich-Karte
interface LearningAreaCardProps {
  area: typeof learningAreas.jahresrueckblick2025
  progress: ReturnType<typeof getAreaProgress>
  modules: UserData['modules']
  userData: UserData
  onModuleClick: (moduleId: string) => void
  onCertificateClick: () => void
  router: ReturnType<typeof useRouter>
}

function LearningAreaCard({ area, progress, modules, userData, onModuleClick, onCertificateClick, router }: LearningAreaCardProps) {
  const modulesList = area.modules.map(moduleId => {
    const moduleData = modules[moduleId as keyof typeof modules]
    return {
      id: moduleId,
      completed: moduleData?.completed || false,
      score: moduleData?.score || 0,
      progress: moduleData?.progress || 0
    }
  })

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{area.title}</h2>
            <p className="text-blue-100 mt-2">{area.description}</p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-200" />
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-100">Fortschritt</span>
            <span className="text-lg font-bold">{progress.progress}%</span>
          </div>
          <div className="w-full bg-blue-400 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-blue-100">
            {progress.points} / {progress.maxPoints} Punkte
          </div>
        </div>
      </div>

      {/* Module Liste */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lernthemen</h3>
        <div className="space-y-3">
          {modulesList.map((module) => (
            <ModuleButton
              key={module.id}
              moduleId={module.id}
              moduleTitle={moduleData[module.id]?.title || 'Unbekanntes Thema'}
              completed={module.completed}
              score={module.score}
              progress={module.progress}
              onClick={() => onModuleClick(module.id)}
            />
          ))}
        </div>

        {/* Zertifikat */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onCertificateClick}
            disabled={progress.progress < 50}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
              progress.progress >= 50
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">
                  {progress.progress >= 50 ? 'Zertifikat anzeigen' : 'Zertifikat (noch nicht freigeschaltet)'}
                </div>
                {progress.progress < 50 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Mindestens 50% der Punkte erforderlich ({progress.points}/{progress.maxPoints})
                  </div>
                )}
              </div>
            </div>
            {progress.progress >= 50 && <ChevronRight className="h-5 w-5" />}
          </button>
          
          {/* Badges - Lernbestätigungen für einzelne Module */}
          {userData.badges && Object.keys(userData.badges).length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Meine Badges</h3>
              <div className="space-y-2">
                {Object.entries(userData.badges).map(([moduleId, badge]) => (
                  <button
                    key={moduleId}
                    onClick={() => router.push(`/badges/${moduleId}`)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border border-yellow-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-gray-900 text-sm">{badge.moduleName}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-yellow-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Gesamtfeedback Button - nur sichtbar wenn alle Module abgeschlossen */}
          {progress.completed === progress.total && (
            <button
              onClick={() => router.push(`/feedback/${area.id}`)}
              className="w-full flex items-center justify-between p-4 rounded-lg transition-all mt-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <span className="font-semibold">
                  Gesamtfeedback abgeben
                </span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Komponente für Modul-Button
interface ModuleButtonProps {
  moduleId: string
  moduleTitle: string
  completed: boolean
  score: number
  progress: number
  onClick: () => void
}

function ModuleButton({ moduleId, moduleTitle, completed, score, progress, onClick }: ModuleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
        completed
          ? 'border-green-500 bg-green-50 hover:bg-green-100'
          : progress > 0
          ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            completed
              ? 'bg-green-500 text-white'
              : progress > 0
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {completed ? <CheckCircle2 className="h-6 w-6" /> : <BookOpen className="h-5 w-5" />}
        </div>
        <div className="text-left">
          <div className="font-semibold text-gray-900">{moduleTitle}</div>
          <div className="text-sm text-gray-600">
            {completed ? `Abgeschlossen - ${score} Punkte` : progress > 0 ? `In Bearbeitung - ${progress}%` : 'Noch nicht begonnen'}
          </div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </button>
  )
}
