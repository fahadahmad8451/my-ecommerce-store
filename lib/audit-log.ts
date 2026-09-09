import fs from "node:fs/promises";
import path from "node:path";
export type AuditEntry = { createdAt: string; action: string; target: string; detail?: string };
const auditPath = path.join(process.cwd(), "data", "audit-log.json");
export async function writeAuditEntry(entry: Omit<AuditEntry, "createdAt">) { let existing: AuditEntry[] = []; try { existing = JSON.parse(await fs.readFile(auditPath, "utf8")) as AuditEntry[]; } catch { /* First action creates the file. */ } existing.unshift({ createdAt: new Date().toISOString(), ...entry }); await fs.writeFile(auditPath, `${JSON.stringify(existing.slice(0, 500), null, 2)}\n`, "utf8"); }
export async function getAuditEntries(limit = 100) { try { const data = JSON.parse(await fs.readFile(auditPath, "utf8")) as AuditEntry[]; return Array.isArray(data) ? data.slice(0, limit) : []; } catch { return []; } }
