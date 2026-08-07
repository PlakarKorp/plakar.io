
# MTU and Jumbo Frames

## MTU

The maximum transmission unit (MTU) is the largest payload a network interface
can send in a single frame without fragmenting it. On Ethernet, the standard MTU
is 1500 bytes. A standard Ethernet frame adds 14 bytes of header and 4 bytes of
CRC on top of that payload, for a total frame size of 1518 bytes.

Most network equipment defaults to the standard 1500-byte MTU, and this is the
right choice for general-purpose networks, including anything that touches the
public internet.

## Jumbo frames

A jumbo frame is any Ethernet frame with a payload larger than 1500 bytes. They
are not part of the [IEEE 802.3](https://en.wikipedia.org/wiki/IEEE_802.3)
standard, so support and maximum size vary by vendor. In practice, 9000 bytes is
the de facto ceiling most networking equipment supports, and it's the value most
commonly meant by "jumbo frames." Frames above 9000 bytes are sometimes called
super jumbo frames, up to a theoretical maximum of 65535 bytes; these are rarely
used outside specialized IPv6 jumbogram scenarios.

Jumbo frames reduce per-packet overhead. Moving the same amount of data in
fewer, larger frames means fewer headers to generate, transmit, and process,
which lowers both bandwidth spent on overhead and CPU cycles spent handling
packets. The gains are only meaningful on networks that are already fast (1 Gbps
or higher) and under real load; on a lightly used or slower network the
difference is negligible.

The tradeoff is fragility. Every device in the path (switches, routers, NICs,
virtual network interfaces) needs to agree on the larger frame size. If one hop
doesn't, the result is either fragmentation (IPv4) or a dropped packet (IPv6,
which does not fragment). Because jumbo frames must be enabled manually and
aren't uniform by default, a single misconfigured device on the path can cause
hard-to-diagnose throughput problems rather than an outright failure.

For that reason, jumbo frames are best reserved for controlled, single-purpose
network segments where every device is known and configured consistently.
Storage area networks and high-performance computing clusters are the classic
use case. They should not be enabled on general office or home networks, and
never on interfaces facing the public internet.

## TCP MSS

The TCP maximum segment size (MSS) is a related but separate value: it's the
largest chunk of data a TCP endpoint will accept in a single segment, negotiated
by both sides during the TCP handshake. Unlike MTU, MSS refers only to the TCP
payload and excludes the TCP and IP headers. MSS is normally derived from the
interface MTU (MTU minus IP and TCP header overhead), so when jumbo frames are
enabled end to end, MSS increases correspondingly and each TCP segment carries
more data per round trip.

## Why this matters for control plane deployments

Jumbo frames can meaningfully speed up large data transfers between
[sources](../apps/sources), [stores](../apps/stores) and
[destinations](../apps/destinations) when the entire path between them, physical
and virtual, is under your control and consistently configured. They are not
something to enable by default, and are not appropriate on any segment that
touches an uncontrolled network or the internet.

By default, the Plakar Control Plane appliance uses the standard 1500-byte MTU
on its interfaces. This is configurable per interface from the
[settings](../administration/general-settings#network-interfaces) page if your
network requires a different value.

