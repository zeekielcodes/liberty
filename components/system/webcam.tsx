"use client";

import React from "react";
import { MediaStream } from "../system-check";
import Image from "next/image";
import { IoCheckmarkOutline } from "react-icons/io5";

export default function WebCamCheck({
	webcamVisualStream,
}: {
	webcamVisualStream: MediaStream | null;
}) {
	return (
		<div className="h-[100px] w-[100px] flex flex-col gap-1 items-center justify-center bg-[#F5F3FF] rounded-lg relative">
			{webcamVisualStream?.active ? (
				<div className="h-[40px] w-[40px] bg-main p-[2px] rounded-full aspect-square">
					<div className="h-full w-full rounded-full border-white border-2 flex justify-center items-center">
						<IoCheckmarkOutline className="text-xl text-white" />
					</div>
				</div>
			) : (
				<div className="h-[40px] w-[40px] bg-[#E6E0FF] p-2 rounded-full aspect-square">
					<Image src="/monitor-recorder.svg" height={25} width={25} alt="" />
				</div>
			)}
			<p className="text-[#4A4A68] text-xs">Webcam</p>
			<div className="h-6 w-6 flex justify-center items-center rounded-full bg-main absolute top-0 right-0"></div>
		</div>
	);
}
