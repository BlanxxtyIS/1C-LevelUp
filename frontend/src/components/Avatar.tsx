interface Props {
  name: string
  avatarUrl?: string | null
  size?: number
  className?: string
}

export default function Avatar({ name, avatarUrl, size = 40, className = '' }: Props) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-violet-600/20 border border-violet-800 flex items-center justify-center font-bold text-violet-400 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {name[0].toUpperCase()}
    </div>
  )
}