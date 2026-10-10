// ─── Chương trình tập giảm béo tại nhà (7 ngày) ────────────────────────────────
//
// Nội dung số hoá nguyên văn từ tài liệu "Chương trình tập 1 tuần.pdf" của
// Ladysfit. Gói kèm thực đơn: in chung vào PDF và nhúng vào link chia sẻ
// /p/[slug]. Muốn đổi giáo án chỉ cần sửa dữ liệu bên dưới, không phải đụng
// tới UI / PDF / trang chia sẻ.

import type { GymLevel } from "@/app/_components/DietForm";

/** Một dòng trong bảng bài tập. Mã A1/A2… là nhóm siêu hiệp: tập hết nhóm rồi mới nghỉ. */
export interface WorkoutExercise {
  code: string;       // "A1"
  name: string;       // "Bicycle Crunch"
  warmupSets: string; // số set khởi động — "1" hoặc "0"
  mainSets: string;   // số set chính — "2"
  reps: string;       // "10-15" hoặc "30-60s" (bài giữ tư thế tính theo giây)
  rest: string;       // "0s" (tập tiếp bài sau) hoặc "1-2p"
}

export interface WorkoutSession {
  label: string; // "Buổi 1"
  exercises: WorkoutExercise[];
}

export interface WorkoutTerm {
  term: string;
  meaning: string;
}

export interface WorkoutPlan {
  title: string;
  subtitle: string;
  brandLine: string;
  /** Lưu ý chung, in ở mỗi buổi trong tài liệu gốc — ở đây in một lần cho gọn */
  note: string;
  glossary: WorkoutTerm[];
  warmupGuide: { title: string; paragraphs: string[] };
  sessions: WorkoutSession[];
  contact?: string;
}

// Cả 4 buổi dùng chung 8 bài, cùng thứ tự và cùng kiểu nghỉ — chỉ khác số set
// chính và mức reps. Buổi sau nặng hơn buổi trước, đó là cách tăng tiến của giáo án.
const EXERCISE_ORDER: ReadonlyArray<{ code: string; name: string; rest: string }> = [
  { code: "A1", name: "Bicycle Crunch",     rest: "0s" },
  { code: "A2", name: "Knee Push Up",       rest: "0s" },
  { code: "A3", name: "Side Plank",         rest: "1-2p" },
  { code: "B1", name: "Glute Bridge",       rest: "0s" },
  { code: "B2", name: "Plank Shoulder Tap", rest: "0s" },
  { code: "B3", name: "Crunch",             rest: "1-2p" },
  { code: "C1", name: "Mountain Climber",   rest: "0s" },
  { code: "C2", name: "Lying Leg Raise",    rest: "1-2p" },
];

// Chỉ nhóm A có set khởi động (1 set), nhóm B và C vào thẳng set chính.
const WARMUP_SETS: Record<string, string> = { A1: "1", A2: "1", A3: "1" };

function session(
  label: string,
  mainSets: string,
  reps: Record<string, string>
): WorkoutSession {
  return {
    label,
    exercises: EXERCISE_ORDER.map((ex) => ({
      code: ex.code,
      name: ex.name,
      warmupSets: WARMUP_SETS[ex.code] ?? "0",
      mainSets,
      reps: reps[ex.code],
      rest: ex.rest,
    })),
  };
}

// Mức reps của buổi 1 → 3 giống hệt nhau, chỉ tăng số set chính (2 → 3 → 4)
const REPS_1_3: Record<string, string> = {
  A1: "10-15", A2: "10-15", A3: "30-60s",
  B1: "12-15", B2: "20-30s", B3: "20-25",
  C1: "20-30s", C2: "20-25",
};

// Buổi 4 giữ 4 set nhưng nâng reps và thời gian giữ tư thế
const REPS_4: Record<string, string> = {
  A1: "15-20", A2: "15-20", A3: "60-90s",
  B1: "15-20", B2: "30-45s", B3: "20-25",
  C1: "30-45s", C2: "20-25",
};

