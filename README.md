# Cloudflare Workers KV Namespace Migration

This tool is to help folks who created namespaces during the beta period to
migrate their data to a new namespace.  During the beta period, when new
features or improvements were added to Workers KV, they were only available to
new namespaces, created after those features or improvements were introduced.
This allowed new features or improvements to be added more quickly and with
fewer bugs, but requires migrating to a new namespace in order to take
advantage of newer features and improvements.

## Requirements

* Node/NPM

## Caveats

This script doesn't handle any of the consistency issues of dealing with
data in two namespaces at the same time. This operation is best done while
there's no data being written to either namespace.

This script performs API and worker operations on your Workers KV namespaces.
This will incur costs at the same rate as any other process performing these
operations. This involves doing list operations, reads from the old namespace
and writes to the new namespace.

## Configuration

This script and the Serverless framework configuration used to deploy the
accompanying worker is configured with environment variables. To get set up, set
the following environment variables:

* `CLOUDFLARE_AUTH_EMAIL`

  The email with which you login to the Cloudflare dashboard

* `CLOUDFLARE_AUTH_KEY`

  Documentation on how to find your Cloudflare API key are available in our [support documentation](https://support.cloudflare.com/hc/en-us/articles/200167836-Where-do-I-find-my-Cloudflare-API-key-)

* `CLOUDFLARE_ACCOUNT_ID`

  Account ID that can be found on the right-hand side of your zone overview page in the Cloudflare dashboard

* `CLOUDFLARE_ZONE_ID`

  Zone ID that can be found on the right-hand side of your zone overview page in the Cloudflare dashboard

* `CLOUDFLARE_ZONE_NAME`

  The website name for the zone to which you want the accompanying worker deployed (ex: `example.com`); must match given zone ID

* `CLOUDFLARE_FROM_NS`

  The name of the old namespace from which you would like to migrate

* `CLOUDFLARE_TO_NS`

  The name of the new namespace to which you would like to migrate

You could also copy the `example.env` file and replace the descriptions with
your desired values, like so:

```bash
$ cp example.env .env
$ vi .env  # replace descriptions with values for your account
$ source .env
```

## Installation and Usage

### Installation and Setup

To install, clone this repository and then install the dependencies, by running `npm
install` in the root directory of this repository. This will install all the
dependencies required for deploying the worker and running the script.

### Deploy the required worker

To deploy the accompanying worker, run the following command after configuring
with environment variables as described [above](#Configuration).

```bash
$ npm run setup
```

### Run the migration

To run the script, run the following command after configuring with environment
variables and deploying the accompanying worker as described [above](#deploy-the-required-worker).

```bash
$ ./bin/workers-kv-migrate
```

### Teardown

After you have run the migration, you will want to remove the accompanying
worker from your account. You can run the following command to do this.

```bash
$ npm run teardown
```
