---
title: "OVH Backup Server Setup"
date: "2026-01-21T10:00:00Z"
weight: 1
summary: "Setup a working backup server that automatically backs up your OVH servers to an Object Storage"
---

## Introduction
This tutorial shows you how to create a dedicated backup server on OVH that automatically backs up your other servers to an Object Storage. By the end, you'll have a VPS running Plakar that backs up your servers on a scheduled interval, with a web UI to monitor the backups.

## Architecture Overview
The system consists of three components:
- **Backup VPS**: Runs Plakar and schedules backups
- **Source servers**: Your OVH servers that need to be backed up
- **OVH Object Storage**: Stores the backups in a Kloset Store.

## Step 1: Create OVH Object Storage
Before you can store backups, you need to set up an S3-compatible storage location. OVH's Object Storage provides scalable, durable storage that Plakar can use as a backend. This approach separates your backup data from your VPS, ensuring backups survive even if your VPS fails.

First, you'll need to create a user who can be assigned to access containers. You'll need access credentials to connect Plakar to your Object Storage:
1. In your Object Storage project, go to **Users & Roles**
2. Click **Create User** or select an existing user
3. Generate S3 credentials for this user
4. Save the following information securely:
    - Access Key ID
    - Secret Access Key

Next, you'll create an S3-compatible Object Storage container to store your backups.
1. Log in to the OVHcloud Control Panel
2. Navigate to **Public Cloud** → **Storage & Backup** → **Object Storage**
3. If you don't have a project, click **Create Project** and follow the prompts
4. Click **Create an Object Storage** container
5. Configure your container:
    - Name: Choose a descriptive name like `plakar-backups`
    - Container API: Select S3-compatible API
    - User selection: Select the user you created to give him access to the container
    - Deployment strategy: Choose based on your needs (3-AZ for high availability, 1-AZ for cost efficiency)
    - Region: Select the location closest to your servers
6. Click Create