export const HOME_WORKOUT_7D: WorkoutPlan = {
  title: "Chương trình tập giảm béo tại nhà (7 ngày)",
  subtitle: "4 buổi tăng tiến — không cần dụng cụ, tập được ngay tại nhà",
  brandLine: "Phương pháp giảm béo bền vững dành riêng cho nữ",
  note:
    "Các bài tập thực hiện với một tốc độ vừa phải, có kiểm soát để tối ưu hoá khả năng tiêu hao " +
    "năng lượng và tối thiểu hoá rủi ro gặp các chấn thương không mong muốn khi tham gia tập luyện.",
  glossary: [
    { term: "Sets", meaning: "Số hiệp tập của một bài tập." },
    { term: "Reps", meaning: "Số lần lặp lại của một động tác / bài tập." },
    { term: "Rest", meaning: "Thời gian nghỉ sau khi thực hiện một bài tập bất kì." },
    {
      term: "Sets chính",
      meaning:
        "Hiệp tập chính thức của bài tập, được thực hiện sau khi khởi động xong, làm đúng với mức Reps đã đề ra trong chương trình tập.",
    },
    {
      term: "Sets khởi động",
      meaning:
        "Thực hiện bài tập với số Reps thấp hơn (ít hơn Sets chính từ 5 – 10 Reps) để cơ thể làm quen.",
    },
  ],
  warmupGuide: {
    title: "Khởi động",
    paragraphs: [
      "Khởi động đóng một vai trò lớn trong bất kì chương trình tập luyện nào. Mục đích chính của việc khởi động là làm gia tăng nhiệt độ cơ thể, hạn chế chấn thương và gia tăng hiệu suất tập luyện.",
      "Việc khởi động không cần thiết phải là một cái gì đó quá khó khăn — chỉ đơn giản là đi bộ trước tập hoặc xoay để làm nóng các khớp như hồi học thể dục ở cấp 3 là đã đủ. Khởi động chỉ nên kéo dài từ 5 – 10 phút để tránh mất thời gian và ảnh hưởng tiêu cực tới buổi tập.",
      "Một buổi khởi động lý tưởng gồm khoảng 1 – 5 phút xoay làm nóng các khớp, rồi vào buổi tập chính và dùng những Sets khởi động để gia tăng sự quen thuộc với các bài tập đó.",
    ],
  },
  sessions: [
    session("Buổi 1", "2", REPS_1_3),
    session("Buổi 2", "3", REPS_1_3),
    session("Buổi 3", "4", REPS_1_3),
    session("Buổi 4", "4", REPS_4),
  ],
  contact: "0973653861",
};

// ─── Giáo án tập Gym theo tần suất tập ─────────────────────────────────────────
//
// Số hoá từ các file giáo án Ladysfit trong thư mục giao-an/ (1-2buoi, 3-4buoi,
// 5-6buoi, 7buoi .xlsx). Mỗi mức tập là một tuần mẫu, khách lặp lại hằng tuần.
// Mã cùng chữ cái (A1, A2…) là một superset: tập hết chuỗi rồi mới nghỉ.

type ExerciseRow = [
  code: string, name: string, warmupSets: string, mainSets: string, reps: string, rest: string,
];

function gymSession(label: string, rows: ExerciseRow[]): WorkoutSession {
  return {
    label,
    exercises: rows.map(([code, name, warmupSets, mainSets, reps, rest]) => ({
      code, name, warmupSets, mainSets, reps, rest,
    })),
  };
}

const GYM_GLOSSARY: WorkoutTerm[] = [
  { term: "Sets", meaning: "Số hiệp tập của một bài tập." },
  { term: "Reps", meaning: "Số lần lặp lại của một động tác / bài tập." },
  { term: "Rest", meaning: "Thời gian nghỉ sau khi thực hiện một bài tập bất kì." },
  {
    term: "Superset",
    meaning:
      "Sau khi tập xong 1 bài cùng chữ cái (A, B, C, D,…) nhưng khác số thứ tự (1, 2, 3, 4,…) thì tập nốt những bài còn lại trong chuỗi đó. Khi nào xong rồi mới nghỉ.",
  },
  {
    term: "Sets chính",
    meaning:
      "Hiệp tập chính thức của bài tập, được thực hiện sau khi khởi động xong, làm đúng với mức Reps đã đề ra trong chương trình tập.",
  },
  {
    term: "Sets khởi động",
    meaning:
      "Thực hiện bài tập với số Reps thấp hơn (ít hơn Sets chính từ 5 – 10 Reps) để cơ thể làm quen.",
  },
];

