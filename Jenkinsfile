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
                sh '''
                    docker stop project-ci-frontend project-ci-backend project-ci-db 2>/dev/null || true
                    docker rm project-ci-frontend project-ci-backend project-ci-db 2>/dev/null || true
                    docker network create ci-network 2>/dev/null || true
                    docker compose up -d frontend backend db
                '''
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
    }

    post {
        success {
            echo 'Pipeline ejecutado correctamente - app desplegada y corriendo'
        }
        failure {
            sh 'docker compose stop frontend backend db || true'
            echo 'Pipeline fallo - contenedores detenidos, revisar logs'
        }
    }
}
