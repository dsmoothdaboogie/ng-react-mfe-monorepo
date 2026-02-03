import { z } from "zod";
export const EventEnvelopeV1 = z.object({
  type: z.string(),
  version: z.literal(1),
  correlationId: z.string(),
  timestamp: z.string(),
  source: z.string(),
  payload: z.unknown()
});
export type EventEnvelopeV1 = z.infer<typeof EventEnvelopeV1>;
