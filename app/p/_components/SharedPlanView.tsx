"use client";

import { useState } from "react";
import type { SharePlan, SlimMeal } from "@/lib/share";
import { getCookingTip } from "@/lib/cooking-tips";

const GOAL_LABEL: Record<string, string> = {
  lose: "Giảm cân", maintain: "Tăng cơ, giảm mỡ",
};

function sumMeals(meals: SlimMeal[]) {
  return meals.reduce(
    (a, m) => ({ cal: a.cal + m.calories, p: a.p + m.protein, f: a.f + m.fat, c: a.c + m.carbs }),
    { cal: 0, p: 0, f: 0, c: 0 }
  );
}

export default function SharedPlanView({ plan }: { plan: SharePlan }) {
  const [activeDay, setActiveDay] = useState(0);
  const [tab, setTab] = useState<"meal" | "workout">("meal");
  const { client, days } = plan;
  const day = days[Math.min(activeDay, days.length - 1)];
  // Link cũ (tạo trước khi có tính năng lịch tập) không kèm field này
  const workout = plan.workout ?? null;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <div style={{ background: "#000000", padding: "26px 20px 22px" }}>
        <div className="max-w-2xl mx-auto">
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#FDE2DC", letterSpacing: "-0.03em", lineHeight: 1 }}>
            LADYSFIT PLAN
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "5px" }}>
            {workout ? "Thực đơn & lịch tập dành cho " : "Thực đơn dành cho "}
            <span style={{ fontWeight: 700, color: "#FDE2DC" }}>{client.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* ── Thông tin & mục tiêu ── */}
        <div
          className="rounded-2xl p-4"
          style={{ border: "1px solid rgba(0,0,0,0.1)" }}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
            {[
              { label: "Mục tiêu", value: GOAL_LABEL[client.weightGoal] ?? client.weightGoal },
              { label: "Thông số", value: `Nữ · ${client.age}t · ${client.height}cm · ${client.weight}kg` },
              { label: "Ngày tạo", value: client.date },
            ].map((it) => (
              <div key={it.label}>
                <div style={{ fontSize: "9px", color: "rgba(0,0,0,0.38)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "3px" }}>
                  {it.label}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#000000" }}>{it.value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Calo", value: `${client.der.toLocaleString("vi-VN")}`, unit: "kcal", color: "#B02F30" },
              { label: "Protein", value: `${client.protein}`, unit: "g", color: "#000000" },
              { label: "Fat", value: `${client.fat}`, unit: "g", color: "#000000" },
              { label: "Carbs", value: `${client.carbs}`, unit: "g", color: "#000000" },
            ].map((it) => (
              <div
                key={it.label}
                className="text-center rounded-xl py-2.5"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <p className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>{it.label}</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: it.color }}>
                  {it.value}<span className="text-xs font-semibold ml-0.5">{it.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chuyển giữa Thực đơn và Lịch tập (chỉ khi có gửi kèm lịch tập) ── */}
        {workout && (
          <div
            className="grid grid-cols-2 gap-1 p-1 rounded-2xl"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            {([
              { key: "meal" as const, label: "🍽️ Thực đơn" },
              { key: "workout" as const, label: "🏋️ Lịch tập" },
            ]).map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
                  style={{
                    background: active ? "#000000" : "transparent",
                    color: active ? "#FDE2DC" : "rgba(0,0,0,0.55)",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        {tab === "meal" && (
        <>
        {/* ── Chọn ngày ── */}
        {days.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {days.map((d, i) => {
              const active = i === activeDay;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveDay(i)}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97]"
                  style={{
                    border: active ? "1px solid #F15B5C" : "1px solid rgba(0,0,0,0.15)",
                    background: active ? "#F15B5C" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#000000",
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Thực đơn ngày đang chọn ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              style={{
                display: "inline-block", background: "#F15B5C", color: "#FFFFFF",
                fontSize: "14px", fontWeight: 800, padding: "5px 14px", borderRadius: "999px",
              }}
            >
              📅 {day.label}
            </span>
          </div>

          {[...day.aiMeals, ...day.manualFoods].length === 0 && (
            <p className="text-sm" style={{ color: "rgba(0,0,0,0.5)" }}>
              Ngày này chưa có thực đơn.
            </p>
          )}

          {/* AI / từng bữa */}
          {day.aiMeals.map((meal, i) => {
            const tip = getCookingTip(meal.name);
            return (
              <div key={`ai-${i}`} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
                <div className="px-4 py-2 flex items-center justify-between" style={{ background: "rgba(241,91,92,0.05)" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#B02F30" }}>{meal.mealName ?? `Bữa ${i + 1}`}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#000000" }}>{meal.calories} kcal</span>
                </div>
                <div className="px-4 py-3 flex items-start justify-between gap-3">
                  <p style={{ fontSize: "0.875rem", color: "#000000", lineHeight: 1.55, flex: 1 }}>{meal.name}</p>
                  <p className="flex-shrink-0 text-right" style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.45)", lineHeight: 1.8 }}>
                    P: {Math.round(meal.protein)}g<br />F: {Math.round(meal.fat)}g<br />C: {Math.round(meal.carbs)}g
                  </p>
                </div>
                {tip && (
                  <div className="px-4 py-2.5 flex items-start gap-2" style={{ borderTop: "1px dashed rgba(0,0,0,0.12)", background: "rgba(0,0,0,0.015)" }}>
                    <span style={{ fontSize: "0.8rem", lineHeight: 1.5 }} aria-hidden="true">👨‍🍳</span>
                    <p style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 700, color: "#B02F30" }}>Gợi ý chế biến: </span>{tip}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Món tự nhập */}
          {day.manualFoods.map((food, i) => (
            <div key={`m-${i}`} className="rounded-xl px-4 py-3" style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
              <div className="flex items-start justify-between gap-3">
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#000000", lineHeight: 1.5, flex: 1 }}>{food.name}</p>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#B02F30" }}>{food.calories} kcal</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "rgba(0,0,0,0.45)" }}>
                P:{Math.round(food.protein)}g · F:{Math.round(food.fat)}g · C:{Math.round(food.carbs)}g
              </p>
            </div>
          ))}

          {/* Tổng cả ngày */}
          {[...day.aiMeals, ...day.manualFoods].length > 0 && (() => {
            const t = sumMeals([...day.aiMeals, ...day.manualFoods]);
            return (
              <div className="rounded-xl p-4" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)" }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(0,0,0,0.35)" }}>
                  Tổng cả ngày
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Calo", value: Math.round(t.cal), color: "#B02F30" },
                    { label: "Protein", value: Math.round(t.p), color: "#000000" },
                    { label: "Fat", value: Math.round(t.f), color: "#000000" },
                    { label: "Carbs", value: Math.round(t.c), color: "#000000" },
                  ].map((it) => (
                    <div key={it.label} className="text-center rounded-lg py-2" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)" }}>
                      <p className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>{it.label}</p>
                      <p className="text-base font-bold mt-0.5" style={{ color: it.color }}>{it.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        </>
        )}

        {/* ── Chương trình tập gửi kèm ── */}
        {tab === "workout" && workout && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4" style={{ background: "#000000" }}>
              <div
                style={{
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: "6px",
                }}
              >
                {workout.brandLine}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#FDE2DC", lineHeight: 1.25 }}>
                {workout.title}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", marginTop: "5px", lineHeight: 1.5 }}>
                {workout.subtitle}
              </div>
            </div>

            {/* Lưu ý khi tập */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(241,91,92,0.06)", border: "1px solid rgba(241,91,92,0.22)" }}
            >
              <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.72)", lineHeight: 1.6 }}>
                <span style={{ fontWeight: 800, color: "#B02F30" }}>Lưu ý: </span>
                {workout.note}
              </p>
            </div>

            {/* Bảng bài tập từng buổi */}
            {workout.sessions.map((s, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: "rgba(241,91,92,0.05)" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#F15B5C",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 800,
                      padding: "4px 14px",
                      borderRadius: "999px",
                    }}
                  >
                    💪 {s.label}
                  </span>
                  <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>
                    {s.exercises.length} bài · {s.exercises[0]?.mainSets} set chính
                  </span>
                </div>

                {s.exercises.map((ex, j) => (
                  <div
                    key={ex.code}
                    className="px-4 py-3"
                    style={{ borderTop: j === 0 ? "1px solid rgba(0,0,0,0.07)" : "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#000000", lineHeight: 1.45 }}>
                      <span style={{ color: "#B02F30", fontWeight: 800 }}>{ex.code}. </span>
                      {ex.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1" style={{ fontSize: "0.75rem" }}>
                      <span style={{ color: "rgba(0,0,0,0.45)" }}>
                        Set khởi động: <span style={{ fontWeight: 700, color: "rgba(0,0,0,0.7)" }}>{ex.warmupSets}</span>
                      </span>
                      <span style={{ color: "rgba(0,0,0,0.45)" }}>
                        Set chính: <span style={{ fontWeight: 700, color: "rgba(0,0,0,0.7)" }}>{ex.mainSets}</span>
                      </span>
                      <span style={{ color: "rgba(0,0,0,0.45)" }}>
                        Reps: <span style={{ fontWeight: 700, color: "#B02F30" }}>{ex.reps}</span>
                      </span>
                      <span style={{ color: "rgba(0,0,0,0.45)" }}>
                        Nghỉ: <span style={{ fontWeight: 700, color: "rgba(0,0,0,0.7)" }}>{ex.rest}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Hướng dẫn khởi động */}
            <div className="rounded-2xl p-4" style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "rgba(0,0,0,0.35)" }}>
                {workout.warmupGuide.title}
              </p>
              {workout.warmupGuide.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mb-2 last:mb-0"
                  style={{ fontSize: "13px", color: "rgba(0,0,0,0.7)", lineHeight: 1.6 }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Thuật ngữ cần nắm */}
            <div className="rounded-2xl p-4" style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "rgba(0,0,0,0.35)" }}>
                Thuật ngữ cần nắm
              </p>
              <ul className="space-y-2">
                {workout.glossary.map((g, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "rgba(0,0,0,0.7)", lineHeight: 1.55 }}>
                    <span style={{ fontWeight: 800, color: "#B02F30" }}>{g.term}: </span>
                    {g.meaning}
                  </li>
                ))}
              </ul>
            </div>

            {workout.contact && (
              <p className="text-center" style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)" }}>
                Cần hỗ trợ trong quá trình tập? Liên hệ huấn luyện viên:{" "}
                <a href={`tel:${workout.contact}`} style={{ fontWeight: 800, color: "#B02F30" }}>
                  {workout.contact}
                </a>
              </p>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="pt-4 pb-8 text-center" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", fontStyle: "italic" }}>
            Được tạo bởi Ladysfit Plan · Máy Tính Dinh Dưỡng Chuyên Sâu
          </p>
        </div>
      </div>
    </div>
  );
}
