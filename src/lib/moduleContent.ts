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
            text: '<iframe src="https://padlet.com/hepverlag/die-fotos-des-jahres-von-unicef-4ty1up0zfojgg7y3" style="width:100%; height:608px; border:none; border-radius:8px" title="UNICEF Fotoreportagen" allow="camera;microphone;geolocation"></iframe>'
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
            text: '<iframe src="https://padlet.com/hepverlag/bilder-des-jahres-2025-uos70aznxq25cuoa" style="width:100%; height:608px; border:none; border-radius:8px" title="Bilder des Jahres 2025" allow="camera;microphone;geolocation"></iframe>'
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
            'Im Jahr 2025 werden weltweit schätzungsweise 2 Billionen digitale Fotos aufgenommen. Das entspricht etwa 61\'000 Fotos pro Sekunde – oder 5.3 Milliarden Fotos pro Tag.',
            'Die USA führen mit durchschnittlich 20 Bildern pro Tag pro Person, während Europäer mit etwa 5 Bildern pro Tag etwas zurückhaltender sind.'
          ],
          callout: {
            type: 'info',
            text: '💡 Zum Vergleich: In den ersten 75 Jahren der Fotografie (1826-1900) wurden insgesamt nur wenige Millionen Fotos gemacht. Im Spitzenjahr der Filmfotografie 1998 waren es 60 Milliarden – heute schaffen wir diese Menge alle 13 Tage!'
          }
        },
        controlQuestion: {
          question: 'Wie viele Fotos werden schätzungsweise 2025 weltweit pro Tag aufgenommen?',
          options: [
            {
              text: 'Ca. 500 Millionen',
              isCorrect: false,
              feedback: 'Diese Schätzung ist zu niedrig. Die weltweite Foto-Produktion ist massiv gestiegen.'
            },
            {
              text: 'Ca. 5.3 Milliarden',
              isCorrect: true,
              feedback: '✅ Richtig! Schätzungsweise 5.3 Milliarden Fotos werden täglich weltweit aufgenommen.'
            },
            {
              text: 'Ca. 50 Milliarden',
              isCorrect: false,
              feedback: 'Diese Schätzung wäre über 6 Fotos pro Sekunde pro Person weltweit – zu hoch!'
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
            'Über 92-95% aller Fotos weltweit werden heute mit Smartphones aufgenommen. Dedizierte Kameras machen nur noch etwa 3-5% aller Aufnahmen aus – ein dramatischer Wandel im Vergleich zu vor 15 Jahren.',
            'Nur etwa 40-80 Milliarden Fotos jährlich werden mit echten digitalen Kameras gemacht, während der Grossteil mit Smartphones entsteht.'
          ],
          callout: {
            type: 'success',
            text: '📸 Moderne Smartphones haben heute Kameras mit über 200 Megapixeln und können durch KI-Unterstützung in vielen Situationen mit professionellen Kameras mithalten.'
          }
        },
        controlQuestion: {
          question: 'Welcher Prozentsatz aller Fotos wird schätzungsweise 2025 mit Smartphones gemacht?',
          options: [
            {
              text: 'Ca. 50%',
              isCorrect: false,
              feedback: 'Diese Schätzung ist zu niedrig. Smartphones sind noch dominanter – die meisten Menschen haben ihre Kamera immer dabei.'
            },
            {
              text: 'Ca. 75%',
              isCorrect: false,
              feedback: 'Fast richtig, aber Schätzungen gehen davon aus, dass Smartphones einen noch grösseren Anteil haben.'
            },
            {
              text: 'Ca. 92-95%',
              isCorrect: true,
              feedback: '✅ Korrekt! Schätzungen zufolge entstehen über 92% aller Fotos mit dem Smartphone.'
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
            '71% aller Social Media Bilder sind mittlerweile KI-generiert oder KI-erweitert. Dies umfasst sowohl vollständig von KI erstellte Bilder als auch Fotos, die durch KI stark verändert wurden.',
            'Über 80% aller Social Media Inhalte werden durch KI-Algorithmen empfohlen, was die Nutzerbindung erheblich verbessert. Die KI-gesteuerte Social Media-Industrie soll bis 2031 auf 12 Milliarden Dollar wachsen.'
          ],
          callout: {
            type: 'warning',
            text: '⚠️ Ethische Frage: 62% der Marketer glauben, dass eine Kennzeichnungspflicht für KI-generierte Inhalte positive Effekte auf Social Media hätte.'
          }
        },
        controlQuestion: {
          question: 'Wie viel Prozent der Social Media Bilder sind gemäss Schätzungen KI-generiert oder KI-erweitert?',
          options: [
            {
              text: 'Ca. 25%',
              isCorrect: false,
              feedback: 'Laut aktuellen Schätzungen ist KI viel verbreiteter! Die Mehrheit der Bilder wird durch KI beeinflusst.'
            },
            {
              text: 'Ca. 50%',
              isCorrect: false,
              feedback: 'Schätzungen gehen von noch mehr aus! KI-Generierung ist heute Standard in Social Media.'
            },
            {
              text: 'Ca. 71%',
              isCorrect: true,
              feedback: '✅ Richtig! Gemäss Schätzungen sind etwa 71% aller Social Media Bilder KI-generiert oder KI-erweitert.'
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
            'Junge Erwachsene (18-24 Jahre) horten zusammen etwa 10 Milliarden Fotos auf ihren Smartphones. Der durchschnittliche Nutzer hat 2.100-2.800 Fotos auf dem Smartphone gespeichert – iOS-Nutzer etwa 2.400, Android-Nutzer rund 1.900 Fotos.',
            '97% aller Smartphone-Nutzer speichern ihre Fotos in Cloud-Diensten, schauen sich diese aber nur einmal pro Monat an. Über ein Drittel der jungen Erwachsenen löscht Fotos nicht aus Angst, Erinnerungen zu verlieren.'
          ],
          callout: {
            type: 'warning',
            text: '⚠️ 60% der Amerikaner löschen nie Fotos oder Videos von ihren Geräten. 12% geben bis zu £5 pro Monat für zusätzlichen Speicherplatz aus – das sind £300 Millionen jährlich.'
          }
        },
        controlQuestion: {
          question: 'Wie viele Fotos hat gemäss Schätzungen der durchschnittliche Smartphone-Nutzer gespeichert?',
          options: [
            {
              text: 'Ca. 500-800 Fotos',
              isCorrect: false,
              feedback: 'Diese Schätzung ist zu niedrig! Wir sammeln viel mehr Fotos an, als uns bewusst ist.'
            },
            {
              text: 'Ca. 2.100-2.800 Fotos',
              isCorrect: true,
              feedback: '✅ Richtig! Schätzungen zufolge liegt der Durchschnitt bei 2.100-2.800 Fotos pro Smartphone.'
            },
            {
              text: 'Ca. 10.000 Fotos',
              isCorrect: false,
              feedback: 'Das wäre extrem viel – gemäss Schätzungen ist der Durchschnitt niedriger, aber immer noch beeindruckend.'
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
            'Der EU Artificial Intelligence Act (EU AI Act) trat 2025 offiziell in Kraft. Es ist die weltweit erste umfassende Gesetzgebung zur Regulierung künstlicher Intelligenz.',
            'Das Gesetz kategorisiert KI-Systeme nach Risikostufen: Verbotene Systeme (z.B. Social Scoring), Hochrisiko-Systeme (z.B. biometrische Identifikation), und Systeme mit geringem Risiko. Verstösse können Strafen bis zu 35 Millionen Euro oder 7% des weltweiten Jahresumsatzes nach sich ziehen.'
          ],
          keyPoints: [
            'Inkrafttreten: Gestaffelt ab Februar 2025',
            'Strafen: Bis 35 Mio. € oder 7% des Jahresumsatzes',
            'Verbotene KI: Social Scoring, manipulative Techniken',
            'Hochrisiko-KI: Strenge Anforderungen an Dokumentation und Transparenz'
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
        title: 'GPT-5 und Gemini Ultra setzen neue Massstäbe',
        icon: '🤖',
        preview: 'KI-Modelle erreichen neue Leistungsniveaus',
        content: {
          paragraphs: [
            'OpenAI veröffentlichte im März 2025 GPT-5, das laut Benchmarks erstmals menschliche Leistung bei komplexen Aufgaben wie Programmierung und wissenschaftlichem Schreiben übertrifft. Google konterte mit Gemini Ultra.',
            'Beide Modelle zeigen dramatische Verbesserungen bei multimodalen Fähigkeiten: Sie verstehen gleichzeitig Text, Bilder, Audio und Video. Die Fehlerrate bei mathematischen Aufgaben sank auf unter 2%, bei Programmiertests erreichen sie über 90% Erfolgsquote.'
          ],
          keyPoints: [
            'GPT-5 Release: Anfang 2025',
            'Gemini Ultra: Mitte 2025',
            'Multimodalität: Text, Bild, Audio, Video gleichzeitig',
            'Durchbruch bei Code-Generierung und wissenschaftlichem Reasoning'
          ]
        },
        controlQuestion: {
          question: 'Welche Erfolgsquote erreichen die neuen KI-Modelle bei Programmiertests?',
          options: [
            {
              text: 'Über 60%',
              isCorrect: false,
              feedback: 'Nicht korrekt. Die Erfolgsquote ist deutlich höher.'
            },
            {
              text: 'Über 90%',
              isCorrect: true,
              feedback: '✅ Richtig! Die KI-Modelle erreichen bei Programmiertests über 90% Erfolgsquote.'
            },
            {
              text: 'Etwa 50%',
              isCorrect: false,
              feedback: 'Nicht korrekt. Die Modelle schneiden viel besser ab.'
            }
          ]
        }
      },
      {
        id: 'wm-vorbereitung',
        title: 'FIFA WM 2026: Vorbereitungen in USA, Kanada und Mexiko',
        icon: '⚽',
        preview: 'Erste WM mit 48 Teams',
        content: {
          paragraphs: [
            'Die Vorbereitungen für die FIFA Fussball-Weltmeisterschaft 2026 liefen 2025 auf Hochtouren. Es wird die erste WM mit 48 teilnehmenden Teams sein (bisher 32) und findet in drei Ländern statt: USA, Kanada und Mexiko.',
            'Neue Stadien in Nordamerika wurden fertiggestellt, darunter das SoFi Stadium in Los Angeles und das MetLife Stadium in New York/New Jersey. Die Qualifikationsspiele starteten im September 2025 mit neuen Formaten für alle Konföderationen.'
          ],
          keyPoints: [
            'Zeitraum: 11. Juni bis 19. Juli 2026',
            'Teilnehmer: 48 Teams (Premiere)',
            'Spiele: 104 (bisher 64)',
            'Gastgeber: 16 Städte in USA, Kanada, Mexiko'
          ]
        },
        controlQuestion: {
          question: 'Wie viele Teams nehmen erstmals an der FIFA WM 2026 teil?',
          options: [
            {
              text: '32 Teams (wie bisher)',
              isCorrect: false,
              feedback: 'Nicht korrekt. Die Anzahl der Teams wurde erhöht.'
            },
            {
              text: '48 Teams',
              isCorrect: true,
              feedback: '✅ Richtig! Erstmals nehmen 48 Teams an einer WM teil (bisher 32).'
            },
            {
              text: '64 Teams',
              isCorrect: false,
              feedback: 'Nicht korrekt. So viele Teams nehmen nicht teil.'
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
      },
      {
        id: 'fifa-wm',
        title: 'FIFA World Cup 2026 Preparations',
        type: 'article',
        author: 'FIFA',
        date: '2025',
        url: 'https://www.fifa.com'
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
    title: 'KI & Digitale Transformation 2025',
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
        id: 'neue-tools',
        title: 'Neue KI-Tools für Kreative',
        icon: '🎨',
        preview: 'Von nano banana bis zu verbesserten Foto-Tools',
        content: {
          paragraphs: [
            'Google Gemini führte 2025 "nano banana" ein – eine Funktion zur drastischen Verbesserung von Fotografien durch KI. Das Tool kann Belichtung, Schärfe und Komposition automatisch optimieren. Gleichzeitig revolutionieren Tools wie Midjourney, DALL-E und Stable Diffusion die Bildgenerierung.'
          ],
          callout: {
            type: 'success',
            text: '✨ Nano banana kann verwackelte oder unterbelichtete Fotos in professionell wirkende Aufnahmen verwandeln – oft besser als teure Profi-Software.'
          }
        },
        controlQuestion: {
          question: 'Was macht "nano banana" von Google Gemini?',
          options: [
            {
              text: 'A) Generiert Bananen-Bilder',
              isCorrect: false,
              feedback: 'Nein, der Name ist irreführend – es geht nicht um Bananen!'
            },
            {
              text: 'B) Verbessert Fotografien durch KI',
              isCorrect: true,
              feedback: '✅ Genau! Nano banana optimiert Fotos automatisch.'
            },
            {
              text: 'C) Erstellt 3D-Modelle',
              isCorrect: false,
              feedback: 'Nein, es fokussiert auf 2D-Fotografie-Verbesserung.'
            }
          ]
        }
      },
      {
        id: 'seo-to-geo',
        title: 'Von SEO zu GEO',
        icon: '🔍',
        preview: 'KI-Suchmaschinen verändern das Internet',
        content: {
          paragraphs: [
            'Der Wandel von SEO (Search Engine Optimization) zu GEO (Generative Engine Optimization) markiert 2025 einen Paradigmenwechsel. Während SEO darauf abzielte, in Suchmaschinen-Rankings zu erscheinen, geht es bei GEO darum, in KI-generierten Antworten zitiert zu werden. ChatGPT, Perplexity und Gemini liefern direkte Antworten statt Link-Listen.'
          ],
          callout: {
            type: 'info',
            text: '💡 Laut einer Gartner-Studie werden bis 2026 traditionelle Suchmaschinen-Zugriffe um 25% sinken, während KI-Chat-Anfragen um 400% steigen.'
          }
        },
        controlQuestion: {
          question: 'Was bedeutet der Wandel von SEO zu GEO?',
          options: [
            {
              text: 'A) Geografische Optimierung von Websites',
              isCorrect: false,
              feedback: 'Nein, GEO steht nicht für Geografie in diesem Kontext.'
            },
            {
              text: 'B) Optimierung für KI-generierte Antworten',
              isCorrect: true,
              feedback: '✅ Richtig! GEO = Generative Engine Optimization.'
            },
            {
              text: 'C) Optimierung für soziale Medien',
              isCorrect: false,
              feedback: 'Nein, es geht speziell um KI-Suchmaschinen.'
            }
          ]
        }
      },
      {
        id: 'google-gewinner',
        title: 'Google als KI-Gewinnerin',
        icon: '🏆',
        preview: 'Warum Google 2025 im KI-Rennen vorne liegt',
        content: {
          paragraphs: [
            'Trotz anfänglicher Ängste um die Dominanz von ChatGPT etablierte sich Google 2025 als klare Gewinnerin im KI-Wettlauf. Gemini wurde nahtlos in alle Google-Dienste integriert: Gmail, Docs, Sheets, YouTube, Maps. Mit Milliarden aktiven Nutzern weltweit hat Google eine uneinholbare Verbreitung erreicht.'
          ],
          callout: {
            type: 'success',
            text: '🎯 Googles Vorteil: Zugang zu mehr Trainingsdaten als jedes andere Unternehmen – YouTube, Google Search, Android, Chrome kombiniert.'
          }
        },
        controlQuestion: {
          question: 'Warum gilt Google als Gewinnerin im KI-Kampf?',
          options: [
            {
              text: 'A) Hat die meisten KI-Forscher',
              isCorrect: false,
              feedback: 'Das ist ein Faktor, aber nicht der Hauptgrund.'
            },
            {
              text: 'B) Integration in 3 Milliarden aktive Nutzer-Dienste',
              isCorrect: true,
              feedback: '✅ Genau! Die nahtlose Integration in bestehende Dienste ist der Schlüssel.'
            },
            {
              text: 'C) Hat das grösste KI-Modell',
              isCorrect: false,
              feedback: 'Modellgrösse allein entscheidet nicht – Verbreitung ist wichtiger.'
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
            '2026 ist ein Jahr bedeutender politischer Zusammenkünfte und Wahlen. Von den US-Midterms über G7- und G20-Gipfel bis zur Klimakonferenz COP31 – die internationale Politik setzt wichtige Weichen für die Zukunft.'
          ],
          keyPoints: [
            'US Midterm-Wahlen: 3. November 2026 – Entscheidend für die zweite Hälfte von Trumps Amtszeit',
            'G7-Gipfel: 14.-16. Juni in Évian-les-Bains, Frankreich – Fokus auf Wirtschaft und Sicherheit',
            'G20-Gipfel: 14.-15. Dezember in Miami, USA – Erste G20 unter US-Präsidentschaft seit 2009',
            'COP31: 9.-20. November in Antalya, Türkei – UN-Klimakonferenz mit 198 Teilnehmerstaaten',
            'Schweizer Bundesratswahlen: Dezember 2026 – Mögliche Rochaden im Bundesrat'
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
        title: 'Jubiläen',
        icon: '🎉',
        preview: 'Bedeutende Jahrestage und Jubiläen 2026',
        content: {
          paragraphs: [
            '2026 feiert zahlreiche bedeutende Jubiläen – von historischen Meilensteinen über kulturelle Institutionen bis zu sportlichen Traditionen.'
          ],
          keyPoints: [
            'USA: 250 Jahre Unabhängigkeit (4. Juli 1776-2026) – Semiquincentennial mit grösster Flottenparade',
            'Sinfonieorchester Basel: 150-jähriges Bestehen – Eines der ältesten Orchester der Schweiz',
            'Theater St. Gallen: 20. Ausgabe der Festspiele mit Verdis "Aida"',
            'Schweizer Armee: 175 Jahre nach der Bundesverfassung 1848',
            'ETH Zürich: 170 Jahre seit Gründung 1855'
          ],
          examples: [
            {
              title: 'USA: Die grösste Flottenparade der Geschichte',
              description: 'Am 4. Juli 2026 versammeln sich 60 Schiffe aus 30 Ländern im New Yorker Hafen für die grösste internationale Flottenparade aller Zeiten. Ein Symbol für 250 Jahre amerikanische Geschichte und internationale Beziehungen.',
              type: 'info'
            },
            {
              title: 'Sinfonieorchester Basel wird 150',
              description: 'Das 1876 gegründete Orchester feiert mit einem Jubiläumsprogramm, das die Geschichte der Orchestertradition in der Schweiz würdigt.',
              type: 'success'
            }
          ],
          callout: {
            type: 'success',
            text: '🎊 2026 ist ein Jahr der Feierlichkeiten – von kulturellen Institutionen bis zu historischen Meilensteinen.'
          }
        }
      },
      {
        id: 'veranstaltungen',
        title: 'Veranstaltungen',
        icon: '🎭',
        preview: 'Sportliche und kulturelle Highlights weltweit und in der Schweiz',
        content: {
          paragraphs: [
            '2026 verspricht ein spektakuläres Jahr für Sport- und Kulturbegeisterte zu werden. Von der FIFA WM über Olympische Winterspiele bis zu legendären Festivals – für jeden ist etwas dabei.'
          ],
          keyPoints: [
            'FIFA Fussball-WM 2026: 11. Juni - 19. Juli (USA/Mexiko/Kanada) – Erstmals mit 48 Teams',
            'Olympische Winterspiele Milano-Cortina: 6.-22. Februar – Ski-Bergsteigen wird olympisch',
            'IIHF Eishockey-WM: 15.-31. Mai (Zürich & Fribourg) – Schweiz gegen Deutschland am 18. Mai',
            'Open Air St. Gallen: 25.-28. Juni mit Twenty One Pilots',
            'Montreux Jazz Festival: 2.-19. Juli mit 17 Bühnen',
            'Gurtenfestival: 15.-18. Juli mit Lorde',
            'Locarno Film Festival: 5.-15. August'
          ],
          examples: [
            {
              title: 'FIFA WM 2026: Ein neues Format',
              description: 'Die WM 2026 ist die erste mit 48 Teams und findet erstmals in drei Ländern statt. 104 Spiele werden in 16 Städten ausgetragen – das Finale steigt am 19. Juli im MetLife Stadium (New Jersey).',
              type: 'info'
            },
            {
              title: 'Schweizer Eishockey-Fest',
              description: 'Die IIHF WM in Zürich (Swiss Life Arena) und Fribourg bringt die besten Eishockey-Nationen in die Schweiz. Highlight: Schweiz gegen Deutschland am 18. Mai.',
              type: 'success'
            }
          ],
          callout: {
            type: 'success',
            text: '🏆 2026 ist das Jahr der Mega-Events – von der FIFA WM bis zur Eishockey-WM in der Schweiz.'
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
        question: 'Welches sportliche Grossereignis findet 2026 in der Schweiz statt?',
        options: [
          {
            text: 'Olympische Winterspiele',
            correct: false,
            feedback: '❌ Falsch. Die Winterolympiade findet in Milano-Cortina (Italien) statt.'
          },
          {
            text: 'IIHF Eishockey-Weltmeisterschaft im Mai',
            correct: true,
            feedback: '✅ Richtig! Vom 15.-31. Mai in Zürich (Swiss Life Arena) und Fribourg.'
          },
          {
            text: 'FIFA Fussball-Weltmeisterschaft',
            correct: false,
            feedback: '❌ Falsch. Die FIFA WM findet in USA/Mexiko/Kanada statt.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Wann findet die FIFA Fussball-WM 2026 statt?',
        options: [
          {
            text: 'Juni bis Juli 2026',
            correct: true,
            feedback: '✅ Richtig! Vom 11. Juni bis 19. Juli 2026 in drei Ländern.'
          },
          {
            text: 'Mai bis Juni 2026',
            correct: false,
            feedback: '❌ Falsch. Die WM beginnt erst im Juni.'
          },
          {
            text: 'November bis Dezember 2026',
            correct: false,
            feedback: '❌ Falsch. Das war die WM 2022 in Katar.'
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
        question: 'Welche olympische Disziplin wird 2026 erstmals bei den Winterspielen eingeführt?',
        options: [
          {
            text: 'Snowboard-Cross',
            correct: false,
            feedback: '❌ Falsch. Snowboard-Cross gibt es schon seit 2006.'
          },
          {
            text: 'Ski-Bergsteigen',
            correct: true,
            feedback: '✅ Richtig! Bei Milano-Cortina wird Ski-Bergsteigen erstmals olympisch.'
          },
          {
            text: 'Eiskunstlauf Paare',
            correct: false,
            feedback: '❌ Falsch. Eiskunstlauf gibt es seit den ersten Winterspielen.'
          }
        ]
      },
      {
        type: 'knowledge',
        question: 'Wie viele Teams nehmen erstmals an der FIFA WM 2026 teil?',
        options: [
          {
            text: '32 Teams (wie bisher)',
            correct: false,
            feedback: '❌ Falsch. Die WM 2026 wird erweitert.'
          },
          {
            text: '48 Teams (erstmals erweitert)',
            correct: true,
            feedback: '✅ Richtig! Die WM 2026 ist die erste mit 48 teilnehmenden Teams in 104 Spielen.'
          },
          {
            text: '64 Teams',
            correct: false,
            feedback: '❌ Falsch. Es sind 48 Teams.'
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
            text: '🎉 Jubiläen',
            correct: true,
            feedback: ''
          },
          {
            text: '🎭 Veranstaltungen',
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
