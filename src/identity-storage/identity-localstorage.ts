import { IdentityStorage } from "./identity-storage";

export class IdentityLocalStorage implements IdentityStorage {
	private static KEY = "flagster-identity";

	save(identity: string) {
		localStorage.setItem(IdentityLocalStorage.KEY, identity);
	}

	get(): string | undefined {
		return localStorage.getItem(IdentityLocalStorage.KEY) || undefined;
	}
}
