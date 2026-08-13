# BlinkMoney — Wealth Circle
## Product Requirements Document (PRD)

> **Product thesis:** Your money is personal. Your habits don't have to be.
>
> Wealth Circle lets families, couples, and friends build better investing habits together without pooling their money.

---

## 1. Assignment Context

The assignment asks for a new React Native mobile experience in one of four domains. The selected domain is **Referral**, defined as:

> Makes a user pull another user in.

The proposed feature is **Wealth Circle**: a private social investing space where users create circles with family, partners, or friends and build financial habits together.

The experience should focus on:
- Strong product thinking
- A polished React Native prototype
- Meaningful interactions and animations
- Clear navigation
- Edge cases and loading states
- Reusable components
- Practical financial-domain behavior

### Prototype scope

A real backend is **not required** for this assignment.

Use:
- Local JSON/mock data
- Local state management
- Optional AsyncStorage for persistence
- A mocked service layer that behaves like an API

Do **not** spend assignment time building:
- Authentication
- Database
- Payment infrastructure
- Real investment execution
- Real contacts integration
- Real push notifications
- Real-time sockets
- Referral tracking infrastructure

The prototype should nevertheless be designed so the mocked service layer can later be replaced by real APIs without changing the UI.

---

# 2. Product Vision

## Build Wealth Together

Wealth Circle turns BlinkMoney from an individual investing product into a lightweight social investing experience.

Users can:

1. Create a private Wealth Circle
2. Invite family, a partner, or friends
3. Define a shared investing goal
4. Configure contribution frequency and amounts
5. Check in when they complete their investment
6. See activity from other members
7. Encourage members who have not contributed
8. Maintain a group investing streak
9. Celebrate milestones
10. Generate shareable group and personal stats cards

### Core principle

**Members invest independently.**

Wealth Circle does **not** represent a pooled investment account.

Each person's investments remain their own. The group provides:
- Accountability
- Habit formation
- Shared goals
- Social reinforcement
- Progress visibility
- Celebration

---

# 3. Target Circle Types

## Family

Example:

**Thomas Family**

Members:
- Dad
- Mom
- Tomcy
- Sarah

Potential use cases:
- Family wealth milestone
- Emergency fund
- Education
- Long-term investing

Default behavior:
- Monthly contributions
- Equal contribution by default

---

## Couple

Example:

**Our Future 💛**

Members:
- You
- Partner

Potential use cases:
- Home
- Wedding
- Travel
- Future planning
- Long-term wealth

Default behavior:
- Individual contribution amounts

Example:

```text
You       ₹5,000/month
Partner   ₹3,000/month

Combined  ₹8,000/month
```

---

## Friends

Example:

**The Boys**

Potential use cases:
- Build a consistent investing habit
- 30-day investment challenge
- Travel goal
- Collective milestone

Default behavior:
- Individual contributions
- Habit/streak oriented

---

# 4. Core User Journey

```text
Create Circle
     ↓
Choose Circle Type
     ↓
Name Circle
     ↓
Set Goal
     ↓
Configure Contributions
     ↓
Invite Members
     ↓
Circle Home
     ↓
Members Invest / Check In
     ↓
Activity Feed
     ↓
Nudge / Encourage
     ↓
Group Streak
     ↓
Milestone
     ↓
Share Stats Card
     ↓
Someone discovers BlinkMoney
     ↓
New Circle / New Member
```

The intended loop is:

**Create → Invite → Act → See → Encourage → Milestone → Share → Invite**

---

# 5. Information Architecture

## Main app

```text
Home
Circles
Profile / More
```

## Circle

```text
Circle
├── Overview
├── Feed
├── Members
└── More
```

---

# 6. Circle Overview

The Overview screen is the primary experience.

Example:

```text
Thomas Family

₹42,000 / ₹1,00,000
████████░░░░░
42%

This month
₹7,000 / ₹10,000
70%

🔥 Circle streak
18 days

Members
Dad       ✓ Invested
Mom       ✓ Invested
Tomcy     ✓ Invested
Sarah     ○ Due
```

Primary actions:

- Invest / Check In
- Nudge member
- View Feed
- View Members
- View Stats
- Share

---

# 7. Circle Creation Flow

## Step 1 — Choose Circle Type

