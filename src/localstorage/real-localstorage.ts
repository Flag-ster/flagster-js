import { ILocalStorage } from "./localstorage";

export class LocalStorage implements ILocalStorage {
	private static KEY = "flagster";
	save(flags: Record<string, boolean>) {
		localStorage.setItem(LocalStorage.KEY, JSON.stringify(flags));
	}

	get(): Record<string, boolean> {
		const flags = localStorage.getItem(LocalStorage.KEY);
		return flags ? JSON.parse(flags) : {};
	}
}
