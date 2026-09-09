"use client";

import { FormEvent, useState } from "react";

type FormKind = "contact" | "affiliate" | "track-order";
type FormValues = Record<string, string>;

const definitions: Record<Exclude<FormKind, "track-order">, Array<{ name: string; label: string; type?: string; multiline?: boolean }>> = {
  contact: [{ name: "name", label: "Name" }, { name: "email", label: "Email", type: "email" }, { name: "subject", label: "Subject" }, { name: "message", label: "Message", multiline: true }],
  affiliate: [{ name: "name", label: "Name" }, { name: "email", label: "Email", type: "email" }, { name: "website", label: "Website or social profile", type: "url" }, { name: "message", label: "Tell us about your audience", multiline: true }]
};

export function SupportForm({ kind }: { kind: Exclude<FormKind, "track-order"> }) {
  const fields = definitions[kind];
  const [values, setValues] = useState<FormValues>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const label = kind === "contact" ? "Send message" : "Apply to the program";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = fields.find(field => !values[field.name]?.trim());
    if (missing) { setStatus("error"); setMessage(`${missing.label} is required.`); return; }
    if (!/^\S+@\S+\.\S+$/.test(values.email || "")) { setStatus("error"); setMessage("Please enter a valid email address."); return; }
    setStatus("loading"); setMessage("");
    try {
      const response = await fetch(`/api/forms/${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Your request could not be sent.");
      setStatus("success"); setMessage(kind === "contact" ? "Your message has been received. We will be in touch soon." : "Your application has been received. Thank you."); setValues({});
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Your request could not be sent."); }
  }
  return <form className="support-form" onSubmit={submit} noValidate>{fields.map(field => <label key={field.name}>{field.label}{field.multiline ? <textarea required rows={5} value={values[field.name] || ""} onChange={event => setValues(current => ({ ...current, [field.name]: event.target.value }))}/> : <input required type={field.type || "text"} value={values[field.name] || ""} onChange={event => setValues(current => ({ ...current, [field.name]: event.target.value }))}/>}</label>)}<button className="btn-primary" disabled={status === "loading"} type="submit">{status === "loading" ? "Sending..." : label}</button><p className={`form-message ${status}`} aria-live="polite">{message}</p></form>;
}

export function TrackOrderForm() {
  const [values, setValues] = useState<FormValues>({}); const [status, setStatus] = useState<"idle" | "loading" | "error">("idle"); const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!values.orderNumber?.trim() || !/^\S+@\S+\.\S+$/.test(values.email || "")) { setStatus("error"); setMessage("Enter your order number and a valid order email."); return; } setStatus("loading"); setMessage(""); try { const response = await fetch("/api/orders/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Tracking is currently unavailable."); } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Tracking is currently unavailable."); } finally { setStatus(current => current === "loading" ? "idle" : current); } }
  return <form className="support-form" onSubmit={submit} noValidate><label>Order number<input required value={values.orderNumber || ""} onChange={event => setValues(current => ({ ...current, orderNumber: event.target.value }))}/></label><label>Email used for order<input required type="email" autoComplete="email" value={values.email || ""} onChange={event => setValues(current => ({ ...current, email: event.target.value }))}/></label><button className="btn-primary" type="submit" disabled={status === "loading"}>{status === "loading" ? "Checking..." : "Track order"}</button><p className={`form-message ${status}`} aria-live="polite">{message}</p></form>;
}
