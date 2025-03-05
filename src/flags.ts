export class Flags {
	private values: Map<string, boolean>;

	constructor(flags: Record<string, boolean>) {
		this.values = new Map(Object.entries(flags));
	}

	getAll() {
		return Object.fromEntries(this.values);
	}

	isEquals(other: Flags) {
		if (this.values.size !== other.values.size) return false;
		return this.values
			.keys()
			.every((key) => this.values.get(key) === other.values.get(key));
	}
}
