export const useTextStress = () => {
  const analyzeTextStress = (text: string): number => {
    let score = 0;
    const lower = text.toLowerCase();

    const urgentWords = [
      "urgent",
      "emergency",
      "dying",
      "help",
      "please",
      "immediately",
      "now",
      "today",
      "deadline",
      "critical",
      "serious",
      "fast",
      "quickly",
      "asap",
    ];

    const fearWords = [
      "scared",
      "worried",
      "panic",
      "afraid",
      "confused",
      "lost",
      "stuck",
      "dont know",
      "no idea",
      "terrified",
    ];

    urgentWords.forEach((word) => {
      if (lower.includes(word)) score += 10;
    });

    fearWords.forEach((word) => {
      if (lower.includes(word)) score += 15;
    });

    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    score += capsRatio * 30;

    const exclamations = (text.match(/!/g) || []).length;
    score += exclamations * 5;

    return Math.min(score, 100);
  };

  return { analyzeTextStress };
};
