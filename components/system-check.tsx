"use client";

import React, { useEffect, useRef, useState } from "react";
import Lighting from "./system/lighting";
import InternetSpeed from "./system/internet-speed";
import AudioCheck from "./system/audio-check";
import WebCamCheck from "./system/webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { useTimeTracker } from "@/context/time";
import TimeUp from "./TimeUp";
import Modal from "./modal";

interface MediaDevice {
	deviceId: string;
	groupId: string;
	kind: string;
	label: string;
}

interface Prediction {
	bbox: number[];
	score: number;
	class: string;
}

export interface MediaStream {
	active: boolean;
	id: string;
}

export default function SystemCheck() {
	const { time } = useTimeTracker();
	const [webcamVisualStream, setVisualStreamData] =
		useState<MediaStream | null>(null);
	const [audioDevice, setAudioDevice] = useState<MediaStream | null>();
	const [networkStatus, setNetworkStatus] = useState(0);
	const [lightLevel, setLightLevel] = useState(0);
	const [recording, setRecording] = useState(false);
	const [predictions, setPredictions] = useState<Prediction[]>([]);
	const [showConfirmationModal, setShowModal] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const recorderRef = useRef<MediaRecorder | null>(null);
	const recordedSegments = useRef<Blob[]>([]);

	useEffect(() => {
		const getMicrophone = async () => {
			const audioDevice = await window.navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			setAudioDevice(audioDevice);
		};
		getMicrophone();
	}, []);

	useEffect(() => {
		const setUpWebCam = async () => {
			const visualStream = await window.navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
				},
				audio: true,
			});
			setVisualStreamData(visualStream);
			if (videoRef.current) {
				videoRef.current.srcObject = visualStream;
			}
		};
		setUpWebCam();
	}, []);

	useEffect(() => {
		const checkNetworkStatus = async () => {
			const connection = (navigator as any).connection;

			if (navigator.onLine) {
				setNetworkStatus(
					connection?.downlink < 1
						? 2
						: connection?.downlink > 1 && connection?.downlink < 5
						? 3
						: connection?.downlink > 5 && connection?.downlink < 20
						? 4
						: 5
				);
			} else {
				setNetworkStatus(0);
			}
		};

		window.addEventListener("online", checkNetworkStatus);
		window.addEventListener("offline", checkNetworkStatus);

		const interval = setInterval(checkNetworkStatus, 1000);

		return () => {
			window.removeEventListener("online", checkNetworkStatus);
			window.removeEventListener("offline", checkNetworkStatus);
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		const detectLightLevel = () => {
			if (!videoRef.current) return;

			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			canvas.width = videoRef.current.videoWidth || 300;
			canvas.height = videoRef.current.videoHeight || 200;

			if (!context) return;

			context.drawImage(videoRef.current, 0, 0);
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

			let total = 0;
			for (let i = 0; i < imageData.data.length; i += 4) {
				const r = imageData.data[i];
				const g = imageData.data[i + 1];
				const b = imageData.data[i + 2];
				total += (r + g + b) / 3;
			}

			const average = total / (imageData.data.length / 4);

			setLightLevel(average);
		};

		const interval = setInterval(detectLightLevel, 1000);
		return () => clearInterval(interval);
	}, [webcamVisualStream]);

	useEffect(() => {
		setPredictions([]);
		let isRunning = true;
		let model: cocoSsd.ObjectDetection | null = null;

		const loadModel = async () => {
			model = await cocoSsd.load();
			if (isRunning) {
				detectObjects();
			}
		};

		const detectObjects = async () => {
			if (!videoRef.current || !model || !webcamVisualStream) return;

			try {
				const predictions = await model.detect(videoRef.current);
				if (isRunning) {
					setPredictions(predictions);
					setTimeout(() => {
						requestAnimationFrame(detectObjects);
					}, 100);
				}
			} catch (err) {
				console.error(err);
			}
		};

		loadModel();

		return () => {
			isRunning = false;
		};
	}, [webcamVisualStream]);

	const recordVideo = async () => {
		if (!webcamVisualStream) return;

		recordedSegments.current = [];
		const mediaRecorder = new MediaRecorder(webcamVisualStream, {
			mimeType: "video/mp4",
		});

		mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				recordedSegments.current.push(event.data);
			}
		};

		mediaRecorder.onstop = () => {
			const blob = new Blob(recordedSegments.current, { type: "video/mp4" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			document.body.appendChild(a);
			a.style.display = "none";
			a.href = url;
			a.download = "recorded-video.mp4";
			a.click();
			URL.revokeObjectURL(url);
		};

		recorderRef.current = mediaRecorder;
		mediaRecorder.start();
		setRecording(true);
	};

	const stopRecording = async () => {
		const recorder = recorderRef.current;
		recorder?.stop();
		setRecording(false);
	};

	if (time <= 0) return <TimeUp />;

	return (
		<>
			{showConfirmationModal && <Modal setShowModal={setShowModal} />}
			<section className="bg-white rounded-xl p-4 md:p-6 w-full md:w-4/5 lg:w-3/5">
				<h2 className="text-lg font-semibold">System check</h2>
				<p className="text-[#4A4A68] text-sm my-3">
					We utilize your camera image to ensure fairness for all participants,
					and we also employ both your camera and microphone for a video
					questions where you will be prompted to record a response using your
					camera or webcam, so it's essential to verify that your camera and
					microphone are functioning correctly and that you have a stable
					internet connection. To do this, please position yourself in front of
					your camera, ensuring that your entire face is clearly visible on the
					screen. This includes your forehead, eyes, ears, nose, and lips. You
					can initiate a 5-second recording of yourself by clicking the button
					below.
				</p>

				{/* The camera preview and all other checks */}

				<div className="flex flex-col md:flex-row gap-10 my-8">
					<div
						className={`md:w-[300px] aspect-video h-auto border-2 ${
							recording ? "border-red-500" : "border-main"
						} rounded-xl overflow-hidden relative`}
					>
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="h-full object-cover w-full"
						>
							{" "}
						</video>
						{predictions.length > 0 && (
							<div className="absolute top-0 left-0 p-1 flex flex-col space-y-1">
								{predictions.map((prediction, index) => (
									<div
										key={index}
										className={`text-white px-2 py-1 text-xs rounded ${
											prediction.score < 0.4
												? "bg-red-600"
												: prediction.score < 0.6
												? "bg-yellow-600"
												: "bg-green-600"
										}`}
									>
										{prediction.class} detected (
										{(prediction.score * 100).toFixed(0)}%)
									</div>
								))}
							</div>
						)}
					</div>
					<div className="grid grid-cols-2 gap-4 w-52">
						<WebCamCheck webcamVisualStream={webcamVisualStream} />
						<InternetSpeed networkStatus={networkStatus} />
						<AudioCheck audioDevice={audioDevice} />
						<Lighting lightLevel={lightLevel} />
					</div>
				</div>
				<button
					onClick={recordVideo}
					className="bg-main text-white rounded px-6 py-2"
				>
					Take picture and continue
				</button>
				{recording && (
					<button
						className="bg-red-500 text-white px-3 py-2 rounded"
						onClick={stopRecording}
					>
						Stop recording
					</button>
				)}
			</section>
		</>
	);
}
