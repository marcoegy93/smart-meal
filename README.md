Voici la traduction complète du README en anglais :  

---

# Smart Meal - Installation Documentation

This repository contains the **Smart Meal** project, a modern application based on microservices using **Docker, Kubernetes, Helm, Istio, and various DevOps tools**.  
This guide will help you clone, install, and deploy the application on your local machine with **Minikube**.

---

## 🛠️ Prerequisites

Before running the application, make sure you have installed the following tools:

- **Docker**: Install Docker from [here](https://www.docker.com/get-started).
- **Kubernetes and Minikube**: Install Minikube following the steps below.
- **Helm**: Install Helm from [Helm.sh](https://helm.sh/).
- **.NET 8 SDK**: Download the .NET 8 SDK from [Microsoft](https://dotnet.microsoft.com/download/dotnet).
- **Node.js 20+**: Download Node.js from [Node.js](https://nodejs.org/).
- **Trivy**: A vulnerability scanner for Docker images. You can install it with the instructions below.

---

## 📦 Clone the repository

Clone the GitHub repository and navigate to the project folder:

```bash
git clone https://github.com/marcoegy93/smart-meal.git
cd smart-meal
```

---

## 🚀 Install Minikube on Linux

On Linux, you can download Minikube using the following command:

```bash
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo chmod +x minikube
sudo mv minikube /usr/local/bin/
```

### 4. **Verify Minikube installation**

After installing Minikube, you can verify that the installation was successful by running:

```bash
minikube version
```

This should display the installed Minikube version.

---

## 🚀 Start Minikube

Once Minikube is installed, you can start a local Kubernetes cluster. Run the following command to start Minikube with Docker as the driver:

```bash
minikube start --driver=docker
```

This will start a local Kubernetes cluster in a Docker virtual machine on your machine.

---

## 🔐 Install Sealed Secrets on Kubernetes

1. **Install the Sealed Secrets controller**:

   ```bash
   kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml
   ```

2. **Download and install `kubeseal`**:

   ```bash
   wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.27.3/kubeseal-0.27.3-linux-amd64.tar.gz
   tar -xvzf kubeseal-0.27.3-linux-amd64.tar.gz kubeseal
   sudo install -m 755 kubeseal /usr/local/bin/kubeseal
   ```

---

## 📡 Install Istio (Service Mesh)

1. **Download and install Istio**:

   ```bash
   curl -L https://istio.io/downloadIstio | sh -
   ISTIO_VERSION=$(ls -d istio-* | head -n 1)
   cd $ISTIO_VERSION
   export PATH=$PWD/bin:$PATH
   istioctl install --set profile=demo -f ../k8s/istio/istio-values.yaml -y
   cd ..
   rm -rf $ISTIO_VERSION
   ```

2. **Enable automatic Istio sidecar injection**:

   ```bash
   kubectl label namespace default istio-injection=enabled
   ```

---

## 🏗️ Install the SQL Server Database

### 📌 1️⃣ **Configure Minikube storage**
Ensure the SQL Server storage directory is properly configured:

```bash
minikube ssh
sudo mkdir -p /mnt/data/sqlserver
sudo chown -R 10001:0 /mnt/data/sqlserver
sudo chmod -R 770 /mnt/data/sqlserver
exit
```

### 📌 2️⃣ **Install SQL Server with Helm**

```bash
cd k8s
helm upgrade --install sqlserver ./helm-sqlserver
```

---

## 🛠️ Build and Push Docker Images

1. **Log in to Docker Hub**:

   ```bash
   docker login
   ```

2. **Build and push microservices**:

   ```bash
   cd ../smart-meal-back

   for service in items restaurant orders payment; do
     docker build -t DOCKER_USERNAME/smart-meal-${service}-service -f smart-meal-${service}-service/Dockerfile .
     docker tag DOCKER_USERNAME/smart-meal-${service}-service DOCKER_USERNAME/smart-meal-${service}-service:latest
     docker push DOCKER_USERNAME/smart-meal-${service}-service:latest
   done
   ```

3. **Build and push the frontend**:

   ```bash
   cd ../smart-meal-front
   docker build -t smart-meal-frontend-service .
   docker tag smart-meal-frontend-service:latest DOCKER_USERNAME/smart-meal-frontend-service:latest
   docker push DOCKER_USERNAME/smart-meal-frontend-service:latest
   ```

---

## 🔍 Scan Docker Images for Vulnerabilities with **Trivy**

Trivy is a vulnerability scanner for Docker images. Here’s how to install and use it:

### Install Trivy on your machine

1. **Download and install Trivy on Linux**:

   ```bash
   sudo apt-get update
   sudo apt-get install -y apt-transport-https
   curl -sfL https://github.com/aquasecurity/trivy/releases/download/v0.29.1/trivy_0.29.1_Linux-64bit.deb -o trivy.deb
   sudo dpkg -i trivy.deb
   rm trivy.deb
   ```

2. **Scan Docker images for vulnerabilities**:

   ```bash
   trivy image DOCKER_USERNAME/smart-meal-items-service:latest
   trivy image DOCKER_USERNAME/smart-meal-restaurant-service:latest
   trivy image DOCKER_USERNAME/smart-meal-orders-service:latest
   trivy image DOCKER_USERNAME/smart-meal-payment-service:latest
   trivy image smart-meal-frontend-service:latest
   ```

---

## 🚢 Deploy Microservices and Frontend

1. **Install the Gateway, certificates and RBAC**:

   ```bash
   cd ../k8s
   helm upgrade --install smart-meal-gateway ./helm-gateway
   helm upgrade --install helm-certificate ./helm-certificate
   helm upgrade --install helm-mtls ./helm-mtls
   helm upgrade --install helm-rbac ./helm-rbac
   ```

2. **Install the Microservices**:

   ```bash
   helm upgrade --install smart-meal-items-service ./helm-items-service
   helm upgrade --install smart-meal-restaurant-service ./helm-restaurant-service
   helm upgrade --install smart-meal-orders-service ./helm-orders-service
   helm upgrade --install smart-meal-payment-service ./helm-payment-service
   ```

3. **Install the Frontend**:

   ```bash
   helm upgrade --install smart-meal-frontend-service ./helm-frontend-service
   ```

---

## 🌐 Configure the `smart-meal.local` Domain

Manually add this line to your `/etc/hosts` file (Linux/Mac):

```
192.168.49.2 smart-meal.local
```

---

## ✅ Verify Deployment

1. **Check Kubernetes pods**:

   ```bash
   kubectl get pods
   ```

2. **Access the application**:

   ```bash
   https://smart-meal.local/30260
   ```

---

## 📊 **Adding Monitoring Tools with Prometheus and Grafana**  

### 📡 Installing Prometheus  

1. **Create a namespace for monitoring**:  

   ```bash
   kubectl create namespace monitoring
   ```

2. **Add the Prometheus repository and install Prometheus**:  

   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm install prometheus prometheus-community/prometheus --namespace monitoring -f ./k8s/monitoring/custom-values-prometheus.yaml
   ```

3. **Access Prometheus**:  

   ```bash
   minikube service prometheus-server -n monitoring
   ```

---

### 📊 Installing Grafana  

1. **Add the Grafana repository and install Grafana**:  

   ```bash
   helm repo add grafana https://grafana.github.io/helm-charts
   helm install grafana grafana/grafana --namespace monitoring --set adminPassword=marco -f ./k8s/monitoring/custom-values-grafana.yaml
   ```

2. **Access Grafana**:  

   ```bash
   minikube service grafana -n monitoring
   ```

3. **Add Prometheus as a data source in Grafana**:  

   - **URL**: `http://192.168.49.2:30090`  

4. **Add a Node_Exporter Dashboard** using **ID `1860`**.  

---

## 🚨 Configuring Alerts in Prometheus  

1. **Set up alert rules**:  

   ```bash
   helm upgrade --reuse-values -f kubernetes-alert-rules.yaml prometheus prometheus-community/prometheus -n monitoring
   ```

2. **Configure email notifications for AlertManager**:  

   ```bash
   helm upgrade --reuse-values -f alertmanager-config.yaml prometheus prometheus-community/prometheus -n monitoring
   ```

---

## 📦 Installing Loki and Promtail for Log Management  

1. **Install Loki**:  

   ```bash
   helm install loki grafana/loki -f grafana-loki-values.yaml -n monitoring
   ```

2. **Install Promtail**:  

   ```bash
   helm install promtail grafana/promtail -n monitoring
   kubectl --namespace monitoring port-forward daemonset/promtail 3101
   ```

3. **Add Loki as a data source in Grafana**:  

   - **URL**: `http://loki-gateway.monitoring.svc.cluster.local/`  

---

## 🎉 Congratulations!  

Your **Smart Meal** application is now fully deployed with Kubernetes, Minikube, and Helm, with integrated monitoring tools using Prometheus, Grafana, Loki, and Promtail. 🚀  