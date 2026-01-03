import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { learningAreas, moduleData } from '@/lib/moduleContent'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface FeedbackAnswers {
  overallSatisfaction: number | null
  favoriteModule: string | null
  wouldRecommend: number | null
}

export default function OverallFeedback() {
  const router = useRouter()
  const { area } = router.query
  const [answers, setAnswers] = useState<FeedbackAnswers>({
    overallSatisfaction: null,
    favoriteModule: null,
    wouldRecommend: null
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [existingFeedback, setExistingFeedback] = useState(false)

  const areaId = area as 'jahresrueckblick2025'
  const learningArea = learningAreas[areaId]

  useEffect(() => {
    const checkFeedback = async () => {
      const user = auth.currentUser
      if (!user || !areaId) {
        router.push('/dashboard')
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          if (data.overallFeedback?.[areaId]) {
            setExistingFeedback(true)
            setAnswers(data.overallFeedback[areaId])
          }
        }
      } catch (error) {
        console.error('Error loading feedback:', error)
      }
      setLoading(false)
    }

    checkFeedback()
  }, [areaId, router])

  const handleSubmit = async () => {
    if (!answers.overallSatisfaction || !answers.favoriteModule || !answers.wouldRecommend) {
      alert('Bitte beantworten Sie alle Fragen.')
      return
    }

    const user = auth.currentUser
    if (!user) return

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        [`overallFeedback.${areaId}`]: {
          ...answers,
          submittedAt: new Date().toISOString()
        }
      })
      setSubmitted(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Fehler beim Speichern. Bitte versuchen Sie es erneut.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!learningArea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bereich nicht gefunden</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Zurück zum Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vielen Dank!</h2>
          <p className="text-gray-600 mb-4">
            Ihr Feedback wurde erfolgreich gespeichert.
          </p>
          <p className="text-sm text-gray-500">
            Sie werden automatisch zum Dashboard weitergeleitet...
          </p>
        </div>
      </div>
    )
  }

  const moduleOptions = learningArea.modules.map(moduleId => ({
    id: moduleId,
    title: moduleData[moduleId]?.title || moduleId
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Zurück zum Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💬 Gesamtfeedback
          </h1>
          <p className="text-gray-600 mb-6">
            {existingFeedback 
              ? 'Ihr bisheriges Feedback zu diesem Lernbereich:'
              : 'Bitte teilen Sie uns Ihre Meinung zum gesamten Lernbereich mit.'}
          </p>

          {/* Frage 1: Gesamtzufriedenheit */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              1. Wie fanden Sie den Jahresrückblick 2025 insgesamt?
            </h3>
            <div className="space-y-3">
              {[
                { value: 5, text: '😍 Ausgezeichnet - sehr informativ und gut gemacht', emoji: '😍' },
                { value: 4, text: '😊 Gut - habe viel gelernt', emoji: '😊' },
                { value: 3, text: '😐 Okay - war in Ordnung', emoji: '😐' },
                { value: 2, text: '😕 Nicht so gut - hatte Schwierigkeiten', emoji: '😕' },
                { value: 1, text: '😞 Schlecht - entsprach nicht meinen Erwartungen', emoji: '😞' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setAnswers({ ...answers, overallSatisfaction: option.value })}
                  disabled={existingFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers.overallSatisfaction === option.value
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  } ${existingFeedback ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <span className="text-2xl mr-3">{option.emoji}</span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* Frage 2: Lieblingsmodul */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              2. Welches Modul war am interessantesten für Sie?
            </h3>
            <div className="space-y-3">
              {moduleOptions.map(module => (
                <button
                  key={module.id}
                  onClick={() => setAnswers({ ...answers, favoriteModule: module.id })}
                  disabled={existingFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers.favoriteModule === module.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  } ${existingFeedback ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  {module.title}
                </button>
              ))}
            </div>
          </div>

          {/* Frage 3: Weiterempfehlung */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              3. Würden Sie den Kurs weiterempfehlen?
            </h3>
            <div className="space-y-3">
              {[
                { value: 5, text: '👍 Ja, auf jeden Fall!', emoji: '👍' },
                { value: 4, text: '😊 Ja, wahrscheinlich', emoji: '😊' },
                { value: 3, text: '😐 Vielleicht', emoji: '😐' },
                { value: 2, text: '😕 Eher nicht', emoji: '😕' },
                { value: 1, text: '👎 Nein, definitiv nicht', emoji: '👎' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setAnswers({ ...answers, wouldRecommend: option.value })}
                  disabled={existingFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers.wouldRecommend === option.value
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  } ${existingFeedback ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <span className="text-2xl mr-3">{option.emoji}</span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          {!existingFeedback && (
            <button
              onClick={handleSubmit}
              disabled={!answers.overallSatisfaction || !answers.favoriteModule || !answers.wouldRecommend}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Feedback abschicken
            </button>
          )}

          {existingFeedback && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">
                ✅ Sie haben bereits Feedback abgegeben
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-3 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Zurück zum Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
