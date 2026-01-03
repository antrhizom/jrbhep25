import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { 
  ArrowLeft, 
  CheckCircle, 
  X, 
  Trophy, 
  Play, 
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react'
import { moduleData, ModuleContent, QuizQuestion, AccordionItem } from '@/lib/moduleContent'
import { AIDisclaimer } from '@/components/AIDisclaimer'

// Fisher-Yates Shuffle Algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function ModulePage() {
  const router = useRouter()
  const { id } = router.query
  const [module, setModule] = useState<ModuleContent | null>(null)
  const [currentStep, setCurrentStep] = useState<'intro' | 'terminology' | 'interactive' | 'survey' | 'knowledge' | 'quiz'>('intro')
  const [surveyStepIndex, setSurveyStepIndex] = useState(0)  // Für jahresanalyse: 0-5 (Umfragen & Ergebnisse & Feedback)
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number[] | number | null }>({}) // Jetzt auch Array für Multi-Select
  const [accordionAnswers, setAccordionAnswers] = useState<{ [key: string]: number | null }>({}) // Accordion ID → gewählte Option
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([])
  const [openAccordions, setOpenAccordions] = useState<string[]>([]) // Für Accordion-State
  const [terminologyQuizCompleted, setTerminologyQuizCompleted] = useState(false) // Für KI-Begriffs-Quiz
  const [terminologyAnswers, setTerminologyAnswers] = useState<{ [key: number]: number | null }>({}) // Terminology Quiz Antworten
  const [selectedAccordionQuestions, setSelectedAccordionQuestions] = useState<string[]>([]) // Für KI: 5 zufällige Accordion-Fragen
  const [shuffledAccordionItems, setShuffledAccordionItems] = useState<AccordionItem[]>([]) // Accordion items mit geshuffleten Optionen

  useEffect(() => {
    if (router.isReady && id) {
      const moduleId = id as string
      const moduleContent = moduleData[moduleId]
      
      if (!moduleContent) {
        router.push('/dashboard')
        return
      }
      
      setModule(moduleContent)
      
      // Variables to hold shuffled data for loadSavedProgress
      let finalShuffledQuestions: QuizQuestion[] = []
      let finalShuffledAccordionItems: AccordionItem[] = []
      
      // Shuffle Accordion Control Question Options (damit nicht immer mittlere Antwort korrekt ist)
      if (moduleContent.accordionItems) {
        const shuffledItems = moduleContent.accordionItems.map(item => {
          if (item.controlQuestion) {
            return {
              ...item,
              controlQuestion: {
                ...item.controlQuestion,
                options: shuffleArray(item.controlQuestion.options)
              }
            }
          }
          return item
        })
        finalShuffledAccordionItems = shuffledItems
        setShuffledAccordionItems(shuffledItems)
        
        // Für KI-Transformation: Wähle 5 zufällige Accordion-Fragen NACH dem Shufflen
        if (moduleId === 'ki-transformation') {
          const accordionIds = shuffledItems
            .filter(item => item.controlQuestion)
            .map(item => item.id)
          
          const shuffledIds = shuffleArray(accordionIds)
          setSelectedAccordionQuestions(shuffledIds.slice(0, Math.min(5, shuffledIds.length)))
        }
      }
      
      // Setze currentStep auf 'terminology' für KI-Modul, 'interactive' wenn kein Video
      if (moduleId === 'ki-transformation') {
        setCurrentStep('terminology')
      } else if (!moduleContent.videoTitle) {
        setCurrentStep('interactive')
      }
      
      // Shuffle quiz questions and their options
      if (moduleId === 'jahresanalyse') {
        // Für jahresanalyse: Keine Fragen mischen, nur Optionen
        const shuffled = moduleContent.quizQuestions.map(q => ({
          ...q,
          options: q.type === 'survey' || q.type === 'survey_results' 
            ? q.options  // Survey-Optionen nicht mischen
            : shuffleArray(q.options)  // Feedback-Optionen mischen
        }))
        finalShuffledQuestions = shuffled
        setShuffledQuestions(shuffled)  // Reihenfolge beibehalten
      } else if (moduleId === 'ki-transformation') {
        // Für KI-Transformation: Erste 8 Fragen sind Terminologie (nicht mischen)
        // Restliche Fragen sind Feedback-Fragen (mischen)
        const terminologyQuizCount = 8
        const terminologyQuestions = moduleContent.quizQuestions.slice(0, terminologyQuizCount).map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }))
        const feedbackQuestions = moduleContent.quizQuestions.slice(terminologyQuizCount).map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }))
        
        // Kombiniere: Terminologie zuerst (nicht mischen), dann Feedback (mischen)
        const combined = [...terminologyQuestions, ...shuffleArray(feedbackQuestions)]
        finalShuffledQuestions = combined
        setShuffledQuestions(combined)
      } else {
        // Für andere Module: Fragen und Optionen mischen
        const shuffled = moduleContent.quizQuestions.map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }))
        const finalShuffled = shuffleArray(shuffled)
        finalShuffledQuestions = finalShuffled
        setShuffledQuestions(finalShuffled)
      }
      
      setLoading(false)
      
      // Load saved progress
      const loadSavedProgress = async () => {
        const user = auth.currentUser
        if (!user) {
          console.log('⚠️ No user logged in, cannot load progress')
          return
        }

        try {
          const userRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userRef)
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            const savedModule = userData.modules?.[moduleId]
            
            console.log('📥 Loading saved progress for', moduleId, ':', savedModule)
            
            if (savedModule) {
              // Restore saved answers - CONVERT FROM TEXT TO INDEX
              if (savedModule.quizAnswers) {
                console.log('📥 Loading quizAnswers (text):', savedModule.quizAnswers)
                
                // 🔄 Convert TEXT to INDEX for UI
                const quizAnswersIndices = convertQuizAnswersToIndices(
                  savedModule.quizAnswers,
                  finalShuffledQuestions  // Use the freshly shuffled questions
                )
                
                console.log('✅ Converted to indices:', quizAnswersIndices)
                setQuizAnswers(quizAnswersIndices)
              } else {
                console.log('ℹ️ No quizAnswers to restore')
              }
              
              if (savedModule.accordionAnswers) {
                console.log('📥 Loading accordionAnswers (text):', savedModule.accordionAnswers)
                
                // 🔄 Convert TEXT to INDEX for UI
                const accordionAnswersIndices = convertAccordionAnswersToIndices(
                  savedModule.accordionAnswers,
                  finalShuffledAccordionItems  // Use the freshly shuffled items
                )
                
                console.log('✅ Converted to indices:', accordionAnswersIndices)
                setAccordionAnswers(accordionAnswersIndices)
              } else {
                console.log('ℹ️ No accordionAnswers to restore')
              }
              
              if (savedModule.terminologyAnswers) {
                console.log('📥 Loading terminologyAnswers (text):', savedModule.terminologyAnswers)
                
                // 🔄 Convert TEXT to INDEX for UI
                const terminologyAnswersIndices = convertTerminologyAnswersToIndices(
                  savedModule.terminologyAnswers,
                  finalShuffledQuestions
                )
                
                console.log('✅ Converted to indices:', terminologyAnswersIndices)
                setTerminologyAnswers(terminologyAnswersIndices)
              } else {
                console.log('ℹ️ No terminologyAnswers to restore')
              }
              
              if (savedModule.terminologyQuizCompleted) {
                console.log('✅ Restoring terminologyQuizCompleted:', savedModule.terminologyQuizCompleted)
                setTerminologyQuizCompleted(savedModule.terminologyQuizCompleted)
              }
              // Don't restore currentStep - always start from beginning
              
              console.log('✅ Progress loaded successfully!')
            } else {
              console.log('ℹ️ No saved module data found for', moduleId)
            }
          } else {
            console.log('❌ User document does not exist')
          }
        } catch (error) {
          console.error('❌ Error loading saved progress:', error)
        }
      }
      
      loadSavedProgress()
    }
  }, [router, id])

  // Mark module as started - runs when module is loaded
  useEffect(() => {
    const markModuleAsStarted = async () => {
      if (!module || !auth.currentUser) return

      try {
        const userRef = doc(db, 'users', auth.currentUser.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const modules = userData.modules || {}
          
          const existingModule = modules[module.id]
          console.log('📂 Existing module data:', existingModule)
          
          // Only mark as started if not already started
          if (!existingModule || existingModule.progress === 0) {
            // PRESERVE all existing data, only add missing fields
            modules[module.id] = {
              ...existingModule,  // Keep ALL existing data (quizAnswers, accordionAnswers, etc.)
              completed: existingModule?.completed ?? false,
              score: existingModule?.score ?? 0,
              progress: existingModule?.progress ?? 1  // Set to 1 if doesn't exist
            }
            
            console.log('📝 Marking module as started (preserving existing data):', modules[module.id])
            await updateDoc(userRef, { modules })
            console.log('✅ Module marked as started:', module.id)
          } else {
            console.log('ℹ️ Module already started, not modifying')
          }
        }
      } catch (error) {
        console.error('Error marking module as started:', error)
      }
    }
    
    markModuleAsStarted()
  }, [module])

  // Auto-save on initial module load (important for modules like fotos2025 without quiz/accordion)
  useEffect(() => {
    if (module && auth.currentUser) {
      const timer = setTimeout(() => {
        autoSaveProgress() // Save that module was visited
      }, 2000) // Save 2 seconds after module load
      
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]) // Only on mount/module change, intentionally not including autoSaveProgress

  // Auto-save progress function (wrapped in useCallback for stability)
  const autoSaveProgress = useCallback(async () => {
    console.log('🔵 autoSaveProgress called for', module?.id)
    
    if (!module) {
      console.log('❌ No module, skipping save')
      return
    }
    
    const user = auth.currentUser
    if (!user) {
      console.log('❌ No user logged in, skipping save')
      return
    }

    console.log('🔄 Attempting to save:', {
      moduleId: module.id,
      quizAnswers,
      accordionAnswers,
      terminologyAnswers
    })

    try {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const modules = userData.modules || {}
        
        // 🔄 Convert answers from INDEX to TEXT for storage
        const quizAnswersText = convertQuizAnswersToText(quizAnswers, shuffledQuestions)
        const accordionAnswersText = convertAccordionAnswersToText(accordionAnswers, shuffledAccordionItems)
        const terminologyAnswersText = convertTerminologyAnswersToText(terminologyAnswers, shuffledQuestions)
        
        console.log('🔄 Converted to text for storage:', {
          quizAnswersText,
          accordionAnswersText,
          terminologyAnswersText
        })
        
        // Save current state
        modules[module.id] = {
          ...modules[module.id],
          quizAnswers: quizAnswersText,  // 📝 Store as TEXT not index
          accordionAnswers: accordionAnswersText,  // 📝 Store as TEXT not index
          terminologyAnswers: terminologyAnswersText,  // 📝 Store as TEXT not index
          terminologyQuizCompleted: terminologyQuizCompleted,
          currentStep: currentStep,
          lastUpdated: new Date().toISOString()
        }
        
        console.log('💾 Saving to Firebase:', modules[module.id])
        
        await updateDoc(userRef, {
          modules
        })
        
        console.log('✅ Progress saved successfully for', module.id)
      } else {
        console.log('❌ User document does not exist')
      }
    } catch (error) {
      console.error('❌ Error auto-saving progress:', error)
    }
  }, [module, quizAnswers, accordionAnswers, terminologyAnswers, terminologyQuizCompleted, currentStep, shuffledQuestions, shuffledAccordionItems])

  // Auto-save whenever answers change (for ALL modules)
  useEffect(() => {
    console.log('🟡 useEffect triggered - checking conditions:', {
      hasModule: !!module,
      hasUser: !!auth.currentUser,
      moduleId: module?.id,
      quizAnswersCount: Object.keys(quizAnswers).length,
      accordionAnswersCount: Object.keys(accordionAnswers).length
    })
    
    if (module && auth.currentUser) {
      console.log('✅ Conditions met, setting timer for auto-save')
      const timer = setTimeout(() => {
        console.log('⏰ Timer fired, calling autoSaveProgress')
        autoSaveProgress()
      }, 1000) // Save 1 second after last change
      
      return () => {
        console.log('🧹 Cleaning up timer')
        clearTimeout(timer)
      }
    } else {
      console.log('⚠️ Conditions not met for auto-save')
    }
  }, [quizAnswers, accordionAnswers, terminologyAnswers, currentStep, module, autoSaveProgress])

  // 🔄 HELPER: Convert quiz answers from index to text (for saving)
  const convertQuizAnswersToText = (
    answers: typeof quizAnswers,
    questions: QuizQuestion[]
  ): { [key: number]: string | string[] } => {
    const textAnswers: { [key: number]: string | string[] } = {}
    
    Object.keys(answers).forEach(qIndexStr => {
      const qIndex = parseInt(qIndexStr)
      const answer = answers[qIndex]
      const question = questions[qIndex]
      
      if (!question) {
        console.warn(`⚠️ Question ${qIndex} not found in questions array!`)
        return
      }
      
      if (Array.isArray(answer)) {
        // Multi-select: array of indices → array of texts
        textAnswers[qIndex] = answer.map(optIndex => 
          question.options[optIndex]?.text || ''
        ).filter(text => text !== '')
      } else if (typeof answer === 'number') {
        // Single select: index → text
        textAnswers[qIndex] = question.options[answer]?.text || ''
      }
    })
    
    return textAnswers
  }
  
  // 🔄 HELPER: Convert quiz answers from text to index (for loading)
  // SUPPORTS BOTH: Text (new) AND Index (old/legacy) formats!
  const convertQuizAnswersToIndices = (
    textAnswers: { [key: number]: string | string[] | number | number[] },  // ⚠️ Can be text OR number!
    questions: QuizQuestion[]
  ): typeof quizAnswers => {
    const indexAnswers: typeof quizAnswers = {}
    
    console.log('🔄 convertQuizAnswersToIndices called:', {
      textAnswersCount: Object.keys(textAnswers).length,
      questionsCount: questions.length,
      textAnswers,
      questionTitles: questions.map((q, i) => `${i}: ${q.question.substring(0, 50)}...`)
    })
    
    Object.keys(textAnswers).forEach(qIndexStr => {
      const qIndex = parseInt(qIndexStr)
      const answer = textAnswers[qIndex]
      const question = questions[qIndex]
      
      console.log(`📝 Processing question ${qIndex}:`, {
        hasQuestion: !!question,
        questionText: question?.question?.substring(0, 50),
        answer,
        answerType: typeof answer,
        isArray: Array.isArray(answer),
        optionsTexts: question?.options?.map(opt => opt.text)
      })
      
      if (!question) {
        console.warn(`⚠️ Question ${qIndex} not found in questions array!`)
        return
      }
      
      // 🔥 LEGACY SUPPORT: If answer is already a number or number[], just use it!
      if (typeof answer === 'number') {
        console.log(`✅ Legacy format detected (number): ${answer}`)
        indexAnswers[qIndex] = answer
        return
      }
      
      if (Array.isArray(answer) && answer.length > 0 && typeof answer[0] === 'number') {
        console.log(`✅ Legacy format detected (number[]): ${answer}`)
        indexAnswers[qIndex] = answer as number[]
        return
      }
      
      // NEW FORMAT: Convert text to index
      if (Array.isArray(answer)) {
        // Multi-select: array of texts → array of indices
        const indices = answer
          .map((text, i) => {
            if (typeof text === 'number') {
              console.log(`  Multi-select item ${i}: already index ${text}`)
              return text
            }
            const index = question.options.findIndex(opt => opt.text === text)
            console.log(`  Multi-select text ${i}: "${text}" → index ${index}`)
            return index
          })
          .filter(idx => idx !== -1)
        indexAnswers[qIndex] = indices
        console.log(`✅ Question ${qIndex} converted (multi):`, indices)
      } else if (typeof answer === 'string') {
        // Single select: text → index
        const index = question.options.findIndex(opt => opt.text === answer)
        console.log(`  Single-select: "${answer}" → index ${index}`)
        if (index !== -1) {
          indexAnswers[qIndex] = index
          console.log(`✅ Question ${qIndex} converted (single): ${index}`)
        } else {
          console.warn(`⚠️ Question ${qIndex}: Text "${answer}" not found in options!`)
        }
      } else {
        console.warn(`⚠️ Question ${qIndex} has unexpected answer type:`, typeof answer)
      }
    })
    
    console.log('🎯 Final converted index answers:', indexAnswers)
    return indexAnswers
  }
  
  // 🔄 HELPER: Convert accordion answers from index to text (for saving)
  const convertAccordionAnswersToText = (
    answers: typeof accordionAnswers,
    items: AccordionItem[]
  ): { [key: string]: string } => {
    const textAnswers: { [key: string]: string } = {}
    
    Object.keys(answers).forEach(itemId => {
      const optIndex = answers[itemId]
      const item = items.find(i => i.id === itemId)
      
      if (item?.controlQuestion && typeof optIndex === 'number') {
        textAnswers[itemId] = item.controlQuestion.options[optIndex]?.text || ''
      }
    })
    
    return textAnswers
  }
  
  // 🔄 HELPER: Convert accordion answers from text to index (for loading)
  // SUPPORTS BOTH: Text (new) AND Index (old/legacy) formats!
  const convertAccordionAnswersToIndices = (
    textAnswers: { [key: string]: string | number },  // ⚠️ Can be text OR number!
    items: AccordionItem[]
  ): typeof accordionAnswers => {
    const indexAnswers: typeof accordionAnswers = {}
    
    Object.keys(textAnswers).forEach(itemId => {
      const answer = textAnswers[itemId]
      const item = items.find(i => i.id === itemId)
      
      if (!item?.controlQuestion) return
      
      // 🔥 LEGACY SUPPORT: If answer is already a number, just use it!
      if (typeof answer === 'number') {
        console.log(`✅ Accordion ${itemId}: Legacy format (number) ${answer}`)
        indexAnswers[itemId] = answer
        return
      }
      
      // NEW FORMAT: Convert text to index
      if (typeof answer === 'string') {
        const index = item.controlQuestion.options.findIndex(opt => opt.text === answer)
        if (index !== -1) {
          indexAnswers[itemId] = index
          console.log(`✅ Accordion ${itemId}: "${answer}" → index ${index}`)
        } else {
          console.warn(`⚠️ Accordion ${itemId}: Text "${answer}" not found!`)
        }
      }
    })
    
    return indexAnswers
  }

  // 🔄 HELPER: Convert terminology answers from index to text (for saving)
  const convertTerminologyAnswersToText = (
    answers: typeof terminologyAnswers,
    questions: QuizQuestion[]
  ): { [key: number]: string } => {
    const textAnswers: { [key: number]: string } = {}
    
    Object.keys(answers).forEach(qIndexStr => {
      const qIndex = parseInt(qIndexStr)
      const optIndex = answers[qIndex]
      const question = questions[qIndex]
      
      if (!question) {
        console.warn(`⚠️ Terminology Question ${qIndex} not found!`)
        return
      }
      
      if (typeof optIndex === 'number') {
        textAnswers[qIndex] = question.options[optIndex]?.text || ''
      }
    })
    
    return textAnswers
  }

  // 🔄 HELPER: Convert terminology answers from text to index (for loading)
  // SUPPORTS BOTH: Text (new) AND Index (old/legacy) formats!
  const convertTerminologyAnswersToIndices = (
    textAnswers: { [key: number]: string | number },  // ⚠️ Can be text OR number!
    questions: QuizQuestion[]
  ): typeof terminologyAnswers => {
    const indexAnswers: typeof terminologyAnswers = {}
    
    Object.keys(textAnswers).forEach(qIndexStr => {
      const qIndex = parseInt(qIndexStr)
      const answer = textAnswers[qIndex]
      const question = questions[qIndex]
      
      if (!question) {
        console.warn(`⚠️ Terminology Question ${qIndex} not found!`)
        return
      }
      
      // 🔥 LEGACY SUPPORT: If answer is already a number, just use it!
      if (typeof answer === 'number') {
        console.log(`✅ Terminology Q${qIndex}: Legacy format (number) ${answer}`)
        indexAnswers[qIndex] = answer
        return
      }
      
      // NEW FORMAT: Convert text to index
      if (typeof answer === 'string') {
        const index = question.options.findIndex(opt => opt.text === answer)
        if (index !== -1) {
          indexAnswers[qIndex] = index
          console.log(`✅ Terminology Q${qIndex}: "${answer}" → index ${index}`)
        } else {
          console.warn(`⚠️ Terminology Q${qIndex}: Text "${answer}" not found!`)
        }
      }
    })
    
    return indexAnswers
  }

  const handleQuizAnswer = (questionIndex: number, optionIndex: number) => {
    console.log('📝 handleQuizAnswer called:', { questionIndex, optionIndex })
    
    if (showQuizResults) {
      console.log('⚠️ Quiz results already shown, ignoring answer')
      return
    }
    
    const question = shuffledQuestions[questionIndex]
    
    // Multi-Select: Toggle selection
    if (question.multipleCorrect) {
      setQuizAnswers(prev => {
        const current = prev[questionIndex]
        const currentArray = Array.isArray(current) ? current : []
        
        let newAnswers
        if (currentArray.includes(optionIndex)) {
          // Deselect
          newAnswers = {
            ...prev,
            [questionIndex]: currentArray.filter(i => i !== optionIndex)
          }
          console.log('✏️ Quiz answer updated (multi-select deselect):', newAnswers)
        } else {
          // Select
          newAnswers = {
            ...prev,
            [questionIndex]: [...currentArray, optionIndex]
          }
          console.log('✏️ Quiz answer updated (multi-select select):', newAnswers)
        }
        
        // 🔥 DIRECT SAVE - Don't wait for useEffect
        setTimeout(() => {
          console.log('💾 Direct save triggered for quiz answer')
          saveProgressDirectly(newAnswers, accordionAnswers, terminologyAnswers)
        }, 100)
        
        return newAnswers
      })
    } else {
      // Single Select: Replace selection
      setQuizAnswers(prev => {
        const newAnswers = {
          ...prev,
          [questionIndex]: optionIndex
        }
        console.log('✏️ Quiz answer updated (single-select):', newAnswers)
        
        // 🔥 DIRECT SAVE - Don't wait for useEffect
        setTimeout(() => {
          console.log('💾 Direct save triggered for quiz answer')
          saveProgressDirectly(newAnswers, accordionAnswers, terminologyAnswers)
        }, 100)
        
        return newAnswers
      })
    }
  }
  
  // 🔥 NEW: Direct save function that doesn't rely on state
  const saveProgressDirectly = async (
    currentQuizAnswers: typeof quizAnswers,
    currentAccordionAnswers: typeof accordionAnswers,
    currentTerminologyAnswers: typeof terminologyAnswers
  ) => {
    if (!module || !auth.currentUser) {
      console.log('❌ Cannot save: no module or user')
      return
    }
    
    console.log('🚀 saveProgressDirectly called with:', {
      quizAnswers: currentQuizAnswers,
      accordionAnswers: currentAccordionAnswers,
      terminologyAnswers: currentTerminologyAnswers
    })
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userDoc = await getDoc(userRef)
      
      if (!userDoc.exists()) {
        console.log('❌ User document does not exist')
        return
      }
      
      const userData = userDoc.data()
      const modules = userData.modules || {}
      
      // Get existing module data
      const existingModule = modules[module.id] || {}
      
      // 🔄 Convert answers from INDEX to TEXT for storage
      const quizAnswersText = convertQuizAnswersToText(currentQuizAnswers, shuffledQuestions)
      const accordionAnswersText = convertAccordionAnswersToText(currentAccordionAnswers, shuffledAccordionItems)
      const terminologyAnswersText = convertTerminologyAnswersToText(currentTerminologyAnswers, shuffledQuestions)
      
      console.log('🔄 Converted to text for storage:', {
        quizAnswersText,
        accordionAnswersText,
        terminologyAnswersText
      })
      
      // Save current state - PRESERVE progress, score, completed
      modules[module.id] = {
        ...existingModule,  // Preserve ALL existing fields
        completed: existingModule.completed ?? false,
        score: existingModule.score ?? 0,
        progress: existingModule.progress ?? 1,  // ⚠️ CRITICAL: Set progress so markModuleAsStarted doesn't reset!
        quizAnswers: quizAnswersText,  // 📝 Store as TEXT not index
        accordionAnswers: accordionAnswersText,  // 📝 Store as TEXT not index
        terminologyAnswers: terminologyAnswersText,  // 📝 Store as TEXT not index
        terminologyQuizCompleted: terminologyQuizCompleted,
        currentStep: currentStep,
        lastUpdated: new Date().toISOString()
      }
      
      console.log('💾 Saving directly to Firebase (with all fields):', modules[module.id])
      
      await updateDoc(userRef, { modules })
      
      console.log('✅✅✅ DIRECT SAVE SUCCESSFUL for', module.id)
    } catch (error) {
      console.error('❌ Error in direct save:', error)
    }
  }
  
  const handleSubmitQuiz = async () => {
    if (!module || showQuizResults) return
    
    let totalScore = 0
    
    // Special scoring for jahresanalyse module
    if (module.id === 'jahresanalyse') {
      // 1. Accordion control questions: 5 questions × 10 points = 50 points
      let accordionScore = 0
      if (shuffledAccordionItems) {
        shuffledAccordionItems.forEach(item => {
          if (item.controlQuestion) {
            const selectedOptionIndex = accordionAnswers[item.id]
            if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
              const selectedOption = item.controlQuestion.options[selectedOptionIndex]
              if (selectedOption && selectedOption.isCorrect) {
                accordionScore += 10
              }
            }
          }
        })
      }
      
      // 2. Survey completion confirmations: 2 confirmations × 10 points = 20 points
      // 3. Survey results viewing: 2 results × 5 points = 10 points
      // 4. Feedback questions: 3 questions = 20 points total
      let quizScore = 0
      let feedbackCount = 0
      let feedbackCompleted = 0
      
      shuffledQuestions.forEach((question, qIndex) => {
        const selectedAnswer = quizAnswers[qIndex]
        
        if (question.type === 'knowledge') {
          // Survey completion confirmations: 10 points each
          if (selectedAnswer !== null && selectedAnswer !== undefined) {
            quizScore += 10
          }
        } else if (question.type === 'survey_results') {
          // Survey results viewing: 5 points each (automatic when clicked through)
          if (selectedAnswer !== null && selectedAnswer !== undefined) {
            quizScore += 5
          }
        } else if (question.type === 'feedback') {
          // Count feedback questions
          feedbackCount++
          if (selectedAnswer !== null && selectedAnswer !== undefined) {
            feedbackCompleted++
          }
        }
      })
      
      // Feedback: 20 points total distributed based on completion percentage
      const feedbackScore = feedbackCount > 0 
        ? Math.round((feedbackCompleted / feedbackCount) * 20)
        : 0
      
      totalScore = accordionScore + quizScore + feedbackScore
      
    } else if (module.id === 'fotos2025') {
      // Fotos2025 scoring: 3 Accordion questions + 4 Feedback questions
      // All feedback questions count (no right/wrong), accordion questions have correct answers
      
      // 1. Accordion control questions: 3 questions × 17 points ≈ 50 points
      let accordionScore = 0
      if (shuffledAccordionItems) {
        shuffledAccordionItems.forEach(item => {
          if (item.controlQuestion) {
            const selectedOptionIndex = accordionAnswers[item.id]
            if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
              const selectedOption = item.controlQuestion.options[selectedOptionIndex]
              if (selectedOption && selectedOption.isCorrect) {
                accordionScore += 17  // ~50 points for 3 questions
              }
            }
          }
        })
      }
      
      // 2. Feedback questions: 4 questions × 12.5 points = 50 points
      // All feedback answers count (just need to answer)
      let feedbackScore = 0
      shuffledQuestions.forEach((question, qIndex) => {
        const selectedAnswer = quizAnswers[qIndex]
        if (selectedAnswer !== null && selectedAnswer !== undefined) {
          feedbackScore += 12.5  // Each answered feedback question = 12.5 points
        }
      })
      
      totalScore = Math.round(accordionScore + feedbackScore)
      console.log('✅ Fotos2025 Score calculated:', { accordionScore, feedbackScore, totalScore, quizAnswers, accordionAnswers })
      
    } else {
      // Original scoring logic for other modules
      // Calculate score from Quiz questions
      let correctQuizAnswers = 0
      shuffledQuestions.forEach((question, qIndex) => {
        const selectedAnswer = quizAnswers[qIndex]
        
        if (question.multipleCorrect) {
          // Multi-Select: Check if all correct options are selected and no incorrect ones
          const selectedIndices = Array.isArray(selectedAnswer) ? selectedAnswer : []
          const correctIndices = question.options
            .map((opt, idx) => opt.correct ? idx : -1)
            .filter(idx => idx !== -1)
          
          // Check if arrays match (all correct selected, no incorrect selected)
          const allCorrectSelected = correctIndices.every(idx => selectedIndices.includes(idx))
          const noIncorrectSelected = selectedIndices.every(idx => question.options[idx].correct)
          
          if (allCorrectSelected && noIncorrectSelected) {
            correctQuizAnswers++
          }
        } else {
          // Single Select: Check if the selected option is correct
          if (selectedAnswer !== null && selectedAnswer !== undefined && typeof selectedAnswer === 'number') {
            if (question.options[selectedAnswer].correct) {
              correctQuizAnswers++
            }
          }
        }
      })
      
      // Calculate score from Accordion control questions
      let correctAccordionAnswers = 0
      let totalAccordionQuestions = 0
      
      if (shuffledAccordionItems) {
        shuffledAccordionItems.forEach(item => {
          if (item.controlQuestion) {
            totalAccordionQuestions++
            const selectedOptionIndex = accordionAnswers[item.id]
            if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
              const selectedOption = item.controlQuestion.options[selectedOptionIndex]
              if (selectedOption && selectedOption.isCorrect) {
                correctAccordionAnswers++
              }
            }
          }
        })
      }
      
      // Calculate total score
      // If there are accordion questions, split points 50/50 between quiz and accordions
      // Otherwise, all points from quiz
      if (totalAccordionQuestions > 0) {
        const quizPoints = Math.round((correctQuizAnswers / shuffledQuestions.length) * (module.maxPoints / 2))
        const accordionPoints = Math.round((correctAccordionAnswers / totalAccordionQuestions) * (module.maxPoints / 2))
        totalScore = quizPoints + accordionPoints
      } else {
        totalScore = Math.round((correctQuizAnswers / shuffledQuestions.length) * module.maxPoints)
      }
    }
    
    setScore(totalScore)
    setShowQuizResults(true)
    
    // Save to Firebase
    const user = auth.currentUser
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const modules = userData.modules || {}
          
          // Get existing module data to preserve answers
          const existingModule = modules[module.id] || {}
          
          // 🔄 Convert answers from INDEX to TEXT for storage
          const quizAnswersText = convertQuizAnswersToText(quizAnswers, shuffledQuestions)
          const accordionAnswersText = convertAccordionAnswersToText(accordionAnswers, shuffledAccordionItems)
          const terminologyAnswersText = convertTerminologyAnswersToText(terminologyAnswers, shuffledQuestions)
          
          console.log('🎯 Quiz submitted! Existing module data:', existingModule)
          console.log('🎯 Current answers to save (as text):', {
            quizAnswersText,
            accordionAnswersText,
            terminologyAnswersText
          })
          
          // Update module progress - PRESERVE ALL EXISTING DATA
          modules[module.id] = {
            ...existingModule,  // ⚠️ CRITICAL: Keep ALL existing data!
            completed: true,
            score: totalScore,
            progress: 100,
            // Explicitly save current answers AS TEXT
            quizAnswers: quizAnswersText,  // 📝 Store as TEXT not index
            accordionAnswers: accordionAnswersText,  // 📝 Store as TEXT not index
            terminologyAnswers: terminologyAnswersText,  // 📝 Store as TEXT not index
            terminologyQuizCompleted: terminologyQuizCompleted,
            currentStep: currentStep,
            lastUpdated: new Date().toISOString()
          }
          
          console.log('💾 Saving quiz completion to Firebase (with text):', modules[module.id])
          
          // Calculate total points
          let totalPoints = 0
          Object.values(modules).forEach((m: any) => {
            totalPoints += m.score || 0
          })
          
          // Award badge for this module (if not already awarded)
          const badges = userData.badges || {}
          if (!badges[module.id]) {
            badges[module.id] = {
              moduleId: module.id,
              moduleName: module.title,
              lerncode: userData.code,  // Fixed: use 'code' not 'lerncode'
              issuedAt: new Date().toISOString()
            }
          }
          
          await updateDoc(userRef, {
            modules,
            badges,
            totalPoints,
            overallProgress: Math.round((totalPoints / 400) * 100) // 400 = total max points (4 modules × 100)
          })
          
          // Save survey responses to Firestore for aggregation
          const { collection, addDoc } = await import('firebase/firestore')
          for (let qIndex = 0; qIndex < shuffledQuestions.length; qIndex++) {
            const selectedAnswer = quizAnswers[qIndex]
            const question = shuffledQuestions[qIndex]
            
            if (selectedAnswer !== null && selectedAnswer !== undefined) {
              // Convert answer to text for consistent aggregation
              let selectedOptionText: string | string[]
              
              if (Array.isArray(selectedAnswer)) {
                // Multi-select: array of indices → array of texts
                selectedOptionText = selectedAnswer.map(optIndex => 
                  question.options[optIndex]?.text || ''
                ).filter(text => text !== '')
              } else if (typeof selectedAnswer === 'number') {
                // Single select: index → text
                selectedOptionText = question.options[selectedAnswer]?.text || ''
              } else {
                continue // Skip invalid answers
              }
              
              await addDoc(collection(db, 'survey_responses'), {
                moduleId: module.id,
                questionIndex: qIndex,
                questionText: question.question,
                selectedOption: selectedOptionText,  // 📝 Store as TEXT not index
                userId: user.uid,
                timestamp: new Date()
              })
            }
          }
          
          // Load aggregated results
          await loadAggregatedResults()
        }
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    }
  }

  // Function to load aggregated results from Firestore
  const loadAggregatedResults = async () => {
    if (!module) return
    
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const responsesQuery = query(
        collection(db, 'survey_responses'),
        where('moduleId', '==', module.id)
      )
      
      const snapshot = await getDocs(responsesQuery)
      const responses: any[] = []
      snapshot.forEach(doc => {
        responses.push(doc.data())
      })
      
      // Calculate aggregated results per question
      const aggregated: { [qIndex: number]: { [optIndex: number]: number } } = {}
      
      shuffledQuestions.forEach((question, qIndex) => {
        aggregated[qIndex] = {}
        
        // Get all responses for this question
        const questionResponses = responses.filter(r => r.questionIndex === qIndex)
        const total = questionResponses.length
        
        if (total > 0) {
          // Count responses per option TEXT (not index)
          const counts: { [optText: string]: number } = {}
          questionResponses.forEach(r => {
            const optText = r.selectedOption
            if (typeof optText === 'string') {
              counts[optText] = (counts[optText] || 0) + 1
            } else if (Array.isArray(optText)) {
              // Multi-select: count each selected option
              optText.forEach(text => {
                counts[text] = (counts[text] || 0) + 1
              })
            }
          })
          
          // Map text counts back to current option indices
          question.options.forEach((option, optIdx) => {
            const count = counts[option.text] || 0
            aggregated[qIndex][optIdx] = Math.round((count / total) * 100)
          })
        }
      })
      
      // Update module's aggregatedResults in state
      setShuffledQuestions(prev => prev.map((q, qIdx) => ({
        ...q,
        aggregatedResults: aggregated[qIdx] || {}
      })))
    } catch (error) {
      console.error('Error loading aggregated results:', error)
    }
  }

  const handleReset = async () => {
    if (!module) return
    
    const user = auth.currentUser
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const modules = userData.modules || {}
          
          // Reset this module
          modules[module.id] = {
            completed: false,
            score: 0,
            progress: 0
          }
          
          // Recalculate total points
          let totalPoints = 0
          Object.values(modules).forEach((m: any) => {
            totalPoints += m.score || 0
          })
          
          await updateDoc(userRef, {
            modules,
            totalPoints,
            overallProgress: Math.round((totalPoints / 400) * 100)
          })
        }
        
        // Reset local state and reshuffle
        setCurrentStep('intro')
        setQuizAnswers({})
        setShowQuizResults(false)
        setScore(0)
        setShowResetConfirm(false)
        setOpenAccordions([]) // Reset Accordion state
        
        // Reshuffle questions
        const shuffled = module.quizQuestions.map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }))
        setShuffledQuestions(shuffleArray(shuffled))
        
      } catch (error) {
        console.error('Error resetting module:', error)
      }
    }
  }

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => 
      prev.includes(id) 
        ? prev.filter(accId => accId !== id)
        : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!module) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Zurück</span>
            </button>
            <div className="flex items-center gap-4">
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
                              <strong class="text-yellow-700">Wichtig:</strong> Alle Inhalte wurden von hep Verlag geprüft und freigegeben. 
                              Die sachliche Korrektheit und pädagogische Eignung sind sichergestellt.
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
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors text-sm"
                title="KI-Informationen"
              >
                <Info className="h-4 w-4" />
                <span>KI-Info</span>
              </button>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">{module.maxPoints} Punkte möglich</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4">{module.title}</h1>
          <p className="text-blue-100 mt-2">{module.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-blue-100">
            <span>⏱ {module.duration}</span>
            <span className="px-2 py-1 bg-blue-700 rounded">
              Jahresrückblick 2025
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section - Video Placeholder (nur wenn vorhanden) */}
        {currentStep === 'intro' && module.videoTitle && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <Play className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.videoTitle}</h2>
                <p className="text-gray-600">{module.videoDescription}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-12 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-10 w-10 text-white" />
                </div>
                <p className="text-gray-700 text-lg mb-2">Platzhalter für Multimedia-Inhalte</p>
                <p className="text-gray-600 text-sm">{module.videoPlaceholder}</p>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep('interactive')}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Weiter zu den Lerninhalten →
            </button>
          </div>
        )}

        {/* KI Terminology Quiz Step - NUR für ki-transformation */}
        {currentStep === 'terminology' && module.id === 'ki-transformation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🧠 KI-Begriffe Quiz</h2>
              <p className="text-gray-700 mb-6">
                Bevor wir in die Tiefe der KI-Transformation eintauchen, teste dein Vorwissen über wichtige KI-Begriffe. 
                Dieses Quiz dient nur zur Selbsteinschätzung – die Begriffe werden im Verlauf des Moduls erklärt.
              </p>
              
              <div className="space-y-6">
                {shuffledQuestions.slice(0, 8).map((question, qIndex) => (
                  <div key={qIndex} className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{question.question}</h3>
                    
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => {
                        const isSelected = terminologyAnswers[qIndex] === oIndex
                        const hasAnswered = terminologyAnswers[qIndex] !== undefined && terminologyAnswers[qIndex] !== null
                        
                        return (
                          <div key={oIndex}>
                            <button
                              onClick={() => {
                                if (!hasAnswered) {
                                  setTerminologyAnswers(prev => ({ ...prev, [qIndex]: oIndex }))
                                  // Auto-save
                                }
                              }}
                              disabled={hasAnswered}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                isSelected && option.correct
                                  ? 'bg-green-100 border-green-500'
                                  : isSelected && !option.correct
                                  ? 'bg-red-100 border-red-500'
                                  : hasAnswered
                                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                                  : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{option.text}</span>
                                {isSelected && option.correct && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                                {isSelected && !option.correct && (
                                  <X className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            </button>
                            
                            {/* Zeige Feedback wenn beantwortet */}
                            {isSelected && hasAnswered && option.feedback && (
                              <div className={`mt-2 p-3 rounded-lg text-sm ${
                                option.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                              }`}>
                                {option.feedback}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => {
                setTerminologyQuizCompleted(true)
                setCurrentStep('interactive')
              }}
              disabled={Object.keys(terminologyAnswers).length < 8}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {Object.keys(terminologyAnswers).length < 8 
                ? `${Object.keys(terminologyAnswers).length}/8 Fragen beantwortet` 
                : 'Weiter zu den Infopoints →'}
            </button>
          </div>
        )}

        {/* Interactive Elements */}
        {currentStep === 'interactive' && (
          <div className="space-y-6">
            
            {/* Accordion Items - Aufklappbare Wissensinhalte (ZUERST anzeigen) */}
            {shuffledAccordionItems && shuffledAccordionItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {module.id === 'ausblick2026' ? '🗓️ Ausblick 2026' : '📚 Wichtige Wissensinhalte'}
                </h2>
                <p className="text-gray-600 mb-6">
                  Klicken Sie auf die einzelnen Themen, um mehr zu erfahren:
                </p>
                
                <div className="space-y-4">
                  {shuffledAccordionItems.map((item) => {
                    const isOpen = openAccordions.includes(item.id)
                    
                    return (
                      <div 
                        key={item.id} 
                        className="border-2 border-gray-200 rounded-lg overflow-hidden transition-all hover:border-blue-300"
                      >
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleAccordion(item.id)}
                          className="w-full flex items-center justify-between p-5 text-left bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {item.icon && <span className="text-3xl">{item.icon}</span>}
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                              {!isOpen && (
                                <p className="text-sm text-gray-600">{item.preview}</p>
                              )}
                            </div>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="h-6 w-6 text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        
                        {/* Accordion Content */}
                        {isOpen && (
                          <div className="p-6 border-t-2 border-gray-100 bg-white">
                            {/* Paragraphs */}
                            {item.content.paragraphs && item.content.paragraphs.map((para, idx) => (
                              <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                                {para}
                              </p>
                            ))}
                            
                            {/* Key Points */}
                            {item.content.keyPoints && item.content.keyPoints.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Kernpunkte:</h4>
                                <ul className="space-y-2">
                                  {item.content.keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700">{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Examples */}
                            {item.content.examples && item.content.examples.map((example, idx) => (
                              <div 
                                key={idx} 
                                className={`p-4 rounded-lg mb-4 border-l-4 ${
                                  example.type === 'success' 
                                    ? 'bg-green-50 border-green-500' 
                                    : example.type === 'warning'
                                    ? 'bg-yellow-50 border-yellow-500'
                                    : 'bg-blue-50 border-blue-500'
                                }`}
                              >
                                <h5 className="font-semibold text-gray-900 mb-2">{example.title}</h5>
                                <p className="text-gray-700">{example.description}</p>
                              </div>
                            ))}
                            
                            {/* Callout */}
                            {item.content.callout && (
                              <div className={`p-4 rounded-lg border-2 ${
                                item.content.callout.type === 'tip'
                                  ? 'bg-purple-50 border-purple-300'
                                  : item.content.callout.type === 'warning'
                                  ? 'bg-yellow-50 border-yellow-300'
                                  : item.content.callout.type === 'success'
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-blue-50 border-blue-300'
                              }`}>
                                <p className="text-gray-700 font-medium">{item.content.callout.text}</p>
                              </div>
                            )}
                            
                            {/* Kontrollfrage */}
                            {item.controlQuestion && (
                              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                                <h4 className="font-bold text-gray-900 mb-4">🎯 Kontrollfrage:</h4>
                                <p className="text-gray-800 font-medium mb-4">{item.controlQuestion.question}</p>
                                
                                <div className="space-y-3">
                                  {item.controlQuestion.options.map((option, optIdx) => {
                                    const isSelected = accordionAnswers[item.id] === optIdx
                                    const hasAnswered = accordionAnswers[item.id] !== undefined && accordionAnswers[item.id] !== null
                                    
                                    return (
                                      <div key={optIdx}>
                                        <button
                                          onClick={() => {
                                            if (!hasAnswered) {
                                              console.log('📋 Accordion answer selected:', { itemId: item.id, optIdx })
                                              setAccordionAnswers(prev => {
                                                const newAnswers = { ...prev, [item.id]: optIdx }
                                                console.log('✏️ Accordion answers updated:', newAnswers)
                                                
                                                // 🔥 DIRECT SAVE
                                                setTimeout(() => {
                                                  console.log('💾 Direct save triggered for accordion answer')
                                                  saveProgressDirectly(quizAnswers, newAnswers, terminologyAnswers)
                                                }, 100)
                                                
                                                return newAnswers
                                              })
                                            }
                                          }}
                                          disabled={hasAnswered}
                                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                            isSelected && option.isCorrect
                                              ? 'bg-green-100 border-green-500'
                                              : isSelected && !option.isCorrect
                                              ? 'bg-red-100 border-red-500'
                                              : hasAnswered
                                              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                                              : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">{option.text}</span>
                                            {isSelected && option.isCorrect && (
                                              <CheckCircle className="h-5 w-5 text-green-600" />
                                            )}
                                            {isSelected && !option.isCorrect && (
                                              <X className="h-5 w-5 text-red-600" />
                                            )}
                                          </div>
                                        </button>
                                        
                                        {/* Zeige Feedback wenn beantwortet */}
                                        {isSelected && hasAnswered && (
                                          <div className={`mt-2 p-3 rounded-lg text-sm ${
                                            option.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                          }`}>
                                            {option.feedback}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                                
                                {/* Quellenlink (immer anzeigen wenn vorhanden) */}
                                {item.controlQuestion.source && (
                                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-300">
                                    <p className="text-sm text-gray-700 mb-2">
                                      <strong>📚 Quelle:</strong>
                                    </p>
                                    {item.controlQuestion.source.url !== '[URL hier eintragen]' ? (
                                      <a 
                                        href={item.controlQuestion.source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                                      >
                                        {item.controlQuestion.source.name}
                                      </a>
                                    ) : (
                                      <p className="text-gray-600 italic text-sm">
                                        {item.controlQuestion.source.name} (URL noch nicht hinterlegt)
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Interactive Elements (Umfrage + Ergebnisse) - NACH den Accordions */}
            {module.interactiveElements && module.interactiveElements.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{module.interactiveTitle}</h2>
                
                {module.interactiveElements.map((element, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{element.title}</h3>
                    <p className="text-gray-700 mb-4">{element.content.text}</p>
                    
                    {element.content.list.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {element.content.list.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {element.content.example && (
                      <div className={`p-4 rounded-lg border-l-4 ${
                        element.content.example.type === 'info' 
                          ? 'bg-blue-50 border-blue-500' 
                          : element.content.example.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-500'
                          : 'bg-green-50 border-green-500'
                      }`}>
                        {element.content.example.text.startsWith('<iframe') ? (
                          <div dangerouslySetInnerHTML={{ __html: element.content.example.text }} />
                        ) : (
                          <p className="text-gray-700">{element.content.example.text}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => {
                if (module.id === 'ki-transformation') {
                  setCurrentStep('knowledge')
                } else if (module.id === 'ausblick2026') {
                  setCurrentStep('knowledge')
                } else if (module.id === 'jahresanalyse') {
                  setSurveyStepIndex(0)  // Reset survey index
                  setCurrentStep('quiz')
                } else {
                  setCurrentStep('quiz')
                }
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {module.id === 'ki-transformation' ? 'Weiter zur Lernkontrolle →' : 
               module.id === 'ausblick2026' ? 'Weiter zur Wissenskontrolle →' :
               module.id === 'jahresanalyse' ? 'Weiter zur Jahresanalyse →' :
               'Weiter zum Feedback zur Lernerfahrung →'}
            </button>
          </div>
        )}

        {/* Knowledge Check Step - für ki-transformation: 5 zufällige Accordion-Fragen */}
        {currentStep === 'knowledge' && module.id === 'ki-transformation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📝 Lernkontrolle</h2>
              <p className="text-gray-600 mb-6">Testen Sie Ihr Wissen: 5 zufällige Fragen aus den Infopoints</p>
              
              {selectedAccordionQuestions.map((itemId, index) => {
                const item = shuffledAccordionItems?.find(acc => acc.id === itemId)
                if (!item || !item.controlQuestion) return null
                
                const answerIndex = accordionAnswers[item.id]
                const hasAnswered = answerIndex !== undefined && answerIndex !== null
                
                return (
                  <div key={item.id} className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {index + 1}. {item.controlQuestion.question}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {item.controlQuestion.options.map((option, optIdx) => {
                        const isSelected = answerIndex === optIdx
                        
                        return (
                          <div key={optIdx}>
                            <button
                              onClick={() => {
                                if (!hasAnswered) {
                                  console.log('📋 Accordion answer selected (interactive):', { itemId: item.id, optIdx })
                                  setAccordionAnswers(prev => {
                                    const newAnswers = { ...prev, [item.id]: optIdx }
                                    console.log('✏️ Accordion answers updated (interactive):', newAnswers)
                                    
                                    // 🔥 DIRECT SAVE
                                    setTimeout(() => {
                                      console.log('💾 Direct save triggered for accordion answer (interactive)')
                                      saveProgressDirectly(quizAnswers, newAnswers, terminologyAnswers)
                                    }, 100)
                                    
                                    return newAnswers
                                  })
                                }
                              }}
                              disabled={hasAnswered}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                isSelected && option.isCorrect
                                  ? 'bg-green-100 border-green-500'
                                  : isSelected && !option.isCorrect
                                  ? 'bg-red-100 border-red-500'
                                  : hasAnswered
                                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                                  : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{option.text}</span>
                                {isSelected && option.isCorrect && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                                {isSelected && !option.isCorrect && (
                                  <X className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            </button>
                            
                            {/* Feedback anzeigen */}
                            {isSelected && hasAnswered && (
                              <div className={`mt-2 p-3 rounded-lg text-sm ${
                                option.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                              }`}>
                                {option.feedback}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('interactive')}
                className="w-1/3 bg-gray-500 text-white py-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                ← Zurück zu Infopoints
              </button>
              <button
                onClick={() => setCurrentStep('survey')}
                disabled={
                  selectedAccordionQuestions.filter(id => accordionAnswers[id] !== undefined).length < 5
                }
                className="w-2/3 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {selectedAccordionQuestions.filter(id => accordionAnswers[id] !== undefined).length < 5
                  ? `${selectedAccordionQuestions.filter(id => accordionAnswers[id] !== undefined).length}/5 Fragen beantwortet`
                  : 'Weiter zur Umfrage →'}
              </button>
            </div>
          </div>
        )}

        {/* Survey Step - nur für ki-transformation */}
        {currentStep === 'survey' && module.id === 'ki-transformation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Ihre KI-Nutzung 2025</h2>
              <p className="text-gray-700 mb-4">Wie nutzen Sie selbst KI im Alltag? Nehmen Sie an unserer Umfrage teil:</p>
              
              <div className="p-4 rounded-lg border-l-4 bg-blue-50 border-blue-500">
                <iframe 
                  src="https://findmind.ch/c/awSZ-b9hT" 
                  style={{width:'100%', height:'800px', border:'none', borderRadius:'8px'}} 
                  title="KI-Nutzungsumfrage 2025"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('knowledge')}
                className="w-1/3 bg-gray-500 text-white py-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                ← Zurück zur Lernkontrolle
              </button>
              <button
                onClick={() => setCurrentStep('quiz')}
                className="w-2/3 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Weiter zum Feedback zur Lernerfahrung →
              </button>
            </div>
          </div>
        )}

        {/* Knowledge Check Step - nur für ausblick2026 */}
        {currentStep === 'knowledge' && module.id === 'ausblick2026' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📝 Wissenskontrolle</h2>
              <p className="text-gray-600 mb-6">Testen Sie Ihr Wissen über das Jahr 2026:</p>
              
              {shuffledQuestions.filter(q => q.type === 'knowledge').map((question, qIndex) => {
                // Finde den echten Index in shuffledQuestions
                const realIndex = shuffledQuestions.indexOf(question)
                const currentAnswer = quizAnswers[realIndex]
                const isMultiSelect = question.multipleCorrect === true
                
                return (
                  <div key={realIndex} className="mb-8 last:mb-0">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{question.question}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => {
                        const isSelected = isMultiSelect
                          ? Array.isArray(currentAnswer) && currentAnswer.includes(oIndex)
                          : currentAnswer === oIndex
                        
                        const showCorrect = showQuizResults && option.correct
                        const showIncorrect = showQuizResults && isSelected && !option.correct
                        
                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleQuizAnswer(realIndex, oIndex)}
                            disabled={showQuizResults}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              showCorrect
                                ? 'bg-green-100 border-green-500'
                                : showIncorrect
                                ? 'bg-red-100 border-red-500'
                                : isSelected
                                ? 'bg-blue-100 border-blue-500'
                                : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                              }`}>
                                {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                              </div>
                              <span className="flex-1">{option.text}</span>
                            </div>
                            {showQuizResults && isSelected && (
                              <div className={`mt-3 p-3 rounded-lg text-sm ${
                                option.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                              }`}>
                                {option.feedback}
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('interactive')}
                className="w-1/3 bg-gray-500 text-white py-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                ← Zurück
              </button>
              <button
                onClick={() => {
                  setShowQuizResults(true)
                }}
                disabled={
                  // Zähle nur Antworten auf knowledge-type Fragen
                  shuffledQuestions.filter((q, idx) => 
                    q.type === 'knowledge' && quizAnswers[idx] !== undefined
                  ).length < shuffledQuestions.filter(q => q.type === 'knowledge').length || 
                  showQuizResults
                }
                className="w-2/3 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {showQuizResults ? 'Ergebnisse angezeigt' : 'Wissen überprüfen'}
              </button>
            </div>
            
            {showQuizResults && (
              <button
                onClick={() => {
                  setCurrentStep('quiz')
                  setShowQuizResults(false)  // Reset für Feedback zur Lernerfahrung
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Weiter zum Feedback zur Lernerfahrung →
              </button>
            )}
          </div>
        )}

        {/* Quiz */}
        {currentStep === 'quiz' && (
          <div className="space-y-6">
            {/* Spezielle Logik für jahresanalyse mit 4-Seiten-Struktur */}
            {module.id === 'jahresanalyse' && surveyStepIndex < 2 ? (
              <div className="bg-white rounded-xl shadow-md p-8">
                {(() => {
                  // Seite 2: Beide Umfragen mit Bestätigungsbuttons (surveyStepIndex 0)
                  if (surveyStepIndex === 0) {
                    const survey1 = shuffledQuestions[0]
                    const confirm1 = shuffledQuestions[1]
                    const survey2 = shuffledQuestions[2]
                    const confirm2 = shuffledQuestions[3]
                    
                    return (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Ihre Jahresanalyse</h2>
                        
                        {/* Umfrage 1: Ereignisse */}
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{survey1.question}</h3>
                          <div className="rounded-lg border-2 border-blue-200 overflow-hidden mb-4">
                            <iframe 
                              src={survey1.surveyUrl}
                              style={{ width: '100%', height: '600px', border: 'none' }}
                              title="Umfrage Ereignisse 2025"
                            />
                          </div>
                          
                          {/* Bestätigungsbutton für Umfrage 1 */}
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-700">{confirm1.question}</p>
                            {confirm1.options.map((option, oIndex) => {
                              const isSelected = quizAnswers[1] === oIndex
                              
                              return (
                                <button
                                  key={oIndex}
                                  onClick={() => handleQuizAnswer(1, oIndex)}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? 'bg-green-100 border-green-500'
                                      : 'bg-gray-50 border-gray-200 hover:border-green-300'
                                  }`}
                                >
                                  {option.text}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        
                        {/* Umfrage 2: Mediennutzung */}
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{survey2.question}</h3>
                          <div className="rounded-lg border-2 border-blue-200 overflow-hidden mb-4">
                            <iframe 
                              src={survey2.surveyUrl}
                              style={{ width: '100%', height: '600px', border: 'none' }}
                              title="Umfrage Mediennutzung 2025"
                            />
                          </div>
                          
                          {/* Bestätigungsbutton für Umfrage 2 */}
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-700">{confirm2.question}</p>
                            {confirm2.options.map((option, oIndex) => {
                              const isSelected = quizAnswers[3] === oIndex
                              
                              return (
                                <button
                                  key={oIndex}
                                  onClick={() => handleQuizAnswer(3, oIndex)}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? 'bg-green-100 border-green-500'
                                      : 'bg-gray-50 border-gray-200 hover:border-green-300'
                                  }`}
                                >
                                  {option.text}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        
                        <div className="mt-6 flex gap-4">
                          <button
                            onClick={() => setCurrentStep('interactive')}
                            className="w-1/3 bg-gray-500 text-white py-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                          >
                            ← Zurück zu den Ereignissen
                          </button>
                          <button
                            onClick={() => setSurveyStepIndex(1)}
                            disabled={quizAnswers[1] === undefined || quizAnswers[3] === undefined}
                            className="w-2/3 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Weiter zu den Auswertungen →
                          </button>
                        </div>
                      </>
                    )
                  }
                  
                  // Seite 3: Beide Ergebnisse (surveyStepIndex 1)
                  if (surveyStepIndex === 1) {
                    const results1 = shuffledQuestions[4]
                    const results2 = shuffledQuestions[5]
                    
                    return (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Auswertungen</h2>
                        
                        {/* Ergebnisse 1: Ereignisse */}
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{results1.question}</h3>
                          <div className="rounded-lg border-2 border-green-200 overflow-hidden">
                            <iframe 
                              src={results1.resultsUrl}
                              style={{ width: '100%', height: '600px', border: 'none' }}
                              title="Ergebnisse Ereignisse"
                            />
                          </div>
                        </div>
                        
                        {/* Ergebnisse 2: Mediennutzung */}
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{results2.question}</h3>
                          <div className="rounded-lg border-2 border-green-200 overflow-hidden">
                            <iframe 
                              src={results2.resultsUrl}
                              style={{ width: '100%', height: '600px', border: 'none' }}
                              title="Ergebnisse Mediennutzung"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 flex gap-4">
                          <button
                            onClick={() => setSurveyStepIndex(0)}
                            className="w-1/3 bg-gray-500 text-white py-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                          >
                            ← Zurück zu den Umfragen
                          </button>
                          <button
                            onClick={() => {
                              // Mark results as viewed (needed for scoring)
                              handleQuizAnswer(4, 0)
                              handleQuizAnswer(5, 0)
                              setSurveyStepIndex(2)
                            }}
                            className="w-2/3 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Weiter zum Feedback →
                          </button>
                        </div>
                      </>
                    )
                  }
                  
                  return null
                })()}
              </div>
            ) : module.id === 'jahresanalyse' ? (
              // Seite 4: Feedback-Fragen (surveyStepIndex 2)
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">💬 Feedback zum Modul</h2>
                <p className="text-gray-600 mb-6">Wie hat Ihnen das Modul "Jahresanalyse 2025" gefallen?</p>
                
                {shuffledQuestions.filter(q => q.type === 'feedback').map((question, qIndex) => {
                  const realIndex = shuffledQuestions.indexOf(question)
                  const currentAnswer = quizAnswers[realIndex]
                  
                  return (
                    <div key={realIndex} className="mb-8 last:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>
                      
                      <div className="space-y-3">
                        {question.options.map((option, oIndex) => {
                          const isSelected = currentAnswer === oIndex
                          
                          return (
                            <button
                              key={oIndex}
                              onClick={() => handleQuizAnswer(realIndex, oIndex)}
                              disabled={showQuizResults}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'bg-blue-100 border-blue-500'
                                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                              } ${showQuizResults ? 'cursor-not-allowed' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option.text}</span>
                                {isSelected && (
                                  <span className="text-blue-600 font-bold text-xl ml-2">✓</span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                
                {!showQuizResults && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setSurveyStepIndex(1)}
                      className="w-1/3 bg-gray-500 text-white py-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      ← Zurück zu den Auswertungen
                    </button>
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={shuffledQuestions.filter(q => q.type === 'feedback').some(
                        (q, idx) => quizAnswers[shuffledQuestions.indexOf(q)] === undefined
                      )}
                      className="w-2/3 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Feedback abschliessen
                    </button>
                  </div>
                )}
                
                {showQuizResults && (
                  <div className="mt-6">
                    <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg">
                      <p className="font-semibold text-lg mb-2">✅ Modul abgeschlossen!</p>
                      <p>Sie haben <strong>{score}</strong> von {module.maxPoints} Punkten erreicht.</p>
                    </div>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full mt-4 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Zum Dashboard →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Normale Quiz-Logik für andere Module (ki-transformation, ausblick2026) */
              <></>
            )}
            
            {/* Umfrage-Ergebnisse für ki-transformation */}
            {module.id === 'ki-transformation' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Umfrage-Ergebnisse</h2>
                <p className="text-gray-700 mb-4">Hier sehen Sie die aggregierten Ergebnisse aller Teilnehmer:</p>
                
                <div className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500">
                  <iframe 
                    src="https://de.findmind.ch/results/wMXMbYi4Bi" 
                    style={{width:'100%', height:'800px', border:'none', borderRadius:'8px'}} 
                    title="Umfrage-Ergebnisse"
                  />
                </div>
              </div>
            )}
            
            {/* Feedback-Sektion nur für ki-transformation und ausblick2026 (NICHT für jahresanalyse) */}
            {module.id !== 'jahresanalyse' && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {module.id === 'ki-transformation' ? '💬 Feedback zur Lernerfahrung' : '💬 Feedback zur Lernerfahrung'}
              </h2>
              <p className="text-gray-600 mb-6">
                {module.id === 'ki-transformation'
                  ? 'Bitte teilen Sie uns Ihre Erfahrung mit diesem Modul mit:'
                  : module.id === 'fotos2025'
                  ? 'Wie haben Ihnen die Fotogalerien gefallen?'
                  : 'Wie hat Ihnen das Modul gefallen?'}
              </p>
              
              {(module.id === 'ausblick2026' 
                ? shuffledQuestions.filter(q => q.type === 'feedback')  // Nur Feedback-Fragen
                : module.id === 'fotos2025'
                ? shuffledQuestions  // Alle 4 Fragen für Fotos-Modul
                : shuffledQuestions.slice(8)  // Für KI: Nur die letzten 3 Feedback-Fragen (Fragen 8-10)
              ).map((question, qIndex) => {
                // Bei ausblick2026, fotos2025 und ki-transformation finden wir den echten Index
                const realIndex = module.id === 'ausblick2026' 
                  ? shuffledQuestions.indexOf(question) 
                  : module.id === 'fotos2025'
                  ? qIndex  // Für Fotos: Direkter Index
                  : 8 + qIndex  // Für KI-Modul: Index startet bei 8
                const currentAnswer = quizAnswers[realIndex]
                const isMultiSelect = question.multipleCorrect === true
                
                return (
                  <div key={qIndex} className="mb-8 last:mb-0">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{question.question}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isMultiSelect 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isMultiSelect ? 'Mehrfachauswahl' : 'Einzelauswahl'}
                      </div>
                    </div>
                    
                    {isMultiSelect && !showQuizResults && (
                      <p className="text-sm text-gray-600 mb-3 italic">
                        💡 Mehrere Antworten können korrekt sein. Wählen Sie alle zutreffenden aus.
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => {
                        // Multi-Select Logic
                        const isSelected = isMultiSelect
                          ? Array.isArray(currentAnswer) && currentAnswer.includes(oIndex)
                          : currentAnswer === oIndex
                        
                        const showCorrect = showQuizResults && option.correct
                        const showIncorrect = showQuizResults && isSelected && !option.correct
                        const hasAnswered = currentAnswer !== undefined && currentAnswer !== null
                        const percentage = question.aggregatedResults?.[oIndex] || 0
                        
                        return (
                          <div key={oIndex}>
                            <button
                              onClick={() => handleQuizAnswer(realIndex, oIndex)}
                              disabled={showQuizResults}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                showQuizResults
                                  ? showCorrect
                                    ? 'border-green-500 bg-green-50'
                                    : showIncorrect
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 bg-gray-50'
                                  : isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  {/* Checkbox/Radio Indicator */}
                                  {!showQuizResults && (
                                    <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                    } ${isMultiSelect ? 'rounded' : 'rounded-full'}`}>
                                      {isSelected && (
                                        <CheckCircle className="h-4 w-4 text-white" />
                                      )}
                                    </div>
                                  )}
                                  <span className="text-gray-900">{option.text}</span>
                                </div>
                                {showQuizResults && (
                                  showCorrect ? (
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                  ) : showIncorrect ? (
                                    <X className="h-6 w-6 text-red-600" />
                                  ) : null
                                )}
                              </div>
                            </button>
                            
                            {/* Zeige Feedback wenn beantwortet und nicht leer */}
                            {showQuizResults && (isSelected || option.correct) && option.feedback && (
                              <p className="text-sm text-gray-600 mt-2 px-4">{option.feedback}</p>
                            )}
                            
                            {/* Zeige aggregierte Resultate wenn Test abgeschlossen */}
                            {showQuizResults && question.aggregatedResults && (
                              <div className="mt-2 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isSelected ? 'bg-green-500' : 'bg-blue-400'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                                    {percentage}%
                                  </span>
                                </div>
                                {isSelected && (
                                  <p className="text-xs text-green-700 mt-1 font-medium">← Ihre Antwort</p>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            )}
            
            {/* Info zu aggregierten Resultaten - nur für andere Module */}
            {module.id !== 'jahresanalyse' && showQuizResults && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-2">📊 So haben andere geantwortet:</h4>
                <p className="text-blue-800 text-sm">
                  Die Balken bei jeder Antwort zeigen, wie alle Teilnehmer geantwortet haben. So sehen Sie, ob Ihre Erfahrung mit der Mehrheit übereinstimmt oder ob Sie eine andere Perspektive haben.
                </p>
              </div>
            )}
            
            {/* FindMind Results iframe nach Bestätigung - nur für andere Module */}
            {module.id !== 'jahresanalyse' && showQuizResults && shuffledQuestions.some(q => q.showResultsIframe && q.resultsUrl) && (
              <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-xl p-6">
                <h4 className="font-bold text-green-900 mb-4">📈 Umfrage-Ergebnisse: So nutzen andere KI</h4>
                <p className="text-green-800 text-sm mb-4">
                  Sehen Sie hier die gesammelten Antworten aller Teilnehmer:
                </p>
                {shuffledQuestions.map((question, idx) => {
                  if (question.showResultsIframe && question.resultsUrl) {
                    return (
                      <iframe
                        key={idx}
                        src={question.resultsUrl}
                        style={{ width: '100%', height: '800px', border: 'none', borderRadius: '8px' }}
                        title="FindMind Umfrage-Ergebnisse"
                      />
                    )
                  }
                  return null
                })}
              </div>
            )}
            
            {/* Navigation Buttons - nur für andere Module */}
            {module.id !== 'jahresanalyse' && !showQuizResults && (
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (module.id === 'ki-transformation') {
                      setCurrentStep('survey')
                    } else if (module.id === 'ausblick2026') {
                      setCurrentStep('knowledge')
                      setShowQuizResults(true)  // Zeige die Feedback-Ergebnisse wieder an
                    } else {
                      setCurrentStep('interactive')
                    }
                  }}
                  className="w-1/3 bg-gray-500 text-white py-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={
                    module.id === 'ausblick2026'
                      ? // Zähle nur Antworten auf feedback-type Fragen
                        shuffledQuestions.filter((q, idx) => 
                          q.type === 'feedback' && quizAnswers[idx] !== undefined
                        ).length < shuffledQuestions.filter(q => q.type === 'feedback').length
                      : module.id === 'ki-transformation'
                      ? // Für KI: Nur die 3 Feedback-Fragen (Index 8-10) müssen beantwortet sein
                        ![8, 9, 10].every(idx => quizAnswers[idx] !== undefined)
                      : module.id === 'fotos2025'
                      ? // Für Fotos: Alle 4 Fragen müssen beantwortet sein
                        [0, 1, 2, 3].some(idx => quizAnswers[idx] === undefined)
                      : Object.keys(quizAnswers).length < shuffledQuestions.length  // Default: Alle Fragen
                  }
                  className="w-2/3 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Feedback abschliessen
                </button>
              </div>
            )}
            
            {showQuizResults && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="text-center">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Glückwunsch!</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">{score} / {module.maxPoints} Punkte</p>
                  <p className="text-gray-600 mb-6">
                    Sie haben dieses Modul erfolgreich abgeschlossen!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Zurück zum Dashboard
                    </button>
                    
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Fortschritt zurücksetzen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fortschritt zurücksetzen?</h3>
                <p className="text-gray-600">
                  Möchten Sie Ihren Fortschritt in diesem Modul wirklich zurücksetzen? 
                  Alle erreichten Punkte gehen verloren und Sie können das Modul erneut durchlaufen.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Disclaimer Button */}
      <AIDisclaimer />
    </div>
  )
}
