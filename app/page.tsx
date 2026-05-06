"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  ArrowRight,
  Building2,
  Car,
  Check,
  ChevronRight,
  Home,
  Hotel,
  LineChart,
  PiggyBank,
  Sparkles,
  Store,
  Warehouse
} from "lucide-react";

type Usage = "倉庫" | "駐車場" | "民泊" | "賃貸住宅";

type CaseStudy = {
  title: string;
  capital: number;
  monthly: number;
  use: Usage;
  area: string;
  period: number;
  note: string;
};

const usageOptions: Array<{ label: Usage; icon: typeof Warehouse }> = [
  { label: "倉庫", icon: Warehouse },
  { label: "駐車場", icon: Car },
  { label: "民泊", icon: Hotel },
  { label: "賃貸住宅", icon: Home }
];

const caseStudies: CaseStudy[] = [
  {
    title: "築古戸建てを倉庫転用",
    capital: 50,
    monthly: 3,
    use: "倉庫",
    area: "郊外住宅地",
    period: 18,
    note: "小規模改修で固定費を抑え、近隣事業者の保管需要を取り込み。"
  },
  {
    title: "空き地を月極駐車場化",
    capital: 30,
    monthly: 2,
    use: "駐車場",
    area: "駅徒歩圏",
    period: 15,
    note: "舗装と区画整備を最小限にして、早期稼働を優先。"
  },
  {
    title: "戸建て再生の賃貸運用",
    capital: 120,
    monthly: 5,
    use: "賃貸住宅",
    area: "地方中核市",
    period: 24,
    note: "水回りを重点改修し、ファミリー層向けの長期入居を確保。"
  },
  {
    title: "小型民泊への用途変更",
    capital: 180,
    monthly: 8,
    use: "民泊",
    area: "観光導線沿い",
    period: 26,
    note: "繁忙期単価を高める内装に集中し、運営代行を併用。"
  },
  {
    title: "駐車場併設の戸建て活用",
    capital: 90,
    monthly: 4,
    use: "駐車場",
    area: "商業施設近隣",
    period: 22,
    note: "建物賃貸と外部駐車区画を組み合わせ、収益源を分散。"
  },
  {
    title: "倉庫兼アトリエ賃貸",
    capital: 220,
    monthly: 9,
    use: "倉庫",
    area: "準工業エリア",
    period: 28,
    note: "天井高と搬入動線を活かし、法人向けの単価で募集。"
  }
];

const formatMan = (value: number) => `${value.toLocaleString("ja-JP")}万円`;

function getRangeProgress(value: number, min: number, max: number) {
  return `${((value - min) / (max - min)) * 100}%`;
}

function getRecommendedType(
  capital: number,
  monthlyIncome: number,
  selectedUsages: Usage[]
) {
  const primaryUse =
    selectedUsages[0] ??
    (capital < 60 ? "駐車場" : capital < 140 ? "倉庫" : "賃貸住宅");

  if (capital < 40) {
    return {
      label: `低資金スタート型（${primaryUse}用途）`,
      description:
        "初期整備を絞り、空き地・小型スペース・部分貸しで早期稼働を狙う設計です。",
      icon: Store
    };
  }

  if (capital < 100) {
    return {
      label: `築古戸建て再生（${primaryUse}用途）`,
      description:
        "取得費と改修費を分けて管理しやすく、月3万円前後の現実的な収益化と相性が良い条件です。",
      icon: Home
    };
  }

  if (capital < 200 || monthlyIncome <= 6) {
    return {
      label: `戸建て・小規模複合運用（${primaryUse}中心）`,
      description:
        "賃貸・倉庫・駐車場を組み合わせ、空室リスクを抑えながら収益の厚みを作れます。",
      icon: Building2
    };
  }

  return {
    label: `高収益リメイド型（${primaryUse}特化）`,
    description:
      "改修余地のある物件に資金を寄せ、民泊・法人倉庫・複合賃貸など高単価運用を検討できます。",
    icon: Sparkles
  };
}

