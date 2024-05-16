import { z } from "zod";
import getUserAccount, { Context } from "../user";

/**
 * Creates a server action (or async function) that has zod validation applied
 *
 * @param zodSchema the zod validation schema
 * @param func the server action to be validated
 * @returns a server action validated against the provided zod schema
 */
export const zodAction = <TArgs, TRes>(
  zodSchema: z.ZodType<TArgs>,
  func: (args: TArgs) => TRes,
): ((args: TArgs) => Promise<TRes>) => {
  return async (args) => {
    zodSchema.parse(args);
    return func(args);
  };
};

/**
 * Creates a server action (or async function) that has zod validation
 * and an authorized user context passed in
 *
 * @param zodSchema the zod validation schema
 * @param func the server action with a context to be passed into
 * @returns an async server action function bundled with context and zod validation
 */
export const protectedAction = <TArgs, TRes>(
  zodSchema: z.ZodType<TArgs>,
  func: (args: TArgs, ctx: Context) => TRes,
): ((args: TArgs) => Promise<TRes>) => {
  return async (args) => {
    const ctx = await getUserAccount();
    const validatedFunc = zodAction(zodSchema, (args) => func(args, ctx));
    return validatedFunc(args);
  };
};
