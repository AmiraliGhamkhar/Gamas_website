/**
 * Isolate embedded Latin identifiers and technical strings in Persian copy.
 *
 * The whole alternative must be a capturing group: `String.split` keeps only
 * captured groups, so an uncaptured pattern silently deletes every Latin run
 * (format names such as MP3 or PPTX would never reach the page).
 */
const LATIN_RUN = /(@[A-Za-z0-9_]+|[A-Za-z0-9_]+(?:[.+/_:-][A-Za-z0-9_]+)*)/g

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
