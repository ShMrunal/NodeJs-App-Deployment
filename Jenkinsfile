/* groovylint-disable NestedBlockDepth */
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
        stage('Test'){
            steps{
              const express = require('express');
              const path = require('path');
              const bodyParser = require('body-parser');
              const app = express();
              const PORT = 3000;
              const IP = '127.0.0.1';

              app.use(express.static('public')); // Serve static files
              app.use(bodyParser.json());

              app.get('/', (req, res) => {
                   res.sendFile(path.join(__dirname, '/public/index.html'));
                });

              app.post('/calculate', (req, res) => {
                const { input1, input2, operation } = req.body;
                const result = calculate(input1, input2, operation);
                res.json({ result });
                });

              function calculate(input1, input2, operation) {
                  if (input1 === '') {
                     return 'Invalid Operation';
                    }
 
                  let secondNumber = 0; // Declare it outside the if block to have function scope
                     if (input2 !== '') {
                      secondNumber = parseFloat(input2);
                    }

                 const firstNumber = parseFloat(input1);

                 switch (operation) {
                     case '+':
                         return firstNumber + secondNumber;
                     case '-':
                        return firstNumber - secondNumber;
                    case '*':
                        return firstNumber * secondNumber;
                    case '/':
                        if (secondNumber === 0) {
                          return "Cannot divide by 0";
                        }
                        return firstNumber / secondNumber;
                    case '√':
                        return Math.sqrt(firstNumber);
                    case '%':
                        return firstNumber / 100;
                    default:
                        return 'Invalid Operation';
                    }
                }

              module.exports = app;       // Exports the Express application
              module.exports.calculate = calculate;  // Also export the calculate function

              app.listen(PORT, IP, () => {
                 console.log(`Server running at http://${IP}:${PORT}`);
              });
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
        stage('Provision Minikube') {
            steps {
                ansiblePlaybook(
                    playbook: './provision_minikube.yaml',
                    inventory: 'localhost',
                    credentialsId: 'ansible_credentials'
                )
            }
        }
        stage('Deploy to Minikube') {
            steps {
                ansiblePlaybook(
                    playbook: './deploy-k8s-pods.yaml',
                    inventory: 'localhost',
                    credentialsId: 'ansible_credentials'
                )
            }
        }
    }
}
