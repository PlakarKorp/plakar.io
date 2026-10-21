

# Plakar Edge

By default, Plakar Control Plane (PCP) runs scheduled operations from the
Control Plane appliance. This works well when the resources you want to protect
are reachable from the appliance.

For environments where resources are spread across different networks, or where
the Control Plane should not have direct access to them, you can run operations
through an **edge**.

An edge is a lightweight executor that runs in the environment where the
resources you want to protect are located. It connects to PCP, receives work
from the Control Plane, performs the operation locally, and reports the result
back.

This lets the Control Plane coordinate protection without needing direct
connectivity to every source and destination.

## When to use an edge

An edge is useful when the systems being protected are not directly reachable
from the Control Plane, when it is more efficient to run the operation close to
those systems, when the appliance on its own cannot keep up with the work, or
when an integration needs tools that the appliance does not carry.

For example, you might deploy an edge inside a datacenter containing virtual
machines and databases, while the Control Plane runs elsewhere. The edge can
then access those resources locally without exposing them to the Control Plane
network.

Edges are also how a deployment scales. Every operation an edge runs is work the
appliance does not run itself, so adding edges increases how much protection a
single deployment can carry out at once, without resizing the appliance.

Edges are particularly useful for:

- Protecting resources behind private networks, firewalls, or NAT gateways.
- Running operations close to the data to reduce unnecessary network traffic and
  latency.
- Distributing work across multiple executors so that protection scales beyond
  what one appliance can run.
- Keeping the Control Plane isolated from networks containing protected
  resources.
- Running the few integrations that depend on external tools, which can be
  installed on the edge host.

An edge belongs to the organization it enrolled into. That organization can run
tasks on it, and so can the organizations below it that inherit its edge
enrollment setting. See
[Sharing edges with child organizations](enrollment#sharing-edges-with-child-organizations).






## [How Edges Work](https://www.stg.plakar.io/docs/control-plane/edges/how-edges-work/index.md)



## [Edge Requirements](https://www.stg.plakar.io/docs/control-plane/edges/requirements/index.md)



## [Edge Enrollment](https://www.stg.plakar.io/docs/control-plane/edges/enrollment/index.md)



## [Edges Installation](https://www.stg.plakar.io/docs/control-plane/edges/installation/index.md)

- [Binary](https://www.stg.plakar.io/docs/control-plane/edges/installation/binary/index.md): Build, enroll, and configure a standalone plakar-edge binary.
- [Kubernetes](https://www.stg.plakar.io/docs/control-plane/edges/installation/kubernetes/index.md): Deploy edges on Kubernetes with the plakar-edge Helm chart.
- [Custom Image](https://www.stg.plakar.io/docs/control-plane/edges/installation/custom-image/index.md): Build an edge container image that includes the tools required by integrations such as MySQL and PostgreSQL.


## [Running Tasks](https://www.stg.plakar.io/docs/control-plane/edges/running-tasks/index.md)



## [Pre-job and Post-job Hooks](https://www.stg.plakar.io/docs/control-plane/edges/hooks/index.md)



## [Supervision and Metrics](https://www.stg.plakar.io/docs/control-plane/edges/monitoring/index.md)




