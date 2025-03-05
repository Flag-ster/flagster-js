export class Flags {
	private values: Record<string, boolean>;

	constructor(flags: Record<string, boolean> = {}) {
		this.values = flags;
	}

	getAll() {
		return this.values;
	}

	isEquals(other: Flags) {
		const hasDivergentKeys =
			Object.keys(this.values).length !== Object.keys(other.values).length;
		if (hasDivergentKeys) return false;
		return Object.keys(this.values).every(
			(key) => this.values[key] === other.values[key],
		);
	}
}
