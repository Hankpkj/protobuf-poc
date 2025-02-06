#!/usr/bin/env bash
set -e    # 에러 발생 시 즉시 스크립트 중단

echo "Running TS build..."

# brew install protobuf
# protoc 바이너리 경로 (OS마다 다를 수 있음)
PROTOC_BIN="/opt/homebrew/bin/protoc"

# .proto 파일이 위치한 디렉터리
PROTO_DIR="./src/main/proto"

# 산출물(생성된 .ts 파일) 위치를 build 디렉토리로 변경
OUT_DIR_TS="./build/generated/ts"

# ts-proto 플러그인
TS_PROTO_PLUGIN="./node_modules/.bin/protoc-gen-ts_proto"

# 혹시 이전 빌드 산출물이 남아있다면 정리
rm -rf $OUT_DIR_TS
mkdir -p $OUT_DIR_TS

# 실제 빌드 실행
$PROTOC_BIN \
  --plugin=protoc-gen-ts_proto=$TS_PROTO_PLUGIN \
  --ts_proto_out=$OUT_DIR_TS \
  --ts_proto_opt=esModuleInterop=true,forceLong=string,outputServices=grpc-js \
  -I=$PROTO_DIR \
  -I=./proto \
  $PROTO_DIR/*.proto

# 불필요한 google/protobuf 디렉토리 제거
rm -rf $OUT_DIR_TS/google

echo "TypeScript build done. Generated files are in $OUT_DIR_TS"
