// Module Content Data - Jahresrückblick 2025
// Lernbereich: Jahresrückblick 2025 mit 4 Modulen (je 100 Punkte)

export interface Source {
  id: string
  title: string
  url?: string
  author?: string
  date?: string
  type: 'web' | 'pdf' | 'book' | 'article' | 'report'
}

export interface QuizQuestion {
  question: string
  type?: 'knowledge' | 'feedback' | 'survey' | 'survey_results'  // Erweitert für Umfragen
  multipleCorrect?: boolean
  surveyUrl?: string  // URL für FindMind-Umfrage iframe
  mediaInfoText?: string  // HTML-Text für Info vor Umfrage (z.B. Mediennutzung-Info)
  options: {
    text: string
    correct: boolean
    feedback: string
  }[]
  aggregatedResults?: {
    [key: number]: number // Option-Index → Prozent
  }
  showResultsIframe?: boolean
  resultsUrl?: string
}

export interface AccordionItem {
  id: string
  title: string
  icon?: string
  preview: string
  content: {
    paragraphs?: string[]
    keyPoints?: string[]
    examples?: {
      title: string
      description: string
      type?: 'success' | 'info' | 'warning'
    }[]
    callout?: {
      type: 'info' | 'warning' | 'success' | 'tip'
      text: string
    }
    source?: {
      name: string
      url: string
    }
  }
  controlQuestion?: {
    question: string
    options: {
      text: string
      isCorrect: boolean
      feedback: string
    }[]
    source?: {
      name: string
      url: string
    }
  }
}

export interface InteractiveElement {
  title: string
  content: {
    text: string
    list: string[]
    example?: {
      type: 'info' | 'warning' | 'success'
      text: string
    }
  }
}

export interface ModuleContent {
  id: string
  area: 'jahresrueckblick2025'
  title: string
  description: string
  duration: string
  maxPoints: number
  videoTitle: string
  videoDescription: string
  videoPlaceholder: string
  interactiveTitle: string
  interactiveElements: InteractiveElement[]
  accordionItems?: AccordionItem[]
  sources?: Source[]
  quizQuestions: QuizQuestion[]
}

// Typ für Lernbereiche
export interface LearningArea {
  id: 'jahresrueckblick2025'
  title: string
  description: string
  maxPoints: number
  modules: string[]
}

export const learningAreas: Record<string, LearningArea> = {
  jahresrueckblick2025: {
    id: 'jahresrueckblick2025',
    title: 'Jahresrückblick 2025',
    description: 'Reflektiere dein Jahr 2025 durch Bilder, persönliche Analysen, die KI-Revolution und blicke voraus auf 2026.',
    maxPoints: 400,
    modules: ['fotos2025', 'jahresanalyse', 'ki-transformation', 'ausblick2026']
  }
}

