import fs from "node:fs/promises";
import path from "node:path";

export type FormSubmission = { type: "newsletter" | "contact" | "affiliate"; createdAt: string; fields: Record<string, string> };
const submissionsPath = path.join(process.cwd(), "data", "form-submissions.json");

export async function saveFormSubmission(submission: FormSubmission) {
  let existing: FormSubmission[] = [];
  try { existing = JSON.parse(await fs.readFile(submissionsPath, "utf8")) as FormSubmission[]; } catch { /* First submission creates the local development file. */ }
  existing.unshift(submission);
  await fs.writeFile(submissionsPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
}
