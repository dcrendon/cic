interface HeaderProps {
  title: string
  right?: React.ReactNode
}

export function Header({ title, right }: HeaderProps) {
  return (
    <header style={{
      padding: "1rem 1.25rem",
      backgroundColor: "var(--bg-1)",
      borderBottom: "1px solid var(--bg-4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      <h1 style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 800,
        fontSize: "1.5rem",
        color: "var(--text-1)",
        margin: 0,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      }}>
        {title}
      </h1>
      {right && <div>{right}</div>}
    </header>
  )
}