Question:

**Who are you investing with?**

Options:

### Family
Build wealth together as a family.

### Couple
Build your future together.

### Friends
Build a better investing habit.

---

## Step 2 — Circle Name

Examples:

- Thomas Family
- Our Future
- The Boys
- Goa 2027

Input:

`My Wealth Circle`

---

## Step 3 — Goal

Question:

**What are you building toward?**

Options:
- Emergency fund
- Home
- Travel
- Education
- Retirement
- Wealth milestone
- Custom

Fields:
- Target amount
- Target date

Example:

```text
Goal: Family Wealth
Target: ₹10,00,000
Date: December 2027
```

---

# 8. Contribution Configuration

## Frequency

```text
Daily
Monthly
```

---

## Contribution Modes

### Equal Contribution

Everyone contributes the same amount.

Example:

```text
₹1,000 / month per person
```

### Individual Contribution

Each member chooses their own amount.

Example:

```text
You       ₹2,000
Mom       ₹1,000
Dad       ₹5,000
```

### Group Target

The circle sets a collective contribution target.

Example:

```text
Group target: ₹10,000/month
```

Each member decides how much they contribute.

---

# 9. Adding Members

Users can add members through:

### Share Invite Link

Example:

```text
blinkmoney.in/join/thomas-family
```

Actions:
- Copy link
- Share

For the prototype, sharing can be mocked.

---

### Search Username

Use a static JSON user directory.

Example:

```text
@rahul
@sarah
@john
```

---

### Phone / Email / Contacts

For the prototype:
- Show the option
- Use mock/static users
- Do not implement real contacts integration

---

# 10. Member States

A member can have:

```text
Active
Invited
Pending
```

Example:

```text
Members

Tomcy     ✓ Active
Mom       ✓ Active
Dad       🟡 Invited
Sarah     ✓ Active
```

Pending actions:
- Resend invite
- Copy invite link

---

# 11. Member Roles

## Owner

Can:
- Edit circle
- Change settings
- Add/remove members
- Create challenges
- Edit goals

## Member

Can:
- Check in
- View feed
- React
- View group progress
- Invite members
- Leave circle

Admin role is not required for the prototype.

---

# 12. Daily / Monthly Check-In

The primary behavioral loop.

## Daily Circle

Example:

```text
Today's investment

₹100

[ Invest today ]
```

After completion:

```text
✓ You're checked in

3/4 members invested today

Keep the circle going 🔥
```

---

## Monthly Circle

Example:

```text
August

₹8,000 / ₹12,000
████████████░░

3 / 4 members completed
```

Member status:

```text
Tomcy      ✓
Mom        ✓
Dad        ✓
Sarah      ○
```

Sarah:

```text
₹1,000 remaining this month
```

CTA:

**Complete investment**

---

## Important prototype distinction

The prototype should use language such as:

- "Mark as invested"
- "Complete investment"
- "Check in"

It should not imply that the prototype is actually executing a financial transaction.

---

# 13. Activity Feed

The Feed is both:

1. A social activity stream
2. A historical record of circle activity

Example:

```text
Today

Tomcy invested ₹500
2h ago
❤️ 2

Mom increased her monthly investment
₹1,000 → ₹1,500
5h ago

Dad completed his monthly investment
Yesterday

Sarah joined the circle
Yesterday

Circle reached ₹25,000
Yesterday
```

---

# 14. Activity Types

The feed should support:

### Investment

> Tomcy invested ₹500.

### Contribution completed

> Mom completed her monthly contribution.

### Investment increment

> Dad increased his monthly contribution by ₹500.

### Goal milestone

> 🎉 The circle crossed ₹50,000.

### Streak milestone

> 🔥 The circle reached a 30-day streak.

### Member joined

> Sarah joined the circle.

### Challenge completed

> Everyone completed this week's challenge.

### Borrowing activity

Potentially show:

> Tomcy used BlinkMoney's borrowing feature.

Do not expose borrowing amount by default.

### Repayment

> Tomcy made a repayment.

### Goal created

> Family created a new ₹10L goal.

---

# 15. Feed Filters

Provide lightweight filtering:

```text
All
Investments
Milestones
Members
```

The Feed should remain useful as historical data grows.

---