export const moduleData: Record<string, ModuleContent> = {
  // ========================================
  // MODUL 1: FOTORÜCKBLICK 2025 (100 Punkte)
  // ========================================
  
  fotos2025: {
    id: 'fotos2025',
    area: 'jahresrueckblick2025',
    title: 'Die Fotos des Jahres 2025',
    description: 'Entdecke prämierte Fotoreportagen von UNICEF und beeindruckende Bilder des Jahres 2025 aus verschiedenen Themenbereichen.',
    duration: '~6 Min.',
    maxPoints: 100,
    videoTitle: '',
    videoDescription: '',
    videoPlaceholder: '',
    interactiveTitle: '🖼️ Fotogalerien 2025',
    interactiveElements: [
      {
        title: '🏆 UNICEF: Prämierte Fotoreportagen',
        content: {
          text: 'UNICEF, das Kinderhilfswerk der UNO, hat Fotoreportagen prämiert. In diesem Padlet sind die prämierten Reportagen per Link zusammengestellt. Schauen Sie sich jeweils die Vorstellung der ganzen Reportage an, indem Sie auf den Post klicken. Bewerten Sie die Reportagen mit Punkten. Halten Sie damit fest, wie stark Sie die Reportagen inhaltlich und visuell ansprechen. Die Posts werden durch die Anzahl der Punkte fortlaufend neu geordnet.',
          list: [],
          example: {
            type: 'info',
            text: '<iframe src="https://padlet.com/hepverlag/die-fotos-des-jahres-von-unicef-4ty1up0zfojgg7y3" style="width:100%; height:608px; border:none; border-radius:8px" title="UNICEF Fotoreportagen" allow="camera;microphone;geolocation" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>'
          }
        }
      },
      {
        title: '📷 Bilder des Jahres 2025',
        content: {
          text: 'Von unterschiedlichen Medienangeboten sind hier Fotos aus dem Jahre 2025 zusammengetragen. Es gibt unterschiedliche Themenbereiche. Eine thematische Ordnung ist absichtlich nicht gegeben. Bewerten Sie diejenigen Fotos mit Punkten, die Sie stark ansprechen, sei das inhaltlich oder rein visuell. Die Posts werden durch die Anzahl der Punkte fortlaufend neu geordnet.',
          list: [],
          example: {
            type: 'success',
            text: '<iframe src="https://padlet.com/hepverlag/bilder-des-jahres-2025-uos70aznxq25cuoa" style="width:100%; height:608px; border:none; border-radius:8px" title="Bilder des Jahres 2025" allow="camera;microphone;geolocation" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>'
          }
        }
      }
    ],
    accordionItems: [
      {
        id: 'foto-statistik-weltweit',
        title: 'Globale Fotografie-Statistik',
        icon: '🌍',
        preview: 'Eine beeindruckende Zahl zur weltweiten Fotografie',
        content: {
          paragraphs: [
            'Gemäss Schätzungen werden im Jahr 2025 weltweit etwa 2 Billionen digitale Fotos aufgenommen. Das entspricht schätzungsweise etwa 61\'000 Fotos pro Sekunde – oder etwa 5.3 Milliarden Fotos pro Tag.',
            'Schätzungen zufolge führen die USA mit durchschnittlich 20 Bildern pro Tag pro Person, während Europäer und Europäerinnen mit etwa 5 Bildern pro Tag etwas zurückhaltender sind.'
          ],
          callout: {
            type: 'info',
            text: '💡 Zum Vergleich: In den ersten 75 Jahren der Fotografie (1826-1900) wurden insgesamt nur wenige Millionen Fotos gemacht. Im Spitzenjahr der Filmfotografie 1998 waren es 60 Milliarden – heute schaffen wir diese Menge alle 13 Tage!'
          }
        },
        controlQuestion: {
          question: 'Wie viele Fotos werden 2025 weltweit pro Tag aufgenommen?',
          options: [
            {
              text: '500 Millionen',
              isCorrect: false,
              feedback: 'Das ist viel zu niedrig. Die weltweite Foto-Produktion ist massiv gestiegen.'
            },
            {
              text: '5.3 Milliarden',
              isCorrect: true,
              feedback: '✅ Richtig! 5.3 Milliarden Fotos werden täglich weltweit aufgenommen.'
            },
            {
              text: '50 Milliarden',
              isCorrect: false,
              feedback: 'Das wäre über 6 Fotos pro Sekunde pro Person weltweit – zu hoch!'
            }
          ]
        }
      },
      {
        id: 'smartphone-dominanz',
        title: 'Smartphone-Fotografie',
        icon: '📱',
        preview: 'Wie dominant sind Smartphones in der Fotografie?',
        content: {
          paragraphs: [
            'Gemäss verschiedenen Schätzungen wird heute der überwiegende Teil aller Fotos weltweit mit Smartphones aufgenommen, während klassische Digitalkameras nur noch einen kleinen Anteil ausmachen. Im Vergleich zu vor 15 Jahren ist das ein deutlicher Wandel.',
            'Schätzungen zufolge entstehen jährlich nur noch einige Dutzend Milliarden Fotos mit dedizierten Digitalkameras, während der Grossteil mit Smartphones aufgenommen wird.'
          ],
          callout: {
            type: 'success',
            text: '📸 Moderne Smartphones bieten Kameras mit sehr hohen Auflösungen von teils über 200 Megapixeln und können dank KI-Unterstützung in vielen Alltagssituationen erstaunlich nahe an die Bildqualität professioneller Kameras herankommen.'
          }
        },
        controlQuestion: {
          question: 'Welcher Prozentsatz aller Fotos wird 2025 mit Smartphones gemacht?',
          options: [
            {
              text: '50%',
              isCorrect: false,
              feedback: 'Smartphones sind noch dominanter! Die meisten Menschen haben ihre Kamera immer dabei.'
            },
            {
              text: '75%',
              isCorrect: false,
              feedback: 'Fast richtig, aber Smartphones haben einen noch grösseren Anteil.'
            },
            {
              text: '92-95%',
              isCorrect: true,
              feedback: '✅ Korrekt! Über 92% aller Fotos entstehen mit dem Smartphone.'
            }
          ]
        }
      },
      {
        id: 'ki-optimierung',
        title: 'KI-generierte Bilder in Social Media',
        icon: '🤖',
        preview: 'Wie verbreitet ist KI in der Social Media Fotografie?',
        content: {
          paragraphs: [
            'Gemäss verschiedenen Schätzungen und Branchenberichten stammt inzwischen ein bedeutender Teil der Bilder auf Social Media aus KI-Systemen – entweder vollständig generiert oder durch KI deutlich verändert.',
            'Ebenso wird ein grosser Anteil der Inhalte, die Nutzenden angezeigt werden, durch Empfehlungsalgorithmen gesteuert, was die Nutzerbindung nachweislich beeinflusst. Die Umsätze im Bereich KI-gestützter Social-Media-Tools und -Dienste werden für die kommenden Jahre auf ein deutliches Wachstum geschätzt, wobei Prognosen von einem Markt im Milliardenbereich ausgehen.'
          ],
          callout: {
            type: 'warning',
            text: '⚠️ Ethische Frage: Umfragen unter Kommunikations- und Marketingverantwortlichen zeigen, dass viele eine klare Kennzeichnung von KI-generierten Inhalten befürworten und sich davon mehr Transparenz und Vertrauen auf Social Media erhoffen.'
          }
        },
        controlQuestion: {
          question: 'Wie viel Prozent der Social Media Bilder sind KI-generiert oder KI-erweitert?',
          options: [
            {
              text: '25%',
              isCorrect: false,
              feedback: 'KI ist viel verbreiteter! Die Mehrheit der Bilder wird durch KI beeinflusst.'
            },
            {
              text: '50%',
              isCorrect: false,
              feedback: 'Es sind noch mehr! KI-Generierung ist heute Standard in Social Media.'
            },
            {
              text: '71%',
              isCorrect: true,
              feedback: '✅ Genau! 71% aller Social Media Bilder sind KI-generiert oder KI-erweitert.'
            }
          ]
        }
      },
      {
        id: 'digitales-foto-horten',
        title: 'Digitales Foto-Horten auf Smartphones',
        icon: '📦',
        preview: 'Wie viele Fotos sammeln sich auf unseren Geräten an?',
        content: {
          paragraphs: [
            'Smartphones haben die Art und Weise verändert, wie wir Fotos speichern. Mit Speicherkapazitäten, die Tausende von Bildern auf jedem Gerät ermöglichen, sammeln sich im Durchschnitt mehrere Tausend Fotos pro Nutzer an.',
            'Viele Menschen sichern ihre Bilder zusätzlich in Cloud-Diensten, schauen sich diese Archive jedoch nur selten an. Das Löschen fällt vielen schwer – aus Sorge, wertvolle Erinnerungen zu verlieren.'
          ],
          callout: {
            type: 'warning',
            text: '⚠️ Diese Anhäufung führt dazu, dass manche für zusätzlichen Speicherplatz bezahlen, was sich zu beträchtlichen jährlichen Ausgaben summieren kann.'
          }
        },
        controlQuestion: {
          question: 'Wie viele Fotos hat der durchschnittliche Smartphone-Nutzer gespeichert?',
          options: [
            {
              text: '500-800 Fotos',
              isCorrect: false,
              feedback: 'Es sind deutlich mehr! Wir sammeln viel mehr Fotos an, als uns bewusst ist.'
            },
            {
              text: '2.100-2.800 Fotos',
              isCorrect: true,
              feedback: '✅ Korrekt! Der Durchschnitt liegt bei 2.100-2.800 Fotos pro Smartphone.'
            },
            {
              text: '10.000 Fotos',
              isCorrect: false,
              feedback: 'Das wäre extrem viel – der Durchschnitt ist niedriger, aber immer noch beeindruckend.'
            }
          ]
        }
      }
    ],
    sources: [
      {
        id: 'unicef-photos',
        title: 'UNICEF Photo of the Year',
        url: 'https://www.unicef.de/informieren/projekte/unicef-foto-des-jahres',
        type: 'web',
        author: 'UNICEF Deutschland',
        date: '2025'
      },
      {
        id: 'photografix-statistics',
        title: 'Fünf Milliarden Fotos täglich – doch was davon ist echte Fotografie?',
        url: 'https://www.photografix-magazin.de/fuenf-milliarden-fotos-taeglich-doch-was-davon-ist-echte-fotografie/',
        type: 'article',
        author: 'Jürgen Wolf',
        date: '22.06.2025'
      },
      {
        id: 'ai-social-media-stats',
        title: 'AI in Social Media: 20 Powerful Statistics in 2025',
        url: 'https://artsmart.ai/blog/ai-in-social-media-statistics/',
        type: 'article',
        author: 'Shalwa',
        date: 'March 2025'
      },
      {
        id: 'photo-hoarding-research',
        title: 'Young adults are hoarding a combined 10 million photos on their smartphones',
        url: 'https://talkingpoints.72point.com/2022/03/young-adults-are-hoarding-a-combined-10-million-photos-on-their-smartphones-according-to-research/',
        type: 'report',
        author: 'Fujifilm Research',
        date: 'March 2022'
      }
    ],
    quizQuestions: [
      {
        question: '📸 Haben Sie die beiden Padlet-Fotogalerien angeschaut?',
        options: [
          {
            text: '😊 Ja, beide ausführlich angeschaut',
            correct: true,
            feedback: ''
          },
          {
            text: '😐 Ja, aber nur kurz durchgescrollt',
            correct: true,
            feedback: ''
          },
          {
            text: '😕 Nur eine der beiden Galerien',
            correct: true,
            feedback: ''
          },
          {
            text: '😞 Keine der Galerien angeschaut',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        question: '⭐ Haben Sie Bewertungen (Punkte) in den Padlets vorgenommen?',
        options: [
          {
            text: '👍 Ja, bei mehreren Bildern/Reportagen',
            correct: true,
            feedback: ''
          },
          {
            text: '🤷 Ja, aber nur bei wenigen',
            correct: true,
            feedback: ''
          },
          {
            text: '👎 Nein, keine Bewertungen vorgenommen',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        question: '💭 Was hat Sie am meisten interessiert?',
        options: [
          {
            text: '🏆 Die UNICEF-Fotoreportagen',
            correct: true,
            feedback: ''
          },
          {
            text: '📷 Die Bilder des Jahres 2025',
            correct: true,
            feedback: ''
          },
          {
            text: '📊 Die Statistiken zur Fotografie',
            correct: true,
            feedback: ''
          },
          {
            text: '🤔 Alles war gleich interessant',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        question: '🎯 Wie fanden Sie diese Art der Aktivität insgesamt?',
        options: [
          {
            text: '😍 Sehr gut – abwechslungsreich und interaktiv',
            correct: true,
            feedback: ''
          },
          {
            text: '😊 Gut – interessante Kombination',
            correct: true,
            feedback: ''
          },
          {
            text: '😐 Okay – hätte andere Formate bevorzugt',
            correct: true,
            feedback: ''
          },
          {
            text: '😕 Nicht so gut – war mir zu viel',
            correct: true,
            feedback: ''
          }
        ]
      }
    ]
  },

  // ========================================
  // MODUL 2: JAHRESANALYSE 2025 (100 Punkte)
  // ========================================
  
  jahresanalyse: {
    id: 'jahresanalyse',
    area: 'jahresrueckblick2025',
    title: 'Jahresanalyse 2025',
    description: 'Reflektiere dein Jahr 2025: Welche Ereignisse haben dich geprägt und wie nutzt du Medien?',
    duration: '~8 Min.',
    maxPoints: 100,
    videoTitle: '',
    videoDescription: '',
    videoPlaceholder: '',
    interactiveTitle: '📰 Wichtige Ereignisse 2025',
    interactiveElements: [],
    accordionItems: [
      {
        id: 'trump-regierung',
        title: 'Donald Trump beginnt zweite Amtszeit als US-Präsident',
        icon: '🇺🇸',
        preview: 'Amtsantritt am 20. Januar 2025',
        content: {
          paragraphs: [
            'Am 20. Januar 2025 wurde Donald Trump als 47. Präsident der Vereinigten Staaten vereidigt. Dies markiert seine Rückkehr ins Weisse Haus nach seiner Wahlniederlage 2020.',
            'Trump kündigte unmittelbar nach Amtsantritt weitreichende Politikänderungen an, darunter neue Handelszölle, strengere Einwanderungspolitik und eine Neuausrichtung der US-Aussenpolitik.'
          ],
          keyPoints: [
            'Amtseinführung: 20. Januar 2025',
            'Erste Amtshandlungen: Executive Orders zu Einwanderung und Handel',
            'Kabinettsbesetzung mit kontroversen Personalentscheidungen',
            'Spannungen mit traditionellen Verbündeten in Europa'
          ]
        },
        controlQuestion: {
          question: 'Wann wurde Donald Trump als 47. US-Präsident vereidigt?',
          options: [
            {
              text: '6. Januar 2025',
              isCorrect: false,
              feedback: 'Nicht korrekt. Das war das Datum des Sturms auf das Kapitol 2021.'
            },
            {
              text: '20. Januar 2025',
              isCorrect: true,
              feedback: '✅ Richtig! Die Amtseinführung fand am 20. Januar 2025 statt.'
            },
            {
              text: '5. November 2024',
              isCorrect: false,
              feedback: 'Nicht korrekt. Das war der Wahltag, nicht die Amtseinführung.'
            }
          ]
        }
      },
      {
        id: 'eu-ai-act',
        title: 'EU AI Act tritt stufenweise in Kraft',
        icon: '⚖️',
        preview: 'Weltweit erste umfassende KI-Regulierung',
        content: {
          paragraphs: [
            'Am 12. Juli 2024 wurde die EU-Verordnung zur Regulierung künstlicher Intelligenz im Amtsblatt veröffentlicht. Der «AI Act» ist das erste umfassende KI-Gesetz weltweit und hat auch Folgen für Drittländer wie die Schweiz.',
            'Das Gesetz kategorisiert KI-Systeme nach Risikostufen: Bestimmte Anwendungen wie Social Scoring sind verboten. Für Hochrisiko-KI-Systeme gelten besondere Transparenzanforderungen und Registrierung in einer EU-Datenbank. Bei Verstössen drohen Geldbussen bis zu 35 Millionen Euro oder 7% des Jahresumsatzes.'
          ],
          keyPoints: [
            'Inkrafttreten: Ab 2. Februar 2025 (allgemeine Bestimmungen)',
            'Vollständige Anwendung: 2. August 2026',
            'Schweizer Unternehmen betroffen: Bei KI-Systemen für EU-Markt',
            'Strafen: Bis 35 Mio. € oder 7% des Jahresumsatzes'
          ]
        },
        controlQuestion: {
          question: 'Welche maximale Strafe kann der EU AI Act bei Verstössen verhängen?',
          options: [
            {
              text: '10 Millionen Euro oder 2% des Jahresumsatzes',
              isCorrect: false,
              feedback: 'Nicht korrekt. Die Strafen sind deutlich höher angesetzt.'
            },
            {
              text: '35 Millionen Euro oder 7% des Jahresumsatzes',
              isCorrect: true,
              feedback: '✅ Richtig! Die Höchststrafe beträgt 35 Mio. € oder 7% des weltweiten Jahresumsatzes.'
            },
            {
              text: '100 Millionen Euro oder 10% des Jahresumsatzes',
              isCorrect: false,
              feedback: 'Nicht korrekt. Diese Strafen wären höher als im Gesetz vorgesehen.'
            }
          ]
        }
      },
      {
        id: 'klimaextreme',
        title: 'Extreme Hitzewellen und Waldbrände weltweit',
        icon: '🌡️',
        preview: '2025 auf Kurs zum wärmsten Jahr',
        content: {
          paragraphs: [
            '2025 verzeichnete weltweit neue Temperaturrekorde. Besonders betroffen waren Südeuropa mit Temperaturen über 45°C, Nordamerika mit verheerenden Waldbränden und Asien mit extremen Hitzewellen.',
            'Die Weltwetterorganisation (WMO) bestätigte, dass 2025 zu den drei wärmsten Jahren seit Beginn der Aufzeichnungen gehört. Die globale Durchschnittstemperatur lag etwa 1.4°C über dem vorindustriellen Niveau.'
          ],
          keyPoints: [
            'Juli 2025: Heissester Monat seit Beginn der Aufzeichnungen',
            'Waldbrände in Kalifornien, Griechenland und Australien',
            'Dürren in Afrika und Südamerika beeinträchtigen Ernten',
            'Überschwemmungen in Asien durch extremen Monsun'
          ]
        },
        controlQuestion: {
          question: 'Um wie viel lag die globale Durchschnittstemperatur 2025 über dem vorindustriellen Niveau?',
          options: [
            {
              text: 'Etwa 0.8°C',
              isCorrect: false,
              feedback: 'Nicht korrekt. Die Temperatur lag bereits deutlich höher.'
            },
            {
              text: 'Etwa 1.4°C',
              isCorrect: true,
              feedback: '✅ Richtig! Die globale Durchschnittstemperatur lag etwa 1.4°C über dem vorindustriellen Niveau.'
            },
            {
              text: 'Etwa 2.5°C',
              isCorrect: false,
              feedback: 'Nicht korrekt. Diese Temperatur wurde noch nicht erreicht.'
            }
          ]
        }
      },
      {
        id: 'ki-durchbruch',
        title: 'Von Chatbots zu autonomen KI-Agenten',
        icon: '🤖',
        preview: 'KI übernimmt eigenständig komplexe Aufgaben',
        content: {
          paragraphs: [
            'Das Jahr 2025 markiert den endgültigen Übergang der künstlichen Intelligenz von reinen Text-Bots hin zu autonomen Agenten. Diese KI-Systeme reagieren nicht nur auf Befehle, sondern führen eigenständig komplexe Aufgaben am Computer aus – sie buchen Reisen, verwalten E-Mails oder steuern Software-Workflows ohne menschliches Eingreifen.',
            'Parallel dazu hat KI-gestütztes Coding das Berufsbild von Programmierern massiv transformiert. Werkzeuge erzeugen ganze Code-Blöcke auf Basis einfacher Beschreibungen, während IT-Fachkräfte sich auf Architektur und Überprüfung konzentrieren. Der Wettlauf um die Artificial General Intelligence (AGI) mit menschenähnlichen kognitiven Fähigkeiten erreichte 2025 neue Höhepunkte.'
          ],
          keyPoints: [
            'Autonome Agenten: KI führt Aufgaben eigenständig aus',
            'KI-gestütztes Coding verändert Softwareentwicklung',
            'Jagd nach AGI (menschenähnliche Intelligenz)',
            'Von Konversation zur produktiven Handlung'
          ]
        },
        controlQuestion: {
          question: 'Was ist der Hauptunterschied zwischen klassischen Chatbots und autonomen KI-Agenten?',
          options: [
            {
              text: 'Agenten können nur Texte generieren',
              isCorrect: false,
              feedback: 'Nicht korrekt. Das können klassische Chatbots auch.'
            },
            {
              text: 'Agenten führen eigenständig komplexe Aufgaben aus',
              isCorrect: true,
              feedback: '✅ Richtig! Autonome Agenten handeln produktiv statt nur zu konversieren.'
            },
            {
              text: 'Agenten sind langsamer als Chatbots',
              isCorrect: false,
              feedback: 'Nicht korrekt. Die Geschwindigkeit ist nicht der Hauptunterschied.'
            }
          ]
        }
      },
      {
        id: 'schweizer-abstimmungen',
        title: 'Wichtige Schweizer Abstimmungen 2025',
        icon: '🗳️',
        preview: 'E-ID und Liegenschaftssteuer im Fokus',
        content: {
          paragraphs: [
            'Das Jahr 2025 brachte wichtige Volksentscheide in der Schweiz. Die elektronische Identität (E-ID) stand erneut zur Debatte, nachdem ein früherer Vorschlag 2021 abgelehnt worden war. Der neue Ansatz legt mehr Wert auf Datenschutz und staatliche Kontrolle.',
            'Parallel dazu wurde über steuerliche Fragen abgestimmt, darunter Anpassungen bei der Liegenschaftssteuer. Diese Abstimmungen zeigen das direkt-demokratische Engagement der Schweizer Bevölkerung bei digitalen und fiskalischen Themen.'
          ],
          keyPoints: [
            'E-ID: Neuer Vorschlag mit mehr Datenschutz',
            'Staatliche Kontrolle statt Private',
            'Liegenschaftssteuer: Anpassungen diskutiert',
            'Direkte Demokratie in Aktion'
          ]
        },
        controlQuestion: {
          question: 'Worum ging es bei der E-ID-Abstimmung in der Schweiz?',
          options: [
            {
              text: 'Eine elektronische Steuererklärung',
              isCorrect: false,
              feedback: 'Nicht korrekt. E-ID steht für elektronische Identität.'
            },
            {
              text: 'Eine elektronische Identität mit staatlicher Kontrolle',
              isCorrect: true,
              feedback: '✅ Richtig! Die E-ID ist eine digitale Identitätslösung mit staatlicher Aufsicht.'
            },
            {
              text: 'Ein neues Wahlsystem',
              isCorrect: false,
              feedback: 'Nicht korrekt. E-ID bezieht sich auf digitale Identifikation.'
            }
          ]
        }
      }
    ],
    sources: [
      {
        id: 'bbc-trump',
        title: 'Trump Inauguration Coverage',
        type: 'article',
        author: 'BBC News',
        date: '2025',
        url: 'https://www.bbc.com/news/world-us-canada'
      },
      {
        id: 'eu-ai-act',
        title: 'EU AI Act Official Documentation',
        type: 'report',
        author: 'Europäische Kommission',
        date: '2025',
        url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'
      },
      {
        id: 'wmo-climate',
        title: 'State of the Climate 2025',
        type: 'report',
        author: 'World Meteorological Organization',
        date: '2025',
        url: 'https://public.wmo.int/en/our-mandate/climate'
      },
      {
        id: 'bsv-ahv',
        title: '13. AHV-Rente: Umsetzung und Finanzierung',
        type: 'report',
        author: 'Bundesamt für Sozialversicherungen',
        date: '2025',
        url: 'https://www.bsv.admin.ch'
      },
      {
        id: 'nature-ai',
        title: 'Breakthrough AI Capabilities in 2025',
        type: 'article',
        author: 'Nature',
        date: '2025',
        url: 'https://www.nature.com/articles/ai'
      }
    ],
    quizQuestions: [
      // Seite 2: Beide Umfragen mit Bestätigungen
      {
        type: 'survey',
        question: '📊 Umfrage 1: Welche Ereignisse des Jahres 2025 haben Sie wahrgenommen?',
        showResultsIframe: false,
        resultsUrl: '',
        options: [
          {
            text: 'iframe',
            correct: true,
            feedback: ''
          }
        ],
        surveyUrl: 'https://findmind.ch/c/wuCK-EZPk'
      },
      {
        type: 'knowledge',
        question: '✅ Umfrage 1 abgeschlossen',
        options: [
          {
            text: 'Ich habe die Umfrage ausgefüllt und bin bereit fortzufahren',
            correct: true,
            feedback: '✅ Vielen Dank für Ihre Teilnahme!'
          }
        ]
      },
      {
        type: 'survey',
        question: '📱 Umfrage 2: Ihre Mediennutzung 2025',
        showResultsIframe: false,
        resultsUrl: '',
        options: [
          {
            text: 'iframe',
            correct: true,
            feedback: ''
          }
        ],
        surveyUrl: 'https://findmind.ch/c/X384-3KtC'
      },
      {
        type: 'knowledge',
        question: '✅ Umfrage 2 abgeschlossen',
        options: [
          {
            text: 'Ich habe die Umfrage ausgefüllt und bin bereit fortzufahren',
            correct: true,
            feedback: '✅ Vielen Dank für Ihre Teilnahme!'
          }
        ]
      },
      // Seite 3: Ergebnisse beider Umfragen
      {
        type: 'survey_results',
        question: '📈 Auswertung: Welche Ereignisse wurden am häufigsten genannt?',
        showResultsIframe: true,
        resultsUrl: 'https://de.findmind.ch/results/jxXp2g4TZi',
        options: [
          {
            text: 'Ergebnisse',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        type: 'survey_results',
        question: '📊 Auswertung: Mediennutzung im Vergleich',
        showResultsIframe: true,
        resultsUrl: 'https://de.findmind.ch/results/5spUSgTBbM',
        options: [
          {
            text: 'Ergebnisse',
            correct: true,
            feedback: ''
          }
        ]
      },
      // Seite 4: Modul-Feedback (3 Fragen)
      {
        type: 'feedback',
        question: '💭 Welcher Aspekt der Jahresanalyse war für Sie am interessantesten?',
        options: [
          {
            text: '📰 Die Ereignisse des Jahres 2025',
            correct: true,
            feedback: ''
          },
          {
            text: '📱 Die Reflexion zur Mediennutzung',
            correct: true,
            feedback: ''
          },
          {
            text: '📊 Die Auswertungen und Vergleiche',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        type: 'feedback',
        question: '🎯 Wie fanden Sie das Modul "Jahresanalyse 2025"?',
        options: [
          {
            text: '😍 Sehr gut - sehr aufschlussreich',
            correct: true,
            feedback: ''
          },
          {
            text: '😊 Gut - interessante Perspektiven',
            correct: true,
            feedback: ''
          },
          {
            text: '😐 Okay - war in Ordnung',
            correct: true,
            feedback: ''
          },
          {
            text: '😕 Nicht so gut',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        type: 'feedback',
        question: '📝 Hat Sie die Jahresanalyse zum Nachdenken angeregt?',
        options: [
          {
            text: '✅ Ja, sehr',
            correct: true,
            feedback: ''
          },
          {
            text: '😊 Ja, etwas',
            correct: true,
            feedback: ''
          },
          {
            text: '😐 Teilweise',
            correct: true,
            feedback: ''
          },
          {
            text: '😕 Nein',
            correct: true,
            feedback: ''
          }
        ]
      }
    ]
  },

  // ========================================
  // MODUL 3: KI & DIGITALE TRANSFORMATION 2025 (100 Punkte)
  // ========================================
  
  'ki-transformation': {
    id: 'ki-transformation',
    area: 'jahresrueckblick2025',
    title: 'KI Superstar',
    description: 'Entdecke die wichtigsten KI-Entwicklungen 2025: Von Vibe Coding bis AI Slop – verstehe, wie KI unsere Welt verändert.',
    duration: '~12 Min.',
    maxPoints: 100,
    videoTitle: '',
    videoDescription: '',
    videoPlaceholder: '',
    interactiveTitle: '📚 KI-Infopoints',
    interactiveElements: [],
    accordionItems: [
      {
        id: 'vibe-coding',
        title: 'Vibe Coding',
        icon: '💻',
        preview: 'Die neue Art des Programmierens mit KI',
        content: {
          paragraphs: [
            '"Vibe Coding" beschreibt eine neue Herangehensweise an die Softwareentwicklung, bei der Entwickler natürlichsprachliche Beschreibungen nutzen, um mit KI-Assistenten wie GitHub Copilot, Cursor oder Claude Code zu kollaborieren. Statt jede Zeile selbst zu schreiben, formulieren Entwickler ihre Absichten und Konzepte – die KI generiert dann funktionierenden Code.'
          ],
          callout: {
            type: 'info',
            text: '💡 2025 zeigt: Die meisten professionellen Entwickler nutzen KI-Tools mindestens wöchentlich. Die "Vibes" eines Projekts werden wichtiger als perfekte technische Spezifikationen.'
          }
        },
        controlQuestion: {
          question: 'Was ist das Hauptmerkmal von "Vibe Coding"?',
          options: [
            {
              text: 'A) Programmieren mit Musik im Hintergrund',
              isCorrect: false,
              feedback: 'Nicht ganz. Es geht nicht um die Arbeitsatmosphäre.'
            },
            {
              text: 'B) Natürlichsprachliche Beschreibungen statt Code-Zeilen',
              isCorrect: true,
              feedback: '✅ Richtig! Vibe Coding bedeutet, mit KI in natürlicher Sprache zu kommunizieren.'
            },
            {
              text: 'C) Kollaboratives Programmieren im Team',
              isCorrect: false,
              feedback: 'Nein, es bezieht sich speziell auf die Zusammenarbeit mit KI.'
            }
          ]
        }
      },
      {
        id: 'arbeitswelt-wandel',
        title: 'Veränderung der Arbeitswelt',
        icon: '🏢',
        preview: 'Weniger Junior-Stellen im IT-Bereich',
        content: {
          paragraphs: [
            'Der IT-Arbeitsmarkt durchläuft 2025 einen drastischen Wandel: Viele Unternehmen stellen deutlich weniger Junior-Entwickler ein. Der Grund: KI-Tools wie GitHub Copilot, Cursor und Claude übernehmen viele Aufgaben, die früher Einstiegspositionen ausmachten – einfache Bug-Fixes, Code-Reviews, Dokumentation und Standard-Implementierungen.'
          ],
          callout: {
            type: 'warning',
            text: '⚠️ Laut einer Studie von Stack Overflow 2025 sank die Zahl der Junior-Stellenausschreibungen deutlich. Gleichzeitig stieg die Nachfrage nach "AI-fluent" Senior-Entwicklern signifikant.'
          }
        },
        controlQuestion: {
          question: 'Warum werden weniger Junior-Entwickler eingestellt?',
          options: [
            {
              text: 'A) Zu viele Absolventen auf dem Markt',
              isCorrect: false,
              feedback: 'Das ist nicht der Hauptgrund. Die Veränderung hat mit Technologie zu tun.'
            },
            {
              text: 'B) KI übernimmt viele Einstiegsaufgaben',
              isCorrect: true,
              feedback: '✅ Korrekt! KI-Tools automatisieren viele typische Junior-Tasks.'
            },
            {
              text: 'C) Wirtschaftskrise in der Tech-Branche',
              isCorrect: false,
              feedback: 'Nein, die Tech-Branche wächst – die Anforderungen ändern sich nur.'
            }
          ]
        }
      },
      {
        id: 'ki-regulierung',
        title: 'EU AI Act & Kalifornien KI-Gesetz',
        icon: '⚖️',
        preview: 'Neue rechtliche Rahmenbedingungen für KI',
        content: {
          paragraphs: [
            'Der EU AI Act trat 2025 stufenweise in Kraft und ist die weltweit erste umfassende KI-Regulierung. Hochrisiko-KI-Systeme müssen strenge Anforderungen erfüllen. Kalifornien verabschiedete 2025 das "Safe and Secure Innovation for Frontier Artificial Intelligence Models Act" (SB 1047) – das strengste KI-Gesetz in den USA.'
          ],
          callout: {
            type: 'warning',
            text: '⚠️ Strafen im EU AI Act: Bis zu 35 Millionen Euro oder 7% des globalen Jahresumsatzes bei Verstössen.'
          }
        },
        controlQuestion: {
          question: 'Was ist der EU AI Act?',
          options: [
            {
              text: 'A) Eine KI-Entwicklungsplattform',
              isCorrect: false,
              feedback: 'Nein, es ist keine Technologie-Plattform.'
            },
            {
              text: 'B) Die erste umfassende KI-Regulierung weltweit',
              isCorrect: true,
              feedback: '✅ Richtig! Der EU AI Act ist ein Gesetzeswerk zur KI-Regulierung.'
            },
            {
              text: 'C) Ein Förderprogramm für KI-Startups',
              isCorrect: false,
              feedback: 'Nein, es geht um Regulierung, nicht Förderung.'
            }
          ]
        }
      },
      {
        id: 'seo-to-geo',
        title: 'Von SEO zu GEO',
        icon: '🔍',
        preview: 'KI verändert die Suchmaschinenoptimierung grundlegend',
        content: {
          paragraphs: [
            'Der Wandel von SEO (Search Engine Optimization) zu GEO (Generative Engine Optimization) markiert 2025 einen Paradigmenwechsel. Während SEO darauf abzielt, in Suchmaschinen-Rankings zu erscheinen, geht es bei GEO darum, in KI-generierten Antworten zitiert zu werden. ChatGPT, Perplexity und Gemini liefern direkte Antworten statt Link-Listen – sogenannte Zero-Click-Suchen.',
            'Eine Studie zeigt: 80% der Quellen in Googles KI-Overviews sind in organischen Suchergebnissen nicht zu finden. Ein Top-3-Ranking bedeutet nur 8% Chance, als KI-Quelle genutzt zu werden. Content muss daher für KI-Modelle optimiert werden – mit strukturierten Daten, konversationellen Inhalten und direkten Antworten auf Nutzerfragen.'
          ],
          callout: {
            type: 'info',
            text: '💡 SEO und GEO ergänzen sich: SEO sorgt für Sichtbarkeit in Suchmaschinen, GEO optimiert für KI-Modelle. Beide Strategien kombiniert bringen die beste Reichweite.'
          }
        },
        controlQuestion: {
          question: 'Was ist der Hauptunterschied zwischen SEO und GEO?',
          options: [
            {
              text: 'SEO für Suchmaschinen-Rankings, GEO für KI-generierte Antworten',
              isCorrect: true,
              feedback: '✅ Richtig! GEO optimiert Content für KI-Modelle, nicht für Rankings.'
            },
            {
              text: 'GEO ist geografische Website-Optimierung',
              isCorrect: false,
              feedback: 'Nein, GEO steht für Generative Engine Optimization.'
            },
            {
              text: 'SEO und GEO sind identisch',
              isCorrect: false,
              feedback: 'Nein, sie haben unterschiedliche Ziele und Methoden.'
            }
          ]
        }
      },
      {
        id: 'google-gewinner',
        title: 'Google Gemini 3: Year in Search-Highlights',
        icon: '🔍',
        preview: 'Googles KI-Chatbot führt die meistgesuchten Trends an',
        content: {
          paragraphs: [
            'Googles KI-Chatbot Gemini führte 2025 die „Year in Search"-Highlights an – noch vor Charlie Kirk und Papst Leo XIV. Seit September verzeichnete Google einen sprunghaften Anstieg bei Gemini-Suchen, als das Unternehmen KI-Updates für Chrome, Suche und Android vorstellte.',
            'Auslöser war Gemini 3, die neueste Version mit Alphabets hauseigenen Chips. Lob kam von OpenAI-Chef Sam Altman und Nvidia. Salesforce-Chef Marc Benioff kündigte nach einem Test an, auf ChatGPT zu verzichten: „Der Sprung ist wahnsinnig – Schlussfolgern, Tempo, alles schärfer und schneller." Gemini 3 führt nun Benchmarks wie „Humanity\'s Last Exam" an und setzte OpenAI unter Druck.'
          ],
          callout: {
            type: 'success',
            text: '🏆 Gemini 3 benötigt weniger Prompting als frühere Modelle und kann „jede Idee zum Leben erwecken" mit modernstem Schlussfolgern und multimodalen Fähigkeiten.'
          }
        },
        controlQuestion: {
          question: 'Was machte Gemini 3 2025 besonders erfolgreich?',
          options: [
            {
              text: 'Integration in Google-Dienste und besseres Schlussfolgern',
              isCorrect: true,
              feedback: '✅ Richtig! Gemini 3 überzeugte durch Integration, Benchmarks und KI-Modus in der Suche.'
            },
            {
              text: 'Es ist das grösste KI-Modell',
              isCorrect: false,
              feedback: 'Nein, die Grösse war nicht der Hauptgrund – Qualität und Integration zählen.'
            },
            {
              text: 'Es ist kostenlos verfügbar',
              isCorrect: false,
              feedback: 'Das war nicht der entscheidende Erfolgsfaktor.'
            }
          ]
        }
      },
      {
        id: 'ai-slop',
        title: 'Die Problematik von AI Slop',
        icon: '🗑️',
        preview: 'Wenn KI das Internet mit Müll überflutet',
        content: {
          paragraphs: [
            '"AI Slop" bezeichnet minderwertige, KI-generierte Inhalte, die das Internet zunehmend überschwemmen: Spam-Artikel, gefälschte Produktbewertungen, automatisch erstellte Social-Media-Posts. 2025 schätzt man, dass Ein grosser Teil der neuen Online-Inhalte KI-generiert sind – oft ohne Qualitätskontrolle.'
          ],
          callout: {
            type: 'warning',
            text: '⚠️ Problem: Suchmaschinen und Social-Media-Plattformen werden zunehmend mit bedeutungslosem Content geflutet, der nur für Algorithmen optimiert ist, nicht für Menschen.'
          }
        },
        controlQuestion: {
          question: 'Was ist "AI Slop"?',
          options: [
            {
              text: 'A) Ein neues KI-Modell von Microsoft',
              isCorrect: false,
              feedback: 'Nein, es ist kein Produkt-Name.'
            },
            {
              text: 'B) Minderwertige KI-generierte Inhalte',
              isCorrect: true,
              feedback: '✅ Korrekt! AI Slop = Low-Quality Content, der das Internet überflutet.'
            },
            {
              text: 'C) Eine Programmiersprache für KI',
              isCorrect: false,
              feedback: 'Nein, es bezeichnet ein Content-Qualitätsproblem.'
            }
          ]
        }
      }
    ],
    quizQuestions: [
      // KI-Begriffe Quiz (8 Fragen am Anfang)
      {
        question: '🤖 Was ist eine "Halluzination" bei KI-Modellen?',
        options: [
          {
            text: 'Wenn die KI falsche oder erfundene Informationen als Fakten präsentiert',
            correct: true,
            feedback: '✅ Richtig! Halluzinationen sind wenn KI-Modelle überzeugt klingende, aber falsche Informationen generieren.'
          },
          {
            text: 'Wenn die KI visuelle Bilder erstellt',
            correct: false,
            feedback: '❌ Nein, Halluzinationen beziehen sich auf falsche Informationen, nicht auf Bildgenerierung.'
          },
          {
            text: 'Wenn die KI zu lange braucht für eine Antwort',
            correct: false,
            feedback: '❌ Nein, das hat nichts mit Halluzinationen zu tun.'
          }
        ]
      },
      {
        question: '💬 Was bedeutet "Prompt" im Kontext von KI?',
        options: [
          {
            text: 'Eine Eingabe oder Anweisung, die man einer KI gibt',
            correct: true,
            feedback: '✅ Genau! Ein Prompt ist die Eingabe/Frage, die man einem KI-Modell stellt.'
          },
          {
            text: 'Eine technische Fehlermeldung',
            correct: false,
            feedback: '❌ Nein, ein Prompt ist keine Fehlermeldung.'
          },
          {
            text: 'Die Geschwindigkeit der KI-Antwort',
            correct: false,
            feedback: '❌ Nein, Prompt bezieht sich auf die Eingabe, nicht auf Geschwindigkeit.'
          }
        ]
      },
      {
        question: '🧠 Was ist Claude?',
        options: [
          {
            text: 'Ein KI-Assistent von Anthropic',
            correct: true,
            feedback: '✅ Richtig! Claude ist der KI-Assistent von Anthropic, mit dem du gerade interagierst.'
          },
          {
            text: 'Eine Programmiersprache',
            correct: false,
            feedback: '❌ Nein, Claude ist keine Programmiersprache.'
          },
          {
            text: 'Ein soziales Netzwerk',
            correct: false,
            feedback: '❌ Nein, Claude ist kein soziales Netzwerk.'
          }
        ]
      },
      {
        question: '📊 Was bedeutet "Training" bei KI-Modellen?',
        options: [
          {
            text: 'Der Prozess, bei dem das Modell aus grossen Datenmengen lernt',
            correct: true,
            feedback: '✅ Genau! Training ist der Lernprozess, bei dem KI-Modelle Muster aus Daten erkennen.'
          },
          {
            text: 'Die tägliche Wartung der Server',
            correct: false,
            feedback: '❌ Nein, Training bezieht sich auf den Lernprozess.'
          },
          {
            text: 'Die Vorbereitung der Benutzer',
            correct: false,
            feedback: '❌ Nein, Training bezieht sich auf das KI-Modell selbst.'
          }
        ]
      },
      {
        question: '⚙️ Was ist ein "Large Language Model" (LLM)?',
        options: [
          {
            text: 'Ein grosses KI-Modell, das mit Texten trainiert wurde',
            correct: true,
            feedback: '✅ Richtig! LLMs sind grosse Sprachmodelle wie GPT, Claude oder Gemini.'
          },
          {
            text: 'Eine Software für Übersetzungen',
            correct: false,
            feedback: '❌ LLMs können übersetzen, aber das ist nur eine von vielen Funktionen.'
          },
          {
            text: 'Ein Datenbank-Management-System',
            correct: false,
            feedback: '❌ Nein, LLMs sind Sprachmodelle, keine Datenbanken.'
          }
        ]
      },
      {
        question: '🎯 Was bedeutet "Fine-Tuning"?',
        options: [
          {
            text: 'Ein bereits trainiertes Modell auf spezifische Aufgaben spezialisieren',
            correct: true,
            feedback: '✅ Genau! Fine-Tuning passt ein bestehendes Modell für spezielle Anwendungen an.'
          },
          {
            text: 'Die Benutzeroberfläche anpassen',
            correct: false,
            feedback: '❌ Nein, Fine-Tuning bezieht sich auf das Modell selbst.'
          },
          {
            text: 'Die Hardware-Einstellungen optimieren',
            correct: false,
            feedback: '❌ Nein, Fine-Tuning ist eine Trainingsmethode für KI-Modelle.'
          }
        ]
      },
      {
        question: '🔍 Was sind "Tokens" in der KI-Verarbeitung?',
        options: [
          {
            text: 'Kleine Texteinheiten, in die der Text zerlegt wird',
            correct: true,
            feedback: '✅ Richtig! Tokens sind die Grundbausteine, wie KI-Modelle Text verarbeiten (z.B. Wortteile).'
          },
          {
            text: 'Kryptowährungen für KI-Dienste',
            correct: false,
            feedback: '❌ Nein, Tokens in KI sind keine Zahlungsmittel.'
          },
          {
            text: 'Sicherheitsschlüssel für den API-Zugang',
            correct: false,
            feedback: '❌ Nein, das sind API-Keys. Tokens sind Text-Einheiten.'
          }
        ]
      },
      {
        question: '💡 Was ist "Context Window"?',
        options: [
          {
            text: 'Die maximale Textmenge, die eine KI auf einmal verarbeiten kann',
            correct: true,
            feedback: '✅ Genau! Das Context Window bestimmt, wie viel Text eine KI gleichzeitig "im Gedächtnis" halten kann.'
          },
          {
            text: 'Die Benutzeroberfläche der KI',
            correct: false,
            feedback: '❌ Nein, das Context Window bezieht sich auf die Verarbeitungskapazität.'
          },
          {
            text: 'Die Zeitspanne zwischen Frage und Antwort',
            correct: false,
            feedback: '❌ Nein, das Context Window ist keine Zeitangabe.'
          }
        ]
      },
      // Feedback-Fragen (wie vorher)
      {
        question: '💭 Welches KI-Thema fanden Sie am interessantesten?',
        options: [
          {
            text: '💻 Vibe Coding & Entwicklung',
            correct: true,
            feedback: ''
          },
          {
            text: '⚖️ Regulierung & Gesetze',
            correct: true,
            feedback: ''
          },
          {
            text: '🎨 Neue Tools & Kreativität',
            correct: true,
            feedback: ''
          },
          {
            text: '🗑️ AI Slop & Probleme',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        question: '🎯 Wie fanden Sie dieses KI-Modul?',
        options: [
          {
            text: '😍 Sehr informativ und gut strukturiert',
            correct: true,
            feedback: ''
          },
          {
            text: '😊 Gut, habe viel gelernt',
            correct: true,
            feedback: ''
          },
          {
            text: '😐 Okay, aber zu viel Information',
            correct: true,
            feedback: ''
          },
          {
            text: '😕 Nicht so gut, war mir zu komplex',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        question: '📊 Haben Sie die FindMind-Umfrage ausgefüllt?',
        options: [
          {
            text: '😊 Ja, vollständig ausgefüllt',
            correct: true,
            feedback: ''
          },
          {
            text: '😐 Teilweise ausgefüllt',
            correct: true,
            feedback: ''
          },
          {
            text: '😕 Nein, nicht ausgefüllt',
            correct: true,
            feedback: ''
          }
        ],
        showResultsIframe: true,
        resultsUrl: 'https://de.findmind.ch/results/wMXMbYi4Bi'
      }
    ]
  },
  ausblick2026: {
    id: 'ausblick2026',
    area: 'jahresrueckblick2025',
    title: 'Ausblick 2026',
    description: 'Was bringt 2026? Von Schweizer Volksabstimmungen über neue Gesetze bis zu globalen Ereignissen – bereite dich auf das kommende Jahr vor.',
    duration: '~4 Min.',
    maxPoints: 100,
    videoTitle: '',
    videoDescription: '',
    videoPlaceholder: '',
    interactiveTitle: '🗓️ Ausblick auf das Jahr 2026',
    interactiveElements: [],
    accordionItems: [
      {
        id: 'gesetzliche-veraenderungen',
        title: 'Gesetzliche Veränderungen',
        icon: '📜',
        preview: 'Neue Gesetze und Regelungen in der Schweiz ab 2026',
        content: {
          paragraphs: [
            'Mit dem Jahreswechsel 2025/2026 treten in der Schweiz wichtige gesetzliche Änderungen in Kraft, die den Alltag vieler Menschen betreffen. Von der 13. AHV-Rente über neue Straftatbestände bis zur digitalen Identität – die Schweiz modernisiert ihre Gesetzgebung.'
          ],
          keyPoints: [
            'Sozial: 13. AHV-Rente wird erstmals im Dezember 2026 ausbezahlt (1\'260-2\'520 CHF zusätzlich pro Jahr für Einzelpersonen)',
            'Strafrecht: Stalking wird eigenständiger Straftatbestand (bis zu 3 Jahre Haft oder Geldstrafe)',
            'Gesundheit: TARDOC ersetzt TARMED als neues Tarifsystem für ärztliche Leistungen',
            'Digital: E-ID wird Ende 2026 verfügbar – App "swiyu" ermöglicht digitale Identität',
            'Energie: Elektrizitätsgemeinschaften erlauben gemeinsame Stromnutzung in Quartieren',
            'Baurecht: 60-tägiges Mängelrügerecht für Käufer, Nachbesserungsrecht kann nicht ausgeschlossen werden'
          ],
          examples: [
            {
              title: 'E-ID: Datenschutz first',
              description: 'Die E-ID nutzt Self-Sovereign Identity und Zero-Knowledge-Proofs. Daten bleiben ausschliesslich auf dem Smartphone – der Bund kann nicht nachvollziehen, wann oder wofür die E-ID genutzt wird.',
              type: 'success'
            }
          ],
          callout: {
            type: 'info',
            text: '💡 Die 13. AHV-Rente wurde im März 2024 vom Schweizer Volk mit 58.2% Ja-Stimmen angenommen und wird erstmals im Dezember 2026 ausbezahlt.'
          }
        }
      },
      {
        id: 'politische-aktivitaeten',
        title: 'Politische Aktivitäten',
        icon: '🗳️',
        preview: 'Abstimmungen und politische Initiativen in der Schweiz',
        content: {
          paragraphs: [
            'Am 8. März 2026 findet in der Schweiz eine historische Abstimmung statt: Erstmals seit 2010 gibt es wieder eine Stichfrage bei eidgenössischen Abstimmungen. Insgesamt vier Vorlagen kommen zur Abstimmung.'
          ],
          keyPoints: [
            'Bargeld-Initiative und Gegenentwurf (mit Stichfrage) – Schutz des Bargelds in der Verfassung',
            'SRG-Initiative: Senkung der Serafe-Gebühren von 335 auf 200 CHF pro Jahr',
            'Klimafonds-Initiative (SP/Grüne) – Finanzierung von Klimaschutzmassnahmen',
            'Referendum gegen Individualbesteuerung – Abschaffung der Heiratsstrafe'
          ],
          examples: [
            {
              title: 'Historische Stichfrage',
              description: 'Bei der Bargeld-Thematik gibt es eine Initiative und einen Gegenentwurf. Wenn beide angenommen werden, entscheidet die Stichfrage, welche Variante in Kraft tritt – ein seltenes Verfahren in der direkten Demokratie.',
              type: 'info'
            }
          ],
          callout: {
            type: 'tip',
            text: '📊 Die Abstimmung am 8. März 2026 ist die erste des Jahres. Es folgen weitere Abstimmungstermine im Juni und November 2026.'
          }
        }
      },
      {
        id: 'politische-ereignisse',
        title: 'Politische Ereignisse',
        icon: '🌍',
        preview: 'Wichtige politische Ereignisse weltweit',
        content: {
          paragraphs: [
            '2026 ist ein Jahr bedeutender politischer Zusammenkünfte und Wahlen. Von den US-Midterms über den G7-Gipfel bis zur Klimakonferenz COP31 – die internationale Politik setzt wichtige Weichen für die Zukunft. Zudem übernimmt die Schweiz den OSZE-Vorsitz und Bulgarien führt den Euro ein.'
          ],
          keyPoints: [
            'US Midterm-Wahlen: 3. November 2026 – Entscheidend für die zweite Hälfte von Trumps Amtszeit',
            'G7-Gipfel: 14.-16. Juni in Évian-les-Bains, Frankreich – Fokus auf Wirtschaft und Sicherheit',
            'Euro-Einführung in Bulgarien: 1. Januar 2026 – Bulgarien wird 21. Mitglied der Eurozone',
            'Schweiz übernimmt OSZE-Vorsitz: 2026 – Organisation für Sicherheit und Zusammenarbeit in Europa',
            'COP31: 9.-20. November in Antalya, Türkei – UN-Klimakonferenz mit 198 Teilnehmerstaaten'
          ],
          examples: [
            {
              title: 'US-Midterms als Richtungsentscheidung',
              description: 'Die Midterm-Wahlen 2026 entscheiden über die Mehrheiten im Repräsentantenhaus und einem Drittel des Senats. Historisch verliert die Präsidentenpartei oft Sitze – was Trumps Agenda beeinflussen könnte.',
              type: 'info'
            }
          ],
          callout: {
            type: 'info',
            text: '🌐 2026 ist ein Jahr der internationalen Diplomatie mit über 15 bedeutenden Gipfeltreffen und Konferenzen.'
          }
        }
      },
      {
        id: 'jubilaeen',
        title: 'Jubiläen & Gedenktage',
        icon: '🎉',
        preview: 'Bedeutende Jahrestage und Jubiläen 2026',
        content: {
          paragraphs: [
            '2026 ist ein Jahr bemerkenswerter Jubiläen – von Fantasy-Sagas über Wissenschaftspioniere bis zu historischen Wendepunkten. Die Vielfalt der Gedenktage spiegelt die Verflechtung verschiedener Kulturen und Epochen wider.',
            'Besonders herausragend sind die Jubiläen islamischer Gelehrter: Der 900. Geburtstag von Averroes (Ibn Rushd), Brückenbauer zwischen islamischer Philosophie und dem Abendland, sowie der 100. Geburtstag von Abdus Salam, dem ersten muslimischen Nobelpreisträger in den Naturwissenschaften.'
          ],
          keyPoints: [
            '🎬 25 Jahre "Harry Potter" & "Herr der Ringe" – Beide Fantasy-Sagas starteten November/Dezember 2001',
            '🐻 100 Jahre Winnie-the-Pooh – Erster Band erschien im Oktober 1926',
            '⭐ 100. Geburtstag Marilyn Monroe – Filmikone geboren am 1. Juni 1926',
            '📚 900. Geburtstag Averroes (Ibn Rushd) – Geboren 14. April 1126 in Córdoba',
            '🕌 500 Jahre Mogulreich – Schlacht von Panipat (April 1526) begründete kulturelle Blütezeit',
            '🔬 100. Geburtstag Abdus Salam – Erster muslimischer Nobelpreisträger (Physik 1979)',
            '✊ 50 Jahre Aufstand in Soweto – 16. Juni 1976, Wendepunkt gegen Apartheid',
            '🏊‍♀️ 100 Jahre Ärmelkanal-Durchquerung – Gertrude Ederle durchschwamm am 6. August 1926 als erste Frau den Kanal',
            '📞 150 Jahre Telefon – Alexander Graham Bell erhielt März 1876 das Patent',
            '⛪ 800. Todestag Franz von Assisi – Der Heilige starb am 3. Oktober 1226',
            '⛪ 400 Jahre Petersdom – Einweihung der Basilika am 18. November 1626',
            '🗽 250 Jahre USA – Unabhängigkeit am 4. Juli 1776, Semiquincentennial mit grösster Flottenparade'
          ],
          examples: [
            {
              title: 'Averroes: Brückenbauer zwischen Kulturen',
              description: 'Ibn Rushd (1126-1198) war Philosoph, Jurist und Arzt. Seine Aristoteles-Kommentare prägten die europäische Scholastik massgeblich. Thomas von Aquin nannte ihn "den Kommentator". Seine Werke ermöglichten den Wissenstransfer zwischen islamischer und christlicher Welt.',
              type: 'info'
            },
            {
              title: 'Abdus Salam: Pionier der Teilchenphysik',
              description: 'Der pakistanische Physiker (1926-1996) erhielt 1979 den Nobelpreis für die elektroschwache Vereinigung. Er gründete das International Centre for Theoretical Physics in Triest, um Wissenschaftler aus Entwicklungsländern zu fördern.',
              type: 'success'
            }
          ],
          callout: {
            type: 'success',
            text: '🌍 2026 würdigt Persönlichkeiten und Ereignisse aus allen Kulturen – von Fantasy-Literatur über islamische Wissenschaft bis zu Menschenrechts-Meilensteinen.'
          }
        }
      }
    ],
    sources: [
      {
        id: 'abstimmungen-2026',
        title: 'Abstimmungsvorlagen für den 8. März 2026',
        url: 'https://www.admin.ch',
        type: 'web',
        author: 'Schweizerische Bundeskanzlei',
        date: '2025'
      },
      {
        id: 'neue-gesetze-2026',
        title: 'Neue Gesetze und Regeln 2026 für die Schweiz',
        url: 'https://www.justis.ch/rechtstipps/artikel/arbeit/neue-gesetze-und-regeln-2026-das-andert-sich-fur-schweizer-konsumenten-und-arbeitnehmer',
        type: 'article',
        date: '2025'
      },
      {
        id: 'e-id-schweiz',
        title: 'E-ID in der Schweiz: Digitaler Ausweis ab 2026',
        url: 'https://geldhelden.org/digitale-identitat-schweiz/',
        type: 'article',
        date: '2025'
      },
      {
        id: 'fifa-wm-2026',
        title: '2026 FIFA World Cup - Wikipedia',
        url: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup',
        type: 'web',
        date: '2025'
      },
      {
        id: 'winterolympiade-2026',
        title: 'Milano Cortina 2026 Winter Olympics',
        url: 'https://www.olympics.com/en/milano-cortina-2026',
        type: 'web',
        author: 'IOC',
        date: '2025'
      },
      {
        id: 'kof-prognose',
        title: 'Schweizer Wirtschaft wird 2026 nur langsam wachsen',
        url: 'https://www.fuw.ch/schweiz-bip-wachstum-von-1-prozent-fuer-2026-prognostiziert',
        type: 'article',
        author: 'Finanz und Wirtschaft',
        date: '2025'
      },
      {
        id: 'gartner-2026',
        title: 'Gartner Identifies the Top Strategic Technology Trends for 2026',
        url: 'https://www.gartner.com/en/newsroom/press-releases/2025-10-20-gartner-identifies-the-top-strategic-technology-trends-for-2026',
        type: 'report',
        author: 'Gartner',
        date: 'Oktober 2025'
      },
      {
        id: 'quantum-2026',
        title: 'IBM Delivers New Quantum Processors',
        url: 'https://newsroom.ibm.com/2025-11-12-ibm-delivers-new-quantum-processors',
        type: 'article',
        author: 'IBM',
        date: 'November 2025'
      }
    ],
    quizQuestions: [
      // ===== WISSENSFRAGEN (type: 'knowledge') =====
      {
        type: 'knowledge',
        question: 'Am 8. März 2026 findet in der Schweiz eine besondere Abstimmung statt. Was ist das Besondere?',
        options: [
          {
            text: 'Es gibt zum ersten Mal eine Stichfrage seit 2010',
            correct: true,
            feedback: '✅ Richtig! Die Bargeld-Initiative und der Gegenentwurf erfordern eine Stichfrage.'
          },
          {
            text: 'Es gibt nur eine einzige Vorlage',
            correct: false,
            feedback: '❌ Falsch. Es gibt vier Vorlagen am 8. März 2026.'
          },
          {
            text: 'Es ist die erste Abstimmung des Jahres',
            correct: false,
            feedback: '❌ Das stimmt zwar, aber das Besondere ist die Stichfrage.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Was bedeutet die 13. AHV-Rente konkret für Einzelpersonen?',
        options: [
          {
            text: 'Die AHV wird um 13% erhöht',
            correct: false,
            feedback: '❌ Falsch. Es ist eine zusätzliche Rentenauszahlung.'
          },
          {
            text: 'Eine zusätzliche Rente von 1\'260-2\'520 CHF pro Jahr',
            correct: true,
            feedback: '✅ Richtig! Die 13. AHV-Rente wird erstmals im Dezember 2026 ausbezahlt.'
          },
          {
            text: 'Die AHV wird ab dem 13. Lebensjahr ausbezahlt',
            correct: false,
            feedback: '❌ Falsch. Es geht um eine zusätzliche Rentenauszahlung für Rentner.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Welches Datenschutz-Merkmal zeichnet die E-ID in der Schweiz aus?',
        options: [
          {
            text: 'Der Bund speichert alle Nutzungsdaten zentral',
            correct: false,
            feedback: '❌ Falsch. Das Gegenteil ist der Fall – Self-Sovereign Identity.'
          },
          {
            text: 'Daten bleiben ausschliesslich auf dem Smartphone',
            correct: true,
            feedback: '✅ Richtig! Self-Sovereign Identity bedeutet: Der Bund kann nicht nachvollziehen, wann oder wofür die E-ID genutzt wird.'
          },
          {
            text: 'Die E-ID ist verpflichtend für alle Schweizer',
            correct: false,
            feedback: '❌ Falsch. Die E-ID ist freiwillig.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Was ändert sich 2026 im Schweizer Gesundheitswesen bei der Tarifierung?',
        options: [
          {
            text: 'TARDOC ersetzt TARMED als neues Tarifsystem',
            correct: true,
            feedback: '✅ Richtig! TARDOC ist das neue Tarifsystem für ärztliche Leistungen.'
          },
          {
            text: 'Die Krankenkassenprämien werden halbiert',
            correct: false,
            feedback: '❌ Falsch. Es geht um das Tarifsystem, nicht um Prämien.'
          },
          {
            text: 'Alle medizinischen Leistungen werden kostenlos',
            correct: false,
            feedback: '❌ Falsch. Es ändert sich nur das Tarifsystem.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Was ermöglichen Elektrizitätsgemeinschaften ab 2026 in der Schweiz?',
        options: [
          {
            text: 'Gemeinsame Stromnutzung in Quartieren',
            correct: true,
            feedback: '✅ Richtig! Elektrizitätsgemeinschaften erlauben die gemeinsame Nutzung von Strom in Quartieren.'
          },
          {
            text: 'Kostenloser Strom für alle',
            correct: false,
            feedback: '❌ Falsch. Es geht um die gemeinsame Nutzung, nicht um Gratisenergie.'
          },
          {
            text: 'Verbot von Solaranlagen',
            correct: false,
            feedback: '❌ Falsch. Im Gegenteil, es fördert erneuerbare Energien.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Welches neue Gesetz tritt 2026 im Schweizer Strafrecht in Kraft?',
        options: [
          {
            text: 'Stalking wird eigenständiger Straftatbestand',
            correct: true,
            feedback: '✅ Richtig! Stalking wird mit bis zu 3 Jahren Haft oder Geldstrafe bestraft.'
          },
          {
            text: 'Cybermobbing wird legalisiert',
            correct: false,
            feedback: '❌ Falsch. Es geht um härtere Strafen, nicht Legalisierung.'
          },
          {
            text: 'Gefängnisstrafen werden generell abgeschafft',
            correct: false,
            feedback: '❌ Falsch. Es geht um neue Straftatbestände.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Welches Land feiert 2026 sein 250-jähriges Jubiläum der Unabhängigkeit?',
        options: [
          {
            text: 'Schweiz',
            correct: false,
            feedback: '❌ Falsch. Die Schweiz wurde 1848 als Bundesstaat gegründet.'
          },
          {
            text: 'USA',
            correct: true,
            feedback: '✅ Richtig! Am 4. Juli 2026 feiert Amerika 250 Jahre Unabhängigkeit.'
          },
          {
            text: 'Frankreich',
            correct: false,
            feedback: '❌ Falsch. Die Französische Revolution war 1789.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Wann finden die US Midterm-Wahlen 2026 statt?',
        options: [
          {
            text: '3. November 2026',
            correct: true,
            feedback: '✅ Richtig! Die Midterms entscheiden über die Mehrheiten im Kongress.'
          },
          {
            text: '5. November 2026',
            correct: false,
            feedback: '❌ Falsch. US-Wahlen sind traditionell am ersten Dienstag im November.'
          },
          {
            text: '8. November 2026',
            correct: false,
            feedback: '❌ Falsch. Das wäre der zweite Dienstag.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Worum geht es bei der SRG-Initiative, über die am 8. März 2026 abgestimmt wird?',
        options: [
          {
            text: 'Senkung der Serafe-Gebühren von 335 auf 200 CHF pro Jahr',
            correct: true,
            feedback: '✅ Richtig! Die Initiative will die Radio- und TV-Gebühren deutlich senken.'
          },
          {
            text: 'Komplette Abschaffung der SRG',
            correct: false,
            feedback: '❌ Falsch. Es geht um die Senkung der Gebühren, nicht um Abschaffung.'
          },
          {
            text: 'Erhöhung der Serafe-Gebühren',
            correct: false,
            feedback: '❌ Falsch. Die Initiative will die Gebühren senken, nicht erhöhen.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Welches neue Recht erhalten Käufer im Schweizer Baurecht ab 2026?',
        options: [
          {
            text: '60-tägiges Mängelrügerecht, Nachbesserungsrecht kann nicht ausgeschlossen werden',
            correct: true,
            feedback: '✅ Richtig! Käufer haben 60 Tage Zeit Mängel zu rügen und ein Nachbesserungsrecht.'
          },
          {
            text: 'Kostenlose Renovierung aller Altbauten',
            correct: false,
            feedback: '❌ Falsch. Es geht um Käuferrechte bei Neubauten.'
          },
          {
            text: 'Verbot von Hypotheken',
            correct: false,
            feedback: '❌ Falsch. Es ändert sich nur das Mängelrecht.'
          }
        ]
      },
      // ===== FEEDBACK-FRAGEN (type: 'feedback') =====
      {
        type: 'feedback',
        question: 'Welche Kategorie im Ausblick 2026 fanden Sie am interessantesten?',
        options: [
          {
            text: '📜 Gesetzliche Veränderungen',
            correct: true,
            feedback: ''
          },
          {
            text: '🗳️ Politische Aktivitäten',
            correct: true,
            feedback: ''
          },
          {
            text: '🌍 Politische Ereignisse',
            correct: true,
            feedback: ''
          },
          {
            text: '🎉 Jubiläen & Gedenktage',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        type: 'feedback',
        question: 'Wie fanden Sie das Modul "Ausblick 2026"?',
        options: [
          {
            text: '😍 Sehr informativ und gut strukturiert',
            correct: true,
            feedback: ''
          },
          {
            text: '😊 Gut, habe Interessantes entdeckt',
            correct: true,
            feedback: ''
          },
          {
            text: '😐 Okay, aber zu viel Information',
            correct: true,
            feedback: ''
          },
          {
            text: '😕 Nicht so gut, war mir zu komplex',
            correct: true,
            feedback: ''
          }
        ]
      },
      {
        type: 'feedback',
        question: 'Fühlen Sie sich gut informiert über das Jahr 2026?',
        options: [
          {
            text: '✅ Ja, sehr gut informiert',
            correct: true,
            feedback: ''
          },
          {
            text: '😊 Ja, ziemlich gut informiert',
            correct: true,
            feedback: ''
          },
          {
            text: '😐 Teilweise informiert',
            correct: true,
            feedback: ''
          },
          {
            text: '😕 Nein, brauche mehr Informationen',
            correct: true,
            feedback: ''
          }
        ]
      }
    ]
  }
}

// Helper Funktionen

export function getModulesByArea(areaId: 'jahresrueckblick2025'): ModuleContent[] {
  return Object.values(moduleData).filter(module => module.area === areaId)
}

export function getTotalPointsByArea(areaId: 'jahresrueckblick2025'): number {
  return getModulesByArea(areaId).reduce((sum, module) => sum + module.maxPoints, 0)
}

export function getAreaProgress(areaId: 'jahresrueckblick2025', userModules: any): {
  completed: number
  total: number
  points: number
  maxPoints: number
  progress: number
} {
  const areaModules = getModulesByArea(areaId)
  const total = areaModules.length
  const completed = areaModules.filter(m => userModules[m.id]?.completed).length
  const points = areaModules.reduce((sum, m) => sum + (userModules[m.id]?.score || 0), 0)
  const maxPoints = getTotalPointsByArea(areaId)
  const progress = Math.round((points / maxPoints) * 100)
  
  return { completed, total, points, maxPoints, progress }
}
