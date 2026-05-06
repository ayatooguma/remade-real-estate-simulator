"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Home,
  RefreshCcw,
  Sparkles,
  Target,
  TimerReset
} from "lucide-react";

type UseType = "" | "storage" | "parking" | "rental" | "minpaku";
type GoalType = "" | "quick" | "stable" | "asset";

type TotalScore = {
  budget: number;
  income: number;
  time: number;
  risk: number;
  condition: number;
  use: UseType;
  goal: GoalType;
};

type ScorePatch = Partial<Omit<TotalScore, "use" | "goal">> & {
  use?: UseType;
  goal?: GoalType;
};

type Option = {
  value: string;
  label: string;
  emoji: string;
  score: ScorePatch;
};

type Question = {
  id: number;
  question: string;
  description: string;
  options: Option[];
};

type DiagnosisResult = {
  type: string;
  icon: string;
  condition: (score: TotalScore) => boolean;
  description: string;
  personality: string;
  recommendedProperty: string;
  propertyPrice: string;
  expectedIncome: string;
  recoveryPeriod: string;
  pros: string[];
  cons: string[];
  successStory: {
    name: string;
    age: number;
    job: string;
    photo: string;
    investment: string;
    result: string;
    recovery: string;
    comment: string;
  };
};

const questions: Question[] = [
  {
    id: 1,
    question: "手元資金はどのくらいありますか？",
    description: "諸費用込みで考えた場合の投資可能額",
    options: [
      { value: "low", label: "30万円以下", emoji: "💰", score: { budget: 1 } },
      { value: "medium", label: "30万円〜100万円", emoji: "💰💰", score: { budget: 2 } },
      { value: "high", label: "100万円以上", emoji: "💰💰💰", score: { budget: 3 } }
    ]
  },
  {
    id: 2,
    question: "月にどのくらいの収入を期待しますか？",
    description: "家賃収入・使用料として得たい金額",
    options: [
      { value: "low", label: "1〜2万円", emoji: "📊", score: { income: 1 } },
      { value: "medium", label: "3〜5万円", emoji: "📊📊", score: { income: 2 } },
      { value: "high", label: "6万円以上", emoji: "📊📊📊", score: { income: 3 } }
    ]
  },
  {
    id: 3,
    question: "物件管理にどのくらい時間をかけられますか？",
    description: "清掃、修繕、入居者対応などに使える時間",
    options: [
      { value: "none", label: "ほぼ時間をかけたくない", emoji: "⏰", score: { time: 1 } },
      { value: "some", label: "月に数時間なら可能", emoji: "⏰⏰", score: { time: 2 } },
      { value: "active", label: "積極的に関わりたい", emoji: "⏰⏰⏰", score: { time: 3 } }
    ]
  },
  {
    id: 4,
    question: "リスクに対する考え方は？",
    description: "投資におけるリスクとリターンのバランス",
    options: [
      { value: "safe", label: "リスクは最小限にしたい", emoji: "🛡️", score: { risk: 1 } },
      {
        value: "balanced",
        label: "リスクとリターンのバランス重視",
        emoji: "⚖️",
        score: { risk: 2 }
      },
      {
        value: "aggressive",
        label: "リスクを取ってリターンを狙いたい",
        emoji: "🚀",
        score: { risk: 3 }
      }
    ]
  },
  {
    id: 5,
    question: "物件の状態についてどう考えますか？",
    description: "リメイド式では「使える部分だけ貸す」という考え方も",
    options: [
      { value: "asis", label: "多少ボロくても気にしない", emoji: "🏚️", score: { condition: 1 } },
      { value: "minimal", label: "最低限の修繕は必要", emoji: "🔨", score: { condition: 2 } },
      { value: "good", label: "ある程度きれいな状態がいい", emoji: "✨", score: { condition: 3 } }
    ]
  },
  {
    id: 6,
    question: "興味のある用途は？（最も近いもの）",
    description: "物件をどのように活用したいか",
    options: [
      { value: "storage", label: "倉庫・物置", emoji: "📦", score: { use: "storage" } },
      { value: "parking", label: "駐車場", emoji: "🚗", score: { use: "parking" } },
      { value: "rental", label: "賃貸住宅", emoji: "🏠", score: { use: "rental" } },
      {
        value: "minpaku",
        label: "民泊・レンタルスペース",
        emoji: "🛏️",
        score: { use: "minpaku" }
      }
    ]
  },
  {
    id: 7,
    question: "投資の目的は？",
    description: "不動産投資で最も重視したいこと",
    options: [
      { value: "quick", label: "早く投資回収したい", emoji: "⚡", score: { goal: "quick" } },
      { value: "stable", label: "安定した収入が欲しい", emoji: "📈", score: { goal: "stable" } },
      { value: "asset", label: "資産として長期保有したい", emoji: "🏛️", score: { goal: "asset" } }
    ]
  }
];

