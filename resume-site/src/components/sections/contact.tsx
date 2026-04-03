"use client";

import { MagneticButton } from "@/components/ui/magnetic-button";
import { Mail, Send, Linkedin, Github } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (!res.ok) throw new Error("Failed to send");
            
            setStatus("success");
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Submission error:", error);
            setStatus("error");
        } finally {
            // Reset after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section id="contact" className="pt-4 pb-24 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Get in Touch</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Interested in discussing a project or opportunity? Send me a message and let&apos;s create something amazing together.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold mb-6">Connect</h3>
                        <div className="space-y-4">
                            <a
                                href="mailto:bilal.ahamad@gmail.com"
                                className="flex items-center gap-3 text-muted-foreground hover:text-blue-500 transition-colors"
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
                                className="flex items-center gap-3 text-muted-foreground hover:text-blue-500 transition-colors"
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
                                className="flex items-center gap-3 text-muted-foreground hover:text-blue-500 transition-colors"
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <textarea
                            name="message"
                            placeholder="Message"
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500 resize-none"
                        />
                    </div>

                    <MagneticButton className="w-full group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-8 font-medium text-white transition-all duration-300 hover:bg-blue-700">
                        <span className="mr-2">
                            {status === "sending" ? "Sending..." : status === "success" ? "Sent!" : "Send Message"}
                        </span>
                        {status === "idle" && <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    </MagneticButton>
                </form>
            </div>
        </section>
    );
}
