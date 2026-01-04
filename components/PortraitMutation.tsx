'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useAuditStore } from '@/lib/store';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { UserMenu } from '@/components/ui/UserMenu';
import { ResetButton } from '@/components/ui/ResetButton';
import { 
  Sparkles, 
  Heart, 
  Trophy,
  XCircle,
  Compass,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  X,
  AlertTriangle
} from 'lucide-react';

interface PortraitMutationProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function PortraitMutation({ onComplete, onBack }: PortraitMutationProps) {
  const { data: session } = useSession();
  const { 
    userIntention, 
    setPassionsConcretes, 
    setCarreDAs, 
    setZoneDeRejet, 
    setHorizonCible, 
    setManifesteHumain,
    validateUserIntention 
  } = useAuditStore();

  const [currentSection, setCurrentSection] = useState(0);
  const [rejetInput, setRejetInput] = useState('');

  // Sections du formulaire
  const sections = [
    { id: 'passions', title: 'Passions Concrètes', icon: Heart, color: 'rose' },
    { id: 'carreDAs', title: 'Le Carré d\'As', icon: Trophy, color: 'amber' },
    { id: 'zoneRejet', title: 'Zone de Rejet', icon: XCircle, color: 'red' },
    { id: 'horizon', title: 'L\'Horizon Cible', icon: Compass, color: 'indigo' },
    { id: 'manifeste', title: 'Le Manifeste Humain', icon: FileText, color: 'violet' },
  ];

  // Validation par section
  const isSectionValid = (index: number) => {
    switch(index) {
      case 0: return userIntention.passionsConcretes.trim().length > 10;
      case 1: return (
        userIntention.carreDAs.talent1.trim().length > 0 &&
        userIntention.carreDAs.talent2.trim().length > 0 &&
        userIntention.carreDAs.talent3.trim().length > 0 &&
        userIntention.carreDAs.talent4.trim().length > 0
      );
      case 2: return userIntention.zoneDeRejet.length >= 2;
      case 3: return (
        userIntention.horizonCible.secteurCible.trim().length > 0 &&
        (userIntention.horizonCible.metierIdeal1.trim().length > 0 || 
         userIntention.horizonCible.metierIdeal2.trim().length > 0)
      );
      case 4: return userIntention.manifesteHumain.trim().length > 20;
      default: return false;
    }
  };

  const isFormComplete = () => {
    return sections.every((_, index) => isSectionValid(index));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (isFormComplete()) {
      validateUserIntention();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      onBack();
    }
  };

  const addRejet = () => {
    if (rejetInput.trim() && userIntention.zoneDeRejet.length < 5) {
      setZoneDeRejet([...userIntention.zoneDeRejet, rejetInput.trim()]);
      setRejetInput('');
    }
  };

