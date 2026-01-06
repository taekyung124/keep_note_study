import React from "react";
import "./styles/global.scss";
import "./api/mock/notes.mock";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Memo from "./pages/Memo";
import Keep from "./pages/Keep";
import Pin from "./pages/Pin";
import Trash from "./pages/Trash";
import Search from "./pages/Search";

// 개발 환경(NODE_ENV !== 'production')에서만 Mock API 활성화
if (process.env.NODE_ENV === 'development') {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import("./api/mock/notes.mock");
	console.log('Mock API 활성화됨.');
}


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/Memo" />} />

				<Route path="/Memo" element={<Memo />} />
				<Route path="/Pin" element={<Pin />} />
				<Route path="/Keep" element={<Keep />} />
				<Route path="/Trash" element={<Trash />} />
				<Route path="/Search" element={<Search />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;