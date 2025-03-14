import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ChanceInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const ChanceInput: FC<ChanceInputProps> = ({ value, onChange, onSubmit, onReset }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ne permet que les chiffres
    if (!/^\d*$/.test(value)) return;

    // Convertit en nombre et vérifie les limites
    const numValue = parseInt(value);
    if (value === '' || (numValue >= 1 && numValue <= 30)) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={value}
          onChange={handleChange}
          className="w-32 text-center text-2xl font-bold rounded-lg border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:outline-none p-2 bg-transparent"
          placeholder={t('scoreModal.chance.placeholder')}
        />
        <p className="text-sm text-gray-500">{t('scoreModal.chance.help')}</p>
      </div>
      <div className="space-y-2">
        <button
          onClick={onSubmit}
          disabled={!value || parseInt(value) < 1 || parseInt(value) > 30}
          className="w-full bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed text-purple-900 font-bold py-4 rounded-xl transition-colors text-xl shadow-sm hover:shadow-md">
          {t('scoreModal.chance.validate')}
        </button>
        <button
          onClick={onReset}
          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold py-4 rounded-xl transition-colors text-xl shadow-sm hover:shadow-md">
          {t('scoreModal.common.reset')}
        </button>
      </div>
    </div>
  );
};