const results: DiagnosisResult[] = [
  {
    type: "格安倉庫・物置投資家タイプ",
    icon: "📦",
    condition: (score) => score.budget <= 2 && score.use === "storage",
    description: "低予算・低リスクで始められる堅実派",
    personality:
      "コツコツと確実に資産を増やしたいあなた。リスクを最小限に抑えながら、着実に収益を上げるタイプです。",
    recommendedProperty: "格安納屋・倉庫",
    propertyPrice: "5万〜30万円",
    expectedIncome: "月1〜3万円",
    recoveryPeriod: "3〜6ヶ月",
    pros: ["初期費用が非常に少ない", "管理の手間がほぼゼロ", "空室リスクが低い", "需要が安定している"],
    cons: ["収入は控えめ", "物件の選択肢が限られる"],
    successStory: {
      name: "伊藤隆さん",
      age: 45,
      job: "運送業",
      photo: "👨‍💼",
      investment: "5万円の納屋",
      result: "月2.5万円の倉庫収入",
      recovery: "3ヶ月で回収完了",
      comment:
        "本業が忙しい自分にぴったりでした。管理の手間がほぼなく、安定した収入が得られています。"
    }
  },
  {
    type: "駐車場投資家タイプ",
    icon: "🚗",
    condition: (score) => score.use === "parking",
    description: "手間なく安定収入を得たい効率派",
    personality:
      "効率重視で、シンプルな投資を好むあなた。複雑な管理は避けて、手間をかけずに収入を得たいタイプです。",
    recommendedProperty: "築古戸建て・空き地",
    propertyPrice: "20万〜50万円",
    expectedIncome: "月1〜2万円",
    recoveryPeriod: "2〜4ヶ月",
    pros: ["管理がほぼ不要", "初期費用が安い", "需要が安定している", "トラブルが少ない"],
    cons: ["収入は控えめ", "立地に左右される"],
    successStory: {
      name: "田村文子さん",
      age: 63,
      job: "主婦",
      photo: "👩",
      investment: "20万円の古い空き家",
      result: "釣り人用駐車場",
      recovery: "2ヶ月以内に黒字化",
      comment:
        "不動産なんて無縁だと思っていましたが、やり方を聞いて『これなら私にもできそう』と思えました。"
    }
  },
  {
    type: "築古戸建て賃貸投資家タイプ",
    icon: "🏠",
    condition: (score) => score.budget >= 2 && score.use === "rental",
    description: "安定収入を目指すバランス派",
    personality:
      "リスクとリターンのバランスを重視するあなた。安定した賃貸需要を狙い、長期的な収益を目指すタイプです。",
    recommendedProperty: "築古戸建て",
    propertyPrice: "50万〜150万円",
    expectedIncome: "月3〜5万円",
    recoveryPeriod: "10〜20ヶ月",
    pros: ["月収が比較的高い", "賃貸需要がある", "資産価値も保てる", "様々な用途に転用可能"],
    cons: ["初期費用がやや高め", "管理の手間がある", "空室リスクがある"],
    successStory: {
      name: "渋谷かおりさん",
      age: 50,
      job: "会社員",
      photo: "👩‍💼",
      investment: "10万円の物件",
      result: "安定した家賃収入",
      recovery: "約1年",
      comment: "Morleyさんが『この物件買って大丈夫だよ』って背中を押してくれました。"
    }
  },
  {
    type: "アクティブ民泊投資家タイプ",
    icon: "🛏️",
    condition: (score) => score.use === "minpaku" || score.time >= 2,
    description: "手間をかけて高リターンを狙う積極派",
    personality:
      "自分で手を動かして、高いリターンを狙いたいあなた。やりがいを感じながら、収益を最大化するタイプです。",
    recommendedProperty: "古民家・戸建て",
    propertyPrice: "50万〜150万円",
    expectedIncome: "月3〜10万円（繁忙期）",
    recoveryPeriod: "12〜24ヶ月",
    pros: ["収入のポテンシャルが高い", "やりがいがある", "創意工夫で差別化できる"],
    cons: ["管理の手間がかかる", "繁閑の差がある", "規制対応が必要"],
    successStory: {
      name: "山口美緒さん",
      age: 36,
      job: "フリーランス",
      photo: "👩‍🎨",
      investment: "15万円の古民家",
      result: "作家向けレンタル工房",
      recovery: "現在2件で月1万円",
      comment: "不動産投資への考え方がガラリと変わりました。"
    }
  },
  {
    type: "ゼロ円物件チャレンジャータイプ",
    icon: "⚡",
    condition: (score) => score.budget === 1 && score.risk >= 2,
    description: "リスクを取って大きなリターンを狙う冒険派",
    personality:
      "チャレンジ精神旺盛で、リスクを恐れないあなた。0円物件という特殊な条件で、大きなリターンを狙うタイプです。",
    recommendedProperty: "0円物件",
    propertyPrice: "0円（諸費用10万円程度）",
    expectedIncome: "月2〜5万円",
    recoveryPeriod: "2〜5ヶ月",
    pros: ["物件価格がゼロ", "成功時のリターンが大きい", "投資回収が早い"],
    cons: ["物件の状態にリスクあり", "修繕費用が読めない", "物件探しに時間がかかる"],
    successStory: {
      name: "八木宏さん",
      age: 63,
      job: "自営業",
      photo: "👨‍💼",
      investment: "0円の物件",
      result: "月々の安定収入",
      recovery: "4ヶ月",
      comment:
        "『資金が少なくてもできる』という点に驚きました。投資なんて自分には縁がないと思っていました。"
    }
  },
  {
    type: "バランス型投資家タイプ",
    icon: "⚖️",
    condition: () => true,
    description: "リスクとリターンのバランスを重視する堅実派",
    personality:
      "極端を避け、バランスの取れた投資を好むあなた。様々な選択肢を検討しながら、最適な投資を見つけるタイプです。",
    recommendedProperty: "築古戸建て",
    propertyPrice: "30万〜100万円",
    expectedIncome: "月2〜4万円",
    recoveryPeriod: "8〜15ヶ月",
    pros: ["リスクが適度", "様々な用途に対応可能", "初期費用も現実的", "選択肢が多い"],
    cons: ["突出した特徴はない"],
    successStory: {
      name: "中島翔太さん",
      age: 43,
      job: "理学療法士",
      photo: "👨‍⚕️",
      investment: "10万円の空き家",
      result: "レンタル物置",
      recovery: "約7ヶ月",
      comment:
        "『住まなくても稼げる』モデルに衝撃を受けました。5区画を貸して毎月15,000円の安定収入です。"
    }
  }
];

