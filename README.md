# Docker Static Site Generator

Docker Static Site Generator is a docker contained, static (HTML) site generator that can optionally upload to S3 and CloudFront. Local development is done via a Node Express server, with a Gulp file included to provide the following tooling and optimisations:

- SASS compiling, autoprefixing and minification
- Image optimisation
- Asset cache-busting
- Critical path CSS
- Foundation for Sites

In addition, Docker Static Site Generator can also publish your generated files straight to S3 with correct cache-control flags, as well as invalidate associated CloudFront distribution cache.

# Requirements

You'll need the following to get up and running:

- Docker
- (Optional) An AWS account (to publish to S3)

# Usage
