stage('Deploy to Minikube') {
            steps {
                ansiblePlaybook(
                    playbook: './deploy-k8s-pods.yaml',
                    inventory: 'localhost',
                    credentialsId: 'ansible-credentials'
                )
            }
        }