# 16. Reactions

Members can react to activities:

- ❤️
- 🔥
- 👏
- 🚀

Comments are intentionally out of scope for the first prototype.

---

# 17. Nudge Mechanic

This is an important social interaction.

Example:

```text
Sarah is the last member this month.
```

CTA:

**Nudge Sarah**

Mock notification:

```text
🔔 Your circle is waiting for you!
```

This changes Wealth Circle from a passive feed into a system where members actively encourage one another.

---

# 18. Circle Streak

There are two levels of streak.

## Personal Streak

```text
Tomcy
🔥 12 days
```

## Circle Streak

```text
Thomas Family
🔥 18 days
```

The Circle Streak continues when all required members complete their contribution.

---

# 19. Streak Rescue

If a member misses:

```text
⚠️ Circle streak at risk

Sarah hasn't completed her investment.
```

Actions:

**Nudge Sarah**

If she completes it:

```text
🔥 Circle streak saved!
```

This should have a visible celebratory animation.

---

# 20. Circle Challenges

Add optional short-term challenges.

## 7-Day Challenge

> Everyone invests at least ₹100/day.

## 30-Day Challenge

> No missed investment days.

## ₹10K Challenge

> Circle invests ₹10,000 collectively.

## Step-Up Challenge

> Increase contribution by 10%.

Challenges are designed to create short-term engagement inside the longer-term circle.

---

# 21. Circle Milestones

Suggested milestones:

```text
₹10K   🌱
₹25K   🌿
₹50K   🌳
₹1L    🏆
₹5L    💎
```

When a milestone is crossed:

```text
🎉 Thomas Family crossed ₹50,000

You've built this together.
```

---

# 22. Privacy Model

Privacy is a core requirement for a finance product.

## Default visible information

Members can see:
- Investment activity
- Contribution completion
- Streak
- Group progress
- Milestones

## Hidden by default

Members should NOT automatically see:
- Net worth
- Portfolio value
- Other investments
- Borrowing amount
- Personal financial data

Optional setting:

```text
Show my contribution amount
```

Members control how much personal information they expose.

---

# 23. Shareable Stats Cards

The group should generate visual cards that can be shared outside the app.

## Group Progress Card

```text
┌───────────────────────────┐
│                           │
│       THOMAS FAMILY       │
│                           │
│       ₹50,000             │
│       INVESTED            │
│                           │
│       ████████░░          │
│          50%              │
│                           │
│       4 members           │
│       31 day streak 🔥    │
│                           │
│       Building wealth     │
│       together.            │
│                           │
│       Powered by          │
│       BlinkMoney          │
└───────────────────────────┘
```

---

## Personal Stats Card

Example:

```text
MY WEALTH JOURNEY

24 investments
🔥 31 day streak
₹12,000 contributed
4 milestones

I'm building wealth consistently.

Powered by BlinkMoney
```

---

## Card Types

### Progress Card
- Current amount
- Goal
- Percentage

### Streak Card
- Current streak
- Circle name

### Milestone Card
- Milestone reached
- Celebration

The prototype should generate PNG output.

---

# 24. Group Settings

## General

- Circle name
- Circle type
- Goal
- Target date

## Contribution

- Daily / Monthly
- Equal / Individual / Group target
- Default amount
- Reminder time

## Privacy

- Show contribution amount
- Show activity
- Show milestones
- Show individual progress

## Notifications

- Investment reminder
- Member activity
- Milestone
- Streak at risk
- Nudge

---

# 25. Notification Center

Use mocked in-app notifications.

Examples:

```text
🔥 Your circle reached a 20-day streak
2m

Mom invested ₹1,000
1h

Sarah joined your circle
3h

₹50K milestone reached
Yesterday
```

No real push notification infrastructure is required.

---

# 26. Empty States

## No Circles

> Your wealth grows better together.

CTA:

**Create your first circle**

---

## Empty Feed

> Your circle is just getting started.

> Make your first investment to start the story.

---

## No Members

> Your circle needs people.

CTA:

**Invite someone you trust**

---

# 27. Leaving a Circle

Confirmation:

> ## Leave Thomas Family?
>
> Your investments remain yours. Leaving only removes you from the circle.

Actions:
- Cancel
- Leave Circle

