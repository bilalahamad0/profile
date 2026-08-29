"use client";

import { Mail, Send, Linkedin, Github, CalendarClock } from "lucide-react";
import { useRef, useState } from "react";
import { ensureSession } from "@/lib/security/client";

// An entry token lives 2h server-side. Re-use a token minted in the last 10
// minutes; anything older is re-minted at submit so a form left open all
// afternoon can never post against a lapsed token.
const SESSION_WARM_MS = 10 * 60 * 1000;

const GENERIC_ERROR = "Couldn't send that — please try again, or email me directly.";

export function ContactSection() {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // The anti-automation handshake. Kicked off on FIRST INTERACTION with the
    // form (not on page load) and awaited — never raced — at submit, so a fast
    // typist who focuses and hits Send immediately still waits for the token.
    const session = useRef<{ at: number; promise: Promise<boolean> } | null>(null);

    const warmSession = (): Promise<boolean> => {
        const now = Date.now();
        if (session.current && now - session.current.at < SESSION_WARM_MS) {
            return session.current.promise;
        }
        const entry = { at: now, promise: ensureSession() };
        session.current = entry;
        return entry.promise;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage("");

        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;

        try {
            // Ensure a fresh entry token (the contact endpoint requires it). Returning
            // visitors whose 2h token lapsed re-mint silently here — no splash needed.
            // Usually already settled from the focus warm-up below; if that attempt
            // failed (offline blip, rate limit) mint again rather than posting an
            // unauthenticated request the endpoint would reject.
            if (!(await warmSession())) {
                session.current = null;
                await warmSession();
            }

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (!res.ok) {
                // The API returns actionable copy (expired session, rate limit,
                // invalid email) — show it instead of failing silently.
                const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
                throw new Error(typeof data?.error === "string" ? data.error : GENERIC_ERROR);
            }

            setStatus("success");
            form.reset();
        } catch (error) {
            setErrorMessage(error instanceof Error && error.message ? error.message : GENERIC_ERROR);
            setStatus("error");
        } finally {
            // Reset after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section id="contact" className="pt-2 pb-10 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="t-h2 mb-4">Say Hello</h2>
                <p className="text-ink-muted max-w-xl mx-auto">
                    Interested in discussing a project or opportunity? Send me a message and let&apos;s create something amazing together.
                </p>

                {/* Prefer a live conversation? Jump to the embedded scheduler below. */}
                <div className="mt-6 flex flex-col items-center gap-2">
                    <a
                        href="#book"
                        className="group inline-flex items-center gap-2.5 rounded-full bg-ink/5 border border-line/10 px-6 py-3 font-semibold text-ink transition-all hover:bg-ink/[0.08] hover:border-blue-500/40"
                    >
                        <CalendarClock className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                        Book a Call
                    </a>
                    <span className="t-caption text-ink-muted">
                        Prefer to talk? Grab a 1:1 slot below.
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="p-6 rounded-3xl bg-ink/5 border border-line/10 backdrop-blur-sm">
                        <h3 className="t-h3 mb-6">Connect</h3>
                        <div className="space-y-4">
                            <a
                                href="mailto:bilal.ahamad@gmail.com"
                                className="flex items-center gap-3 text-ink-muted hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5" />
                                </div>
                                bilal.ahamad@gmail.com
                            </a>
                            <a
                                href="https://linkedin.com/in/bilalahamad"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-ink-muted hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                linkedin.com/in/bilalahamad
                            </a>
                            <a
                                href="https://github.com/bilalahamad0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-ink-muted hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Github className="w-5 h-5" />
                                </div>
                                github.com/bilalahamad0
                            </a>
                        </div>
                    </div>
                </div>

                {/* Form */}
                {/* React's onFocus is focusin, so this fires the moment any field
                    inside the form is first focused — that's when the handshake
                    starts, keeping it off the initial page load. */}
                <form
                    onSubmit={handleSubmit}
                    onFocus={() => { void warmSession(); }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-ink/5 border border-line/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-ink/5 border border-line/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <textarea
                            name="message"
                            placeholder="Message"
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-ink/5 border border-line/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-8 font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span>
                            {status === "sending" ? "Sending..." : status === "success" ? "✓ Sent!" : "Send Message"}
                        </span>
                        {status === "idle" && <Send className="h-4 w-4" />}
                    </button>

                    {status === "error" && (
                        <p role="alert" className="t-small text-red-700 dark:text-red-400">
                            {errorMessage || GENERIC_ERROR}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}
