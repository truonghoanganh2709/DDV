import { useEffect, useState } from 'react';

export function useTypewriterPlaceholder(phrases, typingSpeed = 80, deletingSpeed = 40, pauseMs = 1500) {
  const [display, setDisplay] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases.length) return undefined;

    const phrase = phrases[phraseIdx % phrases.length];
    let timeout;

    if (!isDeleting && display === phrase) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && display === '') {
      setIsDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
    } else if (isDeleting) {
      timeout = setTimeout(() => setDisplay(phrase.substring(0, display.length - 1)), deletingSpeed);
    } else {
      timeout = setTimeout(() => setDisplay(phrase.substring(0, display.length + 1)), typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [display, isDeleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return display;
}
