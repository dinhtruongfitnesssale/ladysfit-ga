// ─── Chương trình tập giảm béo tại nhà (7 ngày) ────────────────────────────────
//
// Nội dung số hoá nguyên văn từ tài liệu "Chương trình tập 1 tuần.pdf" của
// Ladysfit. Gói kèm thực đơn: in chung vào PDF và nhúng vào link chia sẻ
// /p/[slug]. Muốn đổi giáo án chỉ cần sửa dữ liệu HOME_WORKOUT_7D bên dưới,
// không phải đụng tới UI / PDF / trang chia sẻ.

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
