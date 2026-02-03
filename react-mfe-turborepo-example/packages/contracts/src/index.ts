import { z } from "zod";

/**
 * Platform event envelope v1:
 * - Keep stable and backward compatible.
 * - Additive changes are OK.
 * - Breaking changes require a new version (v2).
 */
export const EventEnvelopeV1 = z.object({
  type: z.string(),
  version: z.literal(1),
  correlationId: z.string(),
  timestamp: z.string(),
  source: z.string(),
  payload: z.unknown()
});

export type EventEnvelopeV1 = z.infer<typeof EventEnvelopeV1>;

// Example domain event: order/selected@v1
export const OrderSelectedV1 = EventEnvelopeV1.extend({
  type: z.literal("order/selected"),
  payload: z.object({
    orderId: z.string()
  })
});

export type OrderSelectedV1 = z.infer<typeof OrderSelectedV1>;
