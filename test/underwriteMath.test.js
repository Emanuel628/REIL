import test from "node:test";
import assert from "node:assert/strict";

import { analyzeDeal, getMaximumAllowableOffer } from "../src/utils/underwriteMath.js";
import {
  failingRentalDeal,
  strongRentalDeal,
  unrentableSpeculativeDeal
} from "../src/fixtures/sampleDeals.js";

test("strong rental deal returns a passing recommendation", () => {
  const result = analyzeDeal(strongRentalDeal);

  assert.equal(result.hardFail, false);
  assert.equal(result.grade, "green");
  assert.ok(result.score >= 80);
  assert.ok(result.metrics.dscr >= 1.25);
  assert.ok(result.metrics.stressedDscr >= 1);
  assert.equal(result.failBanner, null);
});

test("failing rental deal triggers the Ben fail banner", () => {
  const result = analyzeDeal(failingRentalDeal);

  assert.equal(result.hardFail, true);
  assert.equal(result.grade, "red");
  assert.equal(result.failBanner, "If it don't make sense, it don't make dollars.");
  assert.ok(result.failedChecks.includes("Negative stabilized cash flow."));
  assert.ok(result.failedChecks.includes("DSCR is below 1.00x on amortizing debt."));
});

test("unsupported speculative rent assumptions force a hard fail", () => {
  const result = analyzeDeal(unrentableSpeculativeDeal);

  assert.equal(result.hardFail, true);
  assert.ok(result.failedChecks.includes("Rents are not sufficiently verified."));
  assert.ok(result.failedChecks.includes("The deal requires rent growth assumptions to work."));
});

test("maximum allowable offer is below supportable value after margin of safety and rehab", () => {
  const mao = getMaximumAllowableOffer(strongRentalDeal);

  assert.ok(mao > 0);
  assert.ok(mao < strongRentalDeal.underwriting.supportableValue);
  assert.ok(mao < strongRentalDeal.purchase.offerPrice + 40000);
});
