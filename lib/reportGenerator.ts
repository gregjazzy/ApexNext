/**
 * APEX Report Generator
 * Génère un rapport PDF structuré à partir des données du store
 * 
 * Structure imposée :
 * 1. Synthèse Exécutive
 * 2. Méthodologie
 * 3. Audit Détaillé
 * 4. Actifs Critiques
 * 5. Matrice ERAC / Ikigai
 * 6. Roadmap Opérationnelle
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { 
  AuditContext, 
  Task, 
  Talent, 
  Software, 
  StrategyData, 
  ComputedKPIs,
  ERACAction 
} from './store';

// ===============================================
// TYPES & INTERFACES
// ===============================================

interface ReportData {
  context: AuditContext;
  tasks: Task[];
  talents: Talent[];
  software: Software[];
  strategy: StrategyData;
  computedKPIs: ComputedKPIs;
  generatedAt: string;
}

interface PDFColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  background: string;
}

// ===============================================
// CONFIGURATION
// ===============================================

const COLORS = {
  augmentation: {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#059669',
    text: '#1e293b',
    muted: '#64748b',
    background: '#f0fdf4',
  },
  pivot: {
    primary: '#6366f1',
    secondary: '#818cf8',
    accent: '#4f46e5',
    text: '#1e293b',
    muted: '#64748b',
    background: '#eef2ff',
  },
};

const PERSONA_LABELS: Record<string, { fr: string; en: string }> = {
  salarie: { fr: 'Salarié', en: 'Employee' },
  freelance: { fr: 'Freelance', en: 'Freelance' },
  leader: { fr: 'Leader / RH', en: 'Leader / HR' },
};

const GOAL_LABELS: Record<string, { fr: string; en: string }> = {
  augmentation: { fr: 'Poste Augmenté', en: 'Augmented Role' },
  pivot: { fr: 'Pivot Stratégique', en: 'Strategic Pivot' },
};

// ===============================================
// HELPER FUNCTIONS
// ===============================================

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function calculateVulnerabilityScore(task: Task): number {
  const avg = (task.resilience.donnees + task.resilience.decision + 
               task.resilience.relationnel + task.resilience.creativite + 
               task.resilience.execution) / 5;
  return Math.round(100 - avg);
}

function getVulnerabilityJustification(task: Task): string {
  const vulnerabilities: string[] = [];
  
  if (task.resilience.donnees < 40) {
    vulnerabilities.push('forte intensité de traitement de données structurées');
  }
  if (task.resilience.decision < 40) {
    vulnerabilities.push('faible complexité décisionnelle');
  }
  if (task.resilience.relationnel < 40) {
    vulnerabilities.push('faible composante relationnelle');
  }
  if (task.resilience.creativite < 40) {
    vulnerabilities.push('processus standardisé sans créativité');
  }
  if (task.resilience.execution < 40) {
    vulnerabilities.push('exécution facilement automatisable');
  }
  
  if (vulnerabilities.length === 0) {
    return 'Tâche présentant une bonne résilience globale.';
  }
  
  return `Ce score est dû à : ${vulnerabilities.join(', ')}.`;
}

// ===============================================
// MAIN REPORT GENERATOR
// ===============================================

export function generatePDFReport(data: ReportData, locale: 'fr' | 'en' = 'fr'): void {
  const { context, tasks, talents, software, strategy, computedKPIs } = data;
  const isAugmentation = context.goal === 'augmentation';
  const colors = isAugmentation ? COLORS.augmentation : COLORS.pivot;
  
  // Création du document PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // ===============================================
  // PAGE 1: COUVERTURE
  // ===============================================
  
  // Background accent
  doc.setFillColor(...hexToRgb(colors.background));
  doc.rect(0, 0, pageWidth, 80, 'F');
  
  // Logo/Title
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.rect(margin, 25, 8, 30, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text('APEX', margin + 12, 42);
  
  doc.setFontSize(14);
  doc.setTextColor(...hexToRgb(colors.muted));
  doc.text(locale === 'fr' ? 'Rapport Stratégique' : 'Strategic Report', margin + 12, 52);
  
  // Scenario Badge
  const scenarioLabel = context.goal ? GOAL_LABELS[context.goal][locale] : '';
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.roundedRect(pageWidth - margin - 50, 35, 50, 12, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(scenarioLabel.toUpperCase(), pageWidth - margin - 25, 42, { align: 'center' });
  
  // Main Title Block
  yPos = 100;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(context.jobTitle || 'Position Non Spécifiée', margin, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...hexToRgb(colors.muted));
  doc.text(`${context.industry || 'Secteur non spécifié'} | ${context.persona ? PERSONA_LABELS[context.persona][locale] : ''}`, margin, yPos);
  
  // KPIs Summary Box
  yPos += 25;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 50, 4, 4, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(locale === 'fr' ? 'INDICATEURS CLÉS' : 'KEY INDICATORS', margin + 5, yPos + 8);
  
  // KPI Grid
  const kpiStartY = yPos + 18;
  const kpiWidth = (pageWidth - 2 * margin - 20) / 4;
  
  const kpis = [
    { label: locale === 'fr' ? 'Productivité' : 'Productivity', value: `+${computedKPIs.productivityGainPercent}%`, color: colors.primary },
    { label: locale === 'fr' ? 'Temps libéré/an' : 'Time saved/year', value: `${computedKPIs.timeROI}h`, color: colors.accent },
    { label: locale === 'fr' ? 'Réduction risque' : 'Risk reduction', value: `${computedKPIs.riskReductionScore}/100`, color: colors.secondary },
    { label: locale === 'fr' ? 'Positionnement' : 'Positioning', value: `${computedKPIs.marketPositioningScore}/100`, color: colors.primary },
  ];
  
  kpis.forEach((kpi, i) => {
    const x = margin + 5 + (i * kpiWidth);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...hexToRgb(kpi.color));
    doc.text(kpi.value, x, kpiStartY + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...hexToRgb(colors.muted));
    doc.text(kpi.label, x, kpiStartY + 12);
  });
  
  // Date & Version
  yPos = pageHeight - 30;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(colors.muted));
  doc.text(`${locale === 'fr' ? 'Généré le' : 'Generated on'} ${new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}`, margin, yPos);
  doc.text('APEX Strategy Engine v2.0', pageWidth - margin, yPos, { align: 'right' });
  
  // ===============================================
  // PAGE 2: SYNTHÈSE EXÉCUTIVE
  // ===============================================
  doc.addPage();
  yPos = margin;
  
  // Header
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.rect(0, 0, pageWidth, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(locale === 'fr' ? '1. SYNTHÈSE EXÉCUTIVE' : '1. EXECUTIVE SUMMARY', margin, yPos + 10);
  
  yPos += 25;
  
  // Business Model You Summary
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 60, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...hexToRgb(colors.primary));
  doc.text(locale === 'fr' ? 'PROPOSITION DE VALEUR' : 'VALUE PROPOSITION', margin + 5, yPos + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...hexToRgb(colors.text));
  
  const splitValue = doc.splitTextToSize(strategy.businessModel.coreValue || '-', pageWidth - 2 * margin - 10);
  doc.text(splitValue, margin + 5, yPos + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(colors.muted));
  doc.text(locale === 'fr' ? 'Différenciateur:' : 'Differentiator:', margin + 5, yPos + 38);
  
  doc.setFont('helvetica', 'normal');
  const splitDiff = doc.splitTextToSize(strategy.businessModel.uniqueDifferentiator || '-', pageWidth - 2 * margin - 10);
  doc.text(splitDiff, margin + 5, yPos + 45);
  
  yPos += 70;
  
  // Ikigai Score Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(locale === 'fr' ? 'ALIGNEMENT STRATÉGIQUE' : 'STRATEGIC ALIGNMENT', margin, yPos);
  
  yPos += 10;
  
  // Alignment bar
  const barWidth = pageWidth - 2 * margin;
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(margin, yPos, barWidth, 8, 2, 2, 'F');
  
  const alignmentWidth = (strategy.ikigai.alignmentScore / 100) * barWidth;
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.roundedRect(margin, yPos, alignmentWidth, 8, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${strategy.ikigai.alignmentScore}%`, margin + alignmentWidth + 5, yPos + 6);
  
  yPos += 20;
  
  // 4 Dimensions
  const dimensions = [
    { label: locale === 'fr' ? 'Engagement Stratégique' : 'Strategic Engagement', value: strategy.ikigai.engagementStrategique },
    { label: locale === 'fr' ? 'Expertise Distinctive' : 'Distinctive Expertise', value: strategy.ikigai.expertiseDistinctive },
    { label: locale === 'fr' ? 'Demande Critique' : 'Critical Demand', value: strategy.ikigai.demandeCritique },
    { label: locale === 'fr' ? 'Levier Économique' : 'Economic Leverage', value: strategy.ikigai.levierEconomique },
  ];
  
  const dimWidth = (pageWidth - 2 * margin) / 4;
  dimensions.forEach((dim, i) => {
    const x = margin + i * dimWidth;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...hexToRgb(colors.primary));
    doc.text(`${dim.value}%`, x, yPos + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...hexToRgb(colors.muted));
    const splitLabel = doc.splitTextToSize(dim.label, dimWidth - 5);
    doc.text(splitLabel, x, yPos + 12);
  });
  
  // ===============================================
  // PAGE 3: MÉTHODOLOGIE
  // ===============================================
  doc.addPage();
  yPos = margin;
  
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.rect(0, 0, pageWidth, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(locale === 'fr' ? '2. MÉTHODOLOGIE' : '2. METHODOLOGY', margin, yPos + 10);
  
  yPos += 25;
  
  const methodologyText = locale === 'fr' 
    ? `Ce rapport a été généré à l'aide du moteur APEX Strategy Engine, qui intègre trois frameworks de management stratégique reconnus :

• ERAC (Blue Ocean Strategy) — W. Chan Kim & Renée Mauborgne
  Framework d'innovation stratégique permettant d'identifier les leviers de différenciation :
  Éliminer les tâches sans valeur, Réduire l'effort sur les activités secondaires,
  Augmenter l'investissement sur les compétences critiques, Créer de nouvelles capacités.

• Business Model You — Tim Clark & Alexander Osterwalder
  Adaptation du Business Model Canvas pour la gestion de carrière individuelle.
  Permet de formaliser la proposition de valeur, l'audience cible et le mode de livraison.

• Ikigai Stratégique (Matrice 4 dimensions)
  Évaluation de l'alignement entre engagement personnel, expertise distinctive,
  demande du marché et potentiel économique.

Les scores de vulnérabilité sont calculés selon 5 dimensions :
1. Données (traitement de données structurées)
2. Décision (complexité du jugement requis)
3. Relationnel (intensité des interactions humaines)
4. Créativité (originalité et innovation requises)
5. Exécution (composante physique/manuelle)`
    : `This report was generated using the APEX Strategy Engine, integrating three recognized strategic management frameworks:

• ERAC (Blue Ocean Strategy) — W. Chan Kim & Renée Mauborgne
  Strategic innovation framework to identify differentiation levers:
  Eliminate low-value tasks, Reduce effort on secondary activities,
  Raise investment in critical skills, Create new capabilities.

• Business Model You — Tim Clark & Alexander Osterwalder
  Business Model Canvas adaptation for individual career management.
  Formalizes value proposition, target audience, and delivery method.

• Strategic Ikigai (4-dimension Matrix)
  Alignment assessment between personal engagement, distinctive expertise,
  market demand, and economic potential.

Vulnerability scores are calculated across 5 dimensions:
1. Data (structured data processing)
2. Decision (judgment complexity required)
3. Relational (human interaction intensity)
4. Creativity (originality and innovation required)
5. Execution (physical/manual component)`;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(colors.text));
  const splitMethod = doc.splitTextToSize(methodologyText, pageWidth - 2 * margin);
  doc.text(splitMethod, margin, yPos);
  
  // ===============================================
  // PAGE 4: AUDIT DÉTAILLÉ DES TÂCHES
  // ===============================================
  doc.addPage();
  yPos = margin;
  
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.rect(0, 0, pageWidth, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(locale === 'fr' ? '3. AUDIT DÉTAILLÉ DES PROCESSUS' : '3. DETAILED PROCESS AUDIT', margin, yPos + 10);
  
  yPos += 20;
  
  // Table des tâches avec justifications
  if (tasks.length > 0) {
    const taskTableData = tasks.map(task => {
      const vulnScore = calculateVulnerabilityScore(task);
      const justification = getVulnerabilityJustification(task);
      return [
        task.name,
        `${task.hoursPerWeek}h/sem`,
        `${vulnScore}%`,
        justification.substring(0, 80) + (justification.length > 80 ? '...' : ''),
      ];
    });
    
    autoTable(doc, {
      startY: yPos,
      head: [[
        locale === 'fr' ? 'Tâche' : 'Task',
        locale === 'fr' ? 'Temps' : 'Time',
        locale === 'fr' ? 'Vuln.' : 'Vuln.',
        locale === 'fr' ? 'Justification technique' : 'Technical justification',
      ]],
      body: taskTableData,
      theme: 'striped',
      headStyles: { 
        fillColor: hexToRgb(colors.primary),
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 15 },
        3: { cellWidth: 'auto' },
      },
      margin: { left: margin, right: margin },
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(locale === 'fr' ? 'Aucune tâche auditée.' : 'No tasks audited.', margin, yPos + 10);
  }
  
  // ===============================================
  // PAGE 5: ACTIFS CRITIQUES
  // ===============================================
  doc.addPage();
  yPos = margin;
  
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.rect(0, 0, pageWidth, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(locale === 'fr' ? '4. ACTIFS STRATÉGIQUES CRITIQUES' : '4. CRITICAL STRATEGIC ASSETS', margin, yPos + 10);
  
  yPos += 20;
  
  const selectedTalents = talents.filter(t => t.selected);
  
  if (selectedTalents.length > 0) {
    const talentTableData = selectedTalents.map(talent => [
      talent.name,
      '★'.repeat(talent.level) + '☆'.repeat(5 - talent.level),
      talent.description,
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [[
        locale === 'fr' ? 'Actif' : 'Asset',
        locale === 'fr' ? 'Maîtrise' : 'Mastery',
        locale === 'fr' ? 'Description' : 'Description',
      ]],
      body: talentTableData,
      theme: 'striped',
      headStyles: { 
        fillColor: hexToRgb(colors.primary),
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 25 },
        2: { cellWidth: 'auto' },
      },
      margin: { left: margin, right: margin },
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(locale === 'fr' ? 'Aucun actif sélectionné.' : 'No assets selected.', margin, yPos + 10);
  }
  
  // ===============================================
  // PAGE 6: MATRICE ERAC
  // ===============================================
  doc.addPage();
  yPos = margin;
  
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.rect(0, 0, pageWidth, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(locale === 'fr' ? '5. MATRICE ERAC' : '5. ERAC MATRIX', margin, yPos + 10);
  
  yPos += 20;
  
  // Grouper les actions par catégorie
  const eracCategories: Record<string, ERACAction[]> = {
    eliminate: [],
    reduce: [],
    raise: [],
    create: [],
  };
  
  strategy.eracActions.forEach(action => {
    eracCategories[action.category].push(action);
  });
  
  const categoryLabels: Record<string, { fr: string; en: string; color: string }> = {
    eliminate: { fr: 'ÉLIMINER', en: 'ELIMINATE', color: '#ef4444' },
    reduce: { fr: 'RÉDUIRE', en: 'REDUCE', color: '#f59e0b' },
    raise: { fr: 'AUGMENTER', en: 'RAISE', color: '#10b981' },
    create: { fr: 'CRÉER', en: 'CREATE', color: '#3b82f6' },
  };
  
  Object.entries(eracCategories).forEach(([category, actions]) => {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }
    
    const catInfo = categoryLabels[category];
    
    // Category header
    doc.setFillColor(...hexToRgb(catInfo.color));
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${catInfo[locale]} (${actions.length})`, margin + 5, yPos + 5.5);
    
    yPos += 12;
    
    if (actions.length > 0) {
      actions.forEach(action => {
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = margin;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...hexToRgb(colors.text));
        doc.text(`• ${action.action}`, margin + 5, yPos);
        
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...hexToRgb(colors.muted));
        doc.text(action.rationale, margin + 8, yPos);
        
        if (action.sourceNote) {
          yPos += 4;
          doc.setFont('courier', 'normal');
          doc.setFontSize(7);
          doc.text(action.sourceNote, margin + 8, yPos);
        }
        
        yPos += 8;
      });
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(...hexToRgb(colors.muted));
      doc.text(locale === 'fr' ? 'Aucune action identifiée' : 'No action identified', margin + 5, yPos);
      yPos += 8;
    }
    
    yPos += 5;
  });
  
  // ===============================================
  // PAGE 7: ROADMAP OPÉRATIONNELLE
  // ===============================================
  doc.addPage();
  yPos = margin;
  
  doc.setFillColor(...hexToRgb(colors.primary));
  doc.rect(0, 0, pageWidth, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(colors.text));
  doc.text(locale === 'fr' ? '6. ROADMAP OPÉRATIONNELLE' : '6. OPERATIONAL ROADMAP', margin, yPos + 10);
  
  yPos += 20;
  
  const pillarLabels: Record<string, { fr: string; en: string }> = {
    delegation: { fr: 'DÉLÉGATION & EFFICIENCE', en: 'DELEGATION & EFFICIENCY' },
    reinforcement: { fr: 'RENFORCEMENT DE SIGNATURE', en: 'SIGNATURE REINFORCEMENT' },
    positioning: { fr: 'POSITIONNEMENT & AUTORITÉ', en: 'POSITIONING & AUTHORITY' },
  };
  
  const priorityLabels: Record<string, { fr: string; en: string }> = {
    immediate: { fr: 'Immédiat', en: 'Immediate' },
    short_term: { fr: '1-3 mois', en: '1-3 months' },
    medium_term: { fr: '3-6 mois', en: '3-6 months' },
  };
  
  // Grouper par pilier
  const roadmapByPillar: Record<string, typeof strategy.roadmap> = {
    delegation: [],
    reinforcement: [],
    positioning: [],
  };
  
  strategy.roadmap.forEach(action => {
    if (roadmapByPillar[action.pillar]) {
      roadmapByPillar[action.pillar].push(action);
    }
  });
  
  Object.entries(roadmapByPillar).forEach(([pillar, actions]) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
    
    // Pillar header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...hexToRgb(colors.primary));
    doc.text(pillarLabels[pillar][locale], margin, yPos);
    yPos += 8;
    
    if (actions.length > 0) {
      const roadmapTableData = actions.map(action => [
        action.completed ? '✓' : '○',
        action.title,
        priorityLabels[action.priority][locale],
        action.kpi || '-',
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [[
          '',
          locale === 'fr' ? 'Action' : 'Action',
          locale === 'fr' ? 'Échéance' : 'Timeline',
          'KPI',
        ]],
        body: roadmapTableData,
        theme: 'plain',
        headStyles: { 
          fillColor: [248, 250, 252],
          textColor: hexToRgb(colors.text),
          fontSize: 8,
          fontStyle: 'bold',
        },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 70 },
          2: { cellWidth: 25 },
          3: { cellWidth: 'auto' },
        },
        margin: { left: margin, right: margin },
      });
      
      // Get final Y position after table
      yPos = (doc as any).lastAutoTable.finalY + 10;
    } else {
      yPos += 10;
    }
  });
  
  // ===============================================
  // FOOTER MÉTHODOLOGIQUE (dernière page)
  // ===============================================
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...hexToRgb(colors.muted));
  doc.text(
    locale === 'fr' 
      ? 'Ce rapport utilise les standards ERAC (Blue Ocean Strategy) et Business Model You.'
      : 'This report uses ERAC (Blue Ocean Strategy) and Business Model You standards.',
    pageWidth / 2, 
    pageHeight - 10, 
    { align: 'center' }
  );
  
  // ===============================================
  // SAUVEGARDE
  // ===============================================
  const fileName = `APEX-Rapport-${context.jobTitle?.replace(/\s+/g, '-') || 'Strategie'}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Export par défaut
export default generatePDFReport;

