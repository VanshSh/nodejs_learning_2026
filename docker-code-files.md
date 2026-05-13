Docker Notes — docker-code-files-main

Purpose: Quick reference notes about Docker and container workflows used in this project. Follow the ordered topics the user provided.

1) Docker and Containerization in DevOps
- Containers package app + dependencies, delivering consistent runtime across environments.
- Benefits: lightweight isolation, fast start-up, immutable artifacts, reproducible builds, CI/CD friendliness.
- Use cases: microservices, testing, dev environments, continuous delivery.

2) Docker and VM
- VM: full OS virtualization (heavy). Docker: OS-level containers sharing host kernel (lightweight).
- Trade-offs: VMs provide stronger isolation; containers offer density and speed.
- When to choose: VMs for multi-kernel needs or untrusted tenants; containers for app delivery and scale.

3) Docker CLI and Commonly used commands
- docker version, docker info
- docker pull <image>, docker push <image>
- docker run -it --rm -p HOST:CONTAINER --name NAME IMAGE
- docker ps, docker ps -a, docker logs <container>
- docker exec -it <container> /bin/sh
- docker stop/start/restart <container>
- docker rm <container>, docker rmi <image>
- docker images, docker inspect <container|image>
- docker build -t name:tag .

4) Docker Images
- Immutable, layered filesystem built from read-only layers + writable container layer.
- Image = ordered set of layers (each Dockerfile instruction creates a layer).
- Tags: name:tag (use semantic tags and latest cautiously).

5) Working with Docker Images
- Pull: docker pull repo/image:tag
- List: docker images
- Inspect layers: docker history image
- Remove dangling images: docker image prune
- Save/load: docker save -o image.tar repo/image:tag; docker load -i image.tar

6) Creating Dockerfile
- Start from minimal base (e.g., node:18-alpine).
- Use COPY/ADD for files; RUN for commands; ENV for env vars; WORKDIR to set directory; EXPOSE for docs; CMD/ENTRYPOINT to set runtime.
- Multi-stage builds: use builder stage to compile, final stage to copy artifacts — reduces image size.
- Example minimal Node app:
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  CMD ["node", "index.js"]

7) Optimize docker image
- Use minimal base images (alpine, distroless).
- Multi-stage builds.
- Combine RUN commands to reduce layers; use --no-cache where appropriate.
- Remove build-time dependencies before final image.
- Use .dockerignore to exclude unnecessary files (node_modules, .git).
- Pin base image versions for reproducible builds.

8) Port mapping in Docker containers
- docker run -p HOST_PORT:CONTAINER_PORT Image
- Map TCP/UDP explicitly (e.g., -p 8080:80/tcp).
- Publish-all: -P maps exposed ports to random host ports.
- Use firewall and host binding safeguards (bind to 127.0.0.1 when needed).

9) DECP
- "DECP" unclear: treat as deployment/packaging concept. Commonly used acronyms: DCP/DEP.
- Note: clarify acronym when used; may refer to Docker Enterprise or deployment pipeline.

10) Publishing docker image
- Tag with registry: docker tag image repo/imagename:tag
- Login: docker login registry
- Push: docker push repo/imagename:tag
- Use CI pipelines to build+push images and sign or scan before publishing (Snyk, Trivy).

11) Running docker container safely
- Principle of least privilege: avoid running as root inside container; use USER in Dockerfile.
- Limit resources: --memory, --cpus.
- Read-only root filesystem: --read-only and use volumes for writable paths.
- Drop capabilities: --cap-drop=ALL then add required ones.
- Use seccomp and AppArmor profiles where applicable.

12) Docker Bridge Networking
- Default bridge network (bridge) for standalone containers.
- Containers on same bridge can communicate by IP; use --network to attach custom bridge.
- For DNS-based service resolution prefer user-defined bridge networks (they provide automatic name resolution).

13) Host Machine using for volumes
- Host bind mount: -v /host/path:/container/path (fast, good for dev; less portable)
- Use for logs, configs or local dev sync. Beware host permission and SELinux contexts.

14) Creating and Managing Custom Named volumes in docker for persistent
- Named volume: docker volume create myvol
- Use: -v myvol:/data or --mount source=myvol,target=/data
- List: docker volume ls; inspect: docker volume inspect myvol
- Remove: docker volume rm myvol (only when not in use)
- Use volumes for persistent DB data, caches — they are managed by Docker and portable across hosts (when using remote drivers).

15) Docker Compose
- Compose uses a YAML file (docker-compose.yml) to declare multi-container apps, networks and volumes.
- Key fields: services, image/build, ports, volumes, environment, depends_on, networks.
- Commands: docker-compose up, docker-compose up --build, docker-compose down, docker-compose logs -f.

16) Volume in docker compose
- Define named volumes under top-level volumes: { data: {} }
- Use service mapping: volumes: - data:/var/lib/postgresql/data
- Use external: true to reference host-managed volumes.

17) Docker build
- docker build -t name:tag .
- BuildKit: enable with DOCKER_BUILDKIT=1 for faster, efficient builds and caching.
- Use --no-cache to force rebuild; use --target for multi-stage partial builds.

18) Docker orchestration why it is required
- Single-host Docker is limited: need scheduling, service discovery, scaling, rolling updates.
- Orchestration solves: multi-host deployments, placement, self-healing, scaling, secrets management.

19) ECS Cluster to run docker containers
- AWS ECS (Fargate or EC2): cluster is logical grouping of compute (EC2 instances or serverless Fargate tasks).
- Define Task Definitions (container specs) and Services (desired count, load balancer attachment).
- Use IAM roles for task execution and access control.

20) Deploying ECS services with load balancer
- Create Target Group and ALB/NLB. Service definition references target group; set container port mapping and listener rules.
- Use health checks (path, interval) to allow safe deployments and autoscaling.
- Use blue/green or rolling deployments (via CodeDeploy or ECS deployment configuration) for zero-downtime.

Notes & Best Practices
- Keep images small and scanned for vulnerabilities.
- Automate build/publish in CI with immutable tags (commit SHA) and retention policies.
- Use secrets management (AWS Secrets Manager, SSM Parameter Store, or docker secrets for swarm).
- Document environment variables and configuration in repo or CI.

References
- Official Docker documentation: https://docs.docker.com
- AWS ECS docs: https://docs.aws.amazon.com/ecs

(End of notes)