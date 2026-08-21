

# References

This section provides comprehensive technical reference documentation for
Plakar's commands, configurations, file formats, and integrations. These pages
are designed for quick lookup and detailed specification rather than learning or
conceptual understanding.

If you're looking for learning materials or conceptual explanations, see the
[Explanations](../explanations) section. For step-by-step instructions, see the
[Guides](../guides) section.






## [Plakar Ptar](https://stg.plakar.io/docs/community/v1.0.6/references/ptar/index.md)



## [Command line syntax](https://stg.plakar.io/docs/community/v1.0.6/references/command-line-syntax/index.md)



## [Commands](https://stg.plakar.io/docs/community/v1.0.6/references/commands/index.md)

- [agent](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-agent/index.md): Run the Plakar agent
- [archive](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-archive/index.md): Create an archive from a Plakar snapshot
- [backup](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-backup/index.md): Create a new snapshot in a Kloset store
- [cat](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-cat/index.md): Display file contents from a Plakar snapshot
- [check](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-check/index.md): Check data integrity in a Plakar repository
- [clone](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-clone/index.md): Clone a Plakar repository to a new location
- [create](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-create/index.md): Create a new Plakar repository
- [destination](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-destination/index.md): Manage Plakar restore destination configuration
- [diag](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-diag/index.md): Display detailed information about Plakar internal structures
- [diff](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-diff/index.md): Show differences between files in a Plakar snapshots
- [digest](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-digest/index.md): Compute digests for files in a Plakar snapshot
- [dup](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-dup/index.md): Duplicates an existing snapshot with a different ID
- [info](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-info/index.md): Display detailed information about internal structures
- [locate](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-locate/index.md): Find filenames in a Plakar snapshot
- [login](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-login/index.md): Authenticate to Plakar services
- [logout](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-logout/index.md): Log out from Plakar services
- [ls](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-ls/index.md): List snapshots and their contents in a Plakar repository
- [maintenance](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-maintenance/index.md): Remove unused data from a Plakar repository
- [mount](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-mount/index.md): Mount Plakar snapshots as read-only filesystem
- [pkg-add](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-pkg-add/index.md): Install Plakar plugins
- [pkg-build](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-pkg-build/index.md): Build Plakar plugins from source
- [pkg-create](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-pkg-create/index.md): Package a plugin
- [pkg-manifest.yaml](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-pkg-manifest.yaml/index.md): Manifest for plugin assemblation
- [pkg-recipe.yaml](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-pkg-recipe.yaml/index.md): Recipe to build Plakar plugins from source
- [pkg-rm](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-pkg-rm/index.md): Uninstall Plakar plugins
- [pkg-show](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-pkg-show/index.md): Show installed Plakar plugins
- [plakar](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar/index.md): effortless backups
- [policy](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-policy/index.md): Manage Plakar retention policies
- [prune](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-prune/index.md): Prune snapshots according to a policy
- [ptar](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-ptar/index.md): generate a self-contained Kloset archive (.ptar)
- [query](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-query/index.md): query flags shared among many Plakar subcommands
- [restore](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-restore/index.md): Restore files from a Plakar snapshot
- [rm](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-rm/index.md): Remove snapshots from a Plakar repository
- [scheduler](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-scheduler/index.md): Run the Plakar scheduler
- [server](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-server/index.md): Start a Plakar server
- [service](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-service/index.md): Manage optional Plakar-connected services
- [source](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-source/index.md): Manage Plakar backup source configuration
- [store](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-store/index.md): Manage Plakar store configurations
- [sync](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-sync/index.md): Synchronize snapshots between Plakar repositories
- [token](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-token/index.md): Manage Plakar tokens
- [ui](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-ui/index.md): Serve the Plakar web user interface
- [version](https://stg.plakar.io/docs/community/v1.0.6/references/commands/plakar-version/index.md): Display the current Plakar version



