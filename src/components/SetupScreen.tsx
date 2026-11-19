import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  CircleCheck,
  Copy,
  CreditCard,
  Fingerprint,
  Globe,
  Lock,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import {
  ASSETS,
  getPromoCode,
  Language,
  PLATFORM,
  TRANSLATIONS,
} from '../constants/assets';
import { soundFx } from '../utils/sound';

interface SetupScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (userId: string) => void;
  initialUserId?: string;
}

interface StepCardProps {
  number: string;
  label: string;
  title: string;
  icon: typeof Lock;
  image?: string;
  children: ReactNode;
}

const CARD_SURFACE_CLASS =
  'rounded-2xl border border-white/[0.07] bg-white/[0.02]';
const PRIMARY_CTA_CLASS =
  'w-full h-14 rounded-2xl bg-gradient-to-l from-[#3B82F6] to-white text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_16px_40px_-16px_rgba(59,130,246,0.85)] transition-all active:scale-[0.98] group cursor-pointer';

function StepCard({ number, label, title, icon: Icon, image, children }: StepCardProps) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#030712]/90 p-5 backdrop-blur-xl">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[rgba(59,130,246,0.12)] blur-[70px]" />

      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[rgba(59,130,246,0.3)] bg-black/80">
            {image && !imgErr ? (
              <img
                src={image}
                alt={title}
                referrerPolicy="no-referrer"
                onError={() => setImgErr(true)}
                className="h-9 w-9 rounded-xl object-contain"
              />
            ) : (
              <Icon className="h-5 w-5 text-[#3B82F6]" />
            )}
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3B82F6]">
              {label}
            </span>
            <h3 className="truncate text-base font-black text-white">{title}</h3>
          </div>
        </div>

        <span className="shrink-0 rounded-xl border border-[rgba(59,130,246,0.28)] bg-black/70 px-2.5 py-1 font-mono text-xs font-black text-[#3B82F6]">
          {number}
        </span>
      </div>

      <div className="relative">{children}</div>
    </section>
  );
}

