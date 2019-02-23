# Build Production Images and push to Docker Hub
docker build -t czachman/multi-client:latest -t czachman/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t czachman/multi-server:latest -t czachman/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t czachman/multi-worker:latest -t czachman/multi-worker:$SHA -f ./worker/Dockerfile ./worker

# Push Images to Docker Hub
docker push czachman/multi-client:latest
docker push czachman/multi-server:latest
docker push czachman/multi-worker:latest

docker push czachman/multi-client:$SHA
docker push czachman/multi-server:$SHA
docker push czachman/multi-worker:$SHA

# Apply Configuration to Cluster
kubectl apply -f /k8s

# Imperatively set the latest image on each Deployment
kubectl set image deployments/client-deployment client=czachman/multi-client:$SHA # Tell client container to use this image
kubectl set image deployments/server-deployment server=czachman/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=czachman/multi-worker:$SHA
