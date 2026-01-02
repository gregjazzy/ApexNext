'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, FileText, Upload, X } from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';

const industries = [
  'Tech / Software',
  'Finance / Banque',
  'Santé / Pharma',
  'Retail / E-commerce',
  'Industrie / Manufacturing',
  'Conseil / Services',
  'Média / Communication',
  'Éducation / Formation',
  'Immobilier / Construction',
  'Énergie / Environnement',
  'Transport / Logistique',
  'Autre',
];

export function Step2Context() {
  const { context, setJobTitle, setIndustry, setJobDescription, nextStep, prevStep } = useAuditStore();
  const [dragActive, setDragActive] = useState(false);

  const canProceed = context.jobTitle.trim() && context.industry;

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
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          className="apex-title text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Context Mapping
        </motion.h1>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Décrivez votre environnement professionnel actuel pour personnaliser l'analyse.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Main Fields */}
        <div className="space-y-6">
          {/* Job Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="apex-label flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Intitulé de poste
            </label>
            <input
              type="text"
              value={context.jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Ex: Chef de projet digital, Développeur senior..."
              className="apex-input"
            />
          </motion.div>

          {/* Industry */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="apex-label flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Secteur d'activité
            </label>
            <select
              value={context.industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="apex-select"
            >
              <option value="">Sélectionnez votre secteur</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
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
            Fiche de poste (optionnel)
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
              Glissez votre fiche de poste
            </p>
            <p className="text-sm text-slate-500">
              ou cliquez pour parcourir (fichier .txt)
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
              Fiche de poste importée
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
        nextLabel="Auditer les tâches"
      />
    </motion.div>
  );
}

