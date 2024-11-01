"use client";

import Image from "next/image";
import React from "react";

export default function Lighting({ lightLevel }: { lightLevel: number }) {
	const getProgressPercentage = () => {
		const percentage = Math.round((lightLevel / 255) * 100);
		const lightingPercentage = Math.min(100, percentage);
		return lightingPercentage;
	};

	return (
		<div className="h-[100px] w-[100px] flex flex-col gap-1 items-center justify-center bg-[#F5F3FF] rounded-lg relative">
			{lightLevel < 1 ? (
				<div className="h-[40px] w-[40px] bg-[#E6E0FF] p-2 rounded-full aspect-square">
					<Image src="/lamp-charge.svg" height={25} width={25} alt="" />
				</div>
			) : (
				<div
					className="h-[40px] w-[40px] flex justify-center items-center rounded-full aspect-square"
					style={{
						background: `conic-gradient(
                            #755AE2 ${getProgressPercentage()}%,
                            #E6E0FF ${getProgressPercentage()}% 100%
                          )`,
					}}
				>
					<div className="h-[35px] w-[35px] bg-[#E6E0FF] flex justify-center items-center rounded-full aspect-square">
						<Image src="/lamp-charge.svg" height={25} width={25} alt="" />
					</div>
				</div>
			)}
			<p className="text-[#4A4A68] text-xs">Lighting</p>
			<div className="h-6 w-6 flex justify-center items-center rounded-full bg-main absolute top-0 right-0"></div>
		</div>
	);
}
