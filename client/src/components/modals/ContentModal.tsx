import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleAr: string;
  titleEn: string;
  contentAr: string | React.ReactNode;
  contentEn: string | React.ReactNode;
}

export default function ContentModal({
  isOpen,
  onClose,
  titleAr,
  titleEn,
  contentAr,
  contentEn,
}: ContentModalProps) {
  const { t, direction } = useLanguage();
  const dir = direction;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      dir={dir}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 
            className="text-2xl font-bold bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent"
            style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t(titleAr, titleEn)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="p-6 overflow-y-auto flex-1"
          style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
        >
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {dir === 'rtl' ? contentAr : contentEn}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#846F9C] to-[#4691A9] text-white rounded-lg hover:opacity-90 transition-opacity"
            style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t('إغلاق', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
}

