import { FlagsStorage } from "./flags-storage";

export class NullLocalStorage implements FlagsStorage {
	save() {}
	get() {
		return {};
	}
}
