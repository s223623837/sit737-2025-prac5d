# SIT737 Prac 5.2D: Dockerization and Cloud Deployment

## Overview
This repository contains a Node.js microservice dockerized and published to Google Cloud Artifact Registry.

## Steps to Publish the Microservice
1. **Create Registry**:
   - Created `sit737-2025-prac5d-registry` in Google Cloud Artifact Registry (`australia-southeast2`).
2. **Build Image**:
   ```bash
   docker build -t sit737-microservice .