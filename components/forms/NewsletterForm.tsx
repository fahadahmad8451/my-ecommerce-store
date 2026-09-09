"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm({ placeholder, button, inputId = "footer-newsletter-email" }: { placeholder: string; button: string; inputId?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/forms/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: normalizedEmail }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Subscription could not be completed.");
      setStatus("success");
      setMessage("You are on the list. Thank you.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Subscription could not be completed.");
    }
  }

  const statusId = `${inputId}-status`;
  return <div className="newsletter-form-wrap"><form onSubmit={submit} noValidate><label className="sr-only" htmlFor={inputId}>Email address</label><input id={inputId} type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={placeholder} autoComplete="email" aria-describedby={statusId} disabled={status === "loading"}/><button type="submit" disabled={status === "loading"}>{status === "loading" ? "..." : button}</button></form><p id={statusId} className={`form-message ${status}`} aria-live="polite">{message}</p></div>;
}
