"use client";

import Image from "next/image";
import React, { useState } from "react";
import { IoCheckmarkOutline, IoWarningOutline } from "react-icons/io5";

export default function InternetSpeed({
	networkStatus,
}: {
	networkStatus: number;
}) {
	const getProgressPercentage = () => {
		const percentage = Math.round(networkStatus * 20);
		const speedpercent = Math.min(100, percentage);
		return speedpercent;
	};

	const getColorByPercentage = (percentage: number) => {
		if (percentage <= 30) return "#ef4444";
		if (percentage <= 50) return "#fbbf24";
		return "#10b981";
	};

	return (
		<div className="h-[100px] w-[100px] flex flex-col gap-1 items-center justify-center bg-[#F5F3FF] rounded-lg relative">
			{networkStatus < 1 ? (
				<div className="h-[40px] w-[40px] bg-[#E6E0FF] p-2 rounded-full aspect-square">
					<Image src="/wifi.svg" height={25} width={25} alt="" />
				</div>
			) : (
				<div
					className="h-[40px] w-[40px] flex justify-center items-center rounded-full aspect-square"
					style={{
						background: `conic-gradient(
                            ${getColorByPercentage(
															getProgressPercentage()
														)} ${getProgressPercentage()}%,
                            #e5e7eb ${getProgressPercentage()}% 100%
                        )`,
					}}
				>
					{getProgressPercentage() < 30 ? (
						<div className="h-[36px] w-[36px] rounded-full bg-red-200 flex justify-center items-center">
							<IoWarningOutline className="text-xl text-red-600" />
						</div>
					) : getProgressPercentage() < 50 ? (
						<div className="h-[36px] w-[36px] rounded-full bg-yellow-200 flex justify-center items-center">
							<IoWarningOutline className="text-xl text-yellow-600" />
						</div>
					) : (
						<div className="h-[36px] w-[36px] rounded-full bg-green-200 flex justify-center items-center">
							<IoCheckmarkOutline className="text-xl text-green-600" />
						</div>
					)}
				</div>
			)}
			<p className="text-[#4A4A68] text-xs">Internet Speed</p>
			<div
				className={`h-6 w-6 flex justify-center items-center rounded-full ${
					!networkStatus
						? "bg-main"
						: getProgressPercentage() < 30
						? "bg-red-600"
						: getProgressPercentage() < 50
						? "bg-yellow-600"
						: "bg-green-600"
				} absolute top-0 right-0`}
			></div>
		</div>
	);
}
