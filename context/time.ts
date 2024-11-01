import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TimeTracker {
	time: number;
	countdown: () => void;
	resetTime: () => void;
}

export const useTimeTracker = create<TimeTracker>()(
	devtools(
		persist(
			(set, get) => ({
				time: 60,
				countdown: () => {
					const state = get();
					set({ time: state.time - 1 });
				},

				resetTime: () => {
					set({ time: 60 });
				},
			}),
			{ name: "timetracking" }
		)
	)
);
