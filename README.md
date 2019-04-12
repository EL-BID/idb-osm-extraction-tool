<img align="right" height="39" src="https://github.com/EL-BID/idb-osm-extraction-tool/blob/develop/img/azavea_logo.png"><img align="right" width="115" height="49" src="https://github.com/EL-BID/idb-osm-extraction-tool/blob/develop/img/IDB_logo.jpg">

## IDB OSM Extraction Tool
### Description and Context
---

[![Netlify Status](https://api.netlify.com/api/v1/badges/32028b66-fa0e-409e-a97a-58cf4d3359dc/deploy-status)](https://app.netlify.com/sites/idb-osm-extraction-tool/deploys)

Friendly front-end for querying OSM features around Guyana from the
[Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) and
extracting them as a Shapefile. The frontend of the OSM extraction tool can be accessed [here](https://idb-osm-extraction-tool.netlify.com/). Use is free and requires no account.

<img src="https://user-images.githubusercontent.com/1014341/54622607-3e97aa00-4a40-11e9-9640-3596cf3270a7.png" width=512>

### User Guide
---
The development environment is completely encapsulated in the
Vagrant, Ansible, and Docker files contained in this respository.
All management scripts can be found in the `./scripts` directory.

### Installation Guide

#### Dependencies

* Vagrant 1.8+
* VirtualBox 4.3
* Ansible 2.1+

#### Getting Started

Install the application and all required dependencies.

```sh
./scripts/setup
```

#### Development

Rebuild Docker images and run application.

```sh
vagrant up
vagrant ssh
./scripts/update
./scripts/server
```

#### Ports

| Service            | Port                            |
| ------------------ | ------------------------------- |
| Webpack Dev Server | [`4567`](http://localhost:4567) |

#### Testing

```
./scripts/test
```

#### Scripts

| Name           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `cibuild`      | Build project for CI                                          |
| `clean`        | Free disk space by cleaning up dangling Docker images         |
| `console`      | Run interactive shell inside application container            |
| `lint`         | Lint source code                                              |
| `server`       | Run Docker Compose services                                   |
| `setup`        | Provision Vagrant VM and run `update`                         |
| `test`         | Run unit tests                                                |
| `update`       | Build Docker images                                           |

#### Adding NPM Packages

To add a new NPM package to the project:

- Manually add the package to the project's `package.json` file, ensuring that you
pin it to a specific version.
- Run `./scripts/update` in the VM.
- Commit the changes to the following files to git:
    - `package.json`
    - `yarn.lock`
- We usually pin packages to a specific version to minimize build errors.

#### Creating a Release with Git Flow

This project uses git flow for releases. You can [find the latest version of
`git-flow` to install here](https://github.com/petervanderdoes/gitflow-avh).

Once it's installed, you'll need to enable `git flow` in your local version of
the repo by typing:

```sh
git flow init
```

Use the default values provided; `master` for the current release, `develop` for
the next release. Since the release process entails pulling changes from
`develop` into a release, then merging that into `master`, you should ensure
that `develop` builds successfully on Travis before commencing a release.

After you've enabled `git flow`, you can use the following commands to make a
release, replacing "1.2.3" with the version you're releasing and updating the
`CHANGELOG.md` and `package.json` to match that version.

```sh
git flow release start 1.2.3
vim CHANGELOG.md
vim src/package.json
git add CHANGELOG.md src/package.json
git commit -m "1.2.3"
git flow release publish 1.2.3
git flow release finish 1.2.3
```

After you've completed the `git flow` steps, you'll need to push the changes
from your local `master` and `develop` branches back to the main repository and
push the release tags to finalize the release:

```sh
git push origin master:master
git push origin develop:develop
git push --tags
```

Once you've pushed the tags, the new release will appear in the project's
["Releases" tab in GitHub](https://github.com/azavea/idb-osm-extraction-tool/releases).
There you can edit the tagged release to add release notes.

### Feature configuration
OSM tags are grouped into high level features in [the config file](src/js/src/featureConfig.js).
The configuration can take all values of a tag, only certain keys of a
tag, and multiple tags. A comprehensive example of a feature configuration is:

```javascript
{
        label: 'Shop/Business',
        entities: [
            { tag: 'shop' },
            { tag: 'craft' },
            { tag: 'office' },
            {
                tag: 'building',
                values: ['office'],
            },
            {
                tag: 'amenity',
                values: ['restaurant', 'cafe', 'internet_cafe', 'bar', 'biergarten', 'fast_food', 'marketplace', 'fuel'],
            },
        ],
    },
```

The OSM tags will be converted to an [Overpass API query](https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide) and fetched from that service.

### Code of Conduct 
---

### Authors
---

* [@kellyi](https://github.com/kellyi)
* [@mmcfarland](https://github.com/mmcfarland)
* [@rbreslow](https://github.com/rbreslow)
* [@eneedham](https://github.com/eneedham)
* [@rajadain](https://github.com/rajadain)
* [@alexlash](https://github.com/alexelash)

For full list see [Contributors](https://github.com/azavea/idb-osm-extraction-tool/graphs/contributors)

### License 
---

The Documentation of Support and Use of the software is licensed under Creative Commons IGO 3.0 Attribution-NonCommercial-NoDerivative (CC-IGO 3.0 BY-NC-ND)

The codebase of this repo uses [AM-331-A3 Software License](LICENSE.md).

### Limitation of responsibilities
---

The IDB is not responsible, under any circumstance, for damage or compensation, moral or patrimonial; direct or indirect; accessory or special; or by way of consequence, foreseen or unforeseen, that could arise:

I. Under any concept of intellectual property, negligence or detriment of another part theory; I

ii. Following the use of the Digital Tool, including, but not limited to defects in the Digital Tool, or the loss or inaccuracy of data of any kind. The foregoing includes expenses or damages associated with communication failures and / or malfunctions of computers, linked to the use of the Digital Tool.
