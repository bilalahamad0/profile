import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createTransportMock,
  verifyMock,
  sendMailMock,
} = vi.hoisted(() => ({
  createTransportMock: vi.fn(),
  verifyMock: vi.fn(),
  sendMailMock: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

import { POST } from "./route";
import { issueSession } from "@/lib/security/session";

let validCookie = "";

// `Cookie` is a forbidden request header that the Fetch spec / happy-dom strip
// from a JS-constructed Request, so we duck-type one whose headers.get("cookie")
// actually returns the token (the platform delivers it for real in production).
function makeRequest(body: unknown, cookie: string | null = validCookie): Request {
  return {
    method: "POST",
    headers: {
      get: (name: string) => (name.toLowerCase() === "cookie" ? cookie : null),
    },
    json: async () => body,
  } as unknown as Request;
}

function applyBaseSmtpEnv() {
  process.env.SMTP_HOST = "smtp.example.com";
  process.env.SMTP_PORT = "2525";
  process.env.SMTP_SECURE = "false";
  process.env.SMTP_USER = "smtp-user@example.com";
  process.env.SMTP_PASS = "smtp-password";
  process.env.SMTP_FROM = "from@example.com";
  process.env.SMTP_TO = "to@example.com";
}

describe("POST /api/contact", () => {
  const originalEnv = { ...process.env };

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    applyBaseSmtpEnv();
    process.env.SESSION_SECRET = "test-session-secret-at-least-16-chars";
    // Keep rate limiting fail-open (no KV) so the tests are deterministic.
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    validCookie = `ba_entry=${(await issueSession("America/Los_Angeles")).token}`;

    verifyMock.mockResolvedValue(undefined);
    sendMailMock.mockResolvedValue({ messageId: "test-id" });
    createTransportMock.mockReturnValue({
      verify: verifyMock,
      sendMail: sendMailMock,
    });
  });

  it("returns 403 without a valid entry session token", async () => {
    const response = await POST(
      makeRequest({ name: "Bilal", email: "bilal@example.com", message: "Hello" }, null)
    );

    expect(response.status).toBe(403);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed email even with a valid session", async () => {
    const response = await POST(
      makeRequest({ name: "Bilal", email: "not-an-email", message: "Hello" })
    );

    expect(response.status).toBe(400);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await POST(
      makeRequest({
        name: "Bilal",
        email: "",
        message: "Hello",
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing required fields",
    });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it("sends sanitized HTML email and uses configured SMTP options", async () => {
    const response = await POST(
      makeRequest({
        name: `<b>Bilal & "Team"</b>`,
        email: "bilal'o@example.com",
        message: `<script>alert("x")</script> & hello`,
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: "Message sent successfully",
    });

    expect(createTransportMock).toHaveBeenCalledWith({
      host: "smtp.example.com",
      port: 2525,
      secure: false,
      auth: {
        user: "smtp-user@example.com",
        pass: "smtp-password",
      },
    });
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    const sentEmail = sendMailMock.mock.calls[0][0];
    expect(sentEmail.subject).toContain(
      "New Lead [bilalahamad.com] - &lt;b&gt;Bilal &amp; &quot;Team&quot;&lt;/b&gt;"
    );
    expect(sentEmail.html).toContain("bilal&#039;o@example.com");
    expect(sentEmail.html).toContain(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; hello"
    );
    expect(sentEmail.replyTo).toBe("bilal'o@example.com");
  });

  it("falls back to port 465 and secure=true for invalid SMTP settings", async () => {
    process.env.SMTP_PORT = "not-a-number";
    delete process.env.SMTP_SECURE;

    const response = await POST(
      makeRequest({
        name: "Bilal",
        email: "bilal@example.com",
        message: "Hello from tests",
      })
    );

    expect(response.status).toBe(200);
    expect(createTransportMock).toHaveBeenCalledWith({
      host: "smtp.example.com",
      port: 465,
      secure: true,
      auth: {
        user: "smtp-user@example.com",
        pass: "smtp-password",
      },
    });
  });

  it("returns a generic 500 (no internal details) on transporter error", async () => {
    verifyMock.mockRejectedValueOnce(new Error("SMTP unavailable"));

    const response = await POST(
      makeRequest({
        name: "Bilal",
        email: "bilal@example.com",
        message: "Hello from tests",
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to send message",
    });
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("returns generic 500 message when a non-Error is thrown", async () => {
    verifyMock.mockRejectedValueOnce("unexpected");

    const response = await POST(
      makeRequest({
        name: "Bilal",
        email: "bilal@example.com",
        message: "Hello from tests",
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to send message",
    });
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});
