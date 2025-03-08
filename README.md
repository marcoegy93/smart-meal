# Smart Meal - Documentation d'installation

Ce dépôt contient le projet **Smart Meal**, une application moderne basée sur des microservices utilisant Docker, Kubernetes, Helm, Istio et divers outils DevOps. Ce guide vous aidera à cloner, installer et déployer l'application sur votre machine locale avec **Minikube**.

---

## 🛠️ Prérequis

Avant de lancer l'application, assurez-vous d'avoir installé les outils suivants :

- **Docker** : Installez Docker depuis [ici](https://www.docker.com/get-started).
- **Kubernetes et Minikube** : Installez Minikube en suivant [cette documentation](https://minikube.sigs.k8s.io/docs/).
- **Helm** : Installez Helm depuis [Helm.sh](https://helm.sh/).
- **.NET 8 SDK** : Téléchargez le SDK .NET 8 depuis [Microsoft](https://dotnet.microsoft.com/download/dotnet).
- **Node.js 20+** : Téléchargez Node.js depuis [Node.js](https://nodejs.org/).

---

## 📦 Cloner le dépôt

Clonez le dépôt GitHub et accédez au dossier du projet :

```bash
git clone https://github.com/marcoegy93/smart-meal.git
cd smart-meal
```

---

## 🔐 Installer Sealed Secrets sur Kubernetes

1. **Installer le contrôleur Sealed Secrets** :

   ```bash
   kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml
   ```

2. **Télécharger et installer `kubeseal`** :

   ```bash
   wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.27.3/kubeseal-0.27.3-linux-amd64.tar.gz
   tar -xvzf kubeseal-0.27.3-linux-amd64.tar.gz kubeseal
   sudo install -m 755 kubeseal /usr/local/bin/kubeseal
   ```

---

## 📡 Installer Istio (Service Mesh)

1. **Télécharger et installer Istio** :

   ```bash
   curl -L https://istio.io/downloadIstio | sh -
   ISTIO_VERSION=$(ls -d istio-* | head -n 1)
   cd $ISTIO_VERSION
   export PATH=$PWD/bin:$PATH
   istioctl install --set profile=demo -f ../k8s/istio/istio-values.yaml -y

   ```

2. **Activer l'injection automatique des side-cars Istio** :

   ```bash
   kubectl label namespace default istio-injection=enabled
   ```

---

## 🏗️ Installation de la Base de Données SQL Server

### 📌 1️⃣ **Configurer le stockage de Minikube**
Assurez-vous que le répertoire de stockage SQL Server est bien configuré :

```bash
minikube ssh
sudo ls -ld /mnt/data/sqlserver
sudo mkdir -p /mnt/data/sqlserver  # Si le répertoire n'existe pas
sudo chown -R 10001:0 /mnt/data/sqlserver
sudo chmod -R 770 /mnt/data/sqlserver
```

### 📌 2️⃣ **Installer SQL Server avec Helm**

```bash
cd k8s
helm upgrade --install sqlserver ./helm-sqlserver
```

---

## 🛠️ Build et Push des Images Docker

1. **Se connecter à Docker Hub** :

   ```bash
   docker login
   ```

2. **Build et push des microservices** :

   ```bash
   cd smart-meal-back

   for service in items restaurant orders payment; do
     docker build -t marcobalamon/smart-meal-${service}-service -f smart-meal-${service}-service/Dockerfile .
     docker tag marcobalamon/smart-meal-${service}-service marcobalamon/smart-meal-${service}-service:latest
     docker push marcobalamon/smart-meal-${service}-service:latest
   done
   ```

3. **Build et push du frontend** :

   ```bash
   cd ../smart-meal-front
   docker build -t marcobalamon/smart-meal-frontend-service .
   docker tag marcobalamon/smart-meal-frontend-service:latest
   docker push marcobalamon/smart-meal-frontend-service:latest
   ```

---

## 🚢 Déploiement des Microservices et du Frontend

1. **Installer la Gateway** :

   ```bash
   cd k8s
   helm upgrade --install smart-meal-gateway ./helm-gateway
   ```

2. **Installer les Microservices** :

   ```bash
   helm upgrade --install smart-meal-items-service ./helm-items-service
   helm upgrade --install smart-meal-restaurant-service ./helm-restaurant-service
   helm upgrade --install smart-meal-orders-service ./helm-orders-service
   helm upgrade --install smart-meal-payment-service ./helm-payment-service
   ```

3. **Installer le Frontend** :

   ```bash
   helm upgrade --install smart-meal-frontend-service ./helm-frontend-service
   ```

---

## ✅ Vérification du Déploiement

1. **Vérifier les pods Kubernetes** :

   ```bash
   kubectl get pods
   ```

2. **Lister les services exposés** :

   ```bash
   minikube service list
   ```

3. **Accéder à l'application** :

   ```bash
   minikube service smart-meal-gateway --url
   ```

---

## 🔍 Dépannage

Si vous rencontrez des problèmes, essayez :

1. **Vérifier les logs d’un pod** :

   ```bash
   kubectl logs <nom_du_pod>
   ```

2. **Vérifier les erreurs Helm** :

   ```bash
   helm list
   ```

3. **Redémarrer Minikube** :

   ```bash
   minikube delete
   minikube start --driver=docker
   ```

4. **Consulter la documentation** :
   - [Kubernetes](https://kubernetes.io/docs/)
   - [Helm](https://helm.sh/docs/)
   - [Minikube](https://minikube.sigs.k8s.io/docs/)

---

## 🎉 Félicitations !

Votre application **Smart Meal** est maintenant déployée avec Kubernetes, Minikube et Helm. 🚀