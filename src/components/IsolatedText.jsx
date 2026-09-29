const LATIN_RUN = /@[A-Za-z0-9_]+|[A-Za-z0-9_]+(?:[.+/_:-][A-Za-z0-9_]+)*/g

/** Isolate embedded Latin identifiers and technical strings in Persian copy. */
export default function IsolatedText({ children }) {
  if (typeof children !== 'string') return children

  const parts = children.split(LATIN_RUN)
  return parts.map((part, index) => (
    /[A-Za-z]/.test(part)
      ? <bdi key={`${index}-${part}`} dir="ltr" lang="en">{part}</bdi>
      : part
  ))
}
