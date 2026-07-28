---
title: "Microsoft SQL Server"
date: "2026-07-21T00:00:00Z"
weight: 1
summary:
  "How to configure a Microsoft SQL Server resource in Plakar Control Plane."
---

# Microsoft SQL Server

The MSSQL integration allows Plakar Control Plane to back up and restore the
`Program Files` folder used by `Microsoft SQL Server` on Windows. It is built on
top of Plakar's VSS integration. Plakar connects to the Windows host over SSH,
requests a VSS snapshot of the volume containing the SQL Server installation
directory, then copies the files from the snapshot over SFTP. Restoring requires
the SQL Server services to be stopped first, since the destination files are
locked while SQL Server is running.

## Inventory Managment

Curretly no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discoving Microsoft SQL Server resources. You need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding an MSSQL resource.

### Adding MSSQL as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add a Windows machine running SQL Server as a resource, use `Database` as the
class. For the endpoint, use the IP address or hostname of the target machine.
See [resources documentation](../../resources) for more information on how to
setup resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Windows["Windows Server"]
    VSS["VSS Snapshot"]
    SQLDir["Microsoft SQL Server<br/>Program Files"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["MSSQL<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"SSH: requests VSS snapshot"| VSS
  VSS --> SQLDir
  SQLDir -->|"SFTP: file transfer"| Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["MSSQL<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Windows["Windows Server"]
    SQLDir["Microsoft SQL Server<br/>Program Files"]
  end

  Store --> Restore
  Destination --> Restore

  Restore -->|"SSH: executes restore operations"| Destination
  Destination -->|"SFTP: transfers restored files"| SQLDir
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **Port**: The SSH server port. Defaults to `22` if left empty.
- **Root**: The absolute path to the Windows drive and directory which should be
  backed up. Defaults to `/C:/Program Files/Microsoft SQL Server`.
- **Ssh Private Key**: To authenticate with the remote machine, PCP uses SSH
  key-based authentication. Generate a dedicated SSH keypair for PCP and add the
  public key to the remote machine's authorized keys before configuring this
  field (see [Setting up SSH access on the Windows host](#) below), then copy
  the private key in full, including the header and footer lines, into this
  field:

  ```txt
  -----BEGIN OPENSSH PRIVATE KEY-----
  ...
  -----END OPENSSH PRIVATE KEY-----
  ```

- **Username**: Required. The name of an administrative user account to perform
  the backup or restore with, e.g. `Administrator`.

### Setting up SSH access on the Windows host

The `mssql` integration relies on OpenSSH Server being installed, running, and
reachable on the Windows host before it can be used.

1. **Install the OpenSSH Server capability**, if not already present:

   ```powershell
   Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
   Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
   ```

2. **Start the service and set it to start automatically**:

   ```powershell
   Start-Service sshd
   Set-Service -Name sshd -StartupType 'Automatic'
   ```

3. **Confirm the Windows Firewall allows inbound connections on port 22**. A
   rule is normally created automatically; verify it exists and add it if not:

   ```powershell
   Get-NetFirewallRule -Name *ssh*
   New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
   ```

   The auto-created rule is normally scoped to the Domain and Private
   [firewall profiles](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ics/windows-firewall-profiles)
   only. If the host is reached over its Public IP, Windows classifies that
   interface as the Public profile and the rule will silently not apply. Check
   the rule's profile and add Public if needed:

   ```powershell
   Get-NetFirewallRule -Name sshd | Select-Object Profile
   Set-NetFirewallRule -Name sshd -Profile Any
   ```

4. **Open port 22 at the network/firewall level** as well (cloud security group,
   VPC firewall, etc.), in addition to the Windows Firewall rule above.

5. **Authorize a dedicated SSH key** for the administrative account used by
   Plakar, rather than relying on password authentication. For accounts that are
   members of the local Administrators group, keys are read from a dedicated
   file rather than the user's own `.ssh` folder:

   ```powershell
   notepad C:\ProgramData\ssh\administrators_authorized_keys
   ```

   Add the public key on its own line, save, then restrict the file's
   permissions. SSH will silently ignore the file if permissions are too
   permissive:

   ```powershell
   icacls "C:\ProgramData\ssh\administrators_authorized_keys" /inheritance:r
   icacls "C:\ProgramData\ssh\administrators_authorized_keys" /grant "Administrators:F"
   icacls "C:\ProgramData\ssh\administrators_authorized_keys" /grant "SYSTEM:F"
   ```

6. **Test the connection** before pasting the private key into Plakar Control
   Plane.

   ```bash
   eval `ssh-agent`
   ssh-add /path/to/private_key
   ssh Administrator@<host>
   ```

   A successful, passwordless login confirms the key is authorized correctly and
   that the network path (firewall, security group, sshd) is open.

   If this is the first time connecting to this host over SSH, you will be
   prompted to accept its host key. This is expected; type `yes` to continue. To
   skip the prompt, connect with:

   ```bash
   ssh -o StrictHostKeyChecking=accept-new Administrator@<host>
   ```

   To verify the fingerprint instead of trusting it blindly, retrieve it
   directly from the Windows host, where OpenSSH Server stores its host keys
   under `C:\ProgramData\ssh`:

   ```powershell
   ssh-keygen -lf C:\ProgramData\ssh\ssh_host_ed25519_key.pub
   ```

   Compare its output against the fingerprint shown in the SSH prompt before
   accepting.

   Once the resource is configured in Plakar Control Plane, you can instead use
   the [Test Connection](../../apps/sources#testing-the-connection) action on
   the source app's dashboard to verify connectivity without using the `ssh`
   command directly.

## Destination configuration

Restoring the Program Files folder requires SQL Server to be fully shut down,
since its services and helper processes hold open file handles for the duration
that they run. Before running a restore, stop the following services on the
Windows host:

- **SQL Server** (`MSSQLSERVER`, or the named instance's service): the main
  database engine.
- **SQL Server Agent** (`SQLSERVERAGENT`): scheduled job runner.
- **SQL Server Browser** (`SQLBrowser`): named instance discovery.
- **SQL Server CEIP** (`SQLTELEMETRY`): usage/telemetry reporting. Can be missed
  since it does not appear in SQL Server Configuration Manager's default service
  list, but it holds files open and will block deletion or restore if left
  running.
- **SQL Server VSS Writer** (`SQLWriter`): used for VSS-based backups. Likewise
  omitted from Configuration Manager's list; must be stopped separately.
- Any additional installed feature services that were configured, such as **SQL
  Server Integration Services**, **SQL Full-text Filter Daemon Launcher**, or
  **SQL Server Analysis Services**.

```powershell
Stop-Service MSSQLSERVER, SQLSERVERAGENT, SQLBrowser, SQLTELEMETRY, SQLWriter -Force -ErrorAction SilentlyContinue
```

Confirm every SQL-related service is stopped before proceeding. This can be done
either from PowerShell:

```powershell
Get-Service | Where-Object {$_.Name -like "*VSS*" -or $_.DisplayName -like "*SQL*"}
```

or visually, using the **Services** app and confirm nothing SQL-related still
shows **Running**.

> [!NOTE]
>
> If a restore or file removal still reports `Access to the path ... is denied`
> after all services above are confirmed stopped, the **WMI Provider Host**
> (`WmiPrvSE.exe`) may be holding a lock on a SQL Server DLL; identify and stop
> the offending process, then retry.
