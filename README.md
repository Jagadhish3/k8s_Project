# Smart Public Safety & Citizen Complaint System

An enterprise-grade platform specifically built for high-scale, real-time public safety complaints targeting municipal bodies and citizen interaction.

## Architecture

* **Backend**: Spring Boot 3 + Java 17
* **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
* **Database**: MySQL 8.0
* **Data Flow**: REST APIs mapping complex Object Models
* **Real-time Engine**: WebSockets (STOMP) & SMTP Mail
* **Monitoring**: Prometheus, Alertmanager, Grafana
* **DevOps**: Docker, Docker Compose, Kubernetes

## Setup & Execution

### Running via Docker Compose (Recommended Local Strategy)

To initialize the entire clustered stack immediately, use the comprehensive definition files provided:

```bash
docker-compose up --build
```
This automatically boots:
- Full MySQL database and mounts local storage `db_data`
- The Spring Boot backend `http://localhost:8080`
- The React Frontend UI `http://localhost:5173`
- The Prometheus Metrics scrapper `http://localhost:9090`
- The Grafana Dashboards `http://localhost:3000`
- The AlertManager module `http://localhost:9093`

### Deploying via Kubernetes

A complete manifest is provided (`k8s-deployment.yaml`) that binds all resources to the `smart-safety` namespace.

```bash
kubectl apply -f k8s-deployment.yaml
```

To expose locally via minikube:
```bash
minikube service frontend-service -n smart-safety
```

## Security Posture
* Anonymous API routes securely exposed (`/api/complaints/public`).
* Identified endpoints are guarded via stateless **JWT** mechanism.
* Google **OAuth2** authentication stub constructed (`OAuth2LoginSuccessHandler`); inject `GOOGLE_CLIENT_ID` inside `application.properties` to map correctly.

## Frontend UI Overview
Leveraging Glassmorphism, Tailwind's dark utility features, and micro-animations via `framer-motion`:
- **Complaint Submission Form**: Tracks Geolocation latitude/longitude automatically. Option to submit entirely anonymously or logged in.
- **Citizen Dashboard**: Pulls the users individual complaint history sorted chronologically.
- **Live Admin Dashboard**: The core administrative command center. Updates seamlessly without refresh leveraging STOMP WebSockets when a citizen submits over the application.
