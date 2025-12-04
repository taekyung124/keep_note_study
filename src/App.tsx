import React from "react";
import "./styles/global.scss";
import "./api/mock/notes.mock"; // mock 서버 활성화
import Memo from "./pages/Memo";

// App.tsx 또는 index.tsx (진입점)

// 💡 개발 환경(NODE_ENV !== 'production')에서만 Mock API 활성화
if (process.env.NODE_ENV === 'development') {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import("./api/mock/notes.mock");
	console.log('Mock API 활성화됨.');
}


function App() {
	// ... 컴포넌트 로직
	return <Memo />;
}

export default App;