import z from "zod"

const min = 4

export const loginShema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(min, { error: `Password must be at least ${min} characters long` }),
  rememberMe: z.boolean().optional(),
})

export type LoginInputs = z.infer<typeof loginShema>
