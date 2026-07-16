type Props = {
  isDark: boolean
  onToggle: () => void
}

export function DarkModeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      className="dark-mode-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="dark-mode-toggle__icon">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