function buildProjection(capital: number, monthlyIncome: number) {
  const rampMonths = monthlyIncome >= 7 ? 4 : monthlyIncome >= 4 ? 3 : 2;
  const setupReserve = Math.max(8, Math.round(capital * 0.08));
  const totalOutlay = capital + setupReserve;
  const breakEvenMonth = Math.ceil(totalOutlay / monthlyIncome) + rampMonths;
  const yearsToShow = Math.max(5, Math.min(10, Math.ceil(breakEvenMonth / 12) + 3));

  const data = Array.from({ length: yearsToShow + 1 }, (_, year) => {
    const months = year * 12;
    const effectiveMonths = Math.max(0, months - rampMonths);
    const cumulative = Math.round(effectiveMonths * monthlyIncome - totalOutlay);
    const annualCashflow =
      year === 0
        ? 0
        : Math.round(
            Math.min(12, Math.max(0, months - rampMonths - (year - 1) * 12)) *
              monthlyIncome
          );

    return {
      year: `${year}年`,
      cumulative,
      annualCashflow
    };
  });

  return {
    data,
    setupReserve,
    totalOutlay,
    breakEvenMonth,
    breakEvenYear: Number((breakEvenMonth / 12).toFixed(1)),
    tenYearProfit: Math.round(Math.max(0, 120 - rampMonths) * monthlyIncome - totalOutlay),
    roi: Math.round(((monthlyIncome * 12) / totalOutlay) * 100)
  };
}

function getMatchingCases(
  capital: number,
  monthlyIncome: number,
  selectedUsages: Usage[]
) {
  return [...caseStudies]
    .sort((a, b) => {
      const aUsage = selectedUsages.includes(a.use) ? 0 : 18;
      const bUsage = selectedUsages.includes(b.use) ? 0 : 18;
      const aScore =
        aUsage + Math.abs(a.capital - capital) * 0.18 + Math.abs(a.monthly - monthlyIncome) * 6;
      const bScore =
        bUsage + Math.abs(b.capital - capital) * 0.18 + Math.abs(b.monthly - monthlyIncome) * 6;

      return aScore - bScore;
    })
    .slice(0, 3);
}

