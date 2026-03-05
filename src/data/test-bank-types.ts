/**
 * Shared question type used by all FAA test banks.
 */
export interface TestBankQuestion {
  id: string;
  aok: string;
  text: string;
  choices: { key: "A" | "B" | "C"; text: string }[];
  correct: "A" | "B" | "C";
  explanation?: string;
  figureRef?: string;
}