For detailed instructions, see the [OVHcloud S3 Object Storage documentation](https://help.ovhcloud.com/csm/fr-documentation-public-cloud-storage-object-storage-s3?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=8eaef5882c21fe144a4e082b79ed2fb9&spa=1).

## Step 2: Provision Your Backup VPS
You need a dedicated server to run Plakar continuously. While you could run backups from your local machine, a VPS provides several advantages: it runs 24/7 and it doesn't depend on your local infrastructure to stay online.

Create a VPS to run your backup server:
1. In the OVHcloud Control Panel, go to Bare Metal Cloud → Dedicated and Virtual Servers → Virtual Private Servers
2. Click on Order
3. Select your configuration:
    - Model: Start with a general purpose instance e.g VPS-1 (2 vCores, 8 GB RAM, 75GB Storage)
    - Region: Same region as your Object Storage for best performance
    - Image: Distribution only, Ubuntu 25.04 (you can use any image you prefer)
4. Order your VPS

### Initial VPS Setup
When you first receive your VPS, you'll get a delivery email with connection details. For security reasons, OVHcloud creates a default username based on your chosen operating system (e.g., `ubuntu` for Ubuntu, `debian` for Debian).

The temporary password is sent via a secure link in your delivery email. Connect to your VPS:
```bash
ssh ubuntu@your_vps_ip
```
Replace `ubuntu` with your actual username and `your_vps_ip` with the IP address from your delivery email.

On first login, you'll be prompted to change the temporary password. After changing it, the session will close automatically. Reconnect with your new password.

For more details on VPS initial setup and security, see the [OVHcloud VPS Getting Started guide](https://help.ovhcloud.com/csm/fr-vps-getting-started?id=kb_article_view&sysparm_article=KB0047736).

## Step 3: Install Plakar
Now that your VPS is ready, you need to install Plakar to handle all backup operations, deduplication, encryption, and storage management.

SSH into your new backup VPS and install Plakar:
```bash
ssh ubuntu@your-vps-ip
```

Install Plakar to your VPS using [Plakar Installation Guide](../../../../../docs/main/quickstart/installation/)

## Step 4: Configure OVH Object Storage in Plakar
In this step, you'll connect Plakar to the OVH S3-compatible Object Storage you created earlier and initialize it as a Kloset Store.

### Install the S3 integration
First, login to Plakar so you can install integrations:
```bash
plakar login -email you@example.com
# OR
plakar login -github
```

Once logged in, install the S3 integration:
```bash
plakar pkg add s3
```

### Add OVH S3 storage as a Storage Connector
Storage connectors in Plakar define where backups are stored. By configuring this once, you can reference it in all future backup commands using a simple alias.

Now, add your OVH Object Storage as a storage connector. Use the S3 endpoint and credentials you generated earlier:
```bash
plakar store add ovh-s3-backups \
  location=s3://<S3_ENDPOINT>/<BUCKET_NAME> \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  use_tls=true \
  passphrase='<YOUR_SECURE_PASSPHRASE>'
```

Replace:
  - `<S3_ENDPOINT>` with your OVH S3 endpoint (e.g., `s3.eu-west-par.io.cloud.ovh.net`)
  - `<BUCKET_NAME>` with the container name you created (e.g., `plakar-backups`)
  - `<YOUR_ACCESS_KEY_ID>` and `<YOUR_SECRET_ACCESS_KEY>` with the credentials generated in Step 1
  - `<YOUR_SECURE_PASSPHRASE>` with a strong passphrase for encrypting your backups (use single quotes if it contains special characters)

{{% notice style="info" title="Configuring Passphrase" expanded="true" %}}
By configuring the passphrase in the store, automated backups will run without prompting for credentials.
{{% /notice %}}

### Initialize the Kloset Store
Finally, initialize the Object Storage location as a Kloset Store:
```bash
plakar at "ovh-s3-backups" create
```
Since you already configured the passphrase when adding the store, this will use that passphrase automatically to encrypt all data before sending it to Object Storage.

Once this step completes, your backup server is fully connected to OVH Object Storage and ready to receive encrypted, deduplicated snapshots.

## Step 5: Set Up SSH Access to Source Servers
To back up remote servers, Plakar needs secure access to read their files. SSH key-based authentication is the standard approach because it's more secure than passwords and allows automated backups without interactive prompts. You'll configure the backup VPS to connect to your source servers using SSH keys.

### Install the SFTP integration
First, install the SFTP integration which enables SSH-based backups:
```bash
plakar pkg add sftp
```

### Generate SSH keys
Generate an SSH key pair on your backup VPS:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_plakar -C "plakar@backup"
```
Press `Enter` to use no passphrase (recommended for automated backups).

### Copy the public key to source servers
Copy the public key to each server you want to back up:
```bash
ssh-copy-id -i ~/.ssh/id_ed25519_plakar.pub user@source-server-1
ssh-copy-id -i ~/.ssh/id_ed25519_plakar.pub user@source-server-2
```
Replace `user` with the appropriate username on your source servers.

Test SSH access:
```bash
ssh -i ~/.ssh/id_ed25519_plakar user@source-server-1 'echo "Connection successful"'
```

### Create SSH host aliases (recommended)
SSH config aliases simplify commands and centralize connection settings. Instead of typing full hostnames, ports, and key paths every time, you can use short aliases. This makes Plakar commands cleaner and reduces the chance of errors.

Create a host alias in `~/.ssh/config` to simplify Plakar commands:
```bash
cat >> ~/.ssh/config << 'EOF'
Host source-1
    HostName source-server-1.example.com
    User backupuser
    Port 22
    IdentityFile ~/.ssh/id_ed25519_plakar

Host source-2
    HostName source-server-2.example.com
    User backupuser
    Port 22
    IdentityFile ~/.ssh/id_ed25519_plakar
EOF
```
Test the alias:
```bash
ssh source-1 'echo "Alias works"'
```

## Step 6: Configure Backup Sources
Source connectors define what to back up—which servers and which directories. Like storage connectors, sources are configured once and referenced by name. This approach provides several benefits: you can reuse source definitions across multiple backup commands, change paths centrally without updating scripts, and maintain a clear inventory of what's being backed up.

### Add source connectors
Configure a source for each server you want to back up:
```bash
# Add first source server
plakar source add web-server-1 sftp://source-1:/var/www

# Add second source server
plakar source add web-server-2 sftp://source-2:/var/www
```
You can add multiple sources pointing to different directories on the same server or different servers.

### Verify source configuration
List your configured sources:
```bash
plakar source show
```

## Step 7: Run Your First Backup
Before setting up automated backups, it's important to test your configuration manually. This ensures all connections work, credentials are correct. A successful manual backup confirms your entire setup is working.

Test your backup configuration by running a manual backup.

### Back up a single source
```bash
plakar at "@ovh-s3-backups" backup "@web-server-1"
```
You should see progress as Plakar connects to the source server, reads files, deduplicates, encrypts, and uploads to OVH Object Storage.

### Back up multiple sources
```bash
plakar at "@ovh-s3-backups" backup "@web-server-1" "@web-server-2"
```

### Verify the backup
List snapshots in your Kloset Store:
```bash
plakar at "@ovh-s3-backups" ls
```
You should see your snapshot(s) listed with timestamps and snapshot id.

## Step 8: Schedule Automatic Backups
Manual backups work for testing, but production backup systems must run automatically. Plakar includes a built-in scheduler that manages backup timing and can verify backups after creation. Using Plakar's scheduler (rather than cron directly) provides better integration, easier management, and built-in checking capabilities.

Plakar includes a built-in scheduler that can run backups automatically. You'll create a configuration file that defines what to back up and how often.

### Create the scheduler configuration
Create a file called `scheduler.yaml` in your home directory:
```bash
cat > ~/scheduler.yaml << 'EOF'
agent:
  tasks:
    - name: Backup web-server-1
      repository: "@ovh-s3-backups"
      backup:
        path: "@web-server-1"
        interval: 24h
        check: true

    - name: Backup web-server-2
      repository: "@ovh-s3-backups"
      backup:
        path: "@web-server-2"
        interval: 24h
        check: true
EOF
```
This configuration:
- Defines two backup tasks (one for each source)
- Runs each backup every 24 hours (`interval: 24h`)
- Verifies each backup after creation (`check: true`)

{{% notice style="info" title="Plakar Scheduler" expanded="true" %}}
The scheduler is still basic and will be improved in future versions with additional features and capabilities.
{{% /notice %}}

### Start the scheduler
Start the Plakar scheduler:
```bash
plakar scheduler start -tasks ~/scheduler.yaml
```
The scheduler runs in the background and will execute backups according to the intervals you configured.

You can check [Scheduler Docs](../../../../../docs/main/guides/setup-scheduler-daily-backups/) for more information on scheduling options.

## Step 9: Set Up Systemd Services
Right now, both the Plakar scheduler and UI are running in your current session. If your VPS reboots or your SSH session ends, these processes will stop and backups won't run automatically. To ensure continuous operation, you need to configure them as system services that start automatically when your VPS boots.

Systemd is the standard service manager on modern Linux systems. By creating systemd service files, you ensure that Plakar processes start on boot, restart if they crash, and can be managed using standard tools like `systemctl`. While Plakar will likely include built-in service installation scripts in future versions, currently you need to create these service files manually.

Configure both the Plakar scheduler and UI to run automatically on your backup VPS.

### Create the scheduler service
The scheduler needs to run continuously to execute backups on schedule. Creating a systemd service ensures it starts automatically when your VPS boots and restarts if it crashes.

Create a systemd service file to run the Plakar scheduler automatically at boot:
```bash
cat << 'EOF' | sudo tee /etc/systemd/system/plakar-scheduler.service > /dev/null
[Unit]
Description=Plakar Scheduler
After=network.target

[Service]
Type=forking
ExecStart=/usr/bin/plakar scheduler start -tasks /home/ubuntu/scheduler.yaml
ExecStop=/usr/bin/plakar scheduler stop
Restart=on-failure
User=ubuntu
WorkingDirectory=/home/ubuntu

[Install]
WantedBy=multi-user.target
EOF
```

### Create the UI service
The web UI also needs to run continuously so you can monitor your backups at any time, not just when you're logged into SSH.

Create a systemd service for the Plakar web UI:
```bash
cat << 'EOF' | sudo tee /etc/systemd/system/plakar-ui.service > /dev/null
[Unit]
Description=Plakar Web UI
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/plakar at "@ovh-s3-backups" ui -listen :8080
Restart=always
User=ubuntu
WorkingDirectory=/home/ubuntu

[Install]
WantedBy=multi-user.target
EOF
```
Replace `ubuntu` with your actual username if different in both service files.

{{% notice style="info" title="Plakar Installation" expanded="true" %}}
If Plakar is installed in a different location, update the path accordingly. Use `which plakar` to find the correct path.
{{% /notice %}}

### Enable and start both services
```bash
sudo systemctl daemon-reload
sudo systemctl enable plakar-scheduler
sudo systemctl enable plakar-ui
sudo systemctl start plakar-scheduler
sudo systemctl start plakar-ui
```
Check both services are running:
```bash
sudo systemctl status plakar-scheduler
sudo systemctl status plakar-ui
```

### Access the UI
Plakar UI requires an access token for security. Plakar automatically generates a random token when the UI starts. You can retrieve it from the service logs:

```bash
sudo journalctl -u plakar-ui -n 100 --no-pager | grep -i token
```

Look for a line like:
```bash
launching webUI at http://:8080?plakar_token=d9fccdbd-77a3-41a0-8657-24d77a6d00ac
```

Copy the token from the URL and open your browser to `http://your-vps-ip:8080`. If prompted for a token, paste the token value.

{{% notice style="warning" title="Security Note" expanded="true" %}}
For production use, configure a firewall to restrict access to port 8080 to only your IP addresses, or set up a reverse proxy with SSL.
{{% /notice %}}

## Troubleshooting
1. **Authentication errors**: Verify SSH keys are properly configured and the user has read permissions on source servers
2. **Can't connect to Object Storage**: Check your S3 credentials and endpoint URL are correct. Verify the passphrase is configured with `plakar store show ovh-s3-backups`
3. **Permission denied on source servers**: Ensure the SSH user has read access to the directories you're backing up
4. **Services won't start after reboot**: Check service status with `systemctl status` and view logs with `journalctl -u plakar-scheduler` or `journalctl -u plakar-ui`

You can also run the UI locally on your own computer by installing Plakar and configuring the same store with your OVH S3 credentials. This allows you to access backups without connecting to the VPS.
