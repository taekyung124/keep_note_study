// src/api/axiosInstance.ts
import axios from "axios";

// 💡 타입 정의를 활용하여 제네릭으로 응답 데이터의 타입을 지정할 수 있습니다.
const instance = axios.create({
	// Mock Adapter가 가로챌 기본 URL을 설정합니다.
	baseURL: "/",
	headers: {
		'Content-Type': 'application/json',
	}
});

export default instance;