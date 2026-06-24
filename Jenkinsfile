pipeline {
    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        BACKEND_URL  = 'http://project-ci-backend:3000'
        FRONTEND_URL = 'http://project-ci-frontend:80'
        COMPOSE_PROJECT_NAME = 'project-ci'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --pretty=format:"%h %s (%an)"'
            }
        }

        stage('Quality Gates') {
            parallel {
                stage('Backend Unit Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                            sh 'npm test'
                        }
                    }
                }
                stage('Frontend Unit Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build frontend backend db'
            }
        }

        stage('Deploy Stack') {
            steps {
                sh '''
                    docker stop project-ci-frontend project-ci-backend project-ci-db 2>/dev/null || true
                    docker rm   project-ci-frontend project-ci-backend project-ci-db 2>/dev/null || true
                    docker network create ci-network 2>/dev/null || true
                    docker compose up -d frontend backend db
                '''
                sh '''
                    echo "Esperando que el backend esté listo..."
                    for i in $(seq 1 20); do
                      if curl -sf ${BACKEND_URL}/health > /dev/null 2>&1; then
                        echo "✅ Backend listo"
                        break
                      fi
                      echo "Intento $i/20 - esperando..."
                      sleep 3
                    done
                '''
            }
        }

        stage('Integration Tests') {
            parallel {
                stage('Health Check') {
                    steps {
                        sh 'curl -sf ${BACKEND_URL}/health'
                    }
                }
                stage('GET /tasks') {
                    steps {
                        sh 'curl -sf ${BACKEND_URL}/tasks'
                    }
                }
                stage('Frontend reachable') {
                    steps {
                        sh 'curl -sfI ${FRONTEND_URL} | head -1'
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline ejecutado correctamente — app desplegada y verificada'
        }
        failure {
            echo '❌ Pipeline falló — recolectando logs y deteniendo contenedores'
            sh 'docker compose logs --tail=80 || true'
            sh 'docker compose stop frontend backend db || true'
        }
        always {
            echo "Build #${env.BUILD_NUMBER} sobre rama ${env.BRANCH_NAME ?: 'main'}"
        }
    }
}
