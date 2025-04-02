import { FlagsStorage } from "./flags-storage";

export class NullFlagsStorage implements FlagsStorage {
	save() {}
	get() {
		return {};
	}
}
