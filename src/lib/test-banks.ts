/**
 * Central configuration for all FAA knowledge test banks.
 */

export const TEST_BANK_CODES = [
  "SPG", "RPA", "PAR", "IRA", "CAX", "ATP",
  "MEA", "AGI", "FOI", "FIA", "FII",
] as const;

export type TestBankCode = (typeof TEST_BANK_CODES)[number];

export type TestBankCategory = "Pilot" | "Add-on" | "Instructor" | "Other";

export interface TestBankConfig {
  code: TestBankCode;
  name: string;
  shortName: string;
  category: TestBankCategory;
  examQuestionCount: number;
  passThreshold: number;
  faaZipUrl: string;
  areasOfKnowledge: readonly string[];
  /** Dashboard milestone IDs that should show this test bank */
  milestones: string[];
}

export const TEST_BANKS: Record<TestBankCode, TestBankConfig> = {
  SPG: {
    code: "SPG",
    name: "Sport Pilot Glider",
    shortName: "Sport Glider",
    category: "Other",
    examQuestionCount: 40,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/SPG.zip",
    areasOfKnowledge: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Performance and Limitations",
      "Principles of Flight",
      "Flight Instruments",
      "Aeromedical Factors",
    ],
    milestones: ["student", "enthusiast"],
  },
  RPA: {
    code: "RPA",
    name: "Recreational Pilot Airplane",
    shortName: "Recreational",
    category: "Other",
    examQuestionCount: 50,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/RPA.zip",
    areasOfKnowledge: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
    ],
    milestones: ["student"],
  },
  PAR: {
    code: "PAR",
    name: "Private Pilot Airplane",
    shortName: "Private",
    category: "Pilot",
    examQuestionCount: 60,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/PAR.zip",
    areasOfKnowledge: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Cross-Country Flight Planning",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
    ],
    milestones: ["private"],
  },
  IRA: {
    code: "IRA",
    name: "Instrument Rating Airplane",
    shortName: "Instrument",
    category: "Pilot",
    examQuestionCount: 60,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/IRA.zip",
    areasOfKnowledge: [
      "Regulations",
      "Flight Instruments",
      "Navigation and Flight Planning",
      "Weather",
      "IFR Procedures",
      "ATC Procedures",
      "Emergency Procedures",
    ],
    milestones: ["instrument"],
  },
  CAX: {
    code: "CAX",
    name: "Commercial Pilot Airplane",
    shortName: "Commercial",
    category: "Pilot",
    examQuestionCount: 100,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/CAX.zip",
    areasOfKnowledge: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Cross-Country Flight Planning",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
      "Commercial Operations",
    ],
    milestones: ["commercial"],
  },
  ATP: {
    code: "ATP",
    name: "Airline Transport Pilot",
    shortName: "ATP",
    category: "Pilot",
    examQuestionCount: 80,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/ATP.zip",
    areasOfKnowledge: [
      "Regulations",
      "Weather",
      "Navigation and Flight Planning",
      "Performance and Limitations",
      "Aerodynamics",
      "Aircraft Systems",
      "Crew Resource Management",
      "Emergency Procedures",
    ],
    milestones: ["regional", "major", "cargo"],
  },
  MEA: {
    code: "MEA",
    name: "Multi-Engine Airplane Add-on",
    shortName: "Multi-Engine",
    category: "Add-on",
    examQuestionCount: 50,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/MEA.zip",
    areasOfKnowledge: [
      "Multi-Engine Aerodynamics",
      "Engine-Out Procedures",
      "Performance and Limitations",
      "Systems",
      "Weight and Balance",
      "Emergency Procedures",
    ],
    milestones: ["multi-engine"],
  },
  AGI: {
    code: "AGI",
    name: "Advanced Ground Instructor",
    shortName: "AGI",
    category: "Add-on",
    examQuestionCount: 100,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/AGI.zip",
    areasOfKnowledge: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Flight Planning",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
      "Instructional Knowledge",
    ],
    milestones: ["cfi"],
  },
  FOI: {
    code: "FOI",
    name: "Fundamentals of Instructing",
    shortName: "FOI",
    category: "Instructor",
    examQuestionCount: 50,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/FOI.zip",
    areasOfKnowledge: [
      "The Learning Process",
      "Human Behavior and Communication",
      "The Teaching Process",
      "Assessment and Critique",
      "Instructor Responsibilities",
      "Techniques of Flight Instruction",
    ],
    milestones: ["cfi"],
  },
  FIA: {
    code: "FIA",
    name: "Flight Instructor Airplane",
    shortName: "CFI",
    category: "Instructor",
    examQuestionCount: 100,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/FIA.zip",
    areasOfKnowledge: [
      "Regulations",
      "National Airspace System",
      "Weather",
      "Flight Planning",
      "Performance and Limitations",
      "Principles of Flight",
      "Aircraft Systems",
      "Flight Instruments",
      "Aeromedical Factors",
      "Flight Instruction Techniques",
    ],
    milestones: ["cfi"],
  },
  FII: {
    code: "FII",
    name: "Flight Instructor Instrument",
    shortName: "CFII",
    category: "Instructor",
    examQuestionCount: 50,
    passThreshold: 0.7,
    faaZipUrl: "https://www.faa.gov/training_testing/testing/test_questions/media/FII.zip",
    areasOfKnowledge: [
      "Regulations",
      "Flight Instruments",
      "Navigation and Flight Planning",
      "Weather",
      "IFR Procedures",
      "ATC Procedures",
      "Instructional Knowledge",
    ],
    milestones: ["cfii"],
  },
};

export function isValidTestBank(code: string): code is TestBankCode {
  return TEST_BANK_CODES.includes(code.toUpperCase() as TestBankCode);
}

export function getTestBank(code: string): TestBankConfig | undefined {
  const upper = code.toUpperCase() as TestBankCode;
  return TEST_BANKS[upper];
}

export function getTestBanksByCategory(category: TestBankCategory): TestBankConfig[] {
  return Object.values(TEST_BANKS).filter((b) => b.category === category);
}

export function getTestBanksForMilestone(milestoneId: string): TestBankConfig[] {
  return Object.values(TEST_BANKS).filter((b) => b.milestones.includes(milestoneId));
}
