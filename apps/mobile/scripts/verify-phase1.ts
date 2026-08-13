import { buildSeed } from "../src/data/seed";
import { CIRCLES } from "../src/data/seed";
import { formatINR, formatCompactINR } from "../src/lib/format";
import { getTotalInvested } from "../src/lib/stats";
import {
	getCircleStreak,
	isStreakAtRisk,
	getPeriodProgress,
	getActiveMembers,
	getLastMilestone,
	getPersonalStreak,
	MILESTONES,
} from "../src/lib/stats";
import { getActiveChallenges } from "../src/services/challengeService";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
	const pass =
		JSON.stringify(actual) === JSON.stringify(expected);
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

// milestone: ₹25K crossed
const lastMilestone = getLastMilestone(thomasTotal);
check("Thomas last milestone = ₹25K", lastMilestone?.label, "₹25K");
check(
	"MILESTONES has ₹25K at index 1",
	MILESTONES[1]?.label,
	"₹25K"
);

// ---- Thomas streak: sarah due today → at risk, streak 2 ----
const thomas = db.circles.find((c) => c.id === CIRCLES.thomas)!;
const thomasMembers = getActiveMembers(db, CIRCLES.thomas);
const thomasStreak = getCircleStreak(thomas, thomasMembers, thomasCheckIns, now);
check("Thomas streak = 2", thomasStreak, 2);
check("Thomas streak at risk", isStreakAtRisk(thomas, thomasMembers, thomasCheckIns, now), true);

const thomasProgress = getPeriodProgress(thomas, thomasMembers, thomasCheckIns, now);
check("Thomas current invested = 4,000", thomasProgress.invested, 4000);
check("Thomas due = [sarah]", thomasProgress.dueUserIds, ["u_sarah"]);

// ---- Our Future: streak 4, individual amounts ----
const futureCheckIns = db.checkIns.filter((c) => c.circleId === CIRCLES.future);
const future = db.circles.find((c) => c.id === CIRCLES.future)!;
const futureMembers = getActiveMembers(db, CIRCLES.future);
const futureStreak = getCircleStreak(future, futureMembers, futureCheckIns, now);
check("Future streak = 4", futureStreak, 4);
const youFuture = futureMembers.find((m) => m.userId === "u_you");
const partnerFuture = futureMembers.find((m) => m.userId === "u_partner");
check("You contribute ₹5,000", youFuture?.contributionAmount, 5000);
check("Partner contributes ₹3,000", partnerFuture?.contributionAmount, 3000);

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

// ---- Challenges ----
const boysChallenges = getActiveChallenges(db, CIRCLES.boys);
check("Boys has no active challenges", boysChallenges.length, 0);
const completedBoysChallenge = db.challenges.find(
	(c) => c.circleId === CIRCLES.boys && c.status === "completed"
);
check("Boys has a completed 7-day challenge", completedBoysChallenge?.type, "7-day");

// ---- Format ----
check("formatINR(100000) = ₹1,00,000", formatINR(100000), "₹1,00,000");
check("formatCompactINR(100000) = ₹1L", formatCompactINR(100000), "₹1L");
check("formatCompactINR(500000) = ₹5L", formatCompactINR(500000), "₹5L");
check("formatCompactINR(25000) = ₹25K", formatCompactINR(25000), "₹25K");

// ---- Personal streak ----
const youBoysStreak = getPersonalStreak("u_you", boys.frequency, boysCheckIns, now);
check("You personal boys streak = 8", youBoysStreak, 8);

// ---- Reactions ----
const milestoneActivity = db.activities.find(
	(a) => a.circleId === CIRCLES.thomas && a.type === "milestone"
);
check("Milestone activity has 🚀 reactions", milestoneActivity?.reactions["🚀"]?.length, 2);

if (failures === 0) {
	console.log("\nAll phase-1 checks passed ✓");
} else {
	console.error(`\n${failures} check(s) failed ✗`);
	process.exit(1);
}