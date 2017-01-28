# Docker Static Site Generator

Docker Static Site Generator is a docker contained, static (HTML) site generator that can optionally upload to S3 and CloudFront. Local development is done via a Node Express server, with a Gulp file included to provide the following tooling and optimisations:

- SASS compiling, autoprefixing and minification
- Image optimisation
- Asset cache-busting
- Critical path CSS :sweat_smile:
- Foundation for Sites

In addition, Docker Static Site Generator can also publish your generated files straight to S3 with correct cache-control flags, as well as invalidate associated CloudFront distribution cache.

### Intended purpose

This is for building static HTML sites, using decent defaults and a few handy tools. Hosting websites on S3 and CloudFlare is also very low cost. This is not intended for building complex sites, or sites that require any sort of dynamic logic, it generates static files only.

## Requirements

You'll need the following to get up and running:

- Docker
- Docker Compose
- An AWS account (optional)

## Docker setup and first run

Run the following command to build and run the Docker container, the first time you run this it will build the container:

    $ docker-compose up

You will see the output from the build process and running process, to stop it you can use `Ctrl + C` or `$ docker-compose down`. To interact with the running container, you can exec as follows:

    $ docker exec -it dockerstaticsitegenerator_app1 /bin/bash

*Note, you may need to change the name of the container if you are running several, check using `$ docker ps`.*

Next time you want to run it, simply issue `$ docker-compose up` in the project directory.

## Interacting with Gulp, NPM etc

Gulp is run the first time `docker-compose` is built, and when you need to run it again, or install any sort of packages using NPM, you need to `exec` into the container. This is simply a matter of issuing the following command:

    $ docker exec -it dockerstaticsitegenerator_app1 /bin/bash

*Note, you may need to change the name of the container if you are running several, check using `$ docker ps`.*

From there you can simply run `$ gulp` or `$ gulp watch`, as well as install NPM packages.

### A note on `$ gulp watch`

Gulp is set-up to run and exit (no watch rules). You can setup a watch rule if you like, however be careful to ensure that the default `$ gulp` tasks exits and watch is only enabled using `$ gulp watch` (otherwise the `run.sh` script will not start the nodemon server when running `$ docker-compose up`).

## Publish to S3

In order to publish to an S3 bucket, you will need to create a `aws-credentials.json` file. Copy the existing `app/aws-credentials.json.example` file and save it as `aws-credentials.json`, adding the details needed. It is highly recommended that you create a dedicated IAM user to use for the token and secret, and restrict their access to only the bucket (and optionally CloudFront). Note for obvious reasons your AWS credentials should be kept out of your git repo, the file is therefore excluded curtosy of a gitignore rule.

Your S3 bucket will need to be setup for static website hosting, with an index.html specified and optionally a 404.html (example included). Any time you publish, the bucket will be emptied, so ensure you have created a bucket solely for the purpose of static website hosting and not containing any files you don't want to be removed when you publish.

To upload to your S3 website bucket, just run `$ gulp publish`, only the files which have changed will be uploaded.

## Invalidate CloudFront cache

If you have your S3 bucket connected to a CloudFront distribution (which is the recommended way to do it), you will want to invalidate the cache when new files are uploaded. Provided your IAM user has permissions to do so, you can include the CloudFront distribution ID in the `aws-credentials.json` file and run `$ gulp invalidate`. Only files which are known to have changed will be invalidated.
