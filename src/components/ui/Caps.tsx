/**
 * Uppercase labels follow the page language: on Turkish pages CSS turns
 * "i" into "İ", which is right for Turkish words but wrong for brand names
 * and English phrases ("AİRVİATECH"). Caps marks those segments as English.
 */
const PROTECTED = /(AirviaTech|AirviaGo|Wings of Technology|System Provider for Sellers|IATA ARM|Live)/g;

export function hasProtected(text: string) {
  PROTECTED.lastIndex = 0;
  return PROTECTED.test(text);
}

export function Caps({ text }: { text: string }) {
  const parts = text.split(PROTECTED);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} lang="en">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
