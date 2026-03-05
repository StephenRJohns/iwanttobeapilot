-- Migration: Copy existing PAR data into new generic test bank tables
-- Run this BEFORE dropping the old PAR tables (i.e., before db:push with the new schema)

-- Copy PARTestAttempt → TestBankAttempt
INSERT INTO "TestBankAttempt" ("id", "userId", "testBank", "score", "total", "passed", "answers", "createdAt")
SELECT "id", "userId", 'PAR', "score", "total", "passed", "answers", "createdAt"
FROM "PARTestAttempt"
ON CONFLICT ("id") DO NOTHING;

-- Copy PARWrongAnswer → TestBankWrongAnswer
INSERT INTO "TestBankWrongAnswer" ("id", "userId", "testBank", "questionId", "wrongCount", "lastSeenAt", "updatedAt")
SELECT "id", "userId", 'PAR', "questionId", "wrongCount", "lastSeenAt", "updatedAt"
FROM "PARWrongAnswer"
ON CONFLICT ("id") DO NOTHING;
