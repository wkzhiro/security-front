#!/bin/bash

# Azure Container Registry Build and Push Script

# ACR情報
ACR_NAME="acrgeekprod"
ACR_LOGIN_SERVER="acrgeekprod.azurecr.io"

# イメージ名とタグ
NEXTJS_IMAGE_NAME="chatbot-app"
FASTAPI_IMAGE_NAME="chatbot-api"
TAG="latest"

# 色付き出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Azure Container Registry Build and Push Script${NC}"
echo "================================================"

# Docker がインストールされているか確認
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# ACRにログイン（Azure CLIを使用しない場合）
echo -e "${YELLOW}1. Logging in to Azure Container Registry...${NC}"
echo "Note: You'll need to provide the ACR password when prompted"
echo "ACR Username: acrgeekprod"

# Azure CLIがインストールされている場合
if command -v az &> /dev/null; then
    az acr login --name $ACR_NAME
else
    # Docker loginを使用
    docker login $ACR_LOGIN_SERVER -u $ACR_NAME
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to login to ACR${NC}"
    exit 1
fi

# Next.js アプリのビルドとプッシュ
echo -e "${YELLOW}2. Building Next.js application...${NC}"
docker build -t ${ACR_LOGIN_SERVER}/${NEXTJS_IMAGE_NAME}:${TAG} .
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build Next.js image${NC}"
    exit 1
fi

echo -e "${YELLOW}3. Pushing Next.js image to ACR...${NC}"
docker push ${ACR_LOGIN_SERVER}/${NEXTJS_IMAGE_NAME}:${TAG}
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push Next.js image${NC}"
    exit 1
fi

# FastAPI アプリのビルドとプッシュ
echo -e "${YELLOW}4. Building FastAPI application...${NC}"
cd ../fastapi-chatbot
docker build -t ${ACR_LOGIN_SERVER}/${FASTAPI_IMAGE_NAME}:${TAG} .
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build FastAPI image${NC}"
    exit 1
fi

echo -e "${YELLOW}5. Pushing FastAPI image to ACR...${NC}"
docker push ${ACR_LOGIN_SERVER}/${FASTAPI_IMAGE_NAME}:${TAG}
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push FastAPI image${NC}"
    exit 1
fi

# 成功メッセージ
echo -e "${GREEN}✅ Successfully built and pushed both images to ACR!${NC}"
echo ""
echo "Images pushed:"
echo "  - ${ACR_LOGIN_SERVER}/${NEXTJS_IMAGE_NAME}:${TAG}"
echo "  - ${ACR_LOGIN_SERVER}/${FASTAPI_IMAGE_NAME}:${TAG}"
echo ""
echo "To pull these images:"
echo "  docker pull ${ACR_LOGIN_SERVER}/${NEXTJS_IMAGE_NAME}:${TAG}"
echo "  docker pull ${ACR_LOGIN_SERVER}/${FASTAPI_IMAGE_NAME}:${TAG}"