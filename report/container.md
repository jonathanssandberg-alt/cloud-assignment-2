# Containerbaserad webbapplikation (AWS ECS)

## Molntjänster som används

- **Amazon ECR** – privat container registry där Docker-imagen för Node.js-applikationen lagras.
- **Amazon ECS (Fargate)** – kör containern som en serverless container-tjänst.
- **IAM** – används för roller och behörigheter till ECS (execution role) och Terraform.
- **VPC + subnät** – AWS default-VPC används för nätverk till Fargate-tasken.
- **Security Groups** – styr inkommande trafik till containern (port 3000).

## Komponenter i lösningen

- En **Node.js-webbapplikation** (Express) med två endpoints:
  - `GET /` – enkel “Hello from containerized app”.
  - `GET /health` – returnerar JSON med status och timestamp.
- **Docker-image** byggd från `Dockerfile` i `container/app`.
- **ECR-repository** där imagen pushas upp.
- **ECS Fargate-kluster** (`node-app-tf-cluster`) skapat via Terraform.
- **ECS Task Definition** (`node-app-tf-task`) som pekar på ECR-imagen och exponerar port 3000.
- **ECS Service** (`node-app-tf-service`) som håller minst 1 task igång och ger den en publik IP-adress.
- **Security Group** (`node-app-tf-sg`) som öppnar port 3000 utåt.

## Säkerhet

- **IAM-roller**:
  - En execution role för ECS-tasks med policyn `AmazonECSTaskExecutionRolePolicy` för att kunna hämta bilden från ECR och skriva loggar.
- **Network/Security**:
  - Tasken körs i AWS VPC.
  - Security group släpper endast in trafik på TCP port 3000 från internet (0.0.0.0/0) för att kunna testa applikationen.
- **Åtkomst till resurser**:
  - Hanteras via IAM och inte genom att lägga in AWS-nycklar i containern.

## IaC och automation (Terraform)

- Infrastruktur för containerlösningen definieras i **Terraform** i `container/infra`.
- Terraform-konfigurationen gör:
  - Skapar ECS-kluster, security group, IAM-roll, task definition och ECS-service.
  - Alla resurser skapas i regionen **eu-west-1**.
  - Image som används sätts via variabel (`container_image`) och pekar på ECR-imagen.
- Genom att köra:
  - `terraform init`
  - `terraform apply`
  kan samma miljö återskapas i ett nytt AWS-konto eller efter att resurser tagits bort.

## Verifiering av infrastrukturen

För att verifiera att infrastrukturen fungerar:

1. **Lokalt**:
   - Kör `node index.js` i `container/app` och testa `http://localhost:3000` och `/health`.
   - Bygg och kör Docker-containern lokalt med:
     - `docker build -t my-node-container-app .`
     - `docker run -p 3000:3000 my-node-container-app`

2. **I molnet (ECS Fargate)**:
   - Kör `terraform apply` i `container/infra` för att skapa kluster, service m.m.
   - Gå till ECS-konsolen, öppna `node-app-tf-cluster` → service → task → kopiera **Public IP**.
   - Testa:
     - `http://PUBLIC_IP:3000/`
     - `http://PUBLIC_IP:3000/health`
   - Om applikationen svarar korrekt vet vi att:
     - ECR-imagen används,
     - ECS-tasken kör,
     - Nätverk och security groups är rätt konfigurerade.
