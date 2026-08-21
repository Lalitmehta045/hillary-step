import assert from "node:assert/strict";
import { describe, it } from "node:test";

/**
 * Mirrors frontend/lib/api/applications.ts buildTurnstileHeaders.
 * Kept in sync so CI can assert the upload request header contract without a TS runner.
 */
function buildTurnstileHeaders(turnstileToken) {
  const token = turnstileToken?.trim();
  if (!token) return {};
  return { "cf-turnstile-response": token };
}

describe("buildTurnstileHeaders (resume upload Turnstile contract)", () => {
  it("includes cf-turnstile-response when a real token is provided", () => {
    assert.deepEqual(buildTurnstileHeaders("tok_abc"), {
      "cf-turnstile-response": "tok_abc",
    });
  });

  it("does not send a fake or empty token when Turnstile is not configured", () => {
    assert.deepEqual(buildTurnstileHeaders(undefined), {});
    assert.deepEqual(buildTurnstileHeaders(null), {});
    assert.deepEqual(buildTurnstileHeaders(""), {});
    assert.deepEqual(buildTurnstileHeaders("   "), {});
  });

  it("trims whitespace from tokens before sending", () => {
    assert.deepEqual(buildTurnstileHeaders("  tok_xyz  "), {
      "cf-turnstile-response": "tok_xyz",
    });
  });
});
