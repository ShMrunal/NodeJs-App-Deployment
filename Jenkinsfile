pipeline {
    agent any
    environment {
      dockerImage = ''
      imagename = 'mrunalsh/nodejs-application-image'
      registryCredential = 'dockerhub_id'
    }
  stages {
    stage('Checkout') {
      steps {
        // git clone
        checkout scm
      }
    }
    stage('Build') {
      steps {
        // calling bild function from docker
        script {
          dockerImage = docker.build imagename
        }
      }
    }
    stage('Test') {
      steps {
        // access app
        script {
          dockerImage.inside {
            sh 'echo test pass'
          }
        }
      }
    }
    stage('Deploy Image') {
      steps {
        // sh 'docker push python-app-todo'
        script {
          docker.withRegistry('https://registry.hub.docker.com', registryCredential) {
            dockerImage.push("$BUILD_NUMBER")
            dockerImage.push('latest')
          }
        }
      }
    }
  }
}