/**
 * Dynamic question loader for any test bank.
 * Uses dynamic imports so only the requested bank's data is loaded.
 */

import type { TestBankCode } from "@/lib/test-banks";
import type { TestBankQuestion } from "./test-bank-types";

export interface TestBankData {
  questions: TestBankQuestion[];
  areasOfKnowledge: readonly string[];
  lastUpdated: string | null;
}

export async function loadTestBankQuestions(code: TestBankCode): Promise<TestBankData> {
  switch (code) {
    case "PAR": {
      const m = await import("@/data/par-questions");
      return {
        questions: m.PAR_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.PAR_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.PAR_DATA_UPDATED ?? null,
      };
    }
    case "IRA": {
      const m = await import("@/data/ira-questions");
      return {
        questions: m.IRA_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.IRA_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.IRA_DATA_UPDATED ?? null,
      };
    }
    case "CAX": {
      const m = await import("@/data/cax-questions");
      return {
        questions: m.CAX_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.CAX_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.CAX_DATA_UPDATED ?? null,
      };
    }
    case "ATP": {
      const m = await import("@/data/atp-questions");
      return {
        questions: m.ATP_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.ATP_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.ATP_DATA_UPDATED ?? null,
      };
    }
    case "MEA": {
      const m = await import("@/data/mea-questions");
      return {
        questions: m.MEA_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.MEA_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.MEA_DATA_UPDATED ?? null,
      };
    }
    case "AGI": {
      const m = await import("@/data/agi-questions");
      return {
        questions: m.AGI_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.AGI_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.AGI_DATA_UPDATED ?? null,
      };
    }
    case "FOI": {
      const m = await import("@/data/foi-questions");
      return {
        questions: m.FOI_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.FOI_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.FOI_DATA_UPDATED ?? null,
      };
    }
    case "FIA": {
      const m = await import("@/data/fia-questions");
      return {
        questions: m.FIA_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.FIA_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.FIA_DATA_UPDATED ?? null,
      };
    }
    case "FII": {
      const m = await import("@/data/fii-questions");
      return {
        questions: m.FII_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.FII_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.FII_DATA_UPDATED ?? null,
      };
    }
    case "SPG": {
      const m = await import("@/data/spg-questions");
      return {
        questions: m.SPG_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.SPG_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.SPG_DATA_UPDATED ?? null,
      };
    }
    case "RPA": {
      const m = await import("@/data/rpa-questions");
      return {
        questions: m.RPA_QUESTIONS as TestBankQuestion[],
        areasOfKnowledge: m.RPA_AREAS_OF_KNOWLEDGE,
        lastUpdated: m.RPA_DATA_UPDATED ?? null,
      };
    }
    default:
      throw new Error(`Unknown test bank: ${code}`);
  }
}