This reinforces that Wealth Circle is not a pooled investment account.

---

# 28. Offline State

The prototype can simulate:

```text
You're offline

Showing data from 8 min ago.
```

Cached/local data remains visible.

This is a useful production-minded edge case.

---

# 29. Data Model

The prototype can use TypeScript interfaces and local JSON.

## User

```ts
type User = {
  id: string
  username: string
  name: string
  avatar: string
}
```

## Circle

```ts
type Circle = {
  id: string
  name: string
  type: "family" | "couple" | "friends"
  ownerId: string
  goal: string
  targetAmount: number
  targetDate: string
  frequency: "daily" | "monthly"
  contributionMode: "equal" | "individual" | "group-target"
  defaultAmount: number
  createdAt: string
}
```

## Circle Member

```ts
type CircleMember = {
  circleId: string
  userId: string
  role: "owner" | "member"
  contributionAmount: number
  joinedAt: string
  status: "active" | "invited" | "pending"
}
```

## Activity

```ts
type Activity = {
  id: string
  circleId: string
  userId: string
  type:
    | "investment"
    | "contribution_completed"
    | "investment_increment"
    | "milestone"
    | "streak"
    | "member_joined"
    | "challenge_completed"
    | "borrowing"
    | "repayment"
    | "goal_created"
  amount?: number
  metadata?: Record<string, unknown>
  createdAt: string
}
```

## Check-In

```ts
type CheckIn = {
  id: string
  circleId: string
  userId: string
  date: string
  amount: number
}
```

## Challenge

```ts
type Challenge = {
  id: string
  circleId: string
  type: string
  target: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "expired"
}
```

---

# 30. Prototype Architecture

Recommended:

```text
src/
├── data/
│   ├── users.json
│   ├── circles.json
│   ├── activities.json
│   └── challenges.json
│
├── services/
│   ├── circleService.ts
│   ├── activityService.ts
│   └── userService.ts
│
├── store/
│   └── circleStore.ts
│
├── screens/
│   ├── circles/
│   ├── circle/
│   ├── create-circle/
│   └── share/
│
└── components/
```

Use a mocked service layer:

```ts
circleService.createCircle()
circleService.addMember()
circleService.checkIn()
circleService.getFeed()
circleService.getStats()
```

The implementation can use local state/AsyncStorage underneath.

---

# 31. Backend Strategy

## Do not build a real backend for the assignment.

Use:

```text
React Native
      ↓
Hooks / Store
      ↓
Mock Service Layer
      ↓
Local JSON + AsyncStorage
```

The UI should behave as though it is communicating with a backend.

For example:

```ts
await mockRequest(() =>
  circleService.checkIn(circleId, userId)
)
```

Simulate 300–700ms latency to demonstrate loading states.

### Why

This lets the prototype demonstrate:
- API-like architecture
- Loading states
- Error states
- Optimistic UI
- State transitions
- Persistence

without spending assignment time on infrastructure.

---

# 32. Required Interactions

The following should be genuinely functional in the prototype:

### Create Circle

Create a group and add it to the circle list.

### Add Member

Search mock user directory and add a member.

### Invite

Generate a mock invite link and pending member state.

### Change Contribution

Example:

```text
₹500 → ₹1,000
```

Group progress should update.

### Check In

User checks in → activity appears in Feed.

### Feed

New activities appear immediately.

### Reactions

Reaction counts update.

### Nudge

Mock notification is generated.

### Milestone

Crossing a threshold triggers celebration.

### Share

Generate a PNG stats card.

### Challenge

Create and complete a challenge.

---

# 33. Explicitly Out of Scope

Do not build:

- Real authentication
- Real backend
- Real database
- Real investment execution
- Payment gateway
- Real contacts API
- Real WhatsApp integration
- Real push notifications
- Portfolio aggregation
- SIP execution
- Real referral tracking
- Real-time WebSocket infrastructure

These can be mentioned as future production work.

---

# 34. Edge Cases to Demonstrate

The assignment specifically values edge cases, so intentionally demonstrate:

1. Circle with no members
2. Pending invitation
3. Duplicate member invite
4. Member leaves
5. Contribution amount changed
6. Member misses investment
7. Circle streak at risk
8. Circle streak rescued
9. Goal reached
10. Goal exceeded
11. Empty feed
12. Offline state
13. Loading state
14. Failed mock action
15. Share card generation
16. Private contribution amount
17. User with multiple circles