/** Phần chữ dùng chung cho mọi giáo án Gym — chỉ khác tiêu đề và lịch tập. */
function gymPlan(frequency: string, sessions: WorkoutSession[]): WorkoutPlan {
  return {
    title: `Chương trình tập giảm mỡ ${frequency}`,
    subtitle: `${sessions.length} buổi tăng tiến — tập tại phòng Gym`,
    brandLine: HOME_WORKOUT_7D.brandLine,
    note:
      "Các bài tập thực hiện với tốc độ vừa phải, có kiểm soát để tối ưu tiêu hao năng lượng và hạn chế chấn thương.",
    glossary: GYM_GLOSSARY,
    warmupGuide: HOME_WORKOUT_7D.warmupGuide,
    sessions,
    contact: HOME_WORKOUT_7D.contact,
  };
}

const GYM_1_2_SESSIONS: WorkoutSession[] = [
  gymSession("Buổi 1", [
    ["A1", "Hip Thrust",            "1", "3", "10-12", "0s"],
    ["A2", "Dumbbell Bench Press",  "1", "3", "12-15", "1-2p"],
    ["B1", "Dumbbell Goblet Squat", "1", "3", "10-12", "90s"],
    ["B2", "OVH Lat Pulldown",      "1", "3", "10-12", "90s"],
    ["C1", "Lying Leg Curl",        "0", "3", "15-20", "60s"],
    ["C2", "Plank",                 "0", "3", "30-60s", "60s"],
  ]),
  gymSession("Buổi 2", [
    ["A1", "Dumbbell Split Squat",           "1", "3", "10-12", "0s"],
    ["A2", "Dumbbell Prone Row",             "1", "3", "12-15", "1-2p"],
    ["B1", "Dumbbell RDL",                   "1", "3", "10-12", "90s"],
    ["B2", "Seated Dumbbell Shoulder Press", "1", "3", "10-12", "90s"],
    ["C1", "Seated Leg Extension",           "0", "3", "15-20", "60s"],
    ["C2", "Plank",                          "0", "3", "30-60s", "60s"],
  ]),
];

const GYM_3_4_SESSIONS: WorkoutSession[] = [
  gymSession("Buổi 1", [
    ["A1", "Hip Thrust",            "1", "3", "10-12", "0s"],
    ["A2", "Dumbbell Bench Press",  "1", "3", "12-15", "1-2p"],
    ["B1", "Dumbbell Goblet Squat", "1", "3", "10-12", "90s"],
    ["B2", "OVH Lat Pulldown",      "1", "3", "10-12", "90s"],
    ["C1", "Lying Leg Curl",        "0", "3", "15-20", "60s"],
    ["C2", "Bear Plank",            "0", "3", "30-60s", "60s"],
  ]),
  gymSession("Buổi 2", [
    ["A1", "Dumbbell Split Squat",           "1", "3", "10-12", "0s"],
    ["A2", "Dumbbell Prone Row",             "1", "3", "12-15", "1-2p"],
    ["B1", "Dumbbell RDL",                   "1", "3", "10-12", "90s"],
    ["B2", "Seated Dumbbell Shoulder Press", "1", "3", "10-12", "90s"],
    ["C1", "Seated Leg Extension",           "0", "3", "15-20", "60s"],
    ["C2", "Lying Leg Raise",                "0", "3", "12-15", "60s"],
  ]),
  gymSession("Buổi 3", [
    ["A1", "Dumbbell Step Up",      "1", "3", "10-12", "0s"],
    ["A2", "Seated Cable Row",      "1", "3", "12-15", "1-2p"],
    ["B1", "Dumbbell B-Stance RDL", "1", "3", "10-12", "90s"],
    ["B2", "Incline Push Up",       "1", "3", "10-12", "90s"],
    ["C1", "Lying Leg Curl",        "0", "3", "15-20", "60s"],
    ["C2", "Boat Hold",             "0", "3", "30-60s", "60s"],
  ]),
  gymSession("Buổi 4", [
    ["A1", "American Hip Thrust",     "1", "3", "10-12", "0s"],
    ["A2", "Incline Bench Press",     "1", "3", "12-15", "1-2p"],
    ["B1", "Single Leg Glute Bridge", "1", "3", "10-12", "90s"],
    ["B2", "UDH Lat Pulldown",        "1", "3", "10-12", "90s"],
    ["C1", "Seated Leg Extension",    "0", "3", "15-20", "60s"],
    ["C2", "Plank",                   "0", "3", "30-60s", "60s"],
  ]),
];

