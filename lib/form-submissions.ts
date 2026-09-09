import fs from "node:fs/promises";
import path from "node:path";

export type FormSubmission = { type: "newsletter" | "contact" | "affiliate" | "return"; createdAt: string; fields: Record<string, string> };
const submissionsPath = path.join(process.cwd(), "data", "form-submissions.json");

export async function saveFormSubmission(submission: FormSubmission) {
  let existing: FormSubmission[] = [];
  try { existing = JSON.parse(await fs.readFile(submissionsPath, "utf8")) as FormSubmission[]; } catch { /* First submission creates the local development file. */ }
  existing.unshift(submission);
  await fs.writeFile(submissionsPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
}

/** Read-only admin view. Form records remain server-side and are never sent to public pages. */
export async function getFormSubmissions(type?: FormSubmission["type"], limit = 100) {
  try {
    const parsed = JSON.parse(await fs.readFile(submissionsPath, "utf8")) as FormSubmission[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(submission => !type || submission.type === type).slice(0, Math.max(1, Math.min(limit, 500)));
  } catch { return []; }
}
