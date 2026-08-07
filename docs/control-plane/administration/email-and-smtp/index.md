
# Email & SMTP Setup

Plakar Control Plane can send email notifications using an `SMTP` server. This
can be configured under **General Settings**.

Provide the hostname, port, authentication credentials (if required), and the
sender email address that should appear in outgoing messages. If your SMTP
server supports encrypted connections, enable **TLS** to secure communication
between Plakar Control Plane and the mail server.

Leaving the **Host** field empty removes the SMTP configuration and disables
email delivery.

{{< figure src="../images/smtp-settings.png" class="max-w-100 mx-auto" alt="SMTP server configuration" >}}

Once configured, this SMTP server is used for all emails sent by your Plakar
Control Plane instance. The only exception is the initial enrollment email used
during first-time setup, which is sent before an SMTP server can be configured.

