"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  WalletCards
} from "lucide-react";

type Category = "money" | "knowledge" | "risk" | "time";

type Question = {
  id: number;
  category: Category;
  categoryLabel: string;
  question: string;
  options: {
    value: number;
    label: string;
  }[];
};

type CategoryScores = Record<Category, number>;

const answerOptions = [
  { value: 1, label: "全く不安ではない" },
  { value: 2, label: "やや不安ではない" },
  { value: 3, label: "どちらとも言えない" },
  { value: 4, label: "やや不安だ" },
  { value: 5, label: "非常に不安だ" }
];

const questions: Question[] = [
  {
    id: 1,
    category: "money",
    categoryLabel: "💰 お金の不安",
    question: "初期費用が高額で、手が出せないのではと不安だ",
    options: answerOptions
  },
  {
    id: 2,
    category: "money",
    categoryLabel: "💰 お金の不安",
    question: "銀行からの借金を背負うことが怖い",
    options: answerOptions
  },
  {
    id: 3,
    category: "money",
    categoryLabel: "💰 お金の不安",
    question: "リフォーム費用がどれくらいかかるか分からず不安だ",
    options: answerOptions
  },
  {
    id: 4,
    category: "knowledge",
    categoryLabel: "📚 知識の不安",
    question: "不動産投資の知識がなく、何から始めればいいか分からない",
    options: answerOptions
  },
  {
    id: 5,
    category: "knowledge",
    categoryLabel: "📚 知識の不安",
    question: "物件の良し悪しを判断できる自信がない",
    options: answerOptions
  },
  {
    id: 6,
    category: "risk",
    categoryLabel: "⚠️ リスクの不安",
    question: "失敗して損をするのではないかと不安だ",
    options: answerOptions
  },
  {
    id: 7,
    category: "risk",
    categoryLabel: "⚠️ リスクの不安",
    question: "空室が出て収入がゼロになるのが怖い",
    options: answerOptions
  },
  {
    id: 8,
    category: "risk",
    categoryLabel: "⚠️ リスクの不安",
    question: "物件が想定より早く劣化・破損するのではと不安だ",
    options: answerOptions
  },
  {
    id: 9,
    category: "time",
    categoryLabel: "⏰ 時間の不安",
    question: "物件管理に時間を取られて本業に支障が出るのでは",
    options: answerOptions
  },
  {
    id: 10,
    category: "time",
    categoryLabel: "⏰ 時間の不安",
    question: "入居者対応やトラブル対応が面倒そうで不安だ",
    options: answerOptions
  }
];

const solutions: Record<Category, { title: string; solutions: string[] }> = {
  money: {
    title: "💰 お金の不安",
    solutions: [
      "リメイド式は50万円から始められます。一般的な不動産投資（数千万円）と比べて圧倒的に低コストです。",
      "銀行融資は不要。自己資金のみで運用するため、借金リスクはゼロです。",
      "フルリフォームは不要。使える部分だけを貸すので、リフォーム費用を最小限に抑えられます。",
      "0円物件もあります。諸費用（約10万円）だけで物件を手に入れることも可能です。"
    ]
  },
  knowledge: {
    title: "📚 知識の不安",
    solutions: [
      "Morleyが物件選定から運用まで完全サポート。35年以上のビジネス経験と20年以上の不動産実績があります。",
      "物件の良し悪しはMorleyが判断。あなたは迷う必要がありません。",
      "350名のコミュニティで情報交換。先輩メンバーの経験を学べます。",
      "個別相談で、あなたの状況に合わせた具体的なアドバイスを提供します。"
    ]
  },
  risk: {
    title: "⚠️ リスクの不安",
    solutions: [
      "低価格物件なので、失敗しても損失は限定的。数千万円の失敗とは比較になりません。",
      "倉庫・駐車場など、住居以外の用途も活用。空室リスクを分散できます。",
      "平均投資回収期間は1〜2年。早期に元本回収できるので、長期リスクを回避できます。",
      "Morleyの物件選定ノウハウで、劣化リスクの低い物件を見極めます。"
    ]
  },
  time: {
    title: "⏰ 時間の不安",
    solutions: [
      "倉庫・駐車場なら管理の手間はほぼゼロ。月に数時間も必要ありません。",
      "「住まなくても稼げる」モデル。入居者対応が不要な用途を選べます。",
      "トラブル対応もMorleyがサポート。困ったときはすぐに相談できます。",
      "本業を続けながら副収入を得られます。実際に会社員・自営業の方が多数実践中です。"
    ]
  }
};

