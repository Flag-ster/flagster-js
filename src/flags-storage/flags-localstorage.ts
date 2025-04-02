import { FlagsStorage } from "./flags-storage";

export class FlagsLocalStorage implements FlagsStorage {
	private static KEY = "flagster";
	save(flags: Record<string, boolean>) {
		localStorage.setItem(FlagsLocalStorage.KEY, JSON.stringify(flags));
	}

	get(): Record<string, boolean> {
		const flags = localStorage.getItem(FlagsLocalStorage.KEY);
		return flags ? JSON.parse(flags) : {};
	}
}
