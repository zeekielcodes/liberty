"use client";

import React from "react";

export default function Modal({
	setShowModal,
	setAcceptConfirmation,
	recordVideo,
	stopRecording,
}: {
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	setAcceptConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
	recordVideo: () => Promise<void>;
	stopRecording: () => Promise<void>;
}) {
	const startAssesment = () => {
		setAcceptConfirmation(true);
		setShowModal(false);
		// Record video
		recordVideo();
		// Stop recording after 5 seconds
		setTimeout(() => {
			stopRecording();
		}, 5000);
	};
	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 z-50 flex justify-center items-center">
			<div className="w-1/3 rounded-3xl flex flex-col h-[400px] bg-white overflow-hidden">
				<div className="h-20 bg-main w-full text-white flex justify-between items-center p-4">
					<h1 className="font-regular">Start assessment</h1>
					<button
						onClick={() => setShowModal(false)}
						className="px-6 py-2 bg-white/30 rounded-lg text-base backdrop-blur-sm"
					>
						Close
					</button>
				</div>
				<div className="flex-1 bg-[#F5F3FF] flex-col justify-center items-center gap-3 text-center p-6">
					<h2 className="text-main text-lg md:text-xl font-semibold">
						Proceed to start assessment
					</h2>
					<p className="text-[#675E8B]">
						Kindly keep to the rules of the assessment and sit up, stay in front
						of your camera/webcam and start your assessment.
					</p>
				</div>
				<div className="flex justify-end p-6">
					<button
						onClick={startAssesment}
						className="px-6 py-2 text-white text-lg rounded-lg bg-main"
					>
						Proceed
					</button>
				</div>
			</div>
		</div>
	);
}
