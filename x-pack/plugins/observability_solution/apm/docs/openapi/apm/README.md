# APM UI OpenAPI documentation

<!-- TO DO: Update links to docs when available on API reference site -->
This directory contains [OpenAPI specifications](https://swagger.io/specification/) for the [APM UI API](#) in Kibana including:

* [Agent Configuration API](#)
* [Annotation API](#)
* [APM agent Key API](#)
* [RUM source map API](#)

## Contents of this directory

* [**`paths` directory**](paths): Defines each endpoint. A path can have one operation per http method. Path files are manually written and maintained.
* **`entrypoint` files**: The overview files that pull together all the paths. `entry` files are manually written and maintained. There are two entrypoint files:
  * `entrypoint.yaml`: The overview file for the stateful APIs.
  * `entrypoint_serverless.yaml`: The overview file for the serverless APIs.
* **`bundled` files**: The current self-contained spec files that are available. `bundle` files should not be edited manually. Instead use the [Bundle commands](#bundle-commands) below to generate these files. There are two bundled files:
  * `bundled.yaml`: The current spec file for stateful APIs.
  * `bundled_serverless.yaml`: The current spec file for serverless APIs.

 This spec is experimental and may be incomplete or change later.

## Bundle commands

Generate the `bundled` files by running the following commands:

```bash
npx @redocly/cli bundle entrypoint_serverless.yaml --output bundled_serverless.yaml --ext yaml
npx @redocly/cli bundle entrypoint.yaml --output bundled.yaml --ext yaml
```

Then join these files with the rest of the Kibana APIs per [`oas_docs/README.md`](../../../../../../../oas_docs/README.md).
