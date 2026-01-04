'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Briefcase, FileText, Upload, X, CheckCircle, Clock, Users, AlertCircle, HelpCircle, Search, ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuditStore, GEO_ZONES, GeoZone } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { contextLexicon, getLexiconValue, personaLabels } from '@/lib/lexicon';
import { Globe } from 'lucide-react';

// ===============================================
// LISTE COMPLÈTE DES SECTEURS D'ACTIVITÉ
// ===============================================
// Donnée clé pour calibrer l'impact de l'IA sur le métier

const SECTORS_LIST = [
  // Finance & Banque
  { key: 'banque_retail', label: { fr: 'Banque de détail', en: 'Retail Banking' }, category: 'finance' },
  { key: 'banque_investissement', label: { fr: 'Banque d\'investissement', en: 'Investment Banking' }, category: 'finance' },
  { key: 'assurance', label: { fr: 'Assurance', en: 'Insurance' }, category: 'finance' },
  { key: 'gestion_actifs', label: { fr: 'Gestion d\'actifs', en: 'Asset Management' }, category: 'finance' },
  { key: 'fintech', label: { fr: 'Fintech', en: 'Fintech' }, category: 'finance' },
  { key: 'audit_comptabilite', label: { fr: 'Audit & Comptabilité', en: 'Audit & Accounting' }, category: 'finance' },
  
  // Tech & Digital
  { key: 'tech_software', label: { fr: 'Éditeur de logiciels', en: 'Software Publisher' }, category: 'tech' },
  { key: 'tech_saas', label: { fr: 'SaaS / Cloud', en: 'SaaS / Cloud' }, category: 'tech' },
  { key: 'tech_ia', label: { fr: 'Intelligence Artificielle', en: 'Artificial Intelligence' }, category: 'tech' },
  { key: 'tech_cybersecurity', label: { fr: 'Cybersécurité', en: 'Cybersecurity' }, category: 'tech' },
  { key: 'tech_data', label: { fr: 'Data & Analytics', en: 'Data & Analytics' }, category: 'tech' },
  { key: 'tech_esn', label: { fr: 'ESN / SSII', en: 'IT Services' }, category: 'tech' },
  { key: 'tech_telecom', label: { fr: 'Télécommunications', en: 'Telecommunications' }, category: 'tech' },
  { key: 'tech_gaming', label: { fr: 'Jeux vidéo', en: 'Video Games' }, category: 'tech' },
  { key: 'ecommerce', label: { fr: 'E-commerce', en: 'E-commerce' }, category: 'tech' },
  
  // Industrie & Manufacturing
  { key: 'industrie_auto', label: { fr: 'Industrie automobile', en: 'Automotive Industry' }, category: 'industrie' },
  { key: 'industrie_aero', label: { fr: 'Aéronautique & Spatial', en: 'Aerospace & Defense' }, category: 'industrie' },
  { key: 'industrie_chimie', label: { fr: 'Chimie & Matériaux', en: 'Chemicals & Materials' }, category: 'industrie' },
  { key: 'industrie_pharma', label: { fr: 'Industrie pharmaceutique', en: 'Pharmaceutical Industry' }, category: 'industrie' },
  { key: 'industrie_agroalimentaire', label: { fr: 'Agroalimentaire', en: 'Food & Beverage' }, category: 'industrie' },
  { key: 'industrie_textile', label: { fr: 'Textile & Habillement', en: 'Textile & Apparel' }, category: 'industrie' },
  { key: 'industrie_mecanique', label: { fr: 'Mécanique & Métallurgie', en: 'Mechanical & Metallurgy' }, category: 'industrie' },
  { key: 'industrie_electronique', label: { fr: 'Électronique & Semi-conducteurs', en: 'Electronics & Semiconductors' }, category: 'industrie' },
  { key: 'btp', label: { fr: 'BTP & Construction', en: 'Construction' }, category: 'industrie' },
  
  // Santé
  { key: 'sante_hopital', label: { fr: 'Établissements de santé', en: 'Healthcare Facilities' }, category: 'sante' },
  { key: 'sante_biotech', label: { fr: 'Biotechnologie', en: 'Biotechnology' }, category: 'sante' },
  { key: 'sante_medtech', label: { fr: 'Medtech / Dispositifs médicaux', en: 'Medtech / Medical Devices' }, category: 'sante' },
  { key: 'sante_labo', label: { fr: 'Laboratoires d\'analyses', en: 'Diagnostic Labs' }, category: 'sante' },
  { key: 'sante_ehpad', label: { fr: 'EHPAD / Soins aux personnes âgées', en: 'Elderly Care' }, category: 'sante' },
  
  // Services aux entreprises
  { key: 'conseil_strategie', label: { fr: 'Conseil en stratégie', en: 'Strategy Consulting' }, category: 'services' },
  { key: 'conseil_management', label: { fr: 'Conseil en management', en: 'Management Consulting' }, category: 'services' },
  { key: 'conseil_rh', label: { fr: 'Conseil RH / Recrutement', en: 'HR Consulting / Recruitment' }, category: 'services' },
  { key: 'juridique', label: { fr: 'Services juridiques / Avocats', en: 'Legal Services' }, category: 'services' },
  { key: 'marketing_communication', label: { fr: 'Marketing & Communication', en: 'Marketing & Communications' }, category: 'services' },
  { key: 'agence_digitale', label: { fr: 'Agence digitale / Web', en: 'Digital Agency' }, category: 'services' },
  { key: 'evenementiel', label: { fr: 'Événementiel', en: 'Events' }, category: 'services' },
  
  // Commerce & Distribution
  { key: 'grande_distribution', label: { fr: 'Grande distribution', en: 'Retail / Supermarkets' }, category: 'commerce' },
  { key: 'luxe', label: { fr: 'Luxe & Mode', en: 'Luxury & Fashion' }, category: 'commerce' },
  { key: 'commerce_gros', label: { fr: 'Commerce de gros / B2B', en: 'Wholesale / B2B Trade' }, category: 'commerce' },
  { key: 'commerce_specialise', label: { fr: 'Commerce spécialisé', en: 'Specialty Retail' }, category: 'commerce' },
  
  // Énergie & Environnement
  { key: 'energie_oil_gas', label: { fr: 'Pétrole & Gaz', en: 'Oil & Gas' }, category: 'energie' },
  { key: 'energie_renouvelable', label: { fr: 'Énergies renouvelables', en: 'Renewable Energy' }, category: 'energie' },
  { key: 'energie_nucleaire', label: { fr: 'Nucléaire', en: 'Nuclear Energy' }, category: 'energie' },
  { key: 'utilities', label: { fr: 'Utilities (eau, électricité)', en: 'Utilities (Water, Electricity)' }, category: 'energie' },
  { key: 'environnement', label: { fr: 'Environnement & Déchets', en: 'Environment & Waste Management' }, category: 'energie' },
  
  // Transport & Logistique
  { key: 'transport_aerien', label: { fr: 'Transport aérien', en: 'Air Transport' }, category: 'transport' },
  { key: 'transport_maritime', label: { fr: 'Transport maritime', en: 'Maritime Transport' }, category: 'transport' },
  { key: 'transport_ferroviaire', label: { fr: 'Transport ferroviaire', en: 'Rail Transport' }, category: 'transport' },
  { key: 'transport_routier', label: { fr: 'Transport routier', en: 'Road Transport' }, category: 'transport' },
  { key: 'logistique', label: { fr: 'Logistique & Supply Chain', en: 'Logistics & Supply Chain' }, category: 'transport' },
  { key: 'mobilite', label: { fr: 'Mobilité / VTC', en: 'Mobility / Ride-hailing' }, category: 'transport' },
  
  // Immobilier
  { key: 'immobilier_promotion', label: { fr: 'Promotion immobilière', en: 'Real Estate Development' }, category: 'immobilier' },
  { key: 'immobilier_gestion', label: { fr: 'Gestion immobilière', en: 'Property Management' }, category: 'immobilier' },
  { key: 'immobilier_transaction', label: { fr: 'Transaction immobilière', en: 'Real Estate Brokerage' }, category: 'immobilier' },
  { key: 'proptech', label: { fr: 'Proptech', en: 'Proptech' }, category: 'immobilier' },
  
  // Médias & Entertainment
  { key: 'media_audiovisuel', label: { fr: 'Audiovisuel / TV / Radio', en: 'Broadcasting / TV / Radio' }, category: 'media' },
  { key: 'media_presse', label: { fr: 'Presse & Édition', en: 'Press & Publishing' }, category: 'media' },
  { key: 'media_production', label: { fr: 'Production cinéma / Musique', en: 'Film / Music Production' }, category: 'media' },
  { key: 'media_streaming', label: { fr: 'Streaming & Contenu digital', en: 'Streaming & Digital Content' }, category: 'media' },
  { key: 'publicite', label: { fr: 'Publicité', en: 'Advertising' }, category: 'media' },
  
  // Éducation & Formation
  { key: 'education_superieur', label: { fr: 'Enseignement supérieur', en: 'Higher Education' }, category: 'education' },
  { key: 'education_scolaire', label: { fr: 'Enseignement scolaire', en: 'K-12 Education' }, category: 'education' },
  { key: 'formation_pro', label: { fr: 'Formation professionnelle', en: 'Professional Training' }, category: 'education' },
  { key: 'edtech', label: { fr: 'Edtech', en: 'Edtech' }, category: 'education' },
  
  // Tourisme & Hôtellerie
  { key: 'hotellerie', label: { fr: 'Hôtellerie', en: 'Hospitality' }, category: 'tourisme' },
  { key: 'restauration', label: { fr: 'Restauration', en: 'Food Service / Restaurants' }, category: 'tourisme' },
  { key: 'tourisme_agence', label: { fr: 'Agences de voyage / Tour-opérateurs', en: 'Travel Agencies / Tour Operators' }, category: 'tourisme' },
  { key: 'loisirs', label: { fr: 'Loisirs & Parcs', en: 'Leisure & Theme Parks' }, category: 'tourisme' },
  
  // Secteur Public
  { key: 'administration_publique', label: { fr: 'Administration publique', en: 'Public Administration' }, category: 'public' },
  { key: 'collectivites', label: { fr: 'Collectivités territoriales', en: 'Local Government' }, category: 'public' },
  { key: 'defense', label: { fr: 'Défense & Sécurité nationale', en: 'Defense & National Security' }, category: 'public' },
  { key: 'ong', label: { fr: 'ONG / Associations', en: 'NGO / Non-profit' }, category: 'public' },
  
  // Autres
  { key: 'agriculture', label: { fr: 'Agriculture & Viticulture', en: 'Agriculture & Viticulture' }, category: 'autre' },
  { key: 'sport', label: { fr: 'Sport & Fitness', en: 'Sports & Fitness' }, category: 'autre' },
  { key: 'beaute_cosmetique', label: { fr: 'Beauté & Cosmétique', en: 'Beauty & Cosmetics' }, category: 'autre' },
  { key: 'artisanat', label: { fr: 'Artisanat', en: 'Crafts' }, category: 'autre' },
];

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
    setCountry,
    nextStep, 
    prevStep 
  } = useAuditStore();
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ===============================================
  // COMBOBOX SECTEUR D'ACTIVITÉ
  // ===============================================
  const [sectorSearch, setSectorSearch] = useState('');
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [showSectorTooltip, setShowSectorTooltip] = useState(false);
  const sectorInputRef = useRef<HTMLInputElement>(null);
  const sectorDropdownRef = useRef<HTMLDivElement>(null);

  const canProceed = context.jobTitle.trim() && context.industry;
  const persona = context.persona || 'salarie';
  const l = locale === 'en' ? 'en' : 'fr';

  // Filtrer les secteurs selon la recherche
  const filteredSectors = useMemo(() => {
    if (!sectorSearch.trim()) return SECTORS_LIST;
    const searchLower = sectorSearch.toLowerCase();
    return SECTORS_LIST.filter(sector => 
      sector.label[l].toLowerCase().includes(searchLower) ||
      sector.category.toLowerCase().includes(searchLower)
    );
  }, [sectorSearch, l]);

  // Obtenir le label du secteur sélectionné
  const getSelectedSectorLabel = useCallback(() => {
    if (!context.industry) return '';
    const found = SECTORS_LIST.find(s => s.key === context.industry);
    if (found) return found.label[l];
    // Si c'est une saisie libre (non trouvé dans la liste)
    return context.industry;
  }, [context.industry, l]);

  // Gérer la sélection d'un secteur
  const handleSectorSelect = useCallback((sectorKey: string, sectorLabel: string) => {
    setIndustry(sectorKey);
    setSectorSearch(sectorLabel);
    setIsSectorDropdownOpen(false);
  }, [setIndustry]);

  // Gérer la saisie libre
  const handleSectorInputChange = useCallback((value: string) => {
    setSectorSearch(value);
    setIsSectorDropdownOpen(true);
    // Si la valeur ne correspond à aucun secteur, on la stocke directement
    const found = SECTORS_LIST.find(s => 
      s.label[l].toLowerCase() === value.toLowerCase()
    );
    if (found) {
      setIndustry(found.key);
    } else {
      // Saisie libre ou vide - on stocke le texte directement (même si vide)
      setIndustry(value);
    }
  }, [l, setIndustry]);

  // Fermer le dropdown quand on clique en dehors
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      sectorDropdownRef.current && 
      !sectorDropdownRef.current.contains(e.target as Node) &&
      sectorInputRef.current &&
      !sectorInputRef.current.contains(e.target as Node)
    ) {
      setIsSectorDropdownOpen(false);
    }
  }, []);

  // Initialiser la recherche avec la valeur existante (uniquement au montage)
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      if (context.industry) {
        setSectorSearch(getSelectedSectorLabel());
      }
      hasInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Volontairement vide - ne s'exécute qu'au montage

  // Effet pour fermer le dropdown au clic extérieur
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

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

  const processFile = useCallback((file: File) => {
    setFileError(null);
    
    // Vérifier le type de fichier
    const isTextFile = file.type === 'text/plain' || file.name.endsWith('.txt');
    const isPdfFile = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    
    if (!isTextFile && !isPdfFile) {
      setFileError(l === 'fr' 
        ? 'Format non supporté. Utilisez .txt uniquement.' 
        : 'Unsupported format. Use .txt only.');
      return;
    }
    
    if (isPdfFile) {
      setFileError(l === 'fr' 
        ? '⚠️ Les fichiers PDF ne peuvent pas être lus directement. Copiez-collez le contenu dans la zone de texte ci-dessous.' 
        : '⚠️ PDF files cannot be read directly. Copy-paste the content in the text area below.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.trim().length > 0) {
        setFileUploaded(true);
        setFileName(file.name);
        setFileError(null);
        updateCombinedDescription(text, manualText);
      } else {
        setFileError(l === 'fr' ? 'Le fichier semble vide.' : 'The file appears to be empty.');
      }
    };
    reader.onerror = () => {
      setFileError(l === 'fr' ? 'Erreur lors de la lecture du fichier.' : 'Error reading the file.');
    };
    reader.readAsText(file);
  }, [l, manualText, updateCombinedDescription]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input pour permettre de re-sélectionner le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
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
    setFileName(null);
    setFileError(null);
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

          {/* Industry / Secteur d'activité - COMBOBOX avec saisie libre */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <label className="apex-label flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {getLexiconValue(contextLexicon.industryLabel, persona, locale)}
              {/* Tooltip d'aide */}
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowSectorTooltip(true)}
                  onMouseLeave={() => setShowSectorTooltip(false)}
                  onClick={() => setShowSectorTooltip(!showSectorTooltip)}
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {showSectorTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute left-0 top-6 z-50 w-64 p-3 bg-slate-800 border border-amber-500/30 rounded-lg shadow-xl"
                    >
                      <p className="text-xs text-slate-300">
                        {l === 'fr' 
                          ? '💡 Le secteur est une donnée clé pour calibrer l\'impact de l\'IA sur votre métier. Soyez le plus précis possible.'
                          : '💡 The sector is key data to calibrate AI impact on your job. Be as precise as possible.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </label>
            
            {/* Combobox Input */}
            <div className="relative" ref={sectorDropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  ref={sectorInputRef}
                  type="text"
                  value={sectorSearch}
                  onChange={(e) => handleSectorInputChange(e.target.value)}
                  onFocus={() => setIsSectorDropdownOpen(true)}
                  placeholder={l === 'fr' ? 'Rechercher ou saisir votre secteur...' : 'Search or type your sector...'}
                  className="apex-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${isSectorDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Dropdown avec liste des secteurs */}
              <AnimatePresence>
                {isSectorDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl"
                  >
                    {filteredSectors.length > 0 ? (
                      <>
                        {/* Grouper par catégorie */}
                        {['finance', 'tech', 'industrie', 'sante', 'services', 'commerce', 'energie', 'transport', 'immobilier', 'media', 'education', 'tourisme', 'public', 'autre'].map(category => {
                          const categorySectors = filteredSectors.filter(s => s.category === category);
                          if (categorySectors.length === 0) return null;
                          
                          const categoryLabels: Record<string, { fr: string; en: string }> = {
                            finance: { fr: '💰 Finance & Banque', en: '💰 Finance & Banking' },
                            tech: { fr: '💻 Tech & Digital', en: '💻 Tech & Digital' },
                            industrie: { fr: '🏭 Industrie', en: '🏭 Industry' },
                            sante: { fr: '🏥 Santé', en: '🏥 Healthcare' },
                            services: { fr: '🏢 Services aux entreprises', en: '🏢 Business Services' },
                            commerce: { fr: '🛍️ Commerce & Distribution', en: '🛍️ Retail & Distribution' },
                            energie: { fr: '⚡ Énergie & Environnement', en: '⚡ Energy & Environment' },
                            transport: { fr: '🚛 Transport & Logistique', en: '🚛 Transport & Logistics' },
                            immobilier: { fr: '🏠 Immobilier', en: '🏠 Real Estate' },
                            media: { fr: '📺 Médias & Entertainment', en: '📺 Media & Entertainment' },
                            education: { fr: '📚 Éducation & Formation', en: '📚 Education & Training' },
                            tourisme: { fr: '✈️ Tourisme & Hôtellerie', en: '✈️ Tourism & Hospitality' },
                            public: { fr: '🏛️ Secteur Public', en: '🏛️ Public Sector' },
                            autre: { fr: '📦 Autres', en: '📦 Others' },
                          };
                          
                          return (
                            <div key={category}>
                              <div className="px-3 py-2 text-xs font-semibold text-amber-500 bg-slate-800/50 sticky top-0">
                                {categoryLabels[category][l]}
                              </div>
                              {categorySectors.map(sector => (
                                <button
                                  key={sector.key}
                                  type="button"
                                  onClick={() => handleSectorSelect(sector.key, sector.label[l])}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-800 transition-colors ${
                                    context.industry === sector.key 
                                      ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500' 
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {sector.label[l]}
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-400">
                        {l === 'fr' 
                          ? `✨ "${sectorSearch}" sera utilisé comme secteur personnalisé`
                          : `✨ "${sectorSearch}" will be used as custom sector`}
                      </div>
                    )}
                    
                    {/* Option de saisie libre si la recherche ne correspond pas exactement */}
                    {sectorSearch.trim() && !SECTORS_LIST.find(s => s.label[l].toLowerCase() === sectorSearch.toLowerCase()) && filteredSectors.length > 0 && (
                      <div className="border-t border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleSectorSelect(sectorSearch, sectorSearch)}
                          className="w-full px-4 py-3 text-left text-sm text-emerald-400 hover:bg-slate-800 transition-colors flex items-center gap-2"
                        >
                          <span className="text-emerald-500">+</span>
                          {l === 'fr' 
                            ? `Utiliser "${sectorSearch}" comme secteur personnalisé`
                            : `Use "${sectorSearch}" as custom sector`}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Indicateur de secteur sélectionné */}
              {context.industry && !isSectorDropdownOpen && (
                <div className="mt-1 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-400">
                    {SECTORS_LIST.find(s => s.key === context.industry) 
                      ? l === 'fr' ? 'Secteur standard sélectionné' : 'Standard sector selected'
                      : l === 'fr' ? 'Secteur personnalisé' : 'Custom sector'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pays / Zone géographique */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.42 }}
          >
            <label className="apex-label flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {l === 'fr' ? 'Pays' : 'Country'}
              <div className="relative">
                <button
                  type="button"
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                  title={l === 'fr' 
                    ? 'Le pays influence les recommandations (certifications, salaires, culture du marché)'
                    : 'Country influences recommendations (certifications, salaries, market culture)'}
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </label>
            <select
              value={context.country || ''}
              onChange={(e) => e.target.value && setCountry(e.target.value as GeoZone)}
              className="apex-select"
            >
              <option value="">{l === 'fr' ? 'Sélectionner votre pays...' : 'Select your country...'}</option>
              {GEO_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.flag} {zone.label[l]}
                </option>
              ))}
            </select>
            {context.country && (
              <div className="mt-1 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-slate-500">
                  {l === 'fr' 
                    ? 'Les recommandations seront adaptées à votre marché local'
                    : 'Recommendations will be adapted to your local market'}
                </span>
              </div>
            )}
          </motion.div>
          
          {/* Expérience & Équipe - Ligne combinée */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-2 gap-3"
          >
            {/* Années d'expérience */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                {l === 'fr' ? 'Expérience' : 'Experience'}
              </label>
              <select
                value={context.yearsExperience || ''}
                onChange={(e) => setYearsExperience(e.target.value ? parseInt(e.target.value) : 0)}
                className="apex-select text-sm py-2"
              >
                <option value="">-</option>
                <option value="1">&lt; 2 {l === 'fr' ? 'ans' : 'yrs'}</option>
                <option value="3">2-5 {l === 'fr' ? 'ans' : 'yrs'}</option>
                <option value="7">5-10 {l === 'fr' ? 'ans' : 'yrs'}</option>
                <option value="15">10-20 {l === 'fr' ? 'ans' : 'yrs'}</option>
                <option value="25">&gt; 20 {l === 'fr' ? 'ans' : 'yrs'}</option>
              </select>
            </div>
            
            {/* Taille équipe */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <Users className="w-3.5 h-3.5" />
                {l === 'fr' ? 'Équipe gérée' : 'Team managed'}
              </label>
              <select
                value={context.teamSize ?? ''}
                onChange={(e) => setTeamSize(e.target.value ? parseInt(e.target.value) : 0)}
                className="apex-select text-sm py-2"
              >
                <option value="">-</option>
                <option value="0">{l === 'fr' ? 'Solo' : 'Solo'}</option>
                <option value="3">1-5</option>
                <option value="10">6-15</option>
                <option value="30">16-50</option>
                <option value="100">50+</option>
              </select>
            </div>
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
          
          {/* Input file caché */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
              ${dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : fileUploaded
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : fileError
                    ? 'border-amber-500/50 bg-amber-500/5'
                    : 'border-slate-700 hover:border-slate-600'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {fileUploaded ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <div className="text-left">
                  <p className="text-emerald-400 font-medium">{t('importedFile')}</p>
                  {fileName && <p className="text-xs text-slate-500">{fileName}</p>}
                  <button 
                    onClick={clearFileUpload}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors mt-1"
                  >
                    {l === 'fr' ? 'Supprimer le fichier' : 'Remove file'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Upload className={`w-8 h-8 mx-auto mb-3 ${dragActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <p className="text-slate-300 font-medium text-sm mb-2">
                  {l === 'fr' 
                    ? 'Glissez votre fiche de poste ici' 
                    : 'Drag your job description here'}
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  {l === 'fr' ? 'ou' : 'or'}
                </p>
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {l === 'fr' ? 'Parcourir les fichiers' : 'Browse files'}
                </button>
                <p className="text-xs text-slate-500 mt-3">
                  {l === 'fr' ? 'Fichiers .txt uniquement' : '.txt files only'}
                </p>
              </>
            )}
          </div>
          
          {/* Message d'erreur */}
          {fileError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300">{fileError}</p>
            </motion.div>
          )}
        </motion.div>
      </div>

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
