import { initBotId } from "botid/client/core";

/**
 * Vercel BotID (Basic, free) — invisible client challenge. Registers the
 * high-value endpoints whose POSTs should carry a BotID challenge solution; the
 * server verifies it with checkBotId(). Deep Analysis is NOT enabled (it's the
 * Pro/billed tier), so this runs Basic only at no cost.
 */
initBotId({
  protect: [{ path: "/api/contact", method: "POST" }],
});
