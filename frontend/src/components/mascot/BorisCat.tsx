import { useEffect, useRef } from 'react'

type Mood = 'idle' | 'correct' | 'wrong' | 'celebrate'

interface Props {
  mood?: Mood
  size?: number
}

export default function BorisCat({ mood = 'idle', size = 120 }: Props) {
  const prevMood = useRef<Mood>('idle')

  useEffect(() => {
    prevMood.current = mood
  }, [mood])

  const eyeColor = mood === 'wrong' ? '#cc0000' : '#2D1B00'
  const bodyColor = mood === 'celebrate' ? '#FFD700' : '#F5C842'
  const bounceClass = mood === 'correct' || mood === 'celebrate' ? 'boris-bounce-fast' : 'boris-bounce'
  const badgeColor = mood === 'wrong' ? '#dc2626' : mood === 'correct' ? '#10b981' : '#7c3aed'
  const badgeText = mood === 'wrong' ? '?!' : mood === 'correct' ? '✓' : '1С'

  return (
    <div style={{ width: size, height: size * 1.1 }}>
      <style>{`
        @keyframes boris-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes boris-bounce-fast {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-14px); }
          75% { transform: translateY(-7px); }
        }
        @keyframes boris-blink {
          0%, 88%, 100% { transform: scaleY(1); }
          93% { transform: scaleY(0.05); }
        }
        @keyframes boris-tail {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
        @keyframes boris-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .boris-bounce { animation: boris-bounce 2s ease-in-out infinite; }
        .boris-bounce-fast { animation: boris-bounce-fast 0.5s ease-in-out 3; }
        .boris-shake { animation: boris-shake 0.4s ease-in-out; }
        .boris-eye-l { transform-origin: 36px 27px; animation: boris-blink 3.5s ease-in-out infinite; }
        .boris-eye-r { transform-origin: 44px 27px; animation: boris-blink 3.5s ease-in-out infinite 0.15s; }
        .boris-tail { transform-origin: 52px 42px; animation: boris-tail 2s ease-in-out infinite; }
      `}</style>

      <svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 80 88"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Тень */}
        <ellipse cx="40" cy="84" rx="22" ry="4" fill="rgba(0,0,0,0.1)"/>

        <g className={mood === 'wrong' ? 'boris-shake' : bounceClass}>

          {/* Хвост */}
          <g className="boris-tail">
            <path d="M52 42 Q65 35 67 25 Q68 20 63 19 Q58 18 57 23 Q56 28 50 34 Z"
              fill={bodyColor} stroke="#E5A800" strokeWidth="0.8"/>
            <ellipse cx="63" cy="19.5" rx="4" ry="3" fill="#FF9EAA"/>
          </g>

          {/* Тело */}
          <ellipse cx="40" cy="58" rx="26" ry="24" fill={bodyColor} stroke="#E5A800" strokeWidth="1"/>

          {/* Живот */}
          <ellipse cx="40" cy="62" rx="16" ry="17" fill="#FDE68A"/>

          {/* Значок */}
          <rect x="32" y="50" width="16" height="12" rx="2" fill={badgeColor}/>
          <text x="40" y="59" textAnchor="middle" fontSize="6" fontWeight="700"
            fill="white" fontFamily="sans-serif">{badgeText}</text>

          {/* Лапы */}
          <ellipse cx="22" cy="76" rx="9" ry="6" fill={bodyColor} stroke="#E5A800" strokeWidth="0.8"/>
          <ellipse cx="58" cy="76" rx="9" ry="6" fill={bodyColor} stroke="#E5A800" strokeWidth="0.8"/>

          {/* Голова */}
          <ellipse cx="40" cy="30" rx="22" ry="21" fill={bodyColor} stroke="#E5A800" strokeWidth="1"/>

          {/* Уши */}
          <polygon points="20,18 14,6 28,16" fill={bodyColor} stroke="#E5A800" strokeWidth="1"/>
          <polygon points="60,18 66,6 52,16" fill={bodyColor} stroke="#E5A800" strokeWidth="1"/>
          <polygon points="21,17 16,9 27,15" fill="#FF9EAA"/>
          <polygon points="59,17 64,9 53,15" fill="#FF9EAA"/>

          {/* Очки */}
          <circle cx="33" cy="28" r="9" fill="none" stroke="#5B3A1A" strokeWidth="1.2"/>
          <circle cx="47" cy="28" r="9" fill="none" stroke="#5B3A1A" strokeWidth="1.2"/>
          <line x1="42" y1="28" x2="38" y2="28" stroke="#5B3A1A" strokeWidth="1.2"/>
          <path d="M24 28 Q20 26 19 23" stroke="#5B3A1A" strokeWidth="1.2" fill="none"/>
          <path d="M56 28 Q60 26 61 23" stroke="#5B3A1A" strokeWidth="1.2" fill="none"/>

          {/* Блики */}
          <circle cx="30" cy="25" r="2" fill="rgba(255,255,255,0.5)"/>
          <circle cx="44" cy="25" r="2" fill="rgba(255,255,255,0.5)"/>

          {/* Глаза */}
          <g className="boris-eye-l">
            <circle cx="33" cy="28" r="6" fill={eyeColor}/>
            <circle cx="34.5" cy="26.5" r="1.8" fill="white"/>
          </g>
          <g className="boris-eye-r">
            <circle cx="47" cy="28" r="6" fill={eyeColor}/>
            <circle cx="48.5" cy="26.5" r="1.8" fill="white"/>
          </g>

          {/* Нос */}
          <ellipse cx="40" cy="35" rx="3" ry="2" fill="#FF7BAC"/>

          {/* Рот */}
          {mood === 'wrong'
            ? <path d="M36 40 Q40 37 44 40" stroke="#5B3A1A" strokeWidth="1" fill="none" strokeLinecap="round"/>
            : <path d="M36 38 Q40 42 44 38" stroke="#5B3A1A" strokeWidth="1" fill="none" strokeLinecap="round"/>
          }

          {/* Усы */}
          <line x1="36" y1="35" x2="18" y2="32" stroke="#5B3A1A" strokeWidth="0.8" strokeLinecap="round"/>
          <line x1="36" y1="37" x2="17" y2="37" stroke="#5B3A1A" strokeWidth="0.8" strokeLinecap="round"/>
          <line x1="36" y1="39" x2="19" y2="42" stroke="#5B3A1A" strokeWidth="0.8" strokeLinecap="round"/>
          <line x1="44" y1="35" x2="62" y2="32" stroke="#5B3A1A" strokeWidth="0.8" strokeLinecap="round"/>
          <line x1="44" y1="37" x2="63" y2="37" stroke="#5B3A1A" strokeWidth="0.8" strokeLinecap="round"/>
          <line x1="44" y1="39" x2="61" y2="42" stroke="#5B3A1A" strokeWidth="0.8" strokeLinecap="round"/>

          {/* Тигровые полоски */}
          <path d="M33 11 Q40 8 47 11" stroke="#E5A800" strokeWidth="1" fill="none"/>
          <path d="M30 15 Q40 11 50 15" stroke="#E5A800" strokeWidth="0.8" fill="none"/>

        </g>
      </svg>
    </div>
  )
}