const GYM_5_6_SESSIONS: WorkoutSession[] = [
  gymSession("Buổi 1", [
    ["A1", "Hip Thrust",            "1", "3", "10-12", "0s"],
    ["A2", "Dumbbell Bench Press",  "1", "3", "12-15", "1-2p"],
    ["B1", "Dumbbell Goblet Squat", "1", "3", "10-12", "90s"],
    ["B2", "OVH Lat Pulldown",      "1", "3", "10-12", "90s"],
    ["C1", "Lying Leg Curl",        "0", "3", "15-20", "60s"],
    ["C2", "Bear Plank",            "0", "3", "30-60s", "60s"],
  ]),
  gymSession("Buổi 2", [
    ["A1", "Jumping Jack",         "1", "6", "20-30s", "0s"],
    ["A2", "Butt Touches Run",     "1", "6", "20-30s", "0-20s"],
    ["A3", "Bicycle Crunch",       "1", "6", "10-12", "0-20s"],
    ["A4", "High Knee Run",        "1", "6", "20-30s", "0-20s"],
    ["A5", "Inch Worm In Place",   "0", "6", "10-12", "0-20s"],
    ["A6", "Dumbbell Farmer Walk", "0", "6", "2-3 vòng", "30-60s"],
  ]),
  gymSession("Buổi 3", [
    ["A1", "Dumbbell Split Squat",           "1", "3", "10-12", "0s"],
    ["A2", "Dumbbell Prone Row",             "1", "3", "12-15", "1-2p"],
    ["B1", "Dumbbell RDL",                   "1", "3", "10-12", "90s"],
    ["B2", "Seated Dumbbell Shoulder Press", "1", "3", "10-12", "90s"],
    ["C1", "Seated Leg Extension",           "0", "3", "15-20", "60s"],
    ["C2", "Lying Leg Raise",                "0", "3", "12-15", "60s"],
  ]),
  gymSession("Buổi 4", [
    ["A1", "Half Burpee",          "1", "6", "20-30s", "0s"],
    ["A2", "Flutter Kick",         "1", "6", "20-30s", "0-20s"],
    ["A3", "Mountain Climber",     "1", "6", "10-12", "0-20s"],
    ["A4", "Lying Leg Raise",      "1", "6", "20-30s", "0-20s"],
    ["A5", "Inch Worm In Place",   "0", "6", "10-12", "0-20s"],
    ["A6", "Dumbbell Farmer Walk", "0", "6", "2-3 vòng", "30-60s"],
  ]),
  gymSession("Buổi 5", [
    ["A1", "American Hip Thrust",     "1", "3", "10-12", "0s"],
    ["A2", "Incline Bench Press",     "1", "3", "12-15", "1-2p"],
    ["B1", "Single Leg Glute Bridge", "1", "3", "10-12", "90s"],
    ["B2", "UDH Lat Pulldown",        "1", "3", "10-12", "90s"],
    ["C1", "Seated Leg Extension",    "0", "3", "15-20", "60s"],
    ["C2", "Plank",                   "0", "3", "30-60s", "60s"],
  ]),
  gymSession("Buổi 6", [
    ["A1", "Dumbbell Squat & Press", "1", "6", "10-12", "0s"],
    ["A2", "Plank Shoulder Touch",   "1", "6", "20-30s", "0-20s"],
    ["A3", "Deadlift & Row",         "1", "6", "10-12", "0-20s"],
    ["A4", "Plank Up & Down",        "1", "6", "20-30s", "0-20s"],
    ["A5", "Bicycle Crunch",         "0", "6", "10-12", "0-20s"],
    ["A6", "Plank In & Out",         "0", "6", "2-3 vòng", "30-60s"],
  ]),
];

