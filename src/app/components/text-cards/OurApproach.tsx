import { useTranslations } from "next-intl";

export default function OurApproach() {
  const t = useTranslations('OurApproach');
  return (
    <div className="rounded-2xl z-10 relative bg-background pt-8 px-12 pb-12 shadow-[0px_-12px_0px_0px_#19184b,inset_0px_-12px_0px_0px_#19184b] md:py-20">
      <p className="font-helvetica pt-6 text-theme-orange leading-[1.1] text-5xl">
        {t('Uma escola internacional onde culturas se encontram')}.
      </p>
      <p className="text-[1.8rem] pt-6">
        {t('Na Nitro Academy, o intercâmbio cultural acontece entre mentores de vários países e alunos do mundo todo')}.
      </p>
    </div>
  );
}
