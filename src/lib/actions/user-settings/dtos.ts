import { MonthBarrierOption } from "@prisma/client";
import { z } from "zod";

export const UserSettingsSchema = z.object({
  monthBarrierOption: z.nativeEnum(MonthBarrierOption),
  day: z
    .number({ message: "Day must be a number." })
    .int("Day must be an integer.")
    .min(-31)
    .max(31),
});

export type UserSettingsDto = z.infer<typeof UserSettingsSchema>;