export default function HomePage() {
  const [capital, setCapital] = useState(50);
  const [monthlyIncome, setMonthlyIncome] = useState(3);
  const [selectedUsages, setSelectedUsages] = useState<Usage[]>(["倉庫"]);

  const recommendation = useMemo(
    () => getRecommendedType(capital, monthlyIncome, selectedUsages),
    [capital, monthlyIncome, selectedUsages]
  );
  const projection = useMemo(
    () => buildProjection(capital, monthlyIncome),
    [capital, monthlyIncome]
  );
  const matchedCases = useMemo(
    () => getMatchingCases(capital, monthlyIncome, selectedUsages),
    [capital, monthlyIncome, selectedUsages]
  );

  const RecommendationIcon = recommendation.icon;

  function toggleUsage(usage: Usage) {
    setSelectedUsages((current) =>
      current.includes(usage)
        ? current.filter((item) => item !== usage)
        : [...current, usage]
    );
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="border-b border-slate-200/80 bg-white/[0.86] backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-7">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              REMADE INVESTMENT
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              リメイド式不動産投資シミュレーター
            </h1>
          </div>
          <a
            href="#result"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange/20 transition hover:bg-[#d86f17] sm:w-auto"
          >
            結果を見る
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gold">入力条件</p>
              <h2 className="mt-1 text-2xl font-bold text-navy">資金と目標を調整</h2>
            </div>
            <div className="rounded-full bg-navy/[0.08] p-3 text-navy">
              <PiggyBank size={24} aria-hidden="true" />
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="capital" className="text-base font-bold text-ink">
                  手元資金
                </label>
                <strong className="text-3xl font-black text-navy sm:text-4xl">
                  {formatMan(capital)}
                </strong>
              </div>
              <input
                id="capital"
                type="range"
                min={10}
                max={300}
                step={10}
                value={capital}
                style={
                  {
                    "--range-progress": getRangeProgress(capital, 10, 300)
                  } as React.CSSProperties
                }
                onChange={(event) => setCapital(Number(event.target.value))}
                className="mt-5"
              />
              <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                <span>10万円</span>
                <span>300万円</span>
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="income" className="text-base font-bold text-ink">
                  希望月収
                </label>
                <strong className="text-3xl font-black text-navy sm:text-4xl">
                  月{formatMan(monthlyIncome)}
                </strong>
              </div>
              <input
                id="income"
                type="range"
                min={1}
                max={10}
                step={1}
                value={monthlyIncome}
                style={
                  {
                    "--range-progress": getRangeProgress(monthlyIncome, 1, 10)
                  } as React.CSSProperties
                }
                onChange={(event) => setMonthlyIncome(Number(event.target.value))}
                className="mt-5"
              />
              <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                <span>月1万円</span>
                <span>月10万円</span>
              </div>
            </div>

            <fieldset>
              <legend className="text-base font-bold text-ink">興味のある用途</legend>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {usageOptions.map(({ label, icon: Icon }) => {
                  const checked = selectedUsages.includes(label);

                  return (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleUsage(label)}
                      className={`flex min-h-16 items-center gap-3 rounded-md border px-3 py-3 text-left transition ${
                        checked
                          ? "border-navy bg-navy text-white shadow-lg shadow-navy/[0.16]"
                          : "border-slate-200 bg-white text-ink hover:border-gold"
                      }`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full border ${
                          checked ? "border-white/50 bg-white/15" : "border-slate-300 bg-mist"
                        }`}
                      >
                        {checked ? (
                          <Check size={16} aria-hidden="true" />
                        ) : (
                          <Icon size={16} aria-hidden="true" />
                        )}
                      </span>
                      <span className="text-sm font-bold">{label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </motion.div>

        <div id="result" className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="rounded-lg border border-slate-200 bg-navy p-5 text-white shadow-soft sm:p-7"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-md bg-gold text-navy">
                  <RecommendationIcon size={25} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gold">おすすめ物件タイプ</p>
                  <h2 className="mt-1 text-2xl font-bold leading-snug">
                    {recommendation.label}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
                    手元資金{formatMan(capital)}なら、{recommendation.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 md:min-w-72">
                <Metric label="回収目安" value={`${projection.breakEvenMonth}カ月`} />
                <Metric label="年間利回り" value={`${projection.roi}%`} />
                <Metric label="予備費" value={formatMan(projection.setupReserve)} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-gold">
                  <LineChart size={17} aria-hidden="true" />
                  投資回収シミュレーション
                </p>
                <h2 className="mt-1 text-2xl font-bold text-navy">
                  累計キャッシュフロー推移
                </h2>
              </div>
              <p className="rounded-md bg-mist px-3 py-2 text-sm font-bold text-ink">
                損益分岐: 約{projection.breakEvenYear}年
              </p>
            </div>

            <div className="mt-6 h-72 w-full sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection.data} margin={{ left: -12, right: 12, top: 8 }}>
                  <defs>
                    <linearGradient id="cashflow" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.42} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E7ECF1" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: "#66788A" }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#66788A" }}
                    tickFormatter={(value) => `${value}万`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}万円`, "累計"]}
                    labelStyle={{ color: "#1E3A5F", fontWeight: 700 }}
                    contentStyle={{
                      border: "1px solid #D9E2EA",
                      borderRadius: 8,
                      boxShadow: "0 16px 42px rgba(30, 58, 95, 0.14)"
                    }}
                  />
                  <ReferenceLine y={0} stroke="#E67E22" strokeWidth={2} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#1E3A5F"
                    strokeWidth={3}
                    fill="url(#cashflow)"
                    dot={{ r: 4, fill: "#D4AF37", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 6, fill: "#E67E22" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <SummaryTile label="初期投下額" value={formatMan(projection.totalOutlay)} />
              <SummaryTile label="10年後の累計収益" value={formatMan(projection.tenYearProfit)} />
              <SummaryTile label="想定月間CF" value={`月${formatMan(monthlyIncome)}`} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-gold">SUCCESS CASES</p>
              <h2 className="mt-1 text-2xl font-bold text-navy">近い条件の成功事例</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              選択した資金・希望月収・用途に近い順で表示しています。数値は体験用のモデルケースです。
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {matchedCases.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-md bg-gold/15 px-3 py-1 text-xs font-black text-navy">
                    {item.use}
                  </span>
                  <ChevronRight size={18} className="text-orange" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">{item.note}</p>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  <MiniStat label="資金" value={formatMan(item.capital)} />
                  <MiniStat label="月収" value={`月${formatMan(item.monthly)}`} />
                  <MiniStat label="回収" value={`${item.period}カ月`} />
                </div>
                <p className="mt-4 text-xs font-bold text-slate-500">{item.area}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/10 px-3 py-3 text-center">
      <p className="text-[11px] font-bold text-white/62">{label}</p>
      <p className="mt-1 text-base font-black text-white">{value}</p>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-mist px-4 py-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-navy">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-ink">{value}</p>
    </div>
  );
}
