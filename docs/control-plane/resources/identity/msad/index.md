
# Microsoft Active Directory

The Microsoft Active Directory (MSAD) integration allows Plakar Control Plane to
protect Windows Active Directory Domain Controllers by creating and restoring
Windows **System State** backups.

The integration is built on top of Plakar's
[VSS integration](../../compute/vss). Plakar connects to the Windows host over
SSH and creates a System State backup on a dedicated NTFS volume, then takes a
VSS snapshot of that volume and transfers the backup files over SFTP into the
Kloset store. During recovery, Plakar restores the System State backup to the
NTFS volume, allowing **Windows Server Backup** to restore the Domain Controller
once booted into **Directory Services Restore Mode (DSRM)**.

The Microsoft Active Directory integration creates System State backups while a
Domain Controller is healthy and online, and restores them when needed. It is
intended for disaster recovery scenarios such as hardware failure, data
corruption, or ransomware, where no healthy Domain Controller remains available
to recover from through normal replication.

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering Microsoft Active Directory resources. You must
configure a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding an Active Directory resource.

### Adding an Active Directory resource

When using a self-managed inventory, you must register resources manually or
import them from a CSV file.

To add a Windows Domain Controller, use `Database` as the class. For the
endpoint, use the hostname or IP address of the Domain Controller. See the
[resources documentation](../../resources) for more information on configuring
resources in a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD

subgraph Windows["Windows Server Domain Controller"]
  AD["Active Directory"]
  WB["Windows System State<br/> Backup"]
  Drive["Dedicated NTFS<br/> Backup Volume"]
  VSS["VSS Snapshot"]
end

subgraph Plakar["Plakar Control Plane"]
  Source["MS AD<br/>Source app"]
  Backup["Backup process<br/>Encrypt & deduplicate"]
end

Store["Kloset Store"]

AD --> WB
WB --> Drive
Source -->|"SSH: starts System State<br/> backup"| WB
Source -->|"SSH: requests<br/> VSS snapshot"| VSS
Drive --> VSS
VSS -->|"SFTP: transfers<br/> backup files"| Source
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
  Destination["MS AD<br/>Destination app"]
  Restore["Restore process"]
end

subgraph Windows["Windows Server Domain Controller"]
  Drive["Dedicated NTFS<br/> Backup Volume"]
end

subgraph Manual["Manual recovery (user-performed)"]
  DSRM["Boot into DSRM"]
  WSB["Windows Server Backup<br/>Recovery Wizard"]
  AD["Active Directory<br/>restored"]
end

Store --> Restore
Destination --> Restore
Restore -->|"SFTP: restores backup files"| Drive
Drive -.->|"user boots into DSRM"| DSRM
DSRM --> WSB
WSB --> AD