const categoryOrder: Category[] = ["money", "knowledge", "risk", "time"];

const ratingColors: Record<number, string> = {
  1: "#4CAF50",
  2: "#8BCB6C",
  3: "#AAB3BD",
  4: "#FFB74D",
  5: "#F44336"
};

function getAnxietyLevel(score: number) {
  if (score < 40) {
    return {
      level: "低",
      color: "#4CAF50",
      label: "不安は少なめ",
      emoji: "😊",
      message: "不動産投資に対する不安は少なく、前向きに検討できる状態です。"
    };
  }

  if (score < 70) {
    return {
      level: "中",
      color: "#FF9800",
      label: "やや不安あり",
      emoji: "😐",
      message: "いくつかの不安がありますが、リメイド式なら解消できます。"
    };
  }

  return {
    level: "高",
    color: "#F44336",
    label: "不安が強い",
    emoji: "😰",
    message: "不安が強い状態ですが、まずは個別相談で一つずつ解消していきましょう。"
  };
}

function getCategoryAnxietyLevel(score: number) {
  if (score < 2.5) return { level: "低", color: "#4CAF50" };
  if (score < 3.5) return { level: "中", color: "#FF9800" };
  return { level: "高", color: "#F44336" };
}

function getOverallAdvice(totalAnxiety: number) {
  if (totalAnxiety < 40) {
    return "不安は少ないようですね。リメイド式なら、さらに安心して始められます。まずは個別相談で具体的な物件や投資プランを一緒に考えましょう。";
  }

  if (totalAnxiety < 70) {
    return "いくつか不安があるのは当然です。多くの方が同じ不安を抱えていましたが、リメイド式で解消しています。個別相談で、あなたの不安を一つずつ解消していきましょう。";
  }

  return "不安が強いのは自然なことです。不動産投資は大きな決断ですから。でも、リメイド式は従来の不動産投資とは全く違います。まずは個別相談で、あなたの不安を聞かせてください。一緒に解決策を見つけましょう。";
}

function calculateCategoryScores(answers: Record<number, number>): CategoryScores {
  return categoryOrder.reduce<CategoryScores>(
    (acc, category) => {
      const categoryQuestions = questions.filter((question) => question.category === category);
      const total = categoryQuestions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0);
      acc[category] = total / categoryQuestions.length;
      return acc;
    },
    { money: 0, knowledge: 0, risk: 0, time: 0 }
  );
}

function calculateTotalAnxiety(answers: Record<number, number>) {
  const average =
    questions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0) / questions.length;

  return Math.round(((average - 1) / 4) * 100);
}

