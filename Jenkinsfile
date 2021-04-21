@Library('va.gov-devops-jenkins-lib') _
import org.kohsuke.github.GitHub

env.CONCURRENCY = 10


node('vetsgov-general-purpose') {
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']],
              parameters([choice(name: "cmsEnvBuildOverride",
                                 description: "Choose an environment to run a content only build. Select 'none' to run the regular pipeline.",
                                 choices: ["none", "dev", "staging"].join("\n"))])]);

  // Checkout vets-website code
  dir("vets-website") {
    checkout scm
    ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  }

  def commonStages = load "vets-website/jenkins/common.groovy"

  // setupStage
  dockerContainer = commonStages.setup()

  // stage('Lint|Security|Unit') {
  //   if (params.cmsEnvBuildOverride != 'none') { return }

  //   try {
  //     parallel (
  //       failFast: true,

  //       lint: {
  //         dockerContainer.inside(commonStages.DOCKER_ARGS) {
  //           sh "cd /application && npm --no-color run lint"
  //         }
  //       },

  //       // Check package.json for known vulnerabilities
  //       security: {
  //         retry(3) {
  //           dockerContainer.inside(commonStages.DOCKER_ARGS) {
  //             sh "cd /application && npm run security-check"
  //           }
  //         }
  //       },

  //       unit: {
  //         dockerContainer.inside(commonStages.DOCKER_ARGS) {
  //           sh "/cc-test-reporter before-build"
  //           sh "cd /application && npm --no-color run test:unit -- --coverage"
  //           sh "cd /application && /cc-test-reporter after-build -r fe4a84c212da79d7bb849d877649138a9ff0dbbef98e7a84881c97e1659a2e24"
  //         }
  //       }
  //     )
  //   } catch (error) {
  //     commonStages.slackNotify()
  //     throw error
  //   } finally {
  //     dir("vets-website") {
  //       step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
  //     }
  //   }
  // }

  // Perform a build for each build type
  envsUsingDrupalCache = commonStages.buildAll(ref, dockerContainer, params.cmsEnvBuildOverride != 'none')

  // Run E2E tests
  stage('Integration') {
    if (commonStages.shouldBail() || !commonStages.VAGOV_BUILDTYPES.contains('vagovprod')) { return }
    dir("vets-website") {
      try {
        if (commonStages.IS_PROD_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovprod')) {
          parallel (
            failFast: true,

            'nightwatch-e2e': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} up -d && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker"
            },          
            // 'nightwatch-accessibility': {
            //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p accessibility up -d && docker-compose -p accessibility run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker -- --env=accessibility"
            // },
            cypress: {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 vets-website --no-color run cy:test:docker"
            }
          )
        } else {
          parallel (
            failFast: true,

            'nightwatch-e2e': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} up -d && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker"
            },     
            cypress: {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e FORMS=false vets-website --no-color run cy:test:docker"
            },     
            'cypress-forms': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypressforms up -d && docker-compose -p cypressforms run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e FORMS=true vets-website --no-color run cy:test:docker"
            }
          )
        }
      } catch (error) {
        commonStages.slackNotify()
        throw error
      } finally {
        sh "docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} down --remove-orphans"
        // if (commonStages.IS_PROD_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovprod')) {
        //   sh "docker-compose -p accessibility down --remove-orphans"
        // }
        sh "docker-compose -p cypress-${env.EXECUTOR_NUMBER} down --remove-orphans"
        sh "docker-compose -p cypressforms down --remove-orphans"
        step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
      }
    }
  }

  commonStages.prearchiveAll(dockerContainer)

  commonStages.archiveAll(dockerContainer, ref);
  commonStages.cacheDrupalContent(dockerContainer, envsUsingDrupalCache);

  stage('Review') {
    if (commonStages.shouldBail()) {
      currentBuild.result = 'ABORTED'
      return
    }

    try {
      if (!commonStages.isReviewable()) {
        return
      }
      build job: 'deploys/vets-review-instance-deploy', parameters: [
        stringParam(name: 'devops_branch', value: 'master'),
        stringParam(name: 'api_branch', value: 'master'),
        stringParam(name: 'web_branch', value: env.BRANCH_NAME),
        stringParam(name: 'source_repo', value: 'vets-website'),
      ], wait: false
    } catch (error) {
      commonStages.slackNotify()
      throw error
    }
  }

  stage('Deploy dev or staging') {
    try {
      if (!commonStages.isDeployable()) { return }

      if (commonStages.IS_DEV_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovdev')) {
        commonStages.runDeploy('deploys/application-build-vagovdev', ref, false)
        commonStages.runDeploy('deploys/vets-website-vagovdev', ref, false)
      }

      if (commonStages.IS_STAGING_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovstaging')) {
        commonStages.runDeploy('deploys/application-build-vagovstaging', ref, false)
        commonStages.runDeploy('deploys/vets-website-vagovstaging', ref, false)
      }

    } catch (error) {
      commonStages.slackNotify()
      throw error
    }
  }
}
