import { buildSeed, CIRCLES } from "../src/data/seed";
import { formatINR, formatCompactINR } from "../src/lib/format";
import { getActiveMembers, getTotalInvested } from "../src/lib/stats";
import {
	getCircleStreak,
	isStreakAtRisk,
	getPeriodProgress,
} from "../src/lib/stats";
import { createCircle, inviteMember } from "../src/services/circleService";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
	const pass = JSON.stringify(actual) === JSON.stringify(expected);
	if (!pass) {
		failures += 1;
		console.error(`✗ ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
	} else {
		console.log(`✓ ${label}`);
	}
}

const now = new Date();
const db = buildSeed();

// ---- Users ----
check("10 users seeded", db.users.length, 10);
check("CURRENT_USER exists", db.users.some((u) => u.id === "u_you"), true);

// ---- Circles ----
check("3 circles seeded", db.circles.length, 3);

// ---- Thomas Family: total must be ₹42,000 ----
const thomasCheckIns = db.checkIns.filter((c) => c.circleId === CIRCLES.thomas);
const thomasTotal = getTotalInvested(thomasCheckIns);
check("Thomas total = ₹42,000", thomasTotal, 42000);

const thomas = db.circles.find((c) => c.id === CIRCLES.thomas)!;
const thomasMembers = getActiveMembers(db, CIRCLES.thomas);
const thomasStreak = getCircleStreak(thomas, thomasMembers, thomasCheckIns, now);
check("Thomas streak = 2", thomasStreak, 2);
check("Thomas streak at risk", isStreakAtRisk(thomas, thomasMembers, thomasCheckIns, now), true);

const thomasProgress = getPeriodProgress(thomas, thomasMembers, thomasCheckIns, now);
check("Thomas current invested = 4,000", thomasProgress.invested, 4000);
check("Thomas due = [sarah]", thomasProgress.dueUserIds, ["u_sarah"]);

// ---- Our Future: streak 4, same amount for everyone ----
const futureCheckIns = db.checkIns.filter((c) => c.circleId === CIRCLES.future);
const future = db.circles.find((c) => c.id === CIRCLES.future)!;
const futureMembers = getActiveMembers(db, CIRCLES.future);
const futureStreak = getCircleStreak(future, futureMembers, futureCheckIns, now);
check("Future streak = 4", futureStreak, 4);
check("Future contribution = ₹4,000", future.contributionAmount, 4000);

// ---- The Boys: daily, streak 7, john+arjun due today ----
const boysCheckIns = db.checkIns.filter((c) => c.circleId === CIRCLES.boys);
const boys = db.circles.find((c) => c.id === CIRCLES.boys)!;
const boysMembers = getActiveMembers(db, CIRCLES.boys);
const boysStreak = getCircleStreak(boys, boysMembers, boysCheckIns, now);
check("Boys streak = 7", boysStreak, 7);
check("Boys streak at risk", isStreakAtRisk(boys, boysMembers, boysCheckIns, now), true);
const boysProgress = getPeriodProgress(boys, boysMembers, boysCheckIns, now);
check("Boys due = [john, arjun]", boysProgress.dueUserIds, ["u_john", "u_arjun"]);

// maya invited
const maya = db.members.find((m) => m.circleId === CIRCLES.boys && m.userId === "u_maya");
check("Maya is invited", maya?.status, "invited");

// ---- Format ----
check("formatINR(100000) = ₹1,00,000", formatINR(100000), "₹1,00,000");
check("formatCompactINR(100000) = ₹1L", formatCompactINR(100000), "₹1L");
check("formatCompactINR(500000) = ₹5L", formatCompactINR(500000), "₹5L");
check("formatCompactINR(25000) = ₹25K", formatCompactINR(25000), "₹25K");

// ---- Create circle: total = amount × periods ----
const monthly = createCircle(buildSeed(), "u_you", {
	name: "Test Circle",
	type: "friends",
	frequency: "monthly",
	contributionAmount: 5000,
	durationMonths: 24,
});
check("Monthly total = amount × months", monthly.circle.targetAmount, 5000 * 24);
check("Monthly contribution stored", monthly.circle.contributionAmount, 5000);

const daily = createCircle(buildSeed(), "u_you", {
	name: "Daily Circle",
	type: "friends",
	frequency: "daily",
	contributionAmount: 100,
	durationMonths: 1,
});
const days = Math.round(
	(Date.parse(daily.circle.targetDate) - Date.now()) / 86400000,
);
check("Daily total = amount × days", daily.circle.targetAmount, 100 * days);
check("Owner member created as active", 
	daily.db.members.find((m) => m.circleId === daily.circle.id)?.status,
	"active");

// ---- Invite ----
const invited = inviteMember(monthly.db, monthly.circle.id, "u_dad");
check(
	"Invite creates invited member",
	invited.db.members.find((m) => m.circleId === monthly.circle.id && m.userId === "u_dad")
		?.status,
	"invited",
);
check(
	"Invite creates a notification",
	invited.db.notifications.filter((n) => n.userId === "u_dad").length,
	1,
);

if (failures === 0) {
	console.log("\nAll checks passed ✓");
} else {
	console.error(`\n${failures} check(s) failed ✗`);
	process.exit(1);
}
