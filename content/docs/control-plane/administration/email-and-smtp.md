---
title: "Email & SMTP Setup"
date: "2026-07-13T00:00:00Z"
weight: 7
summary: "Configure SMTP for email notifications."
---

# Email & SMTP Setup

Plakar Control Plane can send email notifications using an `SMTP` server. This
is configured per organization, from the
[organization settings](../settings/organization#smtp).

Provide the hostname, port, authentication credentials (if required), and the
sender email address that should appear in outgoing messages. If your SMTP
server supports encrypted connections, enable **TLS** to secure communication
between Plakar Control Plane and the mail server.

{{< figure src="../images/smtp-settings.png" class="max-w-100 mx-auto" alt="SMTP server configuration" >}}

Once configured, this SMTP server is used for the emails sent on behalf of the
organization it was configured for. The initial enrollment email used during
first-time setup is an exception, because it is sent before an SMTP server can
be configured.
