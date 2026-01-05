import React from "react";
import Masonry from "react-masonry-css";
import "./MasonryList.css";

interface MasonryListProps {
	children: React.ReactNode;
}

const MasonryList: React.FC<MasonryListProps> = ({ children }) => {
	const breakpointColumnsObj = {
		default: 5,    // 기본 5열
		1264: 4,       // 1100px 이하 4열
		1008: 3,        // 700px 이하 3열
		752: 2,        // 500px 이하 2열
	};

	return (
		<Masonry
			breakpointCols={breakpointColumnsObj}
			className="my-masonry-grid"
			columnClassName="my-masonry-grid_column"
		>
			{children}
		</Masonry>
	)
};

export default MasonryList;