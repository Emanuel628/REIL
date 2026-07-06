import { buildQuickScreenState } from "../fixtures/quickScreenState.js";
import { failingRentalDeal, strongRentalDeal, unrentableSpeculativeDeal } from "../fixtures/sampleDeals.js";
import { analyzeDeal } from "./underwriteMath.js";
import { buildDealFromState } from "../fixtures/quickScreenState.js";

const STORAGE_KEY = "reil.records.v1";

function createId() {
  return `deal_${Math.random().toString(36).slice(2, 10)}`;
}

function createRecordFromDeal(deal, preset = "custom") {
  return {
    id: createId(),
    formState: {
      ...buildQuickScreenState(deal),
      preset
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function createSeedRecords() {
  return [
    createRecordFromDeal(strongRentalDeal, "strong"),
    createRecordFromDeal(failingRentalDeal, "failing"),
    createRecordFromDeal(unrentableSpeculativeDeal, "speculative")
  ];
}

export function loadRecords() {
  if (typeof window === "undefined") {
    return createSeedRecords();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createSeedRecords();
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : createSeedRecords();
  } catch {
    return createSeedRecords();
  }
}

export function persistRecords(records) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function createBlankRecord() {
  const record = createRecordFromDeal(strongRentalDeal, "custom");
  record.formState.recordName = "New deal";
  record.formState.address = "";
  return record;
}

export function summarizeRecord(record) {
  const analysis = analyzeDeal(buildDealFromState(record.formState));
  return {
    id: record.id,
    recordName: record.formState.recordName || "Untitled deal",
    address: record.formState.address || "No address yet",
    updatedAt: record.updatedAt,
    grade: analysis.grade,
    score: analysis.score,
    dscr: analysis.metrics.dscr,
    cashFlow: analysis.metrics.annualLeveredCashFlow,
    allInBasis: analysis.metrics.allInBasis
  };
}
