# DevOps Continuous Integration / Continuous Deployment

First it was [Waterfall](https://en.wikipedia.org/wiki/Waterfall_model), next it was [Agile](https://en.wikipedia.org/wiki/Agile_software_development), and now it's [DevOps](https://aws.amazon.com/devops/what-is-devops/). This is how modern developers approach building great products. With the rise of DevOps has come the new methods of Continuous Integration, Continuous Delivery, (CI/CD) and Continuous Deployment. Conventional software development and delivery methods are rapidly becoming obsolete. Historically, in the agile age, most companies would deploy/ship software in monthly, quarterly, bi-annual, or even annual releases. Now we build and deploy multiple times a day.

**Continuous integration** focuses on blending the work products of individual developers together into a repository. Often, this is done several times each day, and the primary purpose is to enable early detection of integration bugs, which should eventually result in tighter cohesion and more development collaboration. The aim of **continuous delivery** is to minimize the friction points that are inherent in the deployment or release processes. Typically, the implementation involves automating each of the steps for build deployments such that a safe code release can be done—ideally—at any moment in time. **Continuous deployment** is a higher degree of automation, in which a build/deployment occurs automatically whenever a major change is made to the code.

## PIMS CI/CD

The PIMS project currently uses [GitHub Actions](https://github.com/features/actions) and [OpenShift](https://www.openshift.com/) to support CI/CD.

The general high-level workflow is as follows;

1. Fork Repo
1. Clone Repo
1. Submit PR to `main` branch
1. **GitHub Action** - Run Unit Tests
1. **GitHub Action** - Run Code Coverage ([CodeCov](https://codecov.io/gh/bcgov/PIMS))
1. **GitHub Action** - Build and Push Image to Imagesteam(Pull Request Number used as the Tag for the Image Build)
1. Merge PR into `main` branch
1.  **GitHub Action** - Run Deployement to DEV environment (deployes the image tag (PR number))
    - **GitHub Action** - Run **OpenShift** - Deployment Configuration ( API or APP based on the changes )
    - **GitHub Action** - Run **OpenShift** - Deployment Configuration DB Migration (if needed)
    - **OpenShift** - Orchestrate Pods
    - **OpenShift** - Orchestrate Containers
    - **OpenShift** - Orchestrate Storage
    - **OpenShift** - Orchestrate Routes


## Environments

There are four projects within OpenShift that are named, [TOOLS](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-tools/overview), [DEV](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-dev/overview), [TEST](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-test/overview), [PROD](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-prod/overview).
Three of which represent the environments where PIMS instances will reside.
The fourth is TOOLS which hosts tooling such as Jenkins, SonarQube and others.

### Environments

| Name | URL                                                                      | Description                            |
| ---- | ------------------------------------------------------------------------ | -------------------------------------- |
| DEV  | [pims-dev.pathfinder.gov.bc.ca](https://pims-dev.pathfinder.gov.bc.ca)   | The development environment for Developers     |
| TEST | [pims-test.pathfinder.gov.bc.ca](https://pims-test.pathfinder.gov.bc.ca) | The testing environment for QA and UAT |
| PROD | [pims.gov.bc.ca](https://pims.gov.bc.ca)                                 | The production environment             |

## Branching

Repository branches are used to manage development.
There is only one branch [main](https://github.com/bcgov/PIMS/tree/main).

| Branch        | Description                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
| `main`        | Default branch for all environments |
| `{pims-####}` | These branches are normally hosted in forked repositories and link to Jira Stories.  |

It's essential to note that deployments to DEV, TEST, and PROD environments are not dictated by separate branches. Instead, configurations rely on image tags for control and versioning.

#### DEV Environment

Deploying changes to the DEV environment involves a straightforward automated process. The workflows are named as follows:

- **API Image Build:** `DEV API: Image Build on PR`
- **APP Image Build:** `DEV APP: Image Build on PR`
- **API Deployment:** `DEV API: Image Deploy`
- **APP Deployment:** `DEV APP: Image Deploy`

Developers initiate the deployment by creating a pull request (PR) to merge their changes into the main branch. This action then triggers the GitHub workflow, specifically either the `DEV API-:Image Build on PR` or `DEV APP-:Image Build on PR` GitHub Action workflow, or both, depending on the nature of the file changes.

Once the PR is approved and ready to merge, the developer will merge the PR. The merging process automatically triggers the GitHub Action, further promoting the image tag in the DEV environment. This streamlined process ensures that the changes are promptly deployed to the DEV environment for initial quality assurance (QA) testing.

**Note:**
To ensure that the build image tag consistently reflects the latest code from the main branch along with any new work, it is mandatory to perform an "Update branch" before merging. The "Update branch" process involves merging the main branch into the temporary branch intended for merging (`dev`), ensuring that images are updated with the most recent code changes. This practice guarantees that the build image accurately represents the current state of the codebase before any merging occurs.


### TEST Environment Deployment

For changes to be promoted to the TEST environment, a manual trigger of the GitHub Action is essential. The workflows are named as follows:

- **API Deployment:** `TEST API: Image Deploy`
- **APP Deployment:** `TEST APP: Image Deploy`

#### API Deployment Workflow

The GitHub Action workflow for API deployment requires two inputs:

1. **API Image Tag:** This tag specifies the version of the API image to be deployed.
2. **Migration Image Tag:** Optional input; only required if there is a need to promote a migration image.

By providing these inputs, the GitHub Action orchestrates the deployment of the specified image tags to the TEST environment. The inclusion of a migration image tag is necessary only when migration image promotion is required.

#### APP Deployment Workflow

For APP changes, the GitHub Action workflow requires the following input:

- **APP Image Tag:** This tag is mandatory to initiate the workflow.

By specifying the APP image tag, the GitHub Action facilitates the deployment of the corresponding image to the TEST environment. This manual trigger and input-based approach ensure controlled and deliberate promotion of changes in the testing environment.


### PROD Environment Deployment

Similar to TEST, for PROD as well, a manual trigger of the GitHub Action is essential. The workflows are named as follows:

- **API Deployment:** `PROD API: Image Deploy`
- **APP Deployment:** `PROD APP: Image Deploy`

The GitHub Action workflow for API deployment in the PROD environment follows a similar pattern. It entails providing two inputs:

1. **API Image Tag:** This tag designates the version of the API image intended for deployment.
2. **Migration Image Tag:** An optional input, only necessary if there is a requirement to promote a migration image.


Similarly, the workflow for APP changes in the PROD environment adheres to a straightforward input-based process:

- **APP Image Tag:** This mandatory tag initiates the workflow, guiding the GitHub Action to facilitate the deployment of the corresponding image to the PROD environment.




## CI/CD Pipelines

There are four principle pipelines created to support the PIMS solution.
These pipelines are supported by Jenkins and OpenShift tools that enable automated build, test, review and deployment of new releases.

| Name                   |                  Destination                   | Trigger | Description                                                                                                  |
| ---------------------- | :--------------------------------------------: | :-----: | ------------------------------------------------------------------------------------------------------------ |
| cicd-pipeline          |  [DEV](https://pims-dev.pathfinder.gov.bc.ca)  |  Auto   | **Builds and deploys** the `dev` branch. Tags images with `dev`.                                             |
| cicd-dev-test-pipeline | [TEST](https://pims-test.pathfinder.gov.bc.ca) | Manual  | **Deploys** the build images tagged with `dev`.                                                              |
| cicd-test-pipeline     | [TEST](https://pims-test.pathfinder.gov.bc.ca) |  Auto   | **Builds and deploys** the `master` branch. Tags images with `test`. Tags images with `version (i.e. 1.0.2)` |
| cicd-prod-pipeline     |         [PROD](https://pims.gov.bc.ca)         | Manual  | **Deploys** the build images tagged with a specified `version`.                                              |

### Image Tagging

Images are tagged within OpenShift to identify their version, feature, or environment they should be deployed to.

Read more - [here](https://docs.openshift.com/container-platform/4.3/openshift_images/managing_images/tagging-images.html)

## Development Releases

During a Sprint there will be numerous commits to the `dev` branch. These will trigger the `cicd-pipeline` to build, test, scan, tag and deploy a new release to the **DEV** environment (optionally to the **TEST** environment).

![cicd-pipeline](ages/cicd-pipeline.png)

## Production Releases

Every Sprint a new releasable increment is developed.
These new releases will follow our [versioning](RSIONS) strategy (`1.0.0` = `[major.minor.patch]`).

When a releasable increment is ready a PR will be created to merge the `dev` branch into the `master` branch. Upon review and acceptance the `master` branch will be updated, which will inform the Jenkins pipeline to automatically build and deploy a new release to the **TEST** environment.

During the pipeline execution it will prompt a request for a _tag_ name. The tag should be the version number selected for the release (i.e. `1.2.4-alpha`). The pipeline will build, test and review the release and also add the `test` tag. The result will be deployed to the **TEST** environment.

After QA and UAT of the release in the **TEST** environment has been approved a _manually_ triggered production pipeline can be scheduled and run. The production pipeline will prompt for the appropriate version to release.

During the production release a full database backup will occur of the production data. This will be performed in the case of an immediate rollback being required after a failed deployment.

![cicd-prod-pipeline](ages/cicd-prod-pipeline.png)

### Production Release Steps

| Step | Name           | Destination | Description                                               |
| ---: | -------------- | ----------- | --------------------------------------------------------- |
|    1 | Merge `master` |             | Merge the PR                                              |
|    2 | Trigger        |             | Automatic trigger from source to run `cicd-test-pipeline` |
|    3 | Prompt         |             | Request `version` tag for the release                     |
|    4 | Build          |             | Build the source                                          |
|    5 | Test           |             | Run automated unit-tests                                  |
|    6 | Scan           |             | Scan code for issues                                      |
|    7 | Redirect       | MAINT       | Redirect traffic to the maintenance pod                   |
|    8 | Tag            |             | Tag branch with `test` and `version`                      |
|    9 | Deploy         | TEST        | Deploy `test` images to environment                       |
|   10 | Redirect       | TEST        | Remove maintenance pod redirection                        |
|   11 | QA             |             | Manually test and approve release                         |
|   12 | UAT            |             | Client test and approves release                          |
|   13 | Schedule       |             | Schedule a release to production                          |
|   14 | Trigger        |             | Manually initiate `cicd-prod-pipeline`                    |
|   15 | Prompt         |             | Request `version` tag for the release                     |
|   16 | Redirect       | MAINT       | Redirect traffic to the maintenance pod                   |
|   17 | Backup         |             | Backup the production database                            |
|   18 | Deploy         | PROD        | Deploy `version` images to environment                    |
|   19 | Redirect       | PROD        | Remove maintenance pod redirection                        |

### Rollback

If a failure occurs during the deployment phase it will be necessary to rollback the release images that were deployed and restore the database backup. During this time the redirect to the maintenance pod will remain until the rollback has successfully been implemented.

To support `after-the-fact` rollbacks it will be required to generate full migration scripts that allow for this <span style="color:red">**[out-of-scope]**</span>.

### Jenkins and Openshift (CI/CD Pods control)

We have installed a plugin OpenShift Jenkins Pipeline (DSL) Plugin which allows us to execute oc commands in the Jenkins master node and the agents/slave nodes. We will have to elevate the role binding of the user “system:serviceaccount:jcxjin-tools:jenkins” to be able to interact with the pods.

Examples:

- Turning the proxy caddy on/off

```
stage("Turn maintenance mode ON/OFF") {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject('projectName') { // Change project name
              openshift.raw('scale pod proxy-caddy-pod --replicas=1') // ON
              openshift.raw('scale pod proxy-caddy-pod --replicas=0') // OFF
            }
          }
        }
      }
    }
```

- Running shell commands in a pod

```
stage("Database backup") {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject('projectName') { // Change project name
              openshift.raw('rsh <pod_name> <command>')
            }
          }
        }
      }
    }
```

#### Resources:

https://docs.openshift.com/enterprise/3.2/dev_guide/migrating_applications/database_applications.html

https://www.howtogeek.com/50295/backup-your-sql-server-database-from-the-command-line/

https://docs.openshift.com/enterprise/3.1/dev_guide/ssh_environment.html
