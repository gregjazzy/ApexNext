'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, FileText, Upload, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { contextLexicon, getLexiconValue, personaLabels } from '@/lib/lexicon';

export function Step2Context() {
  const t = useTranslations('step2');
  const locale = useLocale();
  const { context, setJobTitle, setIndustry, setJobDescription, nextStep, prevStep } = useAuditStore();
  const [dragActive, setDragActive] = useState(false);

  const canProceed = context.jobTitle.trim() && context.industry;
  const persona = context.persona || 'salarie';
  const l = locale === 'en' ? 'en' : 'fr';

  const industries = [
    { key: 'tech', label: t('industries.tech') },
    { key: 'finance', label: t('industries.finance') },
    { key: 'health', label: t('industries.health') },
    { key: 'retail', label: t('industries.retail') },
    { key: 'industry', label: t('industries.industry') },
    { key: 'consulting', label: t('industries.consulting') },
    { key: 'media', label: t('industries.media') },
    { key: 'education', label: t('industries.education') },
    { key: 'realestate', label: t('industries.realestate') },
    { key: 'energy', label: t('industries.energy') },
    { key: 'transport', label: t('industries.transport') },
    { key: 'other', label: t('industries.other') },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setJobDescription(text);
        };
        reader.readAsText(file);
      }
    }
  }, [setJobDescription]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setJobDescription(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Header with Dynamic Title */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Mode Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Mode Diagnostic : {personaLabels[persona][l]}
          </span>
          
          <h1 className="apex-title text-4xl md:text-5xl">
            {getLexiconValue(contextLexicon.title, persona, locale)}
          </h1>
        </motion.div>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getLexiconValue(contextLexicon.subtitle, persona, locale)}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Main Fields */}
        <div className="space-y-6">
          {/* Job Title / Core Business / Managerial Scope */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="apex-label flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {getLexiconValue(contextLexicon.jobLabel, persona, locale)}
            </label>
            <input
              type="text"
              value={context.jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder={getLexiconValue(contextLexicon.jobPlaceholder, persona, locale)}
              className="apex-input"
            />
          </motion.div>

          {/* Industry / Target Market */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="apex-label flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {getLexiconValue(contextLexicon.industryLabel, persona, locale)}
            </label>
            <select
              value={context.industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="apex-select"
            >
              <option value="">{t('industryPlaceholder')}</option>
              {industries.map((ind) => (
                <option key={ind.key} value={ind.label}>
                  {ind.label}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {/* Right Column - File Upload */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="apex-label flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {getLexiconValue(contextLexicon.descriptionLabel, persona, locale)}
            <span className="text-slate-600 font-normal">(optionnel)</span>
          </label>
          
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-slate-700 hover:border-slate-600'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".txt"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <Upload className={`w-10 h-10 mx-auto mb-4 ${dragActive ? 'text-blue-400' : 'text-slate-500'}`} />
            
            <p className="text-slate-300 font-medium mb-1">
              {t('dragDropHint')}
            </p>
            <p className="text-sm text-slate-500">
              {t('browseHint')}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Job Description Preview */}
      {context.jobDescription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="apex-card p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('importedFile')}
            </span>
            <button
              onClick={() => setJobDescription('')}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="bg-slate-800/50 rounded p-3 max-h-40 overflow-y-auto">
            <p className="text-sm text-slate-400 whitespace-pre-wrap">
              {context.jobDescription.substring(0, 500)}
              {context.jobDescription.length > 500 && '...'}
            </p>
          </div>
        </motion.div>
      )}

      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel={t('nextButton')}
      />
    </motion.div>
  );
}