export function SetupScreen({
  language,
  onLanguageChange,
  onComplete,
  initialUserId = '',
}: SetupScreenProps) {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState(initialUserId);
  const [errors, setErrors] = useState<{ userId?: boolean; userIdLength?: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [verifyStage, setVerifyStage] = useState<'step1' | 'step2' | 'ready'>('step1');
  const [muted, setMuted] = useState(soundFx.isMuted());
  const [logoErr, setLogoErr] = useState(false);
  const [crashErr, setCrashErr] = useState(false);

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const promoCode = getPromoCode();

  const handleCopyPromo = async () => {
    soundFx.playCopy();
    try {
      await navigator.clipboard.writeText(promoCode);
    } catch {
      // Fallback copy if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = promoCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifySubmit = () => {
    soundFx.playClick();
    const cleaned = userId.trim();
    const validLength = cleaned.length >= 10 && cleaned.length <= 15;
    const nextErrors = {
      userId: !cleaned,
      userIdLength: !validLength,
    };
    setErrors(nextErrors);

    if (!nextErrors.userId && !nextErrors.userIdLength) {
      soundFx.playScan();
      setShowModal(true);
      setVerifyStage('step1');
      setTimeout(() => {
        soundFx.playSoftClick();
        setVerifyStage('step2');
      }, 1100);
      setTimeout(() => {
        soundFx.playSuccess();
        setVerifyStage('ready');
      }, 2200);
    } else {
      soundFx.playError();
    }
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    soundFx.setMuted(next);
    if (!next) soundFx.playClick();
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative flex min-h-full flex-col bg-transparent text-white selection:bg-[#3B82F6]/30"
    >
      {/* Subtle Ambient Backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.45) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[rgba(59,130,246,0.12)] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col px-3 pb-16 pt-4 sm:px-6">
        {/* Top Status & Controls Row */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.08)] px-3.5 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6] animate-pulse" />
            <span className="whitespace-nowrap text-xs font-black uppercase tracking-wider text-[#3B82F6]">
              {t.activationBadge}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={muted ? 'Unmute sound' : 'Mute sound'}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-[#3B82F6]/50 hover:text-white cursor-pointer"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#3B82F6]" />}
            </button>

            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-0.5">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onLanguageChange('ar');
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-black transition-colors cursor-pointer ${
                  language === 'ar'
                    ? 'bg-[#3B82F6] text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                AR
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onLanguageChange('en');
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-black transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#3B82F6] text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Hero Terminal Card */}
        <div className="relative mb-5 overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-b from-[rgba(59,130,246,0.10)] via-black/80 to-black p-5 backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[rgba(59,130,246,0.18)] blur-[90px]" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[rgba(59,130,246,0.35)] bg-black/80 p-1.5 shadow-[0_0_24px_rgba(59,130,246,0.4)]">
              {!logoErr ? (
                <img
                  src={ASSETS.brandLogo}
                  alt={PLATFORM.brandTitle}
                  referrerPolicy="no-referrer"
                  onError={() => setLogoErr(true)}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="font-mono text-2xl font-black text-[#3B82F6]">1X</span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-black leading-tight tracking-wide text-white">
              {language === 'ar' ? (
                <>
                  هاك <span className="text-[#3B82F6]">1 اكس بت</span>
                </>
              ) : (
                <>
                  Hack <span className="text-[#3B82F6]">1xBet</span>
                </>
              )}
            </h1>

            <p className="mt-2 max-w-[320px] text-xs leading-relaxed text-white/60 sm:text-sm">
              {t.heroDesc}
            </p>

            {/* Step Pill Indicators 01 -> 03 */}
            <div className="mt-4 flex w-full items-center justify-center gap-1.5" dir="ltr">
              {['01', '02', '03'].map((num) => (
                <div key={num} className="flex items-center gap-1.5">
                  <span className="rounded-lg border border-[rgba(59,130,246,0.28)] bg-black/70 px-2 py-1 font-mono text-[10px] font-black text-[#3B82F6]">
                    {num}
                  </span>
                  {num !== '03' && <span className="h-px w-2 bg-[rgba(59,130,246,0.35)]" />}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 animate-pulse text-[#3B82F6]" />
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#3B82F6]">
                {t.instantActivation}
              </span>
            </div>
          </div>
        </div>

        {/* Active Game Showcase (Crash only) */}
        <section className="mb-5" aria-label={t.crashTitle}>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#3B82F6]/60 bg-[#3B82F6]/10 p-4 shadow-[0_0_24px_-8px_rgba(59,130,246,0.5)]">
            <div className="flex items-center gap-3">
              {!crashErr ? (
                <img
                  src={ASSETS.crashPlane}
                  alt={t.crashTitle}
                  referrerPolicy="no-referrer"
                  onError={() => setCrashErr(true)}
                  className="h-14 w-14 rounded-xl object-contain"
                />
              ) : (
                <span className="text-3xl">✈</span>
              )}
              <div>
                <h2 className="text-base font-black text-white">{t.crashPredictorTitle}</h2>
                <p className="text-xs text-white/60">{t.crashPredictorDesc}</p>
              </div>
            </div>

            <div className="shrink-0 text-end">
              <span className="block text-[10px] font-black uppercase tracking-wider text-white/50">
                {t.promoLabel}
              </span>
              <strong dir="ltr" className="font-mono text-lg font-black text-[#3B82F6]">
                {promoCode}
              </strong>
            </div>
          </div>
        </section>

        {/* 3 Activation Steps */}
        <div className="flex flex-col gap-4">
          {/* Step 01: Promo Code */}
          <StepCard number="01" label={t.step1Label} title={t.step1Title} icon={Lock}>
            <div className="flex flex-col gap-4">
              <p className={`p-4 text-xs leading-relaxed text-white/75 sm:text-sm ${CARD_SURFACE_CLASS}`}>
                {t.step1Desc}
              </p>

              <button
                type="button"
                onClick={handleCopyPromo}
                className="group relative w-full cursor-pointer rounded-2xl border-2 border-dashed border-[rgba(59,130,246,0.4)] bg-black/60 p-4 text-start transition-all hover:border-[#3B82F6]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                      {t.approvedPromo}
                    </span>
                    <span
                      dir="ltr"
                      className="inline-block font-mono text-2xl font-black tracking-[0.2em] text-[#3B82F6] drop-shadow-[0_0_14px_rgba(59,130,246,0.6)] sm:text-3xl"
                    >
                      {promoCode}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      copied
                        ? 'bg-[#3B82F6] text-black shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                        : 'bg-white/5 text-white/80 group-hover:bg-[rgba(59,130,246,0.12)] group-hover:text-[#3B82F6]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>{t.copyCode}</span>
                      </>
                    )}
                  </div>
                </div>

                <Sparkles className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#3B82F6]/60" />
              </button>
            </div>
          </StepCard>

          {/* Step 02: First Deposit */}
          <StepCard number="02" label={t.step2Label} title={t.step2Title} icon={CreditCard}>
            <div className="flex flex-col gap-4">
              <p className={`p-4 text-xs leading-relaxed text-white/75 sm:text-sm ${CARD_SURFACE_CLASS}`}>
                {t.step2Desc}
              </p>

              <div className="grid grid-cols-2 gap-3" dir="ltr">
                {[
                  { label: 'USD ($)', value: '$6.00' },
                  { label: 'EGP (L.E)', value: '300 L.E' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center justify-center p-4 text-center ${CARD_SURFACE_CLASS}`}
                  >
                    <span className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                      {item.label}
                    </span>
                    <span className="font-mono text-2xl font-black text-[#3B82F6] drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-white/55">
                <Globe className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                <span>{t.depositAutoNote}</span>
              </div>
            </div>
          </StepCard>

          {/* Step 03: Verify Account ID */}
          <StepCard
            number="03"
            label={t.step3Label}
            title={t.step3Title}
            icon={Fingerprint}
            image={ASSETS.verifyBadge}
          >
            <div className="flex flex-col gap-4">
              <p className={`p-4 text-xs leading-relaxed text-white/75 sm:text-sm ${CARD_SURFACE_CLASS}`}>
                {t.step3Desc}
              </p>

              <div>
                <label
                  htmlFor="dbbet-user-id"
                  className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.18em] text-white/60"
                >
                  {t.userIdLabel}
                </label>

                <div className="relative">
                  <div
                    className={`absolute inset-y-0 flex items-center justify-center border-white/10 px-3 ${
                      isRtl ? 'right-0 border-l' : 'left-0 border-r'
                    }`}
                  >
                    <Fingerprint
                      className={`h-6 w-6 ${userId ? 'text-[#3B82F6]' : 'text-white/30'}`}
                    />
                  </div>
                  <input
                    id="dbbet-user-id"
                    type="tel"
                    inputMode="numeric"
                    value={userId}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, '');
                      if (digits.length <= 15) {
                        setUserId(digits);
                        if (digits.length >= 10) {
                          setErrors({ userId: false, userIdLength: false });
                        }
                      }
                    }}
                    placeholder={t.userIdPlaceholder}
                    maxLength={15}
                    className={`w-full rounded-2xl border bg-black/60 py-3.5 font-mono text-lg text-white transition-all placeholder:text-white/25 focus:outline-none ${
                      isRtl ? 'pl-4 pr-16 text-right' : 'pl-16 pr-4 text-left'
                    } ${
                      errors.userId || errors.userIdLength
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-white/10 focus:border-[#3B82F6]'
                    }`}
                  />
                </div>

                {(errors.userId || errors.userIdLength) && (
                  <p className="mt-2 text-xs font-bold text-red-400">{t.userIdError}</p>
                )}
              </div>

              <button type="button" onClick={handleVerifySubmit} className={PRIMARY_CTA_CLASS}>
                <span>{t.submitVerify}</span>
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </StepCard>
        </div>

        {/* Footer Security Banner */}
        <div className={`mt-5 flex items-center gap-2 p-4 text-xs text-white/55 ${CARD_SURFACE_CLASS}`}>
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#3B82F6]" />
          <span>{t.serverVerifyNote}</span>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1.5 opacity-50">
          <div className="h-px w-10 bg-[rgba(59,130,246,0.4)]" />
          <span className="text-center text-[9px] font-black uppercase tracking-[0.28em] text-white/60">
            {t.footerSecurity}
          </span>
        </div>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 p-4 backdrop-blur-2xl sm:items-center"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative w-full max-w-[400px] overflow-hidden rounded-[26px] border border-[rgba(59,130,246,0.25)] bg-[#030712]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/[0.07] bg-[rgba(59,130,246,0.06)] px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" />
                  <span className="text-[11px] font-black tracking-[0.12em] text-[#3B82F6]">
                    {t.brandTitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setShowModal(false);
                  }}
                  aria-label="Close"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-white/60 transition-all hover:text-white active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-5 py-6">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.08)]">
                    <Fingerprint className="h-5 w-5 text-[#3B82F6]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      {t.accountId}
                    </span>
                    <span className="block truncate font-mono text-lg font-black tracking-wider text-white">
                      {userId}
                    </span>
                  </div>
                  <div
                    dir="ltr"
                    className={`rounded-lg border border-[rgba(59,130,246,0.25)] bg-black px-2.5 py-1 font-mono text-[11px] font-black text-[#3B82F6] ${
                      isRtl ? 'mr-auto' : 'ml-auto'
                    }`}
                  >
                    {promoCode}
                  </div>
                </div>

                {/* 3 Verification Steps */}
                <div className="mt-5 flex flex-col gap-2.5">
                  {[
                    { key: 'step1', text: t.verifyStep1 },
                    { key: 'step2', text: t.verifyStep2 },
                    { key: 'ready', text: t.verifyStep3 },
                  ].map((step, idx) => {
                    const order = ['step1', 'step2', 'ready'];
                    const currentIdx = order.indexOf(verifyStage);
                    const done = currentIdx > idx || verifyStage === 'ready';
                    const active = currentIdx === idx && verifyStage !== 'ready';

                    return (
                      <div
                        key={step.key}
                        className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-500 ${
                          done
                            ? 'border-[rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.07)]'
                            : active
                            ? 'border-white/15 bg-white/[0.04]'
                            : 'border-white/[0.06] bg-transparent'
                        }`}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black">
                          {done ? (
                            <Check className="h-3.5 w-3.5 text-[#3B82F6]" />
                          ) : active ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                              className="h-3.5 w-3.5 rounded-full border border-[rgba(59,130,246,0.2)] border-t-[#3B82F6]"
                            />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                          )}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            done ? 'text-white' : active ? 'text-white/75' : 'text-white/35'
                          }`}
                        >
                          {step.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {verifyStage === 'ready' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <div className="mb-4 flex items-center justify-center gap-2 text-xs font-black text-[#3B82F6]">
                      <CircleCheck className="h-4 w-4" />
                      <span>{t.verifySuccess}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setShowModal(false);
                        onComplete(userId.trim());
                      }}
                      className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-[18px] bg-gradient-to-l from-[#3B82F6] to-white text-sm font-black text-black shadow-[0_16px_40px_-16px_rgba(59,130,246,0.85)] transition-all active:scale-[0.98]"
                    >
                      <Zap className="h-5 w-5 fill-black" />
                      <span>{t.enterPredictions}</span>
                    </button>
                  </motion.div>
                ) : (
                  <p className="mt-6 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
                    {t.verifyingWait}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