---

# 35. Suggested Screen Inventory

## Circle discovery

1. Circles Home
2. Empty Circles State

## Creation

3. Circle Type
4. Circle Name
5. Goal
6. Contribution Setup
7. Add Members
8. Creation Success

## Circle

9. Circle Overview
10. Circle Feed
11. Circle Members
12. Circle Settings
13. Circle Notifications
14. Circle Challenges

## Actions

15. Check-In
16. Contribution Edit
17. Nudge Member
18. Milestone Celebration

## Sharing

19. Group Stats
20. Personal Stats
21. Share Card Preview

This gives enough surface area for a "fully extensive prototype" without becoming an unfinishable app.

---

# 36. Recommended UX Details

Prioritize:

- Smooth progress animations
- Number/count-up animations
- Check-in confirmation
- Streak animation
- Milestone celebration
- Bottom sheets for quick actions
- Skeleton/loading states
- Haptic feedback where available
- Swipe actions where useful
- Consistent card components
- Strong empty states
- Clear hierarchy
- Accessible touch targets

Avoid excessive gamification.

The experience should still feel like a **finance product**, not a game.

---

# 37. Product Loop

The core product loop should be visible throughout the prototype:

```text
CREATE
  ↓
INVITE
  ↓
SET GOAL
  ↓
CONTRIBUTE
  ↓
CHECK IN
  ↓
SEE FRIENDS/FAMILY ACT
  ↓
NUDGE / ENCOURAGE
  ↓
MAINTAIN STREAK
  ↓
REACH MILESTONE
  ↓
SHARE
  ↓
INVITE MORE PEOPLE
```

---

# 38. Why This Is a Strong Referral Product

A traditional referral system says:

> Invite a friend and receive a reward.

Wealth Circle says:

> **I need my family/friend/partner here because the product becomes more useful when we're together.**

The referral is therefore intrinsic to the feature.

A user invites someone because:
- They want accountability
- They want to build a shared habit
- They want to reach a shared goal
- They want someone to participate in a challenge
- They want to celebrate milestones together

That makes the referral mechanic much more defensible than a generic cash incentive.

---

# 39. Future Production Backend

If this were taken beyond the assignment, the mock service layer could later map to:

```text
Authentication
     ↓
Users
     ↓
Circles
     ├── Members
     ├── Goals
     ├── Contributions
     ├── Activities
     ├── Challenges
     ├── Notifications
     └── Share Cards
```

Potential production services:

- Auth service
- Circle service
- Investment service
- Activity/event service
- Notification service
- Media/share-card service

But none of these are required for the assignment prototype.

---

# 40. MVP Definition

If time becomes limited, prioritize in this order:

## P0 — Must Have

- Create Circle
- Choose Family/Couple/Friends
- Add mock members
- Set contribution frequency
- Set contribution amount
- Circle Overview
- Check In
- Activity Feed
- Members
- Group progress
- Shareable group card

## P1 — Strongly Recommended

- Nudge
- Circle streak
- Milestones
- Individual contribution amounts
- Personal stats card
- Reactions
- Pending invites
- Empty/loading states

## P2 — Polish

- Challenges
- Notification center
- Streak rescue
- Multiple card styles
- Offline state
- Advanced animations
- Haptics

---

# 41. North Star Metric

For a real product:

> **% of active circles where ≥80% of members complete their scheduled contribution.**

This captures the actual purpose of Wealth Circle:

**consistent financial behavior through social accountability.**

Secondary metrics:

- Circle creation rate
- Invite acceptance rate
- Members per circle
- Weekly active circles
- Contribution completion rate
- Circle streak length
- Challenge completion rate
- Share-card generation rate
- New circles created from shared cards

---

# 42. Final Product Positioning

## Wealth Circle

### Build wealth together.

**Family. Partner. Friends.**

Create a private circle, set a goal, invest consistently, and keep each other accountable.

> **Your money is personal. Your habits don't have to be.**

The experience should make BlinkMoney feel less like a place where users simply **check their investments** and more like a place where they **build a financial habit together**.
