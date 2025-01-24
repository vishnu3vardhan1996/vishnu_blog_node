pipeline {
    
    agent {
        label 'vishnu_blog'
    }

    stages {
        stage('Build') {
            steps {
                sh 'echo "Build Ok"'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Testing Ok"'
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo "Deployment Ok"'
            }
        }
        stage('Copy File') {
            steps {
                sh 'touch /Users/vishnu/This_PC/Projects/jenkins/nex.txt'
            }
        }
    }
}
