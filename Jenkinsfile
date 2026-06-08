pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build frontend backend db'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d frontend backend db'
                sh '''
                    echo "Esperando que el backend este listo..."
                    for i in $(seq 1 20); do
                        if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
                            echo "Backend listo"
                            break
                        fi
                        echo "Intento $i/20 - esperando..."
                        sleep 3
                    done
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    echo "--- TEST 1: Health check ---"
                    curl -sf http://localhost:3000/health
                    echo ""
                    echo "--- TEST 2: GET /tasks ---"
                    curl -sf http://localhost:3000/tasks
                    echo ""
                    echo "Pruebas completadas exitosamente"
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker compose stop frontend backend db'
            }
        }
    }

    post {
        always {
            sh 'docker compose stop frontend backend db || true'
        }
        success {
            echo 'Pipeline ejecutado correctamente'
        }
        failure {
            echo 'Pipeline fallo - revisar logs'
        }
    }
}