  const removeRejet = (index: number) => {
    setZoneDeRejet(userIntention.zoneDeRejet.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header avec progression */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Portrait de votre Mutation</h1>
                <p className="text-xs text-slate-500">Prenez le temps. Votre audit technique va maintenant rencontrer votre projet de vie.</p>
              </div>
            </div>
            
            {/* Actions Header */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                {currentSection + 1} / {sections.length}
              </div>
              
              <ResetButton variant="text" />
              <LanguageSwitcher />
              {session?.user && <UserMenu user={session.user} />}
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="flex gap-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`
                  flex-1 h-1.5 rounded-full transition-all duration-300
                  ${index < currentSection 
                    ? 'bg-violet-500' 
                    : index === currentSection 
                      ? 'bg-indigo-500' 
                      : 'bg-slate-700'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center p-6 pt-32">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Titre de section */}
              <div className="text-center mb-8">
                <div className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4
                  ${sections[currentSection].color === 'rose' ? 'bg-rose-500/20 text-rose-400' : ''}
                  ${sections[currentSection].color === 'amber' ? 'bg-amber-500/20 text-amber-400' : ''}
                  ${sections[currentSection].color === 'red' ? 'bg-red-500/20 text-red-400' : ''}
                  ${sections[currentSection].color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400' : ''}
                  ${sections[currentSection].color === 'violet' ? 'bg-violet-500/20 text-violet-400' : ''}
                `}>
                  {(() => {
                    const Icon = sections[currentSection].icon;
                    return <Icon className="w-8 h-8" />;
                  })()}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {sections[currentSection].title}
                </h2>
              </div>

              {/* Section 1: Passions Concrètes */}
              {currentSection === 0 && (
                <div className="space-y-4">
                  <p className="text-slate-300 text-center">
                    Qu&apos;est-ce qui vous fait vibrer dans le concret ?
                  </p>
                  <p className="text-slate-500 text-sm text-center mb-6">
                    Ex: travailler le bois, dessiner, soigner, mécaniser, créer du lien, enseigner, résoudre des énigmes...
                  </p>
                  <textarea
                    value={userIntention.passionsConcretes}
                    onChange={(e) => setPassionsConcretes(e.target.value)}
                    placeholder="Décrivez ce qui vous anime profondément, les activités qui vous font perdre la notion du temps..."
                    className="w-full h-40 px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs ${userIntention.passionsConcretes.length < 10 ? 'text-slate-500' : 'text-rose-400'}`}>
                      {userIntention.passionsConcretes.length} caractères (min. 10)
                    </span>
                  </div>
                </div>
              )}

              {/* Section 2: Carré d'As */}
              {currentSection === 1 && (
                <div className="space-y-4">
                  <p className="text-slate-300 text-center">
                    Citez 4 choses pour lesquelles vous êtes naturellement doué(e), même sans effort.
                  </p>
                  <p className="text-slate-500 text-sm text-center mb-6">
                    Ces talents naturels qui vous viennent sans y penser.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {['talent1', 'talent2', 'talent3', 'talent4'].map((key, index) => (
                      <div key={key} className="relative">
                        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={userIntention.carreDAs[key as keyof typeof userIntention.carreDAs]}
                          onChange={(e) => setCarreDAs({
                            ...userIntention.carreDAs,
                            [key]: e.target.value
                          })}
                          placeholder={`Talent naturel ${index + 1}`}
                          className="w-full px-4 py-3 pl-6 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Zone de Rejet */}
              {currentSection === 2 && (
                <div className="space-y-4">
                  <p className="text-slate-300 text-center">
                    À l&apos;inverse, citez ce pour quoi vous êtes nul(le) ou ce qui vous vide de votre énergie.
                  </p>
                  <p className="text-slate-500 text-sm text-center mb-6">
                    Ex: paperasse, sédentarité, management, tâches répétitives, isolation...
                  </p>
                  
                  {/* Liste des rejets */}
                  <div className="space-y-2 mb-4">
                    {userIntention.zoneDeRejet.map((rejet, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300"
                      >
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span className="flex-1">{rejet}</span>
                        <button
                          onClick={() => removeRejet(index)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Ajout */}
                  {userIntention.zoneDeRejet.length < 5 && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={rejetInput}
                        onChange={(e) => setRejetInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addRejet()}
                        placeholder="Ce qui vous épuise ou vous ennuie..."
                        className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50"
                      />
                      <button
                        onClick={addRejet}
                        disabled={!rejetInput.trim()}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-500 text-center">
                    {userIntention.zoneDeRejet.length}/5 éléments (min. 2)
                  </p>
                </div>
              )}

              {/* Section 4: Horizon Cible */}
              {currentSection === 3 && (
                <div className="space-y-4">
                  <p className="text-slate-300 text-center">
                    Dans quel secteur vous voyez-vous ? Quels seraient vos 2 métiers idéaux ?
                  </p>
                  <p className="text-slate-500 text-sm text-center mb-6">
                    Laissez-vous rêver. Aucune contrainte ici.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-indigo-400 mb-2 block">Secteur cible</label>
                      <input
                        type="text"
                        value={userIntention.horizonCible.secteurCible}
                        onChange={(e) => setHorizonCible({
                          ...userIntention.horizonCible,
                          secteurCible: e.target.value
                        })}
                        placeholder="Ex: Tech, Santé, Éducation, Artisanat..."
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-indigo-400 mb-2 block">Métier idéal #1</label>
                        <input
                          type="text"
                          value={userIntention.horizonCible.metierIdeal1}
                          onChange={(e) => setHorizonCible({
                            ...userIntention.horizonCible,
                            metierIdeal1: e.target.value
                          })}
                          placeholder="Ex: Coach de vie"
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-indigo-400 mb-2 block">Métier idéal #2</label>
                        <input
                          type="text"
                          value={userIntention.horizonCible.metierIdeal2}
                          onChange={(e) => setHorizonCible({
                            ...userIntention.horizonCible,
                            metierIdeal2: e.target.value
                          })}
                          placeholder="Ex: Formateur"
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 5: Manifeste Humain */}
              {currentSection === 4 && (
                <div className="space-y-4">
                  <p className="text-slate-300 text-center">
                    Définissez ici l&apos;humain que vous voulez devenir.
                  </p>
                  <p className="text-slate-500 text-sm text-center mb-6">
                    Quel impact voulez-vous avoir sur votre environnement ? Sur les autres ? Sur vous-même ?
                  </p>
                  <textarea
                    value={userIntention.manifesteHumain}
                    onChange={(e) => setManifesteHumain(e.target.value)}
                    placeholder="Je veux être quelqu'un qui... Je veux contribuer à... Mon impact sera de..."
                    className="w-full h-48 px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs ${userIntention.manifesteHumain.length < 20 ? 'text-slate-500' : 'text-violet-400'}`}>
                      {userIntention.manifesteHumain.length} caractères (min. 20)
                    </span>
                  </div>
                </div>
              )}

              {/* Indicateur de validation */}
              <div className={`
                flex items-center justify-center gap-2 py-2 rounded-lg text-sm
                ${isSectionValid(currentSection) 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-slate-800/50 text-slate-500'
                }
              `}>
                {isSectionValid(currentSection) ? (
                  <>
                    <Check className="w-4 h-4" />
                    Section complétée
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Complétez cette section pour continuer
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer de navigation */}
      <div className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentSection === 0 ? 'Retour au diagnostic' : 'Section précédente'}
            </button>
            
            <div className="flex items-center gap-3">
              {/* Indicateurs de sections */}
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${isSectionValid(index) ? 'bg-emerald-500' : index === currentSection ? 'bg-indigo-500' : 'bg-slate-700'}
                  `}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!isSectionValid(currentSection)}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all duration-300
                ${isSectionValid(currentSection)
                  ? currentSection === sections.length - 1
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/25'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }
              `}
            >
              {currentSection === sections.length - 1 ? (
                <>
                  Lancer la Phase 2
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continuer
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