{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Preparing the Windows host

Before configuring the integration, the Domain Controller needs **Active
Directory Domain Services** and **OpenSSH Server** installed and running, along
with a dedicated NTFS volume for storing System State backups. The backup volume
needs at least 20 GB of available space, though 40 GB or more is recommended.

The dedicated NTFS volume is used to store Windows System State backups before
they are transferred into the Kloset store. If the server does not already have
a suitable backup volume, initialize one before configuring the integration.

### Setting up SSH access on the Windows host

The `msad` integration relies on OpenSSH Server being installed, running, and
reachable on the Windows host before it can be used, with a dedicated SSH key
authorized for the administrative account Plakar connects as.

See
[Setting Up OpenSSH Server on Windows](../../guides/windows/windows-openssh-setup)
for step-by-step instructions on installing OpenSSH Server, opening port 22, and
authorizing an SSH key.

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **Port**: The SSH server port. Defaults to `22` if left empty.
- **Root**: The letter of the Windows drive used to store System State backups,
  e.g. `C:`, `D:`. Required when configuring the destination app.
- **Username**: Required. The administrative account used to create and restore
  System State backups.
- **SSH Private Key**: To authenticate with the remote machine, PCP uses SSH
  key-based authentication. Generate a dedicated SSH keypair for PCP and add the
  public key to the Windows host's authorized keys before configuring this field
  (see
  [Setting up SSH access on the Windows host](#setting-up-ssh-access-on-the-windows-host)
  above), then copy the private key in full, including the header and footer
  lines, into this field:

```txt
  -----BEGIN OPENSSH PRIVATE KEY-----
  ...
  -----END OPENSSH PRIVATE KEY-----
```

## Restoring a Domain Controller

### Before you begin

To restore a Domain Controller from a System State backup, prepare a new host
running the same version of Windows Server as the failed Domain Controller. A
clean installation is sufficient; it does not need to match the failed server's
hostname or IP address.

Install the **Active Directory Domain Services** role, but do not configure it,
along with the **Windows Server Backup** feature:

```powershell
Install-WindowsFeature -Name AD-Domain-Services, Windows-Server-Backup
```

Configure the destination resource in Plakar and restore the System State backup
to the dedicated backup volume before continuing.

### Recovery modes

Windows Server Backup supports two Active Directory recovery modes, and it is
important to choose correctly before running the recovery wizard:

- **Authoritative restore** marks the recovered Active Directory objects as
  newer than the copies held by other Domain Controllers, so they replicate
  outward and overwrite those copies. Use this mode when every Domain Controller
  has failed, since there is no other copy of Active Directory to preserve. Any
  changes made after the backup was taken (group membership, application
  attributes, etc.) will be lost.

- **Non-authoritative restore** brings the Domain Controller back and lets it
  pull the latest changes from any Domain Controller that is still healthy,
  through normal replication. Use this mode whenever another healthy Domain
  Controller is available.

{{< steps >}}

{{< step >}}

### Boot into Directory Services Restore Mode

Before restoring the System State backup, boot the server into **Directory
Services Restore Mode (DSRM)**, either through **System Configuration**
(`msconfig`) by enabling **Safe boot > Active Directory repair** on the **Boot**
tab, or from an elevated command prompt:

```powershell
bcdedit /set safeboot dsrepair
shutdown /r /t 0
```

After the restart, sign in with the local **DSRM Administrator** account, using
the account name in the form `.\Administrator`.

{{< /step >}}

{{< step >}}

### Restore the System State backup

Open **Windows Server Backup** (`wbadmin.msc`) and start the **Recovery
Wizard**.

1. Select **A backup stored on another location**.
2. Select the dedicated backup volume restored by Plakar.
3. Select the backup date to restore.
4. Choose **System State** as the recovery type.
5. Select **Original location**, and, based on the recovery mode chosen above,
   enable or leave disabled **Perform an authoritative restore of Active
   Directory files**.

Windows Server Backup will warn that the backup originates from a different
server and that recovery will trigger replication resynchronization once the
server comes back online; both warnings are expected in this scenario.

Complete the wizard and let Windows Server Backup finish restoring the System
State backup, then restart the server when prompted. The server's hostname will
change to match the Domain Controller recorded in the backup.

{{< /step >}}

{{< step >}}

### Return to normal boot mode

After the restore completes, disable DSRM boot:

```powershell
bcdedit /deletevalue safeboot
```

Restart the server and sign in with a domain administrator account. If the
password is not known, it can be reset once the **Domain Controller** is back
online.

{{< /step >}}

{{< step >}}

### Verify the restored Domain Controller

After the server starts normally, confirm Active Directory is functioning. If
**Active Directory Users and Computers** reports that the server is not
operational, check whether the **SYSVOL** and **NETLOGON** shares are present:

```powershell
net share
```

If they are missing, enable the **SysvolReady** registry value:

1. Open **Registry Editor** (`regedit.exe`).
2. Navigate to:
   `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters`
3. Change **SysvolReady** from `0` to `1`.
4. Restart the Netlogon service:

```powershell
   net stop netlogon
   net start netlogon
```

Confirm the **SYSVOL** and **NETLOGON** shares are now available and that the
**Active Directory Users and Computers** console opens successfully.

{{< /step >}}

{{< /steps >}}

