"use client";

import { useTimeTracker } from "@/context/time";
import React from "react";
import { MdOutlineTimerOff } from "react-icons/md";

export default function TimeUp() {
	const { resetTime } = useTimeTracker();
	return (
		<section className="bg-white min-h-[60vh] rounded-xl p-4 md:p-6 w-full md:w-4/5 lg:w-3/5 flex flex-col gap-22 justify-center items-center">
			<MdOutlineTimerOff className="text-[80px] text-red-500" />
			<h1 className="text-base md:text-lg my-3">Timeout!</h1>
			<button
				onClick={() => resetTime()}
				className="bg-red-500 text-white px-3 py-2 rounded"
			>
				Reset time
			</button>
		</section>
	);
}
