import { useState } from 'react'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { CheckCircle2, UserPlus, LogIn, Copy, Check } from 'lucide-react'

// Code-Generator Funktion
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-'
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<'select' | 'register' | 'login'>('select')
  const [code, setCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [lernname, setLernname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('🚀 Registrierung gestartet...')

    try {
      // Generiere einen neuen Code
      const newCode = generateCode()
      console.log('✅ Code generiert:', newCode)

      // Konvertiere Code zu E-Mail und Passwort
      const email = `${newCode}@jrbhep25.internal`
      const password = newCode

      // E-Mail/Passwort Authentifizierung
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const userId = userCredential.user.uid
      console.log('✅ User erstellt mit UID:', userId)

      // Erstelle Benutzerprofil
      await setDoc(doc(db, 'users', userId), {
        lernname,
        code: newCode,
        createdAt: new Date().toISOString(),
        modules: {
          fotos2025: { completed: false, score: 0, progress: 0 },
          jahresanalyse: { completed: false, score: 0, progress: 0 },
          'ki-transformation': { completed: false, score: 0, progress: 0 },
          ausblick2026: { completed: false, score: 0, progress: 0 }
        },
        totalPoints: 0,
        overallProgress: 0
      })
      console.log('✅ Benutzerprofil erstellt')

      // Speichere Code in access_codes Collection
      await setDoc(doc(db, 'access_codes', newCode), {
        code: newCode,
        userId,
        lernname,
        createdAt: new Date().toISOString()
      })
      console.log('✅ Code in access_codes gespeichert')

      // Code anzeigen
      setGeneratedCode(newCode)
      setLoading(false)
      console.log('✅ Registrierung erfolgreich!')
    } catch (err: any) {
      console.error('❌ Registrierungsfehler:', err)
      setError('Fehler bei der Registrierung: ' + err.message)
      setGeneratedCode('')
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Prüfe ob Code existiert in Firestore
      const codeRef = doc(db, 'access_codes', code.toUpperCase())
      const codeDoc = await getDoc(codeRef)

      if (!codeDoc.exists()) {
        setError('❌ Ungültiger Zugangscode')
        setLoading(false)
        return
      }

      // Konvertiere Code zu E-Mail und Passwort
      const email = `${code.toUpperCase()}@jrbhep25.internal`
      const password = code.toUpperCase()

      // E-Mail/Passwort Login
      await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Login erfolgreich!')

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login Error:', err)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('❌ Ungültiger Zugangscode')
      } else {
        setError('Fehler beim Anmelden: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Jahresrückblick 2025
          </h1>
          <p className="text-gray-600">
            Interaktive Lernplattform von hep Verlag
          </p>
        </div>

        {/* Mode Selection */}
        {mode === 'select' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Wie möchtest du starten?
            </h2>

            <button
              onClick={() => setMode('register')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              <UserPlus className="w-5 h-5" />
              <span>Neu registrieren</span>
            </button>

            <button
              onClick={() => setMode('login')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              <span>Mit bestehendem Code einloggen</span>
            </button>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Hinweis:</strong> Bei der Registrierung erhältst du einen persönlichen Code, 
                mit dem du dich jederzeit wieder einloggen kannst.
              </p>
            </div>
          </div>
        )}

        {/* Register Form */}
        {mode === 'register' && !generatedCode && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Registrierung</h2>
              <button
                onClick={() => setMode('select')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Zurück
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="lernname" className="block text-sm font-medium text-gray-700 mb-2">
                  Dein Name oder Nickname
                </label>
                <input
                  id="lernname"
                  type="text"
                  value={lernname}
                  onChange={(e) => setLernname(e.target.value)}
                  placeholder="z.B. Max Mustermann"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required
                  minLength={2}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Dieser Name wird auf deinen Zertifikaten erscheinen.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !lernname.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Code wird generiert...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Code generieren</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Generated Code Display */}
        {mode === 'register' && generatedCode && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Registrierung erfolgreich!
              </h2>
              <p className="text-gray-600">
                Dein persönlicher Zugangscode wurde erstellt.
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-700 mb-3 font-medium text-center">
                🔑 Dein Zugangscode:
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-2xl font-mono font-bold text-center text-blue-600 tracking-wider">
                  {generatedCode}
                </p>
              </div>
              <button
                onClick={copyCode}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Code kopieren</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 font-medium mb-2">
                ⚠️ Wichtig: Speichere diesen Code!
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Schreibe ihn auf oder mache einen Screenshot</li>
                <li>• Du benötigst ihn für zukünftige Logins</li>
                <li>• Der Code kann nicht wiederhergestellt werden</li>
              </ul>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Zum Dashboard →
            </button>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Login</h2>
              <button
                onClick={() => setMode('select')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Zurück
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Zugangscode
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase())
                    setError('')
                  }}
                  placeholder="z.B. ABCD-1234-EFGH"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono tracking-wider uppercase"
                  disabled={loading}
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Wird überprüft...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Einloggen</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Tipp:</strong> Dein Zugangscode besteht aus 12 Zeichen 
                (Format: XXXX-XXXX-XXXX).
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2025 hep Verlag. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </div>
  )
}
