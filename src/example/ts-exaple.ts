// import (상태경로 예시)
import {
  LoginRequest,
  LoginResponse,
  type LoginRequest as LoginRequestSchema,
} from "../generated-js/messages";

// 혹은 npm 패키지로 publish 했다면
// import { LoginRequest, LoginResponse } from '@myorg/protos';

// REST API 요청/응답 (JSON) 예시
async function callLoginApi() {
  // 1) 프로토버퍼 객체 생성 (fromPartial 또는 create 사용)
  const requestMessage: LoginRequestSchema = LoginRequest.fromPartial({
    username: "alice",
    password: "secret123",
  });

  // 2) JSON 직렬화 (toJSON)
  //    실제로 fetch POST 바디에 넣을 땐, JS 객체를 그대로 JSON.stringify 해도 좋습니다.
  const requestBody = LoginRequest.toJSON(requestMessage);
  // requestBody = { username: 'alice', password: 'secret123' }

  // 3) fetch로 POST
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  // 4) 응답(JSON)을 받아서 -> LoginResponse 형태로 변환
  const responseData = await response.json();
  // responseData = { userId: 'some-id', success: true, message: 'Welcome!' }

  // 5) fromJSON으로 프로토버퍼 메시지에 매핑
  const loginResp = LoginResponse.fromJSON(responseData);

  if (loginResp.success) {
    console.log("Login success, user:", loginResp.userId);
  } else {
    console.log("Login fail:", loginResp.message);
  }
}

//  gRPC-like 바이너리 전송 예시
