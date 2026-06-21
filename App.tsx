import { useState, useRef, useEffect } from "react";
import {
  Dumbbell,
  Flame,
  TrendingUp,
  Bot,
  Play,
  CheckCircle2,
  Plus,
  Send,
  ChevronRight,
  Zap,
  Target,
  Award,
  Clock,
  BarChart3,
  Apple,
  Droplets,
  Moon,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const workoutDays = [
  {
    day: "MON",
    label: "Push",
    done: true,
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8–10", kg: 85 },
      { name: "Incline DB Press", sets: 3, reps: "10–12", kg: 32 },
      { name: "Cable Fly", sets: 3, reps: "12–15", kg: 18 },
      { name: "Tricep Pushdown", sets: 3, reps: "12–15", kg: 22 },
      { name: "Overhead Extension", sets: 2, reps: "15", kg: 20 },
    ],
  },
  {
    day: "TUE",
    label: "Pull",
    done: true,
    exercises: [
      { name: "Deadlift", sets: 4, reps: "5", kg: 140 },
      { name: "Barbell Row", sets: 4, reps: "8", kg: 90 },
      { name: "Lat Pulldown", sets: 3, reps: "10–12", kg: 72 },
      { name: "Face Pull", sets: 3, reps: "15", kg: 24 },
      { name: "Hammer Curl", sets: 3, reps: "12", kg: 18 },
    ],
  },
  {
    day: "WED",
    label: "Legs",
    done: false,
    active: true,
    exercises: [
      { name: "Back Squat", sets: 4, reps: "6–8", kg: 110 },
      { name: "Romanian Deadlift", sets: 3, reps: "10", kg: 80 },
      { name: "Leg Press", sets: 3, reps: "12–15", kg: 200 },
      { name: "Walking Lunge", sets: 3, reps: "20 steps", kg: 24 },
      { name: "Calf Raise", sets: 4, reps: "20", kg: 60 },
    ],
  },
  {
    day: "THU",
    label: "Rest",
    done: false,
    rest: true,
    exercises: [],
  },
  {
    day: "FRI",
    label: "Push",
    done: false,
    exercises: [
      { name: "Overhead Press", sets: 4, reps: "6–8", kg: 65 },
      { name: "Arnold Press", sets: 3, reps: "10", kg: 28 },
      { name: "Lateral Raise", sets: 4, reps: "15", kg: 12 },
      { name: "Dip", sets: 3, reps: "12", kg: 0 },
    ],
  },
  {
    day: "SAT",
    label: "Pull",
    done: false,
    exercises: [
      { name: "Pull-up", sets: 4, reps: "8–10", kg: 0 },
      { name: "Cable Row", sets: 3, reps: "12", kg: 65 },
      { name: "Chest-Supported Row", sets: 3, reps: "10", kg: 60 },
      { name: "Bicep Curl", sets: 3, reps: "12", kg: 20 },
    ],
  },
  {
    day: "SUN",
    label: "Rest",
    done: false,
    rest: true,
    exercises: [],
  },
];

const foodLog = [
  { time: "07:30", name: "Greek Yogurt + Blueberries", cal: 220, p: 18, c: 28, f: 4 },
  { time: "09:00", name: "Protein Shake (Whey)", cal: 160, p: 32, c: 6, f: 2 },
  { time: "12:30", name: "Grilled Chicken + Brown Rice", cal: 480, p: 45, c: 52, f: 8 },
  { time: "15:00", name: "Apple + Peanut Butter", cal: 200, p: 6, c: 28, f: 9 },
  { time: "18:30", name: "Salmon Fillet + Broccoli", cal: 390, p: 42, c: 12, f: 18 },
  { time: "21:00", name: "Casein Shake", cal: 140, p: 28, c: 8, f: 1 },
];

const weightHistory = [
  { week: "W1", weight: 84.2 },
  { week: "W2", weight: 83.8 },
  { week: "W3", weight: 83.5 },
  { week: "W4", weight: 83.1 },
  { week: "W5", weight: 82.9 },
  { week: "W6", weight: 82.4 },
  { week: "W7", weight: 82.1 },
  { week: "W8", weight: 81.7 },
];

const strengthHistory = [
  { week: "W1", squat: 100, bench: 80, deadlift: 130 },
  { week: "W2", squat: 102, bench: 82, deadlift: 132 },
  { week: "W3", squat: 105, bench: 83, deadlift: 135 },
  { week: "W4", squat: 105, bench: 84, deadlift: 137 },
  { week: "W5", squat: 107, bench: 85, deadlift: 138 },
  { week: "W6", squat: 108, bench: 85, deadlift: 140 },
  { week: "W7", squat: 110, bench: 86, deadlift: 140 },
  { week: "W8", squat: 110, bench: 87, deadlift: 142 },
];

