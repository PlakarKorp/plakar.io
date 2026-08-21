

# Infrastructure as Code

Plakar Control Plane (PCP) can be configured either through the web interface or
declaratively using Infrastructure as Code (IaC) tools.

Instead of configuring resources manually, IaC lets you describe the desired
state in code, apply it, and keep your PCP configuration consistent and
repeatable. Resources such as sources, stores, destinations, and scheduled
backup, check, and sync tasks can all be managed this way.

The tools in this section connect to an existing Plakar Control Plane
deployment. They do not perform backups themselves or replace the PCP appliance,
which must already be installed and enrolled. If you haven't installed PCP yet,
see the [installation documentation](../intro/installation).






## [Kubernetes Operator](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/index.md)

- [Operator Installation](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/installation/index.md): Install the plakar-operator into a Kubernetes cluster and connect it to a Plakar Control Plane instance.
- [Store Resource](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/stores/index.md): Declaring a store app with the plakar-operator Store custom resource.
- [Source Resource](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/sources/index.md): Define a source using the plakar-operator Source custom resource.
- [Destination Resource](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/destinations/index.md): Define a destination using the plakar-operator Destination custom resource.
- [Restore Resource](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/restore/index.md): Run a one-off restore using the plakar-operator Restore custom resource.
- [Scheduling](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/scheduling/index.md): Define scheduled backup, check, and sync tasks using the plakar-operator.