const GYM_7_SESSIONS: WorkoutSession[] = [
  gymSession("Buổi 1", [
    ["A1", "Hip Thrust",            "1", "3", "10-12", "0s"],
    ["A2", "Dumbbell Bench Press",  "1", "3", "12-15", "30s"],
    ["B1", "Dumbbell Goblet Squat", "1", "3", "10-12", "0s"],
    ["B2", "OVH Lat Pulldown",      "1", "3", "10-12", "30s"],
    ["C1", "Lying Leg Curl",        "0", "3", "15-20", "0s"],
    ["C2", "Bear Plank",            "0", "3", "30-60s", "60s"],
  ]),
  gymSession("Buổi 2", [
    ["A1", "Jumping Jack",         "1", "6", "20-30s", "0s"],
    ["A2", "Butt Touches Run",     "1", "6", "20-30s", "0-20s"],
    ["A3", "Bicycle Crunch",       "1", "6", "10-12", "0-20s"],
    ["A4", "High Knee Run",        "1", "6", "20-30s", "0-20s"],
    ["A5", "Inch Worm In Place",   "0", "6", "10-12", "0-20s"],
    ["A6", "Dumbbell Farmer Walk", "0", "6", "2-3 vòng", "30-60s"],
  ]),
  gymSession("Buổi 3", [
    ["A1", "Dumbbell Split Squat",           "1", "3", "10-12", "0s"],
    ["A2", "Dumbbell Prone Row",             "1", "3", "12-15", "30s"],
    ["B1", "Dumbbell RDL",                   "1", "3", "10-12", "0s"],
    ["B2", "Seated Dumbbell Shoulder Press", "1", "3", "10-12", "30s"],
    ["C1", "Seated Leg Extension",           "0", "3", "15-20", "0s"],
    ["C2", "Lying Leg Raise",                "0", "3", "12-15", "60s"],
  ]),
  gymSession("Buổi 4", [
    ["A1", "Half Burpee",          "1", "6", "20-30s", "0s"],
    ["A2", "Flutter Kick",         "1", "6", "20-30s", "0-20s"],
    ["A3", "Mountain Climber",     "1", "6", "10-12", "0-20s"],
    ["A4", "Lying Leg Raise",      "1", "6", "20-30s", "0-20s"],
    ["A5", "Inch Worm In Place",   "0", "6", "10-12", "0-20s"],
    ["A6", "Dumbbell Farmer Walk", "0", "6", "2-3 vòng", "30-60s"],
  ]),
  gymSession("Buổi 5", [
    ["A1", "American Hip Thrust",     "1", "3", "10-12", "0s"],
    ["A2", "Incline Bench Press",     "1", "3", "12-15", "30s"],
    ["B1", "Single Leg Glute Bridge", "1", "3", "10-12", "0s"],
    ["B2", "UDH Lat Pulldown",        "1", "3", "10-12", "30s"],
    ["C1", "Seated Leg Extension",    "0", "3", "15-20", "0s"],
    ["C2", "Plank",                   "0", "3", "30-60s", "60s"],
  ]),
  gymSession("Buổi 6", [
    ["A1", "Dumbbell Squat & Press", "1", "6", "10-12", "0s"],
    ["A2", "Plank Shoulder Touch",   "1", "6", "20-30s", "0-20s"],
    ["A3", "Deadlift & Row",         "1", "6", "10-12", "0-20s"],
    ["A4", "Plank Up & Down",        "1", "6", "20-30s", "0-20s"],
    ["A5", "Bicycle Crunch",         "0", "6", "10-12", "0-20s"],
    ["A6", "Plank In & Out",         "0", "6", "2-3 vòng", "30-60s"],
  ]),
  gymSession("Buổi 7", [
    ["A1", "Dumbbell Reverse Lunge", "1", "6", "10-12", "0s"],
    ["A2", "Dumbbell Bent Row",      "1", "6", "12-15", "30s"],
    ["B1", "Single Leg Hip Thrust",  "1", "6", "10-12", "0s"],
    ["B2", "Incline Push Up",        "1", "6", "12-15", "30s"],
    ["C1", "Hip Extension",          "0", "6", "10-12", "0s"],
    ["C2", "Crunches",               "0", "6", "12-15", "60s"],
  ]),
];

// Khách chọn "Mức độ tập luyện" nào thì nhận giáo án tương ứng; "Không tập Gym"
// thì không gửi kèm giáo án.
export const WORKOUT_BY_GYM_LEVEL: Record<GymLevel, WorkoutPlan | null> = {
  gym1: null,
  gym2: gymPlan("1-2 buổi/tuần", GYM_1_2_SESSIONS),
  gym3: gymPlan("3-4 buổi/tuần", GYM_3_4_SESSIONS),
  gym4: gymPlan("5-6 buổi/tuần", GYM_5_6_SESSIONS),
  gym5: gymPlan("7 buổi/tuần", GYM_7_SESSIONS),
};
