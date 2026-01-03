'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, FileText, Upload, X, CheckCircle, Clock, Users, Zap, DollarSign, Handshake } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { contextLexicon, getLexiconValue, personaLabels } from '@/lib/lexicon';

export function Step2Context() {
  const t = useTranslations('step2');
  const locale = useLocale();
  const { 
    context, 
    setJobTitle, 
    setIndustry, 
    setJobDescription, 
    setYearsExperience,
    setTeamSize,
    setAutomationExposure,
    setBudgetResponsibility,
    setClientFacing,
    nextStep, 
    prevStep 
  } = useAuditStore();
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [manualText, setManualText] = useState('');

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

  // Fusion des deux sources dans le store
  const updateCombinedDescription = useCallback((fileContent: string | null, manual: string) => {
    const parts: string[] = [];
    if (fileContent) {
      parts.push('--- Contenu du fichier importé ---\n' + fileContent);
    }
    if (manual.trim()) {
      parts.push('--- Description manuelle ---\n' + manual.trim());
    }
    setJobDescription(parts.join('\n\n'));
  }, [setJobDescription]);

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
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setFileUploaded(true);
          updateCombinedDescription(text, manualText);
        };
        reader.readAsText(file);
      }
    }
  }, [manualText, updateCombinedDescription]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileUploaded(true);
        updateCombinedDescription(text, manualText);
      };
      reader.readAsText(file);
    }
  };

  const handleManualTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setManualText(text);
    // Si pas de fichier uploadé, le texte manuel est la seule source
    if (!fileUploaded) {
      setJobDescription(text);
    } else {
      // Sinon on fusionne
      updateCombinedDescription(context.jobDescription.split('--- Description manuelle ---')[0].replace('--- Contenu du fichier importé ---\n', ''), text);
    }
  };

  const clearFileUpload = () => {
    setFileUploaded(false);
    setJobDescription(manualText);
  };

  // Placeholder dynamique selon le persona
  const getTextareaPlaceholder = () => {
    if (l === 'en') {
      return 'Paste your job description, missions, or main responsibilities here...';
    }
    return 'Collez ici le contenu de votre fiche de poste, vos missions ou vos responsabilités principales...';
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
          
          {/* Années d'expérience */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label className="apex-label flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {l === 'fr' ? 'Années d\'expérience dans ce poste' : 'Years of experience in this role'}
              <span className="text-slate-600 font-normal">(optionnel)</span>
            </label>
            <select
              value={context.yearsExperience || ''}
              onChange={(e) => setYearsExperience(e.target.value ? parseInt(e.target.value) : 0)}
              className="apex-select"
            >
              <option value="">{l === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
              <option value="1">&lt; 2 {l === 'fr' ? 'ans' : 'years'}</option>
              <option value="3">2-5 {l === 'fr' ? 'ans' : 'years'}</option>
              <option value="7">5-10 {l === 'fr' ? 'ans' : 'years'}</option>
              <option value="15">10-20 {l === 'fr' ? 'ans' : 'years'}</option>
              <option value="25">&gt; 20 {l === 'fr' ? 'ans' : 'years'}</option>
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
              relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
              ${dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : fileUploaded
                  ? 'border-emerald-500/50 bg-emerald-500/5'
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
              accept=".txt,.pdf"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {fileUploaded ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <div className="text-left">
                  <p className="text-emerald-400 font-medium">{t('importedFile')}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFileUpload();
                    }}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    {l === 'fr' ? 'Supprimer le fichier' : 'Remove file'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Upload className={`w-8 h-8 mx-auto mb-3 ${dragActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <p className="text-slate-300 font-medium text-sm">
                  {l === 'fr' 
                    ? 'Glissez votre fiche de poste ici ou cliquez pour parcourir' 
                    : 'Drag your job description here or click to browse'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {l === 'fr' ? 'Fichiers .txt ou .pdf' : '.txt or .pdf files'}
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Section Données Enrichies pour Diagnostic Précis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">
            {l === 'fr' ? 'Données de diagnostic avancé' : 'Advanced Diagnostic Data'}
          </span>
          <span className="text-xs text-slate-600">{l === 'fr' ? '(Optionnel - améliore la précision)' : '(Optional - improves accuracy)'}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          {/* Taille équipe */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
              <Users className="w-3.5 h-3.5" />
              {l === 'fr' ? 'Taille équipe supervisée' : 'Team size supervised'}
            </label>
            <select
              value={context.teamSize ?? ''}
              onChange={(e) => setTeamSize(e.target.value ? parseInt(e.target.value) : 0)}
              className="apex-select text-sm py-2"
            >
              <option value="">-</option>
              <option value="0">{l === 'fr' ? 'Contributeur individuel' : 'Individual contributor'}</option>
              <option value="3">1-5 {l === 'fr' ? 'personnes' : 'people'}</option>
              <option value="10">6-15 {l === 'fr' ? 'personnes' : 'people'}</option>
              <option value="30">16-50 {l === 'fr' ? 'personnes' : 'people'}</option>
              <option value="100">50+ {l === 'fr' ? 'personnes' : 'people'}</option>
            </select>
          </div>
          
          {/* Exposition automatisation */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
              <Zap className="w-3.5 h-3.5" />
              {l === 'fr' ? 'Exposition automatisation' : 'Automation exposure'}
            </label>
            <select
              value={context.automationExposure || ''}
              onChange={(e) => setAutomationExposure(e.target.value as 'low' | 'medium' | 'high')}
              className="apex-select text-sm py-2"
            >
              <option value="">-</option>
              <option value="low">{l === 'fr' ? 'Faible' : 'Low'}</option>
              <option value="medium">{l === 'fr' ? 'Modérée' : 'Medium'}</option>
              <option value="high">{l === 'fr' ? 'Élevée' : 'High'}</option>
            </select>
          </div>
          
          {/* Budget */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              {l === 'fr' ? 'Responsabilité budget (K€)' : 'Budget responsibility (K€)'}
            </label>
            <select
              value={context.budgetResponsibility ?? ''}
              onChange={(e) => setBudgetResponsibility(e.target.value ? parseInt(e.target.value) : 0)}
              className="apex-select text-sm py-2"
            >
              <option value="">-</option>
              <option value="0">{l === 'fr' ? 'Aucun' : 'None'}</option>
              <option value="50">&lt; 100K€</option>
              <option value="250">100K€ - 500K€</option>
              <option value="750">500K€ - 1M€</option>
              <option value="2000">1M€ - 5M€</option>
              <option value="10000">&gt; 5M€</option>
            </select>
          </div>
          
          {/* Contact client */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
              <Handshake className="w-3.5 h-3.5" />
              {l === 'fr' ? 'Contact client direct' : 'Direct client contact'}
            </label>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setClientFacing(true)}
                className={`flex-1 py-2 px-3 rounded text-sm transition-all ${
                  context.clientFacing === true 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {l === 'fr' ? 'Oui' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setClientFacing(false)}
                className={`flex-1 py-2 px-3 rounded text-sm transition-all ${
                  context.clientFacing === false 
                    ? 'bg-slate-700/50 text-slate-300 border border-slate-600' 
                    : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {l === 'fr' ? 'Non' : 'No'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TEXTAREA - Description manuelle des missions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <label className="apex-label flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {l === 'fr' ? 'Description des missions' : 'Mission Description'}
          <span className="text-slate-600 font-normal">(optionnel)</span>
        </label>
        
        <textarea
          value={manualText}
          onChange={handleManualTextChange}
          placeholder={getTextareaPlaceholder()}
          rows={5}
          className="apex-input resize-none w-full"
        />
        
        <p className="text-xs text-slate-500">
          {l === 'fr' 
            ? '💡 Vous pouvez combiner un fichier importé et une description manuelle. Les deux seront fusionnés pour l\'analyse.'
            : '💡 You can combine an imported file and a manual description. Both will be merged for analysis.'}
        </p>
      </motion.div>

      {/* Combined Description Preview */}
      {context.jobDescription && context.jobDescription.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="apex-card p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {l === 'fr' ? 'Aperçu du contenu fusionné' : 'Merged content preview'}
            </span>
            <button
              onClick={() => {
                setJobDescription('');
                setManualText('');
                setFileUploaded(false);
              }}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="bg-slate-800/50 rounded p-3 max-h-32 overflow-y-auto">
            <p className="text-sm text-slate-400 whitespace-pre-wrap">
              {context.jobDescription.substring(0, 500)}
              {context.jobDescription.length > 500 && '...'}
            </p>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {context.jobDescription.length} {l === 'fr' ? 'caractères' : 'characters'}
          </p>
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
