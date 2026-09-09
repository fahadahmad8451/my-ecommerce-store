"use client";
import { useEffect, useState } from "react";
import type { FormSubmission } from "@/lib/form-submissions";

export function SupportInbox() {
  const [items, setItems] = useState<FormSubmission[]>([]); const [message, setMessage] = useState("Loading messages...");
  useEffect(() => { fetch("/api/admin/inbox", { cache: "no-store" }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Messages could not be loaded."); setItems(data.submissions); setMessage(""); }).catch(error => setMessage(error instanceof Error ? error.message : "Messages could not be loaded.")); }, []);
  if (message) return <p className="admin-help">{message}</p>;
  if (!items.length) return <p className="admin-empty">No contact messages yet.</p>;
  return <div className="support-inbox">{items.map((item, index) => <article key={`${item.createdAt}-${index}`}><div><strong>{item.fields.subject || "Support request"}</strong><span>{item.fields.name || "Unknown"} · {item.fields.email || "No email"}</span></div><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time><p>{item.fields.message || "No message"}</p><a href={`mailto:${encodeURIComponent(item.fields.email || "")}?subject=${encodeURIComponent(`Re: ${item.fields.subject || "Your DESKAVYN request"}`)}`}>Reply by email ↗</a></article>)}</div>;
}