const activityData = [
  { day: "M", cal: 520 },
  { day: "T", cal: 410 },
  { day: "W", cal: 680 },
  { day: "T", day2: "Th", cal: 0 },
  { day: "F", cal: 590 },
  { day: "S", cal: 450 },
  { day: "S", day2: "Su", cal: 0 },
];

const aiMessages = [
  {
    role: "ai",
    text: "Good morning, Marcus. Your recovery score is 87/100 — you slept 7h 42m and HRV is trending up. Today's Legs session looks optimal.",
  },
  {
    role: "user",
    text: "My right knee felt stiff during yesterday's squats. Should I modify today?",
  },
  {
    role: "ai",
    text: "Smart to flag that. Swap Back Squat for Leg Press (3×15 at 70% load) and add 10 min of hip flexor + quad mobility before lifting. Avoid deep knee flexion past 90° today. If stiffness persists post-session, let's look at your squat form data.",
  },
  {
    role: "user",
    text: "Also I've been stuck at 82kg for two weeks. What should I adjust?",
  },
  {
    role: "ai",
    text: "Your calories are averaging 1,590 kcal — that's likely too aggressive. Your maintenance is ~2,200 kcal. I'd recommend bumping to 1,850 kcal with a protein floor of 180g. Add 40g carbs around your training window. A slower deficit will preserve more muscle and get the scale moving again.",
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

type Screen = "workout" | "calories" | "progress" | "coach";

const NAV_ITEMS: { id: Screen; icon: React.FC<{ size?: number; className?: string }>; label: string }[] = [
  { id: "workout", icon: Dumbbell, label: "Plans" },
  { id: "calories", icon: Flame, label: "Calories" },
  { id: "progress", icon: TrendingUp, label: "Progress" },
  { id: "coach", icon: Bot, label: "AI Coach" },
];

function StatPill({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`flex flex-col items-center px-4 py-2 rounded-lg ${accent ? "bg-primary/10 border border-primary/30" : "bg-secondary/50 border border-border"}`}>
      <span className={`font-mono text-xl font-medium leading-none ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
      <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-mono">{label}</span>
    </div>
  );
}

// ─── Workout Plans Screen ─────────────────────────────────────────────────────

function WorkoutScreen() {
  const [selected, setSelected] = useState(2);

  const day = workoutDays[selected];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Week 8 of 12</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "-0.01em" }}>
              PUSH / PULL / LEGS
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <Zap size={12} className="text-primary" />
            <span className="text-xs font-mono text-primary font-medium">5/7 done</span>
          </div>
        </div>

        {/* Day picker */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          {workoutDays.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 w-12 py-2 rounded-lg border transition-all duration-150 ${
                selected === i
                  ? "bg-primary border-primary"
                  : d.done
                  ? "bg-secondary/40 border-border"
                  : d.rest
                  ? "bg-transparent border-border/40"
                  : "bg-secondary/20 border-border hover:border-border/60"
              }`}
            >
              <span
                className={`text-[10px] font-mono font-medium uppercase ${
                  selected === i ? "text-primary-foreground" : d.done ? "text-muted-foreground" : "text-muted-foreground"
                }`}
              >
                {d.day}
              </span>
              {d.done ? (
                <CheckCircle2 size={14} className={selected === i ? "text-primary-foreground" : "text-primary"} />
              ) : d.rest ? (
                <Moon size={14} className="text-muted-foreground/50" />
              ) : (
                <div className={`w-1.5 h-1.5 rounded-full ${selected === i ? "bg-primary-foreground" : "bg-muted-foreground/30"}`} />
              )}
              <span
                className={`text-[9px] font-mono uppercase ${
                  selected === i ? "text-primary-foreground/80" : "text-muted-foreground/60"
                }`}
              >
                {d.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
        {day.rest ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
            <Moon size={36} className="opacity-30" />
            <p className="font-mono text-sm uppercase tracking-widest">Active Recovery Day</p>
            <p className="text-xs text-center max-w-xs opacity-60">Light walk, stretching, or mobility work. Let your body rebuild.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Start button */}
            <button className="w-full flex items-center justify-between px-5 py-4 bg-primary rounded-xl text-primary-foreground font-medium transition-opacity hover:opacity-90 active:opacity-80">
              <div className="flex items-center gap-3">
                <Play size={18} fill="currentColor" />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-lg font-bold tracking-wide uppercase">
                  Start {day.label} Workout
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span className="text-sm font-mono">~55 min</span>
              </div>
            </button>

            {/* Exercises */}
            {day.exercises.map((ex, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 bg-card rounded-xl border border-border hover:border-border/80 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{ex.name}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      {ex.sets} sets × {ex.reps}{ex.kg > 0 ? ` · ${ex.kg} kg` : ""}
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Calorie Tracking Screen ──────────────────────────────────────────────────

const totals = foodLog.reduce(
  (acc, f) => ({ cal: acc.cal + f.cal, p: acc.p + f.p, c: acc.c + f.c, fat: acc.fat + f.f }),
  { cal: 0, p: 0, c: 0, fat: 0 }
);

const macroRings = [
  { name: "Protein", value: totals.p, goal: 180, color: "#c8ff47", bg: "#c8ff4720" },
  { name: "Carbs", value: totals.c, goal: 220, color: "#4dabf7", bg: "#4dabf720" },
  { name: "Fat", value: totals.fat, goal: 65, color: "#ff922b", bg: "#ff922b20" },
];

function MacroRing({ name, value, goal, color, bg }: { name: string; value: number; goal: number; color: string; bg: string }) {
  const pct = Math.min(value / goal, 1);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke={bg} strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-mono font-medium" style={{ color }}>{value}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-foreground">{name}</p>
        <p className="text-[10px] font-mono text-muted-foreground">{goal}g goal</p>
      </div>
    </div>
  );
}

function CalorieScreen() {
  const [showAdd, setShowAdd] = useState(false);
  const calGoal = 1850;
  const remaining = calGoal - totals.cal;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Today · Jun 21</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              NUTRITION LOG
            </h1>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide space-y-4">
        {/* Calorie summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Consumed</p>
              <p className="text-5xl font-mono font-medium text-foreground leading-none mt-1">{totals.cal}</p>
              <p className="text-xs font-mono text-muted-foreground mt-1">of {calGoal} kcal goal</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Remaining</p>
              <p className={`text-3xl font-mono font-medium leading-none mt-1 ${remaining > 0 ? "text-primary" : "text-destructive"}`}>
                {remaining > 0 ? `+${remaining}` : remaining}
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min((totals.cal / calGoal) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1.5">{Math.round((totals.cal / calGoal) * 100)}% of daily goal</p>
        </div>

        {/* Macros */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Macronutrients</p>
          <div className="flex items-center justify-around">
            {macroRings.map((m) => (
              <MacroRing key={m.name} {...m} />
            ))}
          </div>
        </div>

        {/* Water + goal */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#4dabf720] flex items-center justify-center flex-shrink-0">
              <Droplets size={16} className="text-[#4dabf7]" />
            </div>
            <div>
              <p className="font-mono text-lg font-medium text-foreground">2.1L</p>
              <p className="text-[10px] font-mono text-muted-foreground">of 3L goal</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Apple size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-mono text-lg font-medium text-foreground">6</p>
              <p className="text-[10px] font-mono text-muted-foreground">meals logged</p>
            </div>
          </div>
        </div>

        {/* Food log */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Meal Log</p>
          </div>
          {foodLog.map((f, i) => (
            <div key={i} className={`flex items-center justify-between px-5 py-3 ${i < foodLog.length - 1 ? "border-b border-border/50" : ""} hover:bg-secondary/30 transition-colors`}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-muted-foreground w-10">{f.time}</span>
                <div>
                  <p className="text-sm text-foreground">{f.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    P {f.p}g · C {f.c}g · F {f.f}g
                  </p>
                </div>
              </div>
              <span className="text-sm font-mono text-foreground">{f.cal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Progress Charts Screen ───────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.value}{p.unit || ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function ProgressScreen() {
  const [strengthMetric, setStrengthMetric] = useState<"squat" | "bench" | "deadlift">("squat");

  const metricColors = { squat: "#c8ff47", bench: "#4dabf7", deadlift: "#ff922b" };
  const metricLabels = { squat: "Back Squat", bench: "Bench Press", deadlift: "Deadlift" };

  const measurements = [
    { label: "Chest", value: "102 cm", delta: "+1.5", pos: true },
    { label: "Waist", value: "82 cm", delta: "-3.2", pos: false },
    { label: "Hips", value: "98 cm", delta: "-1.1", pos: false },
    { label: "Thigh", value: "63 cm", delta: "+0.8", pos: true },
    { label: "Body Fat", value: "14.2%", delta: "-1.8%", pos: false },
    { label: "Lean Mass", value: "70.3 kg", delta: "+1.2", pos: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">8-Week Overview</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          PROGRESS
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatPill value="−2.5" label="kg lost" accent />
          <StatPill value="47" label="sessions" />
          <StatPill value="87%" label="adherence" />
        </div>

        {/* Weekly activity */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Calories Burned · This Week</p>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={activityData} barSize={20} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6b7985", fontFamily: "DM Mono" }} />
              <Bar dataKey="cal" fill="#c8ff47" radius={[3, 3, 0, 0]} opacity={0.85} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weight */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Body Weight</p>
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp size={12} />
              <span className="text-xs font-mono">−2.5 kg</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={weightHistory} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8ff47" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c8ff47" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6b7985", fontFamily: "DM Mono" }} />
              <YAxis domain={["auto", "auto"]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6b7985", fontFamily: "DM Mono" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="weight" stroke="#c8ff47" strokeWidth={2} fill="url(#wGrad)" dot={{ r: 3, fill: "#c8ff47", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Strength */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Strength Lifts</p>
            <div className="flex gap-1">
              {(["squat", "bench", "deadlift"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setStrengthMetric(m)}
                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase transition-all ${
                    strengthMetric === m
                      ? "text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={strengthMetric === m ? { backgroundColor: metricColors[m] } : {}}
                >
                  {m === "deadlift" ? "DL" : m === "bench" ? "BP" : "SQ"}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{metricLabels[strengthMetric]}</p>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={strengthHistory} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6b7985", fontFamily: "DM Mono" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6b7985", fontFamily: "DM Mono" }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={strengthMetric}
                stroke={metricColors[strengthMetric]}
                strokeWidth={2.5}
                dot={{ r: 3, fill: metricColors[strengthMetric], strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Measurements */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Body Measurements</p>
          </div>
          <div className="grid grid-cols-2">
            {measurements.map((m, i) => (
              <div
                key={i}
                className={`px-5 py-3 flex items-center justify-between ${
                  i % 2 === 0 ? "border-r border-border/50" : ""
                } ${i < measurements.length - 2 ? "border-b border-border/50" : ""}`}
              >
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">{m.label}</p>
                  <p className="text-sm font-mono text-foreground font-medium">{m.value}</p>
                </div>
                <span className={`text-xs font-mono ${m.pos ? "text-primary" : "text-[#38d9a9]"}`}>{m.delta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Coach Screen ──────────────────────────────────────────────────────────

const suggestions = [
  "How do I break through a plateau?",
  "Optimize sleep for recovery",
  "Best pre-workout nutrition",
  "Rate my form on deadlifts",
];

function CoachScreen() {
  const [messages, setMessages] = useState(aiMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "I've noted that. Based on your training history and biometrics, I'll adjust your plan and check in tomorrow after your session. Keep crushing it.",
        },
      ]);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Bot size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-medium text-foreground text-sm">Atlas AI Coach</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-muted-foreground">Online · Analyzing your data</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
          {[
            { icon: Activity, label: "HRV", value: "+12%" },
            { icon: Award, label: "Streak", value: "14d" },
            { icon: Target, label: "Goal", value: "82kg" },
            { icon: BarChart3, label: "Score", value: "87/100" },
          ].map((s, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-border rounded-lg">
              <s.icon size={12} className="text-primary" />
              <span className="text-[10px] font-mono text-muted-foreground">{s.label}</span>
              <span className="text-[10px] font-mono text-foreground font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "ai" && (
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={13} className="text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-card border border-border text-foreground rounded-tl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot size={13} className="text-primary" />
            </div>
            <div className="px-4 py-3 bg-card border border-border rounded-xl rounded-tl-none">
              <div className="flex gap-1 items-center h-4">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-6 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="flex-shrink-0 px-3 py-1.5 bg-secondary/60 border border-border rounded-full text-xs text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors font-mono"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-2">
        <div className="flex items-center gap-3 bg-secondary/60 border border-border rounded-xl px-4 py-3 focus-within:border-primary/40 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask your coach anything..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center disabled:opacity-30 transition-opacity hover:opacity-90"
          >
            <Send size={13} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("workout");

  const screens: Record<Screen, React.ReactNode> = {
    workout: <WorkoutScreen />,
    calories: <CalorieScreen />,
    progress: <ProgressScreen />,
    coach: <CoachScreen />,
  };

  return (
    <div
      className="size-full flex items-center justify-center bg-[#050709]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Phone frame */}
      <div className="relative w-full max-w-sm h-full max-h-[860px] bg-background flex flex-col overflow-hidden md:rounded-3xl md:shadow-2xl md:border md:border-white/5">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 flex-shrink-0">
          <span className="text-[11px] font-mono text-muted-foreground">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              {[2, 3, 4, 4].map((h, i) => (
                <div key={i} className="w-0.5 rounded-sm bg-foreground/60" style={{ height: `${h * 3}px` }} />
              ))}
            </div>
            <div className="w-4 h-2 border border-foreground/60 rounded-[2px] relative">
              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-foreground/60 rounded-[1px] m-px" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden">
          {screens[screen]}
        </div>

        {/* Bottom navigation */}
        <div className="flex-shrink-0 border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center">
            {NAV_ITEMS.map((item) => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
                >
                  <item.icon
                    size={20}
                    className={`transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${
                      active ? "text-primary" : "text-muted-foreground/60"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-24 h-1 rounded-full bg-foreground/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
