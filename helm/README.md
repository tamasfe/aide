# Frontend Helm Chart

This Helm chart deploys the GiroBet/ZambaBet frontend application on Kubernetes, following Helm best practices and providing extensive configurability.

## Features

- **Multi-environment support**: Separate values files for GiroBet and ZambaBet
- **Configurable image tags**: Easy version management through values
- **Multiple ingress controllers**: Support for Contour HTTPProxy and standard Kubernetes Ingress
- **Security**: Pod security contexts, non-root containers, read-only root filesystem
- **Scalability**: Horizontal Pod Autoscaler (HPA) support
- **High Availability**: Pod Disruption Budget and pod anti-affinity
- **Monitoring**: OpenTelemetry configuration and health checks

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- Cert-manager (if using TLS certificates)
- Contour or another ingress controller

## Installation

### Quick Start

1. **Install for GiroBet environment:**
   ```bash
   helm install girobet-frontend ./helm -f ./helm/values_girobet.yaml --set image.tag=v1.2.3
   ```

2. **Install for ZambaBet environment:**
   ```bash
   helm install zambabet-frontend ./helm -f ./helm/values_zambabet.yaml --set image.tag=v1.2.3
   ```

### Custom Installation

```bash
# Create a custom values file
cp helm/values.yaml my-values.yaml

# Edit my-values.yaml with your configuration
# Then install:
helm install my-frontend ./helm -f my-values.yaml
```

## Configuration

### Image Configuration

The image tag should be specified during installation to control which version is deployed:

```yaml
image:
  repository: 050295693931.dkr.ecr.eu-west-1.amazonaws.com/frontend
  tag: "v1.2.3"  # Specify your version here
  pullPolicy: IfNotPresent
```

### Domain Configuration

Configure your domains in the values file:

```yaml
config:
  public_domain: "your-domain.com"
  public_api_domain: "api.your-domain.com"
  internal_api_domain: "api.default.svc.cluster.local"
  site_name: "Your Site"
```

### Ingress Configuration

The chart supports multiple ingress types:

#### Contour HTTPProxy (default)
```yaml
ingress:
  enabled: true
  type: "contour-httpproxy"
  hosts:
    - host: "your-domain.com"
      paths:
        - path: /
          pathType: Prefix
```

#### Standard Kubernetes Ingress
```yaml
ingress:
  enabled: true
  type: "ingress"
  className: "nginx"
  hosts:
    - host: "your-domain.com"
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: your-tls-secret
      hosts:
        - "your-domain.com"
```

### Auto-scaling

Enable horizontal pod autoscaling:

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80
```

### Security Configuration

The chart includes security best practices:

```yaml
securityContext:
  capabilities:
    drop:
    - ALL
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  runAsUser: 1000

podSecurityContext:
  fsGroup: 2000
```

## Values Files

### Default values.yaml
Contains all available configuration options with sensible defaults.

### Environment-specific values
- `values_girobet.yaml`: GiroBet environment configuration
- `values_zambabet.yaml`: ZambaBet environment configuration

These files should only override necessary values from the default configuration.

## Upgrading

```bash
# Upgrade with new image tag
helm upgrade girobet-frontend ./helm -f ./helm/values_girobet.yaml --set image.tag=v1.2.4

# Upgrade with new configuration
helm upgrade girobet-frontend ./helm -f ./helm/values_girobet.yaml -f my-overrides.yaml
```

## Monitoring and Troubleshooting

### Check deployment status
```bash
kubectl get pods -l app.kubernetes.io/name=frontend
kubectl get ingress
kubectl get hpa
```

### View logs
```bash
kubectl logs -l app.kubernetes.io/name=frontend -f
```

### Check configuration
```bash
kubectl get configmap <release-name> -o yaml
```

## Advanced Configuration

### Custom Environment Variables

Add extra environment variables:

```yaml
extraEnvVars:
  - name: CUSTOM_VAR
    value: "custom-value"

extraEnvVarsFrom:
  - secretRef:
      name: my-secret
```

### Custom Volumes

Add additional volumes and mounts:

```yaml
extraVolumes:
  - name: cache-volume
    emptyDir: {}

extraVolumeMounts:
  - name: cache-volume
    mountPath: /app/cache
```

## Development

### Linting
```bash
helm lint ./helm
```

### Template Testing
```bash
helm template test ./helm -f ./helm/values_girobet.yaml
```

### Dry Run
```bash
helm install test ./helm -f ./helm/values_girobet.yaml --dry-run
```

## Contributing

1. Follow Helm best practices
2. Update documentation when adding new features
3. Test with both environment configurations
4. Ensure backward compatibility

## Support

For issues and questions:
- Check the [GitHub repository](https://github.com/GiroBet/girobet-frontend)
- Review Kubernetes and Helm documentation
- Check application logs for runtime issues