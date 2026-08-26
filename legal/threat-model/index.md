
## Purpose of this document

Plakar is designed so that a backup can be stored in a location that is not fully
trusted — a shared system, a rented bucket, a provider whose administrator can read
or modify what is stored there.

The line we draw is this: plakar makes the data it writes confidential, and makes any
corruption or alteration of that data evident and non-usable. It does not make the
surrounding deployment safe. An insecure transfer protocol, a storage endpoint that
authenticates nobody, or an over-broad ACL on a source or a bucket remains the
operator's problem, and no property below compensates for one. We assume a multi-site
deployment with properly isolated stores in which no single client can reach all of
them.

This document states what we assume, what we guarantee under those assumptions, and
what an adversary can still achieve at each level of access. It is written to be
falsifiable: every guarantee below is a claim that can be broken, and a report that
breaks one is a valid finding.

It also serves as the scope boundary for the
[Feature and Bug Bounty Program](https://plakar.io/legal-notice/bounty-policy/).
A report is in scope when it defeats a **guarantee** in section 2 without violating an
**assumption** in section 1, in code and in a release that section 4 covers. A report
that only demonstrates the consequence of a violated assumption is not a vulnerability
in plakar, and is triaged as out of scope.

**The assumptions are a scope boundary, not a statement of ambition.** Listing
something as an assumption means we do not currently claim to defend against it and
will not pay a bounty for demonstrating it. It does not mean we consider it
acceptable, uninteresting, or permanently out of reach. Several items in section 1
and most of section 6 are things we intend to narrow or eliminate; when we do, this
document changes and the bounty scope widens with it. Researchers who want to work on
those areas are welcome to write to security@plakar.io first — we would rather tell
you in advance whether something is in scope than have you spend a week on a report we
have to close.

This document is largely inspired by that of other opensource projects and does not
make assumptions that aren't already standard in other projects.

---

## 1. Assumptions

These conditions are taken as given. Everything in section 2 holds only while they do.

**A1 — The host creating the backup is trusted.**
This is the most basic requirement and it is essential to creating a trustworthy backup.
A machine that is compromised at the time a snapshot is taken cannot produce a snapshot we can vouch for.
In the context of the control plane, unless the attack compromises it, we consider the host as trusted:
a vulnerability should be demonstrable on the latest stable version we deploy and point you at.

**A2 — The user runs an authentic copy of plakar, and authentic plugins.**
Obtaining plakar or a connector from a channel the user has not verified is outside this model.
Similarly, crafting custom destructive plugins and installing them is the equivalent of assuming a user runs an untrusted executable from the internet,
and plakar does not defend against that.

**A3 — The user does not share the repository passphrase or a decrypted key with an adversary.**

**A4 — plakar is not designed to protect against an adversary deleting, overwriting or
otherwise altering files at the storage location.** Corruption and modification are
made *evident* — see G2 and G3, and this is a real property, not a consolation — but
evident is not prevented.
A client cannot stop a party with write access to the store from destroying what is there.
Plakar will make it detectable but not preventable.

The expected mitigation is architectural, not cryptographic: **run a multi-copy policy
in which no single client has access to every store.** The reference shape is a client
that pushes to store 1, with store 1 synchronised onward to stores 2 and 3 whose keys
are not disclosed to that client. A client — or whoever compromises it — can then
damage only the copy it can reach, and the copies it cannot reach remain both intact
and unreadable to it. Deployments that point every client at every store, or that share
one key across all of them, are outside what this model defends.

**A5 — The whole repository is re-encrypted if a key is leaked.** Under the current
key management design it is not possible to securely revoke a leaked key without
re-encrypting the repository. Changing the passphrase does not help: the passphrase
protects the wrapped subkeys, and an adversary holding an unwrapped subkey keeps it.

**A6 — No practical cryptanalytic advance has occurred against the primitives plakar
uses** — AES-GCM-SIV, AES-KW (RFC 3394), Argon2id and BLAKE3. Such an advance would
render the confidentiality or integrity properties below useless.

**A7 — No advance in computing has made brute-force attack against those primitives,
or against a high-entropy passphrase, feasible.**

**A8 — The deployment around plakar is soundly operated.**
plakar protects the data it writes. It does not protect the environment it runs in, and
it cannot compensate for that environment being misconfigured. Specifically, we assume:

- Transfers run over a trusted channel. Where a backend speaks TLS, TLS is used and
  its certificates are verified. Data at rest stays confidential and tamper-evident
  even over a hostile transport, but availability, endpoint authenticity and
  correlation resistance do not.
- Storage endpoints and data sources authenticate their callers, and their ACLs grant
  each identity only what it needs. A bucket writable by anyone, a database replicating
  without credentials, or a share exported to the world is a deployment fault.
- Stores are isolated across sites, and no single client holds access to all of them
  (see A4).

Reports whose root cause is a plaintext transport, an absent or unverified credential,
or an over-broad ACL describe a deployment fault rather than a defect in plakar, and
are triaged accordingly. A place where plakar *causes* one of those conditions — a
backend that silently downgrades to plaintext, a certificate check that does not
happen, a default that is broader than documented — is very much a defect, and in
scope.

---

## 2. Guarantees

Under the assumptions above, plakar guarantees the following.

**G1 — Content and metadata are unreadable without the repository passphrase.**
Chunks, packfiles, the virtual filesystem index and snapshot manifests are all
encrypted at the source. The storage backend receives opaque blobs. Metadata is
encrypted, not merely the file content.

**G2 — Modification of stored data is detected.**
Every stored object is content-addressed by a keyed MAC. An object whose bytes have
changed — through disk corruption, a faulty transfer, or deliberate modification by
someone without the key — does not match its address and is rejected.

**G3 — Tampered data is not decrypted.**
Authentication precedes use. Data failing its MAC check is never returned to the
caller as valid plaintext.

**G4 — A stored object cannot be located by knowing its cleartext.**
Objects are addressed by keyed MAC, not by a bare digest of the plaintext. An
adversary with read access to the store who suspects a particular file is present
cannot confirm it by computing its hash. (
[2025 cryptography audit](https://plakar.io/posts/2025-02-28/audit-of-plakar-cryptography/))

**G5 — Writes are append-only at the format level.**
Once written, a stream is never modified in place. A repository is advanced by adding objects, not by rewriting them.

**G6 — Snapshots are independent.**
A snapshot does not depend on another snapshot to be restorable. Deleting or losing
any one snapshot does not impair the restore of any other. There is no chain to break.

**G7 — A snapshot can be verified without being restored, and without contacting us.**
Integrity is checkable offline against the repository alone.

---

## 3. What an adversary can still do

The following are things an adversary can achieve **without** breaking any guarantee
above. They are known, accepted, and not eligible for bounty unless the report shows
more than what is described here.

### 3.1 Read access to the storage location

- Attempt an offline brute-force attack against the passphrase. Argon2id (t=4, m=256MB)
  raises the cost per guess; it does not rescue a weak passphrase. **Use a passphrase
  with real entropy.**
- Infer which packfiles probably hold index or tree structures from access patterns
  and size distribution.
- Infer the approximate size, frequency and timing of backups from object creation
  timestamps and counts.
- Observe repository growth over time, and from it infer roughly how much data changed
  between two points.

### 3.2 Network access

- Denial of service against the storage endpoint or the link to it.
- Determine where backups originate (source address) and where they are sent
  (provider, bucket, region).
- Infer backup size and cadence from traffic volume and timing.
- Interfere with the flow outright where it is not carried over a trusted channel:
  drop, delay, reorder or replay it, redirect it to an endpoint of their choosing, and
  substitute the bytes in transit. Encryption and content addressing mean substituted
  bytes are rejected rather than trusted — the transfer fails loudly instead of
  silently corrupting a snapshot — but a plaintext transport still hands the adversary
  full control over whether the backup completes at all, and over the metadata in 3.1
  and 3.2. Use TLS (A8).

### 3.3 Write access to the storage location

- Delete or corrupt stored objects, impairing or preventing restore. This is A4.
- Correlate objects by creation timestamp to identify which ones a given snapshot
  introduced, and delete exactly those. The snapshot disappears; other snapshots that
  deduplicated against its chunks lose the data those chunks held. plakar detects that
  the objects are *missing* — `check` will report it — but cannot prevent it and does
  not treat selective deletion as distinguishable from ordinary loss.
- Roll a repository back to an earlier state by restoring an older copy of its
  metadata, silently discarding recent snapshots.

### 3.4 A compromised source host (violates A1)

- Intercept the passphrase as it is entered or as it is held by a running agent, copy
  files before they are backed up, and manipulate what is written into new snapshots.
- Create snapshots full of garbage covering every modified file, then wait for the
  retention policy to age out the legitimate ones.
- Create one bogus snapshot per legitimate snapshot at a slightly offset timestamp, so
  that a single retention pass discards all the real ones at once.

Both retention attacks are real and we do not currently defend against them
client-side. See section 6.

### 3.5 A compromised host holding append-only credentials

- Capture the passphrase and decrypt past *and* future backups.
- Make every snapshot taken after the compromise untrustworthy. Snapshots taken before
  it remain intact and restorable — this is the property append-only access buys, and
  it is worth having.
- Drive retention (`rm`, policy-based pruning) so that legitimate snapshots are removed
  and only attacker-authored ones survive. Append-only storage does not prevent this,
  because the deletion is requested by a legitimately keyed client.

### 3.6 A leaked, decrypted key (violates A3/A5)

- Decrypt all existing and all future data in that repository.
- Where several hosts back up into one repository, read every host's data — the
  repository has one master key and no per-host isolation.
- Write validly encrypted, validly authenticated objects into the repository. G2 and
  G3 protect against modification by someone *without* the key; they say nothing about
  an adversary who has it.

### 3.7 Components beyond the store

These ship with plakar and fall under section 4, though what follows describes intended
properties rather than proven ones.

- **Agent.** The agent holds unlocked key material in memory so subsequent commands do
  not re-derive it. Anything that can reach its control socket can act as the user.
  Local privilege boundaries around that socket are the security control; a way to
  reach it from another local user, another container, or the network is a valid
  finding.
- **Web UI.** `plakar ui` serves a local interface over the repository. It exposes
  decrypted snapshot content. Binding beyond loopback without explicit intent, missing
  origin checks, a request-forgery path from a page the user has open, or content from
  a snapshot escaping into the UI's own execution context are valid findings.
- **`sync`.** Two Kloset stores exchange objects. A malicious remote is an untrusted
  peer: it must not be able to induce the local side to accept objects it cannot
  authenticate, to consume unbounded memory, or to write outside the store.
- **`ptar`.** A self-contained archive is a file that travels. Anything that turns
  opening one into code execution, path traversal on extraction, or a decompression
  bomb is a valid finding.
- **Plugins and connectors (`pkg`).** Installed plugins run with the user's authority.
  How plakar loads, isolates, feeds and trusts them is ours; where a given connector
  came from is A2; what a third-party connector does with the authority it was given is
  its author's (4.1). Custom connectors that do not originate from our distribution
  channels are out of scope as they only demonstrate that voluntarily installing a
  malware allows executing that malware.
- **Restore path.** A repository is data, and a client browsing or restoring from one
  parses it. Authenticated-but-hostile input — from a leaked-key adversary, a malicious
  `sync` peer, or a shared repository — must not yield path traversal outside the
  restore target, symlink-following writes, resource exhaustion, or memory unsafety.

---

## 4. Scope

Sections 1 to 3 say what counts as a defect. This section says which code and which
builds it has to be found in.

### 4.1 Code

In scope: everything we write and ship. Kloset, the plakar CLI, the agent, the web UI,
`sync`, `ptar`, the plugin machinery itself, and the integrations authored by our team.

Out of scope: **integrations contributed by community or third-party authors.** We do
not own that code and cannot commit to fixing it or to a timeline. Send those to us
anyway — we will forward the report to the maintainer and help coordinate disclosure —
but the outcome is theirs to decide and the report is not eligible for a reward from
us. The only action we can take is unlink them from our hub if fixes do not land timely.

The dividing line runs through the plugin boundary rather than around it. A flaw in how
plakar loads, isolates, feeds or trusts a plugin is ours, and stays in scope even when
you found it through somebody else's connector. A flaw in what that connector does with
the authority it was legitimately given is theirs.

### 4.2 Releases

We follow semantic versioning, and the suffix tells you whether a build is meant for
users or for us.

In scope: **any `v1.y.z` and any `v1.y.z-rc`.** A release candidate is offered to users
as something they may reasonably run, so it carries the same obligations as a stable
release.

Out of scope: **`-alpha` and `-beta` builds, and untagged branches.** These are
development artefacts published for developers. They are expected to be incomplete,
they may ship code that has not been reviewed yet, and finding that they are is not a
finding. If the same defect also reaches a stable or rc build, it is in scope through
that build — report it against the released version.

Security updates are provided for the 1.x line.

---

## 5. Reporting

Send findings to **security@plakar.io**. We can arrange a secure channel or exchange
public keys for anything sensitive. Do not test against production systems you do not
own.

A report is most useful when it names the guarantee it breaks (G1–G7), the access level
it assumes (section 3), and gives a reproduction. If your finding requires violating an
assumption, say so and explain why the assumption should be narrower — we would rather
have that argument than not hear about it.

Please do not disclose publicly before a fix is available. We will keep you involved
through analysis and remediation and credit you on publication, unless you prefer
otherwise.

Rewards, eligibility and safe-harbour terms are in the
[bounty policy](https://plakar.io/legal-notice/bounty-policy/).

---

## 6. Known limitations

These are design gaps we are aware of, stated here so that nobody has to discover them
by writing a report. They are not currently eligible for bounty. They *are* on the
engineering agenda, and this section is the list against which this document will be
revised.

**5.1 One master key per repository; no write-only credential.**
A host that can write to a repository can also read everything in it, including other
hosts' snapshots. There is no asymmetric mode in which an agent contributes data it
cannot decrypt. This is the single change that would most reduce the blast radius of
section 3.4 and 3.6.

**5.2 Key revocation requires re-encryption.**
A5. Rotation today means moving the data to a repository with a new master key.

**5.3 Retention is not defended against poisoning.**
Section 3.4. There is no bound on snapshot churn, no anomaly signal, and no policy that
lives somewhere the compromised host cannot reach.

**5.4 Metadata leakage is mitigated to the best of our abilities.**
Sizes, timing and access patterns (3.1, 3.2) are observable.
We randomize, pad and batch to obfuscate and make it harder to study access patterns,
but these are opportunistic not fool-proof approaches.

**5.5 Immutability is inherited, not enforced.**
G5 is a property of the format: plakar never rewrites. It is not a property the
repository imposes on whoever holds the credentials. Real immutability currently comes
from the storage layer beneath us (object lock, append-only ACLs), not from Kloset.

---

## Revision policy

This document is versioned with the code it describes. Any change to the assumptions or
guarantees is a change to the bounty scope and will be dated here. If a released
version's behaviour and this document disagree, that discrepancy is itself worth
reporting.

