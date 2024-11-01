"use client";

import { useTimeTracker } from "@/context/time";
import { formatTime } from "@/utils/time";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineTimerOff } from "react-icons/md";

export default function Nav() {
	const { time, countdown } = useTimeTracker();
	const [showTimer, setShowTimer] = useState(true);
	const [timeCounting, setTimeCounting] = useState(true);

	useEffect(() => {
		let intervalId: any;

		if (timeCounting && time > 0) {
			intervalId = setInterval(() => {
				countdown();
			}, 1000);
		} else if (time === 0) {
			setTimeCounting(false);
		}

		return () => clearInterval(intervalId);
	}, [timeCounting, time]);

	return (
		<header className="bg-white px-4 md:px-12 lg:px-32 py-4 sticky top-0 border-b-background border-b-2">
			<nav className="flex flex-col md:flex-row justify-between gap-3 md:items-center">
				<div className="flex gap-2 items-center">
					<Image src="/logo.png" alt="Logo" height={50} width={50} />
					<div>
						<h1 className="text-lg font-semibold">Frontend developer</h1>
						<p className="text-sm text-[#8C8CA1]">Skill assessment test</p>
					</div>
				</div>
				{time > 0 ? (
					<div className="flex gap-2 items-center self-end">
						{showTimer && (
							<div className="bg-[#ECE8FF] text-main rounded px-4 py-2 font-semibold text-xl flex gap-1 items-center">
								<Image
									src="/timer-start.svg"
									height={15}
									width={15}
									alt=""
									className="mr-2"
								/>
								{formatTime(time)} <span className="text-sm">time left</span>
							</div>
						)}
						<button
							onClick={() => setShowTimer(!showTimer)}
							className="bg-[#E6E0FF] p-1 rounded-full"
						>
							<Image src="/eye.svg" height={25} width={25} alt="" />
						</button>
					</div>
				) : (
					<div className="bg-red-500 text-white rounded px-4 self-end py-2 font-semibold text-xl flex gap-1 items-center">
						<MdOutlineTimerOff className="text-xl" /> Time up!
					</div>
				)}
			</nav>
		</header>
	);
}
