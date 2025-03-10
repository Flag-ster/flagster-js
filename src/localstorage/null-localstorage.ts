import { ILocalStorage } from "./localstorage";

export class NullLocalStorage implements ILocalStorage {
	save() {}
	get() {
		return {};
	}
}
