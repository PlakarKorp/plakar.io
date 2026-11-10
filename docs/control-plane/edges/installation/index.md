

# Installing an Edge

An edge can run either as a standalone binary or as a Kubernetes workload.
Choose the deployment method that best fits the environment where the edge will
run. When the edge needs tools required by integrations such as MySQL or
PostgreSQL, build a custom image that includes them.

An edge enrolls into an edge pool with the pool's enrollment key, and joins the
organization that owns the pool. See [edge enrollment](../enrollment) for how to
create a pool and generate its key.

Edges enrolled before pools were introduced, without a pool, have been placed in
a pool named `default`, which is the organization's default pool.






## [Binary](https://www.stg.plakar.io/docs/control-plane/edges/installation/binary/index.md)



## [Kubernetes](https://www.stg.plakar.io/docs/control-plane/edges/installation/kubernetes/index.md)



## [Custom Image](https://www.stg.plakar.io/docs/control-plane/edges/installation/custom-image/index.md)




