import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DB } from "../types";
import { buildSeed } from "../data/seed";

const DB_KEY = "blink.db.v1";

export async function loadDB(): Promise<DB> {
	const raw = await AsyncStorage.getItem(DB_KEY);
	if (!raw) {
		const seed = buildSeed();
		await AsyncStorage.setItem(DB_KEY, JSON.stringify(seed));
		return seed;
	}
	try {
		return JSON.parse(raw) as DB;
	} catch {
		const seed = buildSeed();
		await AsyncStorage.setItem(DB_KEY, JSON.stringify(seed));
		return seed;
	}
}

export async function saveDB(db: DB): Promise<void> {
	await AsyncStorage.setItem(DB_KEY, JSON.stringify(db));
}

export async function clearDB(): Promise<void> {
	await AsyncStorage.removeItem(DB_KEY);
}