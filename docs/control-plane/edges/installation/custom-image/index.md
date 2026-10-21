
# Building a Custom Edge Image

Some integrations, such as MySQL, PostgreSQL and MongoDB, rely on tools provided
by the vendor. These tools must be available on the edge that runs the task, as
described in
[Integrations that need external tools](../../requirements#integrations-that-need-external-tools).
The official edge image does not include them.

A custom image bundles those tools with `plakar-edge`. Start from a base image
that provides the tools, then copy the `plakar-edge` binary from the official
image. The resulting image can be pushed to a container registry and run
anywhere containers run, including on Kubernetes with the
[Helm chart](../kubernetes).

## Base image requirements

The base image must provide:

- **glibc 2.34 or later.** The `plakar-edge` binary and the integrations it
  installs are built against glibc. Images based on Ubuntu 22.04 or later,
  Debian bookworm or later, and the official `mysql` image meet this
  requirement. Alpine images, including the `-alpine` variants of vendor images,
  do not.
- **CA certificates**, so that the edge can connect to the Control Plane over
  HTTPS.
- **The OpenSSH client** (`ssh`, `ssh-add` and `ssh-agent`), if the edge runs
  SFTP or Windows VSS tasks, or tasks of the integrations built on VSS. See
  [SSH client](../../requirements#ssh-client).

The tools must also be compatible with the server they connect to. For example,
`pg_dump` must be at least the same major version as the PostgreSQL server it
backs up. Each integration lists the tools it needs on its
[resource page](../../../resources).

## Starting from a vendor image

The simplest custom image starts from the vendor's own image, which already
contains the tools. The official `mysql` image includes `mysql`, `mysqldump` and
CA certificates:

```dockerfile
FROM mysql:8.4
COPY --from=ghcr.io/plakarkorp/plakar-edge:<version> /bin/plakar-edge /bin/
ENTRYPOINT ["/bin/plakar-edge"]
```

Setting `ENTRYPOINT` replaces the vendor image's own entry point, so the
container runs the edge and not the database server. The `mysql` image does not
include the OpenSSH client.

## Starting from a distribution image

An edge that serves several integrations can start from a general-purpose
distribution and install each tool it needs:

```dockerfile
FROM ubuntu:24.04
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates openssh-client mysql-client postgresql-client \
 && rm -rf /var/lib/apt/lists/*
COPY --from=ghcr.io/plakarkorp/plakar-edge:<version> /bin/plakar-edge /bin/
ENTRYPOINT ["/bin/plakar-edge"]
```

Distribution images such as `ubuntu` do not include CA certificates, so
`ca-certificates` must be installed explicitly. Some vendor images, such as the
official `postgres` image, also lack them. Check that the base image provides
them before relying on it.

## Choosing the edge version

Replace `<version>` with a released version of the edge image rather than
`latest`, and keep it in line with your Control Plane. An edge whose protocol
version differs from the Control Plane's still enrolls, but receives no tasks
until it is upgraded.

## Running the image

The image accepts the same options as the
[standalone binary](../binary#configuring-the-edge). The state directory holds
the edge identity, authentication token and package cache, and must be stored on
a persistent volume. Otherwise the edge enrolls as a new edge every time its
container is recreated.

For example, with Docker:

```sh
$ docker run -d --name edge-mysql-1 \
  -v edge-mysql-1:/var/lib/plakar-edge \
  -e PLAKAR_EDGE_ENROLL_KEY=<enrollment-key> \
  -e PLAKAR_EDGE_ORGANIZATION=<organization-id> \
  registry.example.com/plakar-edge-mysql:1.0 \
  -control-plane https://plakman.example.com \
  -name edge-mysql-1
```

Setting `-name` keeps the edge name stable, since the container hostname changes
when the container is recreated.

On Kubernetes, set `image.repository` and `image.tag` to the custom image when
[installing the chart](../kubernetes#configure-the-chart).

