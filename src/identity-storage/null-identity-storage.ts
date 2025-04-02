import { IdentityStorage } from "./identity-storage";

export class NullIdentityStorage implements IdentityStorage {
	save(_: string) {}

	get(): string | undefined {
		return;
	}
}
