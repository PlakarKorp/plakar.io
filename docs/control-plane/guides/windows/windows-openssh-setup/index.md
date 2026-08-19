
# Setting Up OpenSSH Server on Windows

Several Plakar Control Plane integrations, including
[Microsoft SQL Server](../../resources/database/mssql) and
[Microsoft Active Directory](../../resources/database/msad), connect to Windows
hosts over SSH. This guide explains how to install and configure OpenSSH Server
on Windows and authorize an SSH key for the account used by Plakar Control
Plane.

{{< steps >}}

{{< step >}}

## Install OpenSSH Server

Check whether OpenSSH Server is already installed. If it is not, install it
using the following commands:

```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

{{< /step >}}

{{< step >}}

## Start the SSH service

Start the `sshd` service and configure it to start automatically whenever the
system boots:

```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

{{< /step >}}

{{< step >}}

## Allow SSH connections

OpenSSH Server listens on TCP port `22`. Windows normally creates a firewall
rule automatically when the capability is installed. Verify that the rule
exists, or create it if its missing:

```powershell
Get-NetFirewallRule -Name *ssh*
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

The auto-created rule is normally scoped to the Domain and Private
[firewall profiles](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ics/windows-firewall-profiles)
only. If the host is reached over its public IP, Windows classifies that
interface as the Public profile, and the rule will silently not apply. Check the
rule's profile and add Public if needed:

```powershell
Get-NetFirewallRule -Name sshd | Select-Object Profile
Set-NetFirewallRule -Name sshd -Profile Any
```

Also open port 22 at the network/firewall level (cloud security group, VPC
firewall, etc.), in addition to the Windows Firewall rule above.

{{< /step >}}

{{< step >}}

## Authorize a dedicated SSH key

Generate a dedicated SSH keypair for PCP rather than relying on password
authentication. For accounts that are members of the local Administrators group,
keys are read from a dedicated file rather than the user's own `.ssh` folder:

```powershell
notepad C:\ProgramData\ssh\administrators_authorized_keys
```

Add the public key on its own line, save, then restrict the file's permissions.
SSH will silently ignore the file if permissions are too permissive:

```powershell
icacls "C:\ProgramData\ssh\administrators_authorized_keys" /inheritance:r
icacls "C:\ProgramData\ssh\administrators_authorized_keys" /grant "Administrators:F"
icacls "C:\ProgramData\ssh\administrators_authorized_keys" /grant "SYSTEM:F"
```

{{< /step >}}

{{< step >}}

## Test the connection

Before pasting the private key into Plakar Control Plane, confirm the key and
network path both work:

```sh
eval `ssh-agent`
ssh-add /path/to/private_key
ssh Administrator@<host>
```

A successful, passwordless login confirms the key is authorized correctly and
that the network path (firewall, security group, sshd) is open.

If this is the first time connecting to this host over SSH, you will be prompted
to accept its host key. This is expected; type `yes` to continue. To skip the
prompt, connect with:

```sh
ssh -o StrictHostKeyChecking=accept-new Administrator@<host>
```

To verify the fingerprint instead of trusting it blindly, retrieve it directly
from the Windows host, where OpenSSH Server stores its host keys under
`C:\ProgramData\ssh`:

```powershell
ssh-keygen -lf C:\ProgramData\ssh\ssh_host_ed25519_key.pub
```

Compare its output against the fingerprint shown in the SSH prompt before
accepting.

{{< /step >}}

{{< /steps >}}