export default function AnxietyCheckPage() {
  const [step, setStep] = useState<"start" | "questions" | "loading" | "result">("start");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;
  const categoryScores = useMemo(() => calculateCategoryScores(answers), [answers]);
  const totalAnxiety = useMemo(() => calculateTotalAnxiety(answers), [answers]);

  function startCheck() {
    setAnswers({});
    setStep("questions");
  }

  function submitCheck() {
    if (!isComplete) return;

    setStep("loading");
    window.setTimeout(() => {
      setStep("result");
    }, 2300);
  }

  function resetCheck() {
    setAnswers({});
    setStep("start");
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] text-ink">
      <AnimatePresence mode="wait">
        {step === "start" && <StartScreen onStart={startCheck} />}
        {step === "questions" && (
          <QuestionsScreen
            answers={answers}
            answeredCount={answeredCount}
            isComplete={isComplete}
            onAnswer={(questionId, value) =>
              setAnswers((current) => ({
                ...current,
                [questionId]: value
              }))
            }
            onSubmit={submitCheck}
          />
        )}
        {step === "loading" && <LoadingScreen />}
        {step === "result" && (
          <ResultScreen
            categoryScores={categoryScores}
            totalAnxiety={totalAnxiety}
            onReset={resetCheck}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      key="start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F5F5_50%,#E6EEF5_100%)] px-5 py-10"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid size-28 place-items-center rounded-full border border-white bg-white shadow-soft"
          aria-hidden="true"
        >
          <ShieldCheck className="text-navy" size={52} strokeWidth={1.8} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-7 text-sm font-bold text-gold"
        >
          ANXIETY CHECK
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-3 text-[32px] font-black leading-tight text-navy sm:text-5xl"
        >
          不動産投資の不安度チェック
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
        >
          <p>
            不動産投資に対する不安を
            <br className="hidden sm:block" />
            4つのカテゴリで診断します
          </p>
          <div className="mt-5 grid gap-2 text-left sm:grid-cols-2">
            {["💰 お金の不安", "📚 知識の不安", "⚠️ リスクの不安", "⏰ 時間の不安"].map(
              (item) => (
                <div key={item} className="rounded-md bg-white px-4 py-3 text-base font-bold text-ink shadow-sm">
                  {item}
                </div>
              )
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.26 }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm"
        >
          <Clock3 size={17} className="text-orange" aria-hidden="true" />
          所要時間：約3分
        </motion.div>
        <motion.button
          type="button"
          onClick={onStart}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="mt-9 inline-flex h-[60px] w-full max-w-[300px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange to-[#F39C12] text-xl font-black text-white shadow-lg shadow-orange/25 transition hover:shadow-xl"
        >
          診断を始める
          <ArrowRight size={22} aria-hidden="true" />
        </motion.button>
      </div>
    </motion.section>
  );
}

function QuestionsScreen({
  answers,
  answeredCount,
  isComplete,
  onAnswer,
  onSubmit
}: {
  answers: Record<number, number>;
  answeredCount: number;
  isComplete: boolean;
  onAnswer: (questionId: number, value: number) => void;
  onSubmit: () => void;
}) {
  const progress = (answeredCount / questions.length) * 100;

  return (
    <motion.section
      key="questions"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35 }}
      className="px-5 py-6 sm:px-8 lg:py-10"
    >
      <div className="mx-auto max-w-5xl">
        <div className="sticky top-0 z-10 -mx-5 border-b border-slate-200 bg-[#F5F5F5]/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
          <div className="flex items-center justify-between text-sm font-bold text-slate-600">
            <span>回答済み {answeredCount} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-bold text-gold">CHECK QUESTIONS</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-navy sm:text-4xl">
            不安に近い度合いを選んでください
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            1は不安が少ない状態、5は不安が強い状態です。直感に近いものを選んでください。
          </p>
        </div>

        <div className="mt-7 grid gap-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedValue={answers[question.id]}
              onAnswer={(value) => onAnswer(question.id, value)}
            />
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <motion.button
            type="button"
            disabled={!isComplete}
            onClick={onSubmit}
            whileHover={isComplete ? { y: -2 } : undefined}
            whileTap={isComplete ? { scale: 0.98 } : undefined}
            className={`h-[60px] w-full max-w-[600px] rounded-full text-lg font-black text-white shadow-lg transition ${
              isComplete
                ? "bg-gradient-to-r from-orange to-[#F39C12] shadow-orange/20 hover:brightness-105"
                : "cursor-not-allowed bg-slate-300 shadow-none"
            }`}
          >
            診断結果を見る
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

function QuestionCard({
  question,
  selectedValue,
  onAnswer
}: {
  question: Question;
  selectedValue?: number;
  onAnswer: (value: number) => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-bold text-slate-500">{question.categoryLabel}</p>
      <h2 className="mt-2 text-lg font-black leading-7 text-navy">{question.question}</h2>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {question.options.map((option) => {
          const selected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              data-testid={`question-${question.id}-rating-${option.value}`}
              aria-pressed={selected}
              aria-label={`${option.value}: ${option.label}`}
              onClick={() => onAnswer(option.value)}
              className={`group flex min-h-16 flex-col items-center justify-center rounded-md border px-2 py-2 text-center transition ${
                selected
                  ? "border-transparent text-white shadow-lg"
                  : "border-slate-200 bg-white text-slate-700 hover:border-gold hover:bg-gold/10"
              }`}
              style={
                selected
                  ? {
                      background: `linear-gradient(135deg, ${ratingColors[option.value]}, ${ratingColors[option.value]}cc)`
                    }
                  : undefined
              }
            >
              <span className="text-xl font-black">{option.value}</span>
              <span className="mt-1 hidden text-[11px] font-bold leading-4 sm:block">{option.label}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}

function LoadingScreen() {
  return (
    <motion.section
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#1E3A5F_0%,#142A44_100%)] px-5 text-white"
    >
      <div className="text-center">
        <div className="mx-auto grid size-24 place-items-center rounded-full bg-white/10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            className="grid size-16 place-items-center rounded-full border-4 border-white/20 border-t-gold"
            aria-hidden="true"
          >
            <BarChart3 className="text-gold" size={26} />
          </motion.div>
        </div>
        <h2 className="mt-8 text-3xl font-black leading-tight">
          あなたの不安度を
          <br />
          分析しています
          <LoadingDots />
        </h2>
      </div>
    </motion.section>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex w-10 justify-start" aria-hidden="true">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: dot * 0.18 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

function ResultScreen({
  categoryScores,
  totalAnxiety,
  onReset
}: {
  categoryScores: CategoryScores;
  totalAnxiety: number;
  onReset: () => void;
}) {
  const level = getAnxietyLevel(totalAnxiety);
  const radarData = [
    { category: "お金", score: categoryScores.money },
    { category: "知識", score: categoryScores.knowledge },
    { category: "リスク", score: categoryScores.risk },
    { category: "時間", score: categoryScores.time }
  ];

  return (
    <motion.section
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="px-5 py-8 sm:px-8 lg:py-12"
    >
      <motion.div
        className="mx-auto grid max-w-6xl gap-5"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.12 }
          }
        }}
      >
        <motion.div variants={sectionVariant} className="rounded-lg bg-white p-6 text-center shadow-soft sm:p-8">
          <p className="text-sm font-bold text-gold">ANALYSIS RESULT</p>
          <h1 className="mt-2 text-3xl font-black text-navy sm:text-4xl">不安度チェック結果</h1>
          <div className="mt-8 flex flex-col items-center gap-6 lg:flex-row lg:justify-center">
            <CircularScore value={totalAnxiety} color={level.color} />
            <div className="max-w-xl text-center lg:text-left">
              <div className="text-6xl" aria-hidden="true">
                {level.emoji}
              </div>
              <h2 className="mt-4 text-2xl font-black leading-snug text-navy">
                あなたの不安度は
                <span style={{ color: level.color }}>【{level.level}】</span>
                レベルです
              </h2>
              <p className="mt-2 text-lg font-bold" style={{ color: level.color }}>
                {level.label}
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600">{level.message}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={sectionVariant} className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-black text-navy">カテゴリ別の不安度</h2>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                  <PolarGrid stroke="#DDE5EC" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "#2C3E50", fontSize: 13, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={90} domain={[1, 5]} tick={{ fill: "#7B8794", fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)} / 5.0`, "不安度"]} />
                  <Radar
                    name="不安度"
                    dataKey="score"
                    stroke="#FF9800"
                    fill="#FF9800"
                    fillOpacity={0.5}
                    isAnimationActive
                    animationDuration={1000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-3">
            {categoryOrder.map((category, index) => (
              <motion.div
                key={category}
                variants={slideVariant}
                custom={index}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <CategoryHeader category={category} score={categoryScores[category]} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={sectionVariant} className="grid gap-4 lg:grid-cols-2">
          {categoryOrder.map((category, index) => (
            <motion.article
              key={category}
              variants={slideVariant}
              custom={index}
              className="rounded-lg bg-white p-6 shadow-sm sm:p-7"
            >
              <CategoryHeader category={category} score={categoryScores[category]} />
              <h3 className="mt-5 flex items-center gap-2 text-base font-black text-navy">
                <Sparkles size={18} className="text-gold" aria-hidden="true" />
                リメイド式の解決策
              </h3>
              <ul className="mt-4 grid gap-3">
                {solutions[category].solutions.map((solution) => (
                  <li key={solution} className="flex items-start gap-3 text-sm leading-7 text-slate-700">
                    <CheckCircle2 className="mt-1 shrink-0 text-forest" size={18} aria-hidden="true" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>

        <motion.div variants={sectionVariant} className="rounded-lg border border-gold/30 bg-gold/15 p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-black text-navy">
            <AlertCircle size={22} className="text-orange" aria-hidden="true" />
            あなたへのアドバイス
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">{getOverallAdvice(totalAnxiety)}</p>
        </motion.div>

        <motion.div variants={sectionVariant} className="rounded-lg bg-navy p-6 text-center text-white shadow-soft sm:p-10">
          <p className="text-2xl font-black leading-snug">
            あなたの診断結果をもとに、
            <br />
            直接アドバイスやヒアリングします
          </p>
          <p className="mt-3 text-lg font-bold text-gold">👇無料個別相談に申し込む</p>
          <motion.a
            href="https://utage-system.com/p/YrSFgC8KLNX1"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="mt-7 inline-flex min-h-[70px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange to-[#F39C12] px-6 text-lg font-black text-white shadow-lg shadow-orange/25 transition hover:brightness-110 sm:text-xl"
          >
            無料個別相談に申し込む
            <ArrowRight size={23} aria-hidden="true" />
          </motion.a>
        </motion.div>

        <motion.button
          variants={sectionVariant}
          type="button"
          onClick={onReset}
          className="mx-auto inline-flex items-center gap-2 border-b border-navy pb-1 text-sm font-black text-navy transition hover:text-orange"
        >
          <RefreshCcw size={16} aria-hidden="true" />
          もう一度診断する
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

function CircularScore({ value, color }: { value: number; color: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const radius = 88;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="relative grid size-[220px] place-items-center">
      <svg className="-rotate-90" width="220" height="220" viewBox="0 0 220 220" aria-hidden="true">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="#E6ECF2" strokeWidth={strokeWidth} />
        <motion.circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.25 }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-6xl font-black" style={{ color }}>
          {displayValue}%
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500">総合不安度</p>
      </div>
    </div>
  );
}

function CategoryHeader({ category, score }: { category: Category; score: number }) {
  const categoryLevel = getCategoryAnxietyLevel(score);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-base font-black text-navy">{solutions[category].title}</h3>
        <p className="mt-1 text-sm font-bold text-slate-600">{score.toFixed(1)} / 5.0</p>
      </div>
      <span
        className="rounded-full px-3 py-1 text-xs font-black text-white"
        style={{ backgroundColor: categoryLevel.color }}
      >
        {categoryLevel.level}
      </span>
    </div>
  );
}

const sectionVariant = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const slideVariant = {
  hidden: { opacity: 0, x: -22 },
  show: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, delay: index * 0.04 }
  })
};