const emptyScore: TotalScore = {
  budget: 0,
  income: 0,
  time: 0,
  risk: 0,
  condition: 0,
  use: "",
  goal: ""
};

function getDiagnosisResult(totalScore: TotalScore) {
  for (const result of results) {
    if (result.condition(totalScore)) {
      return result;
    }
  }

  return results[results.length - 1];
}

function mergeScores(answers: Option[]) {
  return answers.reduce<TotalScore>((score, answer) => {
    return {
      ...score,
      ...answer.score
    };
  }, emptyScore);
}

export default function PropertyDiagnosisPage() {
  const [step, setStep] = useState<"start" | "question" | "loading" | "result">("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);

  const totalScore = useMemo(() => mergeScores(answers), [answers]);
  const result = useMemo(() => getDiagnosisResult(totalScore), [totalScore]);
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  function startDiagnosis() {
    setAnswers([]);
    setCurrentIndex(0);
    setStep("question");
  }

  function selectOption(option: Option) {
    const nextAnswers = [...answers.slice(0, currentIndex), option];
    setAnswers(nextAnswers);

    if (currentIndex === questions.length - 1) {
      setStep("loading");
      window.setTimeout(() => {
        setStep("result");
      }, 2300);
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  function goBack() {
    if (currentIndex === 0) {
      setStep("start");
      return;
    }

    setCurrentIndex((index) => index - 1);
  }

  function resetDiagnosis() {
    setAnswers([]);
    setCurrentIndex(0);
    setStep("start");
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] text-ink">
      <AnimatePresence mode="wait">
        {step === "start" && <StartScreen onStart={startDiagnosis} />}
        {step === "question" && (
          <QuestionScreen
            key={currentQuestion.id}
            question={currentQuestion}
            progress={progress}
            questionNumber={currentIndex + 1}
            selectedValue={answers[currentIndex]?.value}
            onBack={goBack}
            onSelect={selectOption}
          />
        )}
        {step === "loading" && <LoadingScreen />}
        {step === "result" && <ResultScreen result={result} onReset={resetDiagnosis} />}
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
      className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F5F5_50%,#DFE9F2_100%)] px-5 py-10"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative grid size-28 place-items-center rounded-full border border-white bg-white shadow-soft"
          aria-hidden="true"
        >
          <div className="absolute inset-3 rounded-full bg-gold/20" />
          <Home className="relative text-navy" size={48} strokeWidth={1.8} />
          <Sparkles className="absolute right-4 top-5 text-orange" size={20} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-7 text-sm font-bold text-gold"
        >
          PROPERTY TYPE DIAGNOSIS
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-3 text-[32px] font-black leading-tight text-navy sm:text-5xl"
        >
          あなたにぴったりの
          <br />
          物件タイプを診断
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg leading-8 text-slate-600"
        >
          7つの質問に答えるだけで、
          <br className="hidden sm:block" />
          あなたに最適な物件タイプと投資スタイルがわかります
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.26 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm"
        >
          <Clock3 size={17} className="text-orange" aria-hidden="true" />
          所要時間：約2分
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

function QuestionScreen({
  question,
  progress,
  questionNumber,
  selectedValue,
  onBack,
  onSelect
}: {
  question: Question;
  progress: number;
  questionNumber: number;
  selectedValue?: string;
  onBack: () => void;
  onSelect: (option: Option) => void;
}) {
  return (
    <motion.section
      key={`question-${question.id}`}
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen px-5 py-6 sm:px-8"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-sm transition hover:bg-gold/15"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          戻る
        </button>

        <div className="mt-8">
          <div className="flex items-center justify-between text-sm font-bold text-slate-600">
            <span>質問 {questionNumber} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>

        <div className="flex flex-1 items-center py-8">
          <div className="w-full">
            <p className="text-sm font-bold text-gold">QUESTION {question.id}</p>
            <h2 className="mt-3 text-2xl font-black leading-snug text-navy sm:text-4xl">
              {question.question}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{question.description}</p>

            <div className="mt-8 grid gap-3">
              {question.options.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => onSelect(option)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex min-h-20 w-full items-center justify-between rounded-lg border px-4 py-4 text-left shadow-sm transition ${
                    selectedValue === option.value
                      ? "border-gold bg-gold/15"
                      : "border-slate-200 bg-white hover:border-gold hover:bg-gold/10"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-md bg-mist text-2xl">
                      {option.emoji}
                    </span>
                    <span className="text-base font-black leading-6 text-ink sm:text-lg">
                      {option.label}
                    </span>
                  </span>
                  <ArrowRight className="shrink-0 text-orange" size={21} aria-hidden="true" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
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
            <Target className="text-gold" size={26} />
          </motion.div>
        </div>
        <h2 className="mt-8 text-3xl font-black leading-tight">
          あなたにぴったりの
          <br />
          物件タイプを診断中
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
  result,
  onReset
}: {
  result: DiagnosisResult;
  onReset: () => void;
}) {
  return (
    <motion.section
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="px-5 py-8 sm:px-8 lg:py-12"
    >
      <motion.div
        className="mx-auto grid max-w-5xl gap-5"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        <motion.div
          variants={resultCardVariant}
          className="rounded-lg bg-gradient-to-br from-gold to-[#B58F22] p-5 text-white shadow-soft sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="grid size-[76px] shrink-0 place-items-center rounded-md bg-white/18 text-6xl">
              {result.icon}
            </span>
            <div>
              <p className="text-sm font-black text-white/78">診断結果</p>
              <h1 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">{result.type}</h1>
              <p className="mt-3 text-lg font-bold text-white/88">{result.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={sectionVariant} className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-black text-navy">
            <Sparkles size={22} className="text-gold" aria-hidden="true" />
            あなたの性格
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">{result.personality}</p>
        </motion.div>

        <motion.div variants={sectionVariant} className="rounded-lg bg-navy p-6 text-white shadow-soft sm:p-8">
          <h2 className="text-xl font-black">おすすめ物件情報</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile label="おすすめ物件" value={result.recommendedProperty} />
            <InfoTile label="物件価格" value={result.propertyPrice} />
            <InfoTile label="期待月収" value={result.expectedIncome} />
            <InfoTile label="投資回収期間" value={result.recoveryPeriod} />
          </div>
        </motion.div>

        <motion.div variants={sectionVariant} className="grid gap-5 lg:grid-cols-2">
          <ListPanel title="メリット" items={result.pros} tone="good" />
          <ListPanel title="デメリット" items={result.cons} tone="caution" />
        </motion.div>

        <motion.div variants={sectionVariant} className="rounded-lg bg-[#ECEFF2] p-6 sm:p-8">
          <h2 className="text-xl font-black text-navy">同じタイプで成功した方</h2>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-start">
            <div className="grid size-20 shrink-0 place-items-center rounded-full bg-white text-5xl shadow-sm">
              {result.successStory.photo}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-black text-navy">
                {result.successStory.name}・{result.successStory.age}歳・{result.successStory.job}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <SmallFact label="投資内容" value={result.successStory.investment} />
                <SmallFact label="結果" value={result.successStory.result} />
                <SmallFact label="投資回収" value={result.successStory.recovery} />
              </div>
              <blockquote className="mt-5 rounded-lg bg-white px-5 py-4 text-sm leading-7 text-slate-700 shadow-sm">
                「{result.successStory.comment}」
              </blockquote>
            </div>
          </div>
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

const sectionVariant = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const resultCardVariant = {
  hidden: { opacity: 0, y: 18, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
};

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/10 px-4 py-4">
      <p className="text-xs font-bold text-white/62">{label}</p>
      <p className="mt-2 text-lg font-black leading-snug text-white">{value}</p>
    </div>
  );
}

function ListPanel({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "good" | "caution";
}) {
  const Icon = tone === "good" ? CheckCircle2 : AlertTriangle;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-black text-navy">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-700">
            <Icon
              className={tone === "good" ? "mt-1 shrink-0 text-forest" : "mt-1 shrink-0 text-orange"}
              size={18}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmallFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black leading-6 text-ink">{value}</p>
    </div>
  );
}
