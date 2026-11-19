export const HOSPITAL_INSTITUTIONS = [
  'SNMC and HSK Hospital Bagalkot, Karnataka',
  'PIMS (DU) Loni, Maharashtra',
] as const;

export type BinId = 'yellow' | 'red' | 'white' | 'blue' | 'general';

export interface BinProtocol {
  id: BinId;
  name: string;
  shortLabel: string;
  regulatoryCode: string;
  treatmentCode: string;
  containerSpec: string;
  treatmentMethod: string;
  fillLimit: string;
  summary: string;
  acceptedItems: string[];
  prohibitedItems: string[];
  clinicalNote: string;
}

export interface TrainingModule {
  id: string;
  number: string;
  title: string;
  duration: string;
  regulatoryRef: string;
  summary: string;
  keyProtocols: {
    code: string;
    heading: string;
    detail: string;
  }[];
}

export type ClinicalUnit = 'All Units' | 'ICU & Ward' | 'Operation Theatre' | 'Microbiology Lab';

export type SpecimenType =
  | 'gauze'
  | 'iv-tubing'
  | 'needle-syringe'
  | 'glass-vial'
  | 'cytotoxic-vial'
  | 'catheter'
  | 'scalpel'
  | 'culture-plate'
  | 'gloves'
  | 'implant'
  | 'anatomical'
  | 'broken-ampoule'
  | 'paper-packaging'
  | 'food-waste'
  | 'water-bottle';

export interface SegregationItem {
  id: string;
  specimenCode: string;
  name: string;
  unit: Exclude<ClinicalUnit, 'All Units'>;
  context: string;
  correctBin: BinId;
  specimenType: SpecimenType;
  hint: string;
  advisory: string;
  wrongBinHazards: Record<BinId, string>;
}

export const BIN_PROTOCOLS: Record<BinId, BinProtocol> = {
  yellow: {
    id: 'yellow',
    name: 'Yellow — Anatomical & Soiled Waste',
    shortLabel: 'Yellow',
    regulatoryCode: 'BMWM-SCH-I-Y',
    treatmentCode: 'INCINERATION-1050C',
    containerSpec: 'Yellow colored non-chlorinated plastic bags or rigid containers',
    treatmentMethod: 'Incineration, plasma pyrolysis, or deep burial (rural/remote)',
    fillLimit: 'Seal at 3/4 capacity (75% maximum fill)',
    summary:
      'Infectious human/animal anatomical waste, blood-soaked dressings, expired medicines, chemical liquid waste, and pre-treated microbiological lab waste.',
    acceptedItems: [
      'Human anatomical waste, tissues, organs, and body parts',
      'Items contaminated with blood or body fluids (cotton swabs, gauze, plaster casts, bedding)',
      'Expired or discarded medicines and cytotoxic drugs (in separate labeled yellow bags)',
      'Chemical waste and chemical liquid waste (pre-treated prior to discharge)',
      'Microbiology, biotechnology, and clinical lab waste (autoclaved/pre-treated first)',
    ],
    prohibitedItems: [
      'Chlorinated plastic IV bottles, tubing, or catheters (causes dioxin/furan emission)',
      'Unprotected hypodermic needles, blades, or metallic sharps',
      'Clean paper wrappers or non-infectious general waste',
    ],
    clinicalNote:
      'Never place PVC plastics or uncontaminated general paper/packaging in Yellow bags. Chlorinated plastics incinerated in Yellow streams generate toxic dioxins and furans.',
  },
  red: {
    id: 'red',
    name: 'Red — Contaminated Recyclables',
    shortLabel: 'Red',
    regulatoryCode: 'BMWM-SCH-I-R',
    treatmentCode: 'CBMWTF-AUTOCLAVE',
    containerSpec: 'Red colored non-chlorinated plastic bags or puncture-resistant containers',
    treatmentMethod: 'Autoclaving or micro-waving / hydroclaving followed by shredding and authorized recycling',
    fillLimit: 'Seal at 3/4 capacity (75% maximum fill)',
    summary:
      'Wastes generated from disposable items other than waste sharps, such as tubing, bottles, intravenous tubes and sets, catheters, urine bags, and syringes without needles.',
    acceptedItems: [
      'Intravenous (IV) tubes, sets, and plastic saline/dextrose bottles',
      'Foley catheters, Ryle’s tubes, suction catheters, and urine collection bags',
      'Disposable plastic syringes without fixed needles and vacutainers',
      'Contaminated latex/nitrile examination gloves and plastic aprons',
    ],
    prohibitedItems: [
      'Syringes with fixed needles or detached metallic needles',
      'Blood-soaked cotton swabs, gauze, or anatomical dressings',
      'Clean non-contaminated packaging or drinking water bottles (belong in Black/Green)',
    ],
    clinicalNote:
      'Plastic waste in the Red bin is never incinerated. It undergoes thermal disinfection (autoclave) and mechanical shredding before authorized recycling.',
  },
  white: {
    id: 'white',
    name: 'White — Translucent Puncture-Proof Sharps',
    shortLabel: 'White (Sharps)',
    regulatoryCode: 'BMWM-SCH-I-W',
    treatmentCode: 'SHARPS-AUTOCLAVE-SHRED',
    containerSpec: 'Puncture-proof, leak-proof, tamper-proof translucent white containers',
    treatmentMethod: 'Autoclaving or dry heat sterilization followed by shredding, mutilation, or encapsulation',
    fillLimit: 'Lock permanently at 3/4 capacity; never overfill or hand-compress',
    summary:
      'Waste sharps including metals: needles, syringes with fixed needles, needles from needle tip cutter/burner, scalpels, blades, or any contaminated sharp object.',
    acceptedItems: [
      'Hypodermic needles and syringes with fixed needles (e.g., insulin syringes)',
      'Surgical scalpel blades, lancets, suture needles, and lumbar puncture needles',
      'Needles severed by needle tip cutters or hub cutters',
      'Any metallic sharp object capable of puncturing standard plastic bags',
    ],
    prohibitedItems: [
      'Broken glass ampoules or vials (belong in Blue puncture-proof containers)',
      'Plastic syringe barrels without needles (belong in Red)',
      'Soft dressings, swabs, gloves, or general paper waste',
    ],
    clinicalNote:
      'Translucent walls allow staff to visually inspect the 3/4 fill line without opening the container. Never recap bent or used needles before disposal.',
  },
  blue: {
    id: 'blue',
    name: 'Blue — Glassware & Metallic Implants',
    shortLabel: 'Blue',
    regulatoryCode: 'BMWM-SCH-I-B',
    treatmentCode: 'DISINFECTION-RECYCLE',
    containerSpec: 'Puncture-proof and leak-proof cardboard boxes with blue colored marking',
    treatmentMethod: 'Disinfection (detergent & sodium hypochlorite soak) or autoclaving, then authorized glass/metal recycling',
    fillLimit: 'Seal securely at 3/4 capacity with blue biohazard marking visible',
    summary:
      'Broken or discarded and contaminated glass including medicine vials and ampoules (except those contaminated with cytotoxic wastes), plus metallic body implants.',
    acceptedItems: [
      'Broken or discarded glass medicine vials and glass ampoules',
      'Glass slides, cover slips, and glass pipettes (non-cytotoxic)',
      'Metallic body implants (orthopedic plates, screws, K-wires, dental implants)',
    ],
    prohibitedItems: [
      'Glass vials contaminated with cytotoxic/chemotherapy drugs (must go to Yellow)',
      'Metallic needles, surgical scalpels, or lancets (must go to White)',
      'Plastic IV bottles, plastic syringes, or general wrappers',
    ],
    clinicalNote:
      'Always verify whether a discarded glass vial held cytotoxic agents. Cytotoxic-contaminated vials bypass the Blue stream and enter Yellow incineration.',
  },
  general: {
    id: 'general',
    name: 'Black / Green — General Non-Hazardous Waste',
    shortLabel: 'Black / Green',
    regulatoryCode: 'BMWM-GEN-SWM',
    treatmentCode: 'MUNICIPAL-COMPOST-RECYCLE',
    containerSpec: 'Black (dry general waste) or Green (biodegradable wet waste) municipal bags',
    treatmentMethod: 'Municipal solid waste stream: composting for Green wet waste and material recovery for Black dry waste',
    fillLimit: 'Tie securely at 3/4 capacity; strictly exclude all infectious waste',
    summary:
      'Non-infectious, uncontaminated general hospital waste generated in wards, nursing stations, and offices that has zero contact with blood, body fluids, or hazardous drugs.',
    acceptedItems: [
      'Clean sterile syringe/gloves outer paper & plastic peel pouches (before contamination)',
      'Clean cardboard medicine cartons, administrative paper, and newspapers',
      'Leftover patient meal trays, fruit peels, and biodegradable food waste (Green)',
      'Empty uncontaminated mineral water bottles and clean cup wrappers (Black)',
    ],
    prohibitedItems: [
      'Any item stained with blood, pus, sputum, or body fluids (Yellow)',
      'Contaminated gloves, IV sets, catheters, or syringes (Red)',
      'Needles, blades, glass ampoules, or vials (White / Blue)',
    ],
    clinicalNote:
      'Accurate separation of clean packaging into Black/Green prevents overloading biomedical incinerators and autoclaves—reducing hospital treatment costs and emissions.',
  },
};

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'mod-01',
    number: '01',
    title: 'Statutory Framework & Five-Stream Segregation',
    duration: '12 min study',
    regulatoryRef: 'BMWM Rules 2016 · Schedule I & SWM',
    summary:
      'Establishes point-of-generation segregation discipline across hospital wards, ICUs, and clinics using the four mandatory biomedical waste streams (Yellow, Red, White, Blue) alongside the Black/Green municipal general waste bin.',
    keyProtocols: [
      {
        code: 'RULE-4(a)',
        heading: 'Segregation at Source',
        detail:
          'Biomedical waste must never be mixed with Black/Green general municipal waste. Segregation occurs strictly at the point of generation (bedside, procedure tray, or lab bench).',
      },
      {
        code: 'SCH-I-75',
        heading: 'Three-Quarter Fill Ceiling',
        detail:
          'All color-coded bags and puncture-proof containers must be tied/sealed once filled to 75% (three-quarters) capacity to prevent tearing, spillage, and aerosol exposure.',
      },
      {
        code: 'RULE-8(3)',
        heading: '48-Hour Storage Limit',
        detail:
          'Untreated human anatomical waste, animal waste, soiled waste, and biotechnology waste must not be stored beyond 48 hours on facility premises.',
      },
    ],
  },
  {
    id: 'mod-02',
    number: '02',
    title: 'Sharps Containment & Needle-Stick Injury Prevention',
    duration: '10 min study',
    regulatoryRef: 'BMWM-SCH-I-W · OSHA/NACO',
    summary:
      'Operational safeguards for handling hypodermic needles, scalpel blades, and fixed-needle syringes to eliminate percutaneous injuries among healthcare personnel.',
    keyProtocols: [
      {
        code: 'SHARP-01',
        heading: 'Zero-Recapping Mandate',
        detail:
          'Never recap, bend, or manually detach used needles with two hands. Deposit fixed-needle syringes intact or utilize an approved hub cutter mounted over a White container.',
      },
      {
        code: 'SHARP-02',
        heading: 'Translucent Visual Check',
        detail:
          'White containers must remain translucent and puncture-proof so clinicians can visually verify the 3/4 fill line without reaching inside.',
      },
      {
        code: 'PEP-02H',
        heading: 'Immediate Exposure Window',
        detail:
          'Following a needle-stick injury, wash gently with soap and running water (do not squeeze or scrub), report to the nodal officer immediately, and initiate PEP assessment within 2 hours.',
      },
    ],
  },
  {
    id: 'mod-03',
    number: '03',
    title: 'Pre-Treatment of Microbiological & Cytotoxic Waste',
    duration: '14 min study',
    regulatoryRef: 'BMWM Amendment 2018 · WHO Guidelines',
    summary:
      'Mandatory on-site sterilization of high-consequence laboratory cultures and specialized routing for cytotoxic oncology vials and expired pharmaceuticals.',
    keyProtocols: [
      {
        code: 'MICRO-PRE',
        heading: 'On-Site Autoclave Pre-Treatment',
        detail:
          'Microbiology cultures, stocks of infectious agents, blood bags, and live/attenuated vaccines must be pre-treated on site by autoclaving/microwaving per WHO/NACO standards prior to handing over in Yellow bags.',
      },
      {
        code: 'CYTO-RT',
        heading: 'Cytotoxic Exception Rule',
        detail:
          'Although ordinary glass medicine vials go to the Blue box, glass vials contaminated with cytotoxic or chemotherapeutic agents must be routed to Yellow for high-temperature incineration (>1050°C).',
      },
      {
        code: 'CHEM-1',
        heading: 'Chlorinated Plastic Ban',
        detail:
          'Facilities must strictly phase out chlorinated plastic bags (excluding blood bags) and gloves to eliminate persistent organic pollutant formation.',
      },
    ],
  },
  {
    id: 'mod-04',
    number: '04',
    title: 'CBMWTF Chain of Custody, Barcoding & Spill Protocol',
    duration: '11 min study',
    regulatoryRef: 'BMWM Rule 4(i) · Form IV Tracking',
    summary:
      'Digital barcode tracking from ward collection to the Common Biomedical Waste Treatment Facility (CBMWTF), blood spill containment, and statutory documentation.',
    keyProtocols: [
      {
        code: 'BAR-CUST',
        heading: 'Mandatory Barcoded Bags',
        detail:
          'Every color-coded bag or container handed to the CBMWTF transporter must bear a scannable barcode label recording hospital ID, category, weight, and pickup timestamp.',
      },
      {
        code: 'SPILL-BLOOD',
        heading: 'Blood Spill Containment (1% Hypochlorite)',
        detail:
          'Don PPE, cover blood/body fluid spill with absorbent paper/gauze, apply freshly prepared 1% sodium hypochlorite for 20 minutes contact time, and discard cleanup swabs into the Yellow bag.',
      },
      {
        code: 'LOG-30D',
        heading: 'Annual & Monthly Register',
        detail:
          'Maintain daily waste generation registers by color category and submit Annual Reports (Form IV) to the State Pollution Control Board before June 30 each year.',
      },
    ],
  },
];

export const SEGREGATION_ITEMS: SegregationItem[] = [
  {
    id: 'item-01',
    specimenCode: 'SPEC-ICU-104',
    name: 'Blood-Soiled Surgical Gauze & Dressing',
    unit: 'ICU & Ward',
    context: 'Removed from a post-operative abdominal wound dressing change in Surgical ICU Bed 4.',
    correctBin: 'yellow',
    specimenType: 'gauze',
    hint: 'Contains human blood and infectious exudate on absorbent cotton fabric.',
    advisory:
      'Soiled dressings, cotton swabs, and items contaminated with blood/body fluids belong strictly in the Yellow non-chlorinated bag for incineration.',
    wrongBinHazards: {
      yellow: '',
      red: 'Red is reserved for recyclable plastics. Absorbent blood-soaked gauze cannot be recycled and contaminates autoclave batches.',
      white: 'White puncture-proof containers are strictly for metallic sharps. Soft dressings waste limited sharps capacity.',
      blue: 'Blue is strictly for glassware and metallic implants. Soiled dressings pose infectious hazard in recycling streams.',
      general: 'Discarding blood-soaked gauze in Black/Green general waste exposes municipal sanitation workers to severe biohazards.',
    },
  },
  {
    id: 'item-02',
    specimenCode: 'SPEC-WRD-209',
    name: 'Used IV Infusion Set & Saline Bottle',
    unit: 'ICU & Ward',
    context: 'Disconnected plastic IV tubing and collapsible plastic normal saline bottle after infusion completion.',
    correctBin: 'red',
    specimenType: 'iv-tubing',
    hint: 'Contaminated disposable medical plastic with no metallic needle attached.',
    advisory:
      'IV tubes, sets, catheters, and plastic bottles belong in the Red stream for autoclaving and mechanical shredding prior to recycling.',
    wrongBinHazards: {
      yellow: 'Incinerating medical plastics in Yellow bags releases toxic dioxins and furans into the atmosphere.',
      red: '',
      white: 'Plastic IV tubing is not a sharp and will rapidly overfill rigid sharps containers.',
      blue: 'Blue is reserved for glass vials, ampoules, and metallic implants—not flexible medical plastics.',
      general: 'Used IV sets are contaminated clinical plastics and must never enter general Black/Green municipal waste.',
    },
  },
  {
    id: 'item-03',
    specimenCode: 'SPEC-ICU-312',
    name: '22G Hypodermic Needle with Fixed Syringe',
    unit: 'ICU & Ward',
    context: 'Subcutaneous insulin/heparin syringe with an integrated, non-detachable metallic needle.',
    correctBin: 'white',
    specimenType: 'needle-syringe',
    hint: 'Integrated sharp metallic tip capable of puncturing standard plastic bags.',
    advisory:
      'Syringes with fixed needles must be deposited intact into the White translucent puncture-proof container. Never manually bend or recap.',
    wrongBinHazards: {
      yellow: 'Uncontained needles puncture Yellow plastic bags, creating severe needle-stick injury risks for waste handlers.',
      red: 'Fixed needles in Red bags injure housekeeping and CBMWTF autoclave shredding operators.',
      white: '',
      blue: 'Blue containers are designated for glass ampoules and implants; metallic needles require White sharps containment.',
      general: 'Loose needles in Black/Green municipal waste cause life-threatening bloodborne pathogen exposures.',
    },
  },
  {
    id: 'item-04',
    specimenCode: 'SPEC-WRD-418',
    name: 'Broken Cefotaxime Glass Vial',
    unit: 'ICU & Ward',
    context: 'Empty, cracked borosilicate antibiotic vial after reconstitution on the medication cart.',
    correctBin: 'blue',
    specimenType: 'glass-vial',
    hint: 'Non-cytotoxic pharmaceutical glassware.',
    advisory:
      'Discarded or broken medicine vials and ampoules (non-cytotoxic) belong in the Blue puncture-proof marked box for disinfection and glass recycling.',
    wrongBinHazards: {
      yellow: 'Glass does not burn in incinerators; it shatters and accumulates as hazardous slag in Yellow incineration ash.',
      red: 'Broken glass cuts through Red bags and damages plastic shredding blades during recycling.',
      white: 'White containers are dedicated to metallic sharps (needles/blades), whereas pharmaceutical glass belongs in Blue.',
      blue: '',
      general: 'Contaminated pharmaceutical glass vials must be disinfected via Blue containers rather than general trash.',
    },
  },
  {
    id: 'item-05',
    specimenCode: 'SPEC-WRD-450',
    name: 'Clean Syringe Outer Wrapper & Cardboard Box',
    unit: 'ICU & Ward',
    context: 'Uncontaminated sterile blister paper peel-pouch and outer cardboard carton opened before patient contact.',
    correctBin: 'general',
    specimenType: 'paper-packaging',
    hint: 'Clean, uncontaminated dry packaging with zero biological or drug exposure.',
    advisory:
      'Clean paper wrappers and cardboard packaging belong in the Black/Green general non-hazardous waste bin to keep biomedical streams unburdened.',
    wrongBinHazards: {
      yellow: 'Sending clean paper cartons to Yellow incineration wastes hospital funds and causes unnecessary emissions.',
      red: 'Clean outer paper packaging is not contaminated clinical plastic and does not belong in Red autoclave streams.',
      white: 'Clean wrappers must never occupy expensive puncture-proof White sharps containers.',
      blue: 'Blue is reserved exclusively for glassware and metallic implants.',
      general: '',
    },
  },
  {
    id: 'item-06',
    specimenCode: 'SPEC-ONC-501',
    name: 'Empty Cytotoxic Chemotherapy Vial (Cisplatin)',
    unit: 'ICU & Ward',
    context: 'Residual trace cytotoxic antineoplastic vial generated during oncology infusion preparation.',
    correctBin: 'yellow',
    specimenType: 'cytotoxic-vial',
    hint: 'Check the Cytotoxic Exception Rule under Schedule I!',
    advisory:
      'Even though it is glass, any container contaminated with cytotoxic drugs MUST go into the Yellow bag (labeled Cytotoxic Waste) for high-temperature incineration.',
    wrongBinHazards: {
      yellow: '',
      red: 'Cytotoxic drug residue cannot enter plastic autoclave/recycling streams.',
      white: 'White sharps containers are not thermally destroyed at cytotoxic incineration temperatures (>1050°C).',
      blue: 'Schedule I explicitly excludes cytotoxic-contaminated glass from Blue recycling due to mutagenic residue risks.',
      general: 'Cytotoxic chemotherapy residue is highly hazardous and strictly forbidden in general waste.',
    },
  },
  {
    id: 'item-07',
    specimenCode: 'SPEC-OT-607',
    name: 'Used Foley Urinary Catheter & Drainage Bag',
    unit: 'Operation Theatre',
    context: 'Silicone/latex Foley catheter and plastic collection bag removed post-surgery.',
    correctBin: 'red',
    specimenType: 'catheter',
    hint: 'Disposable contaminated plastic/elastomer tubing without metallic sharps.',
    advisory:
      'Catheters, urine bags, and suction tubing belong in the Red bin for autoclaving/microwaving and authorized recycling.',
    wrongBinHazards: {
      yellow: 'Placing chlorinated/polymer catheters in Yellow causes toxic emissions during incineration.',
      red: '',
      white: 'Catheters are flexible tubing, not sharps.',
      blue: 'Blue is strictly for glassware and metallic body implants.',
      general: 'Contaminated urinary catheters are infectious biomedical plastic and cannot go into general waste.',
    },
  },
  {
    id: 'item-08',
    specimenCode: 'SPEC-OT-714',
    name: 'Discarded #11 Surgical Scalpel Blade',
    unit: 'Operation Theatre',
    context: 'Detached sterile stainless-steel scalpel blade after minor incision procedure.',
    correctBin: 'white',
    specimenType: 'scalpel',
    hint: 'High-risk metallic cutting sharp.',
    advisory:
      'Scalpel blades, suture needles, and lancets must be placed immediately into the White translucent puncture-proof sharps container.',
    wrongBinHazards: {
      yellow: 'Loose scalpel blades slice open Yellow plastic bags, causing severe occupational lacerations.',
      red: 'Blades inside Red bags pose lethal laceration hazards during downstream sorting and shredding.',
      white: '',
      blue: 'Metallic surgical sharps must be segregated in White containers, not Blue glassware boxes.',
      general: 'Surgical blades in Black/Green bins endanger all hospital housekeeping and municipal staff.',
    },
  },
  {
    id: 'item-09',
    specimenCode: 'SPEC-LAB-822',
    name: 'Pre-Treated Bacterial Culture Plate',
    unit: 'Microbiology Lab',
    context: 'MacConkey agar plate containing clinical bacterial colonies after mandatory on-site autoclaving.',
    correctBin: 'yellow',
    specimenType: 'culture-plate',
    hint: 'Microbiology & biotechnology laboratory waste after on-site pre-treatment.',
    advisory:
      'Microbiology and biotechnology lab waste must be pre-treated (autoclaved on site) and then dispatched in Yellow bags for final CBMWTF disposal.',
    wrongBinHazards: {
      yellow: '',
      red: 'Bio-culture plates containing agar and microbial stocks belong in Yellow after pre-treatment, not Red household plastic recycling.',
      white: 'Plastic culture plates are not metallic sharps.',
      blue: 'Plastic Petri dishes with microbial waste do not belong in the Blue glassware/implant stream.',
      general: 'Microbial culture plates are regulated laboratory waste and cannot enter general municipal waste.',
    },
  },
  {
    id: 'item-10',
    specimenCode: 'SPEC-WRD-903',
    name: 'Contaminated Nitrile Examination Gloves',
    unit: 'ICU & Ward',
    context: 'Single-use examination gloves worn during venipuncture and patient wound assessment.',
    correctBin: 'red',
    specimenType: 'gloves',
    hint: 'Contaminated non-PVC disposable PPE polymer.',
    advisory:
      'Contaminated disposable gloves (rubber/nitrile) are classified under Red contaminated recyclables for autoclaving and shredding.',
    wrongBinHazards: {
      yellow: 'Gloves are non-anatomical disposable polymers and belong in Red rather than Yellow incineration.',
      red: '',
      white: 'Gloves are soft material, not sharps.',
      blue: 'Blue is restricted to glass vials, ampoules, and metallic implants.',
      general: 'Clinical examination gloves used on patients are infectious and must not go into Black/Green general waste.',
    },
  },
  {
    id: 'item-11',
    specimenCode: 'SPEC-OT-955',
    name: 'Explanted Titanium Orthopedic Plate & Screws',
    unit: 'Operation Theatre',
    context: 'Non-sharp metallic fixation plate and cortical screws removed during revision orthopedic surgery.',
    correctBin: 'blue',
    specimenType: 'implant',
    hint: 'Category (b) under Blue: Metallic body implants.',
    advisory:
      'Metallic body implants (plates, rods, screws, dental prostheses) are specifically assigned to the Blue stream for disinfection and metal recycling.',
    wrongBinHazards: {
      yellow: 'Metallic implants are non-combustible and interfere with incinerator grates.',
      red: 'Heavy titanium hardware damages plastic shredders used for Red bag waste.',
      white: 'White is for disposable waste sharps (needles/blades), whereas metallic body implants belong in Blue.',
      blue: '',
      general: 'Explanted surgical hardware requires Blue disinfection/recycling, not municipal trash.',
    },
  },
  {
    id: 'item-12',
    specimenCode: 'SPEC-WRD-960',
    name: 'Leftover Patient Fruit Peels & Food Waste',
    unit: 'ICU & Ward',
    context: 'Biodegradable kitchen waste and fruit peels from a general medical ward meal tray (non-isolation ward).',
    correctBin: 'general',
    specimenType: 'food-waste',
    hint: 'Biodegradable organic municipal waste without infectious contamination.',
    advisory:
      'Non-infectious food scraps and organic waste belong in the Green/Black general municipal stream (Green bin for composting).',
    wrongBinHazards: {
      yellow: 'Wet organic food waste lowers incinerator efficiency in Yellow biomedical streams.',
      red: 'Food waste contaminates Red recyclable medical plastics.',
      white: 'Food scraps must never be placed in sharps containers.',
      blue: 'Blue is strictly for glassware and metallic implants.',
      general: '',
    },
  },
  {
    id: 'item-13',
    specimenCode: 'SPEC-OT-981',
    name: 'Excised Lipoma Tissue Specimen',
    unit: 'Operation Theatre',
    context: 'Human anatomical tissue excised during surgery after histopathology clearance.',
    correctBin: 'yellow',
    specimenType: 'anatomical',
    hint: 'Human anatomical tissue waste.',
    advisory:
      'All human anatomical waste—tissues, organs, and body parts—must be placed in Yellow non-chlorinated bags for incineration within 48 hours.',
    wrongBinHazards: {
      yellow: '',
      red: 'Human tissue cannot enter plastic autoclaving and recycling workflows.',
      white: 'White is exclusively for metallic sharps.',
      blue: 'Blue is strictly for glassware and metallic implants.',
      general: 'Human anatomical tissue is strictly prohibited from Black/Green general municipal waste.',
    },
  },
  {
    id: 'item-14',
    specimenCode: 'SPEC-LAB-994',
    name: 'Snapped Adrenaline Glass Ampoule',
    unit: 'Operation Theatre',
    context: 'Opened 1 mL glass ampoule with sharp snapped neck from emergency resuscitation trolley.',
    correctBin: 'blue',
    specimenType: 'broken-ampoule',
    hint: 'Broken non-cytotoxic medication glass ampoule.',
    advisory:
      'Snapped or broken glass ampoules (non-cytotoxic) go directly into the Blue puncture-proof, leak-proof marked container.',
    wrongBinHazards: {
      yellow: 'Glass ampoules do not incinerate and puncture soft Yellow plastic bags.',
      red: 'Glass fragments tear Red bags and pose laceration hazards.',
      white: 'Even when snapped, glass medication ampoules are routed to Blue glassware boxes rather than White metallic sharps.',
      blue: '',
      general: 'Broken glass medication ampoules pose severe laceration risks in general waste bags.',
    },
  },
  {
    id: 'item-15',
    specimenCode: 'SPEC-LAB-998',
    name: 'Empty Clean Drinking Water Bottle',
    unit: 'Microbiology Lab',
    context: 'Sealed clean PET water bottle from the clean administrative desk outside the microbiology bench.',
    correctBin: 'general',
    specimenType: 'water-bottle',
    hint: 'Non-clinical, uncontaminated municipal recyclable plastic.',
    advisory:
      'Uncontaminated domestic water bottles from clean administrative areas belong in the Black/Green general waste stream—not Red clinical plastic.',
    wrongBinHazards: {
      yellow: 'Clean PET bottles should never be incinerated in Yellow bags.',
      red: 'Red is strictly for infectious medical plastics (IV bottles, catheters, syringes); mixing clean bottles inflates bio-waste costs.',
      white: 'Water bottles do not belong in White sharps containers.',
      blue: 'Blue is strictly for glassware and metallic implants.',
      general: '',
    },
  },
];

// 20-Item Certification Exam Deck (Drag & Drop Only — 19/20 = 95% Required to Pass)
export const EXAM_SPECIMENS: SegregationItem[] = [
  ...SEGREGATION_ITEMS,
  {
    id: 'exam-16',
    specimenCode: 'EXAM-ICU-101',
    name: 'Used Blood-Stained Cotton Swab (Post-Cannulation)',
    unit: 'ICU & Ward',
    context: 'Cotton ball saturated with blood following peripheral IV cannula removal.',
    correctBin: 'yellow',
    specimenType: 'gauze',
    hint: 'Blood-soaked absorbent cotton.',
    advisory:
      'Blood-soaked cotton swabs and dressings belong in the Yellow stream for incineration.',
    wrongBinHazards: {
      yellow: '',
      red: 'Absorbent cotton swabs cannot be autoclaved for plastic recycling.',
      white: 'Cotton swabs are soft soiled waste, not sharps.',
      blue: 'Blue is reserved for glass and metallic implants.',
      general: 'Blood-soaked cotton is infectious and prohibited in Black/Green general waste.',
    },
  },
  {
    id: 'exam-17',
    specimenCode: 'EXAM-WRD-102',
    name: 'Plastic Syringe Barrel (Needle Detached via Hub Cutter)',
    unit: 'ICU & Ward',
    context: '5 mL plastic syringe barrel after its metallic needle was sheared directly into a White sharps container.',
    correctBin: 'red',
    specimenType: 'iv-tubing',
    hint: 'Syringe without fixed needle.',
    advisory:
      'Once the needle is safely sheared off, the contaminated plastic syringe barrel belongs in the Red bin for autoclaving and recycling.',
    wrongBinHazards: {
      yellow: 'Plastic syringes in Yellow bags release dioxins upon incineration.',
      red: '',
      white: 'Only the detached needle belongs in White; placing bulky plastic barrels in White wastes sharps capacity.',
      blue: 'Blue is strictly for glassware and metallic implants.',
      general: 'Used syringe barrels are contaminated clinical waste and prohibited in Black/Green bins.',
    },
  },
  {
    id: 'exam-18',
    specimenCode: 'EXAM-OT-103',
    name: 'Used Curved Surgical Suture Needle',
    unit: 'Operation Theatre',
    context: 'Stainless steel suture needle detached from needle holder after skin closure.',
    correctBin: 'white',
    specimenType: 'scalpel',
    hint: 'Metallic surgical sharp.',
    advisory:
      'Suture needles, scalpel blades, and hypodermic needles must be placed in the White translucent puncture-proof sharps container.',
    wrongBinHazards: {
      yellow: 'Loose suture needles pierce Yellow bags and injure waste handlers.',
      red: 'Suture needles in Red bags cause percutaneous injuries during sorting.',
      white: '',
      blue: 'Metallic needles belong in White, not Blue glassware boxes.',
      general: 'Suture needles are high-risk sharps and strictly forbidden in Black/Green bins.',
    },
  },
  {
    id: 'exam-19',
    specimenCode: 'EXAM-LAB-104',
    name: 'Discarded Glass Microscope Slide (Non-Cytotoxic)',
    unit: 'Microbiology Lab',
    context: 'Cracked glass slide from routine peripheral blood smear examination.',
    correctBin: 'blue',
    specimenType: 'glass-vial',
    hint: 'Contaminated laboratory glassware.',
    advisory:
      'Broken or discarded glass slides, ampoules, and non-cytotoxic vials belong in the Blue puncture-proof marked box for disinfection.',
    wrongBinHazards: {
      yellow: 'Glass slides do not incinerate and shatter inside Yellow bags.',
      red: 'Glass slides tear Red plastic bags and damage recycling shredders.',
      white: 'Glassware belongs in Blue containers; White is reserved for metallic sharps.',
      blue: '',
      general: 'Contaminated blood-smear glass slides cannot enter general municipal waste.',
    },
  },
  {
    id: 'exam-20',
    specimenCode: 'EXAM-ADM-105',
    name: 'Clean Non-Soiled Paper Hand Towel (Staff Washbasin)',
    unit: 'ICU & Ward',
    context: 'Single-use paper towel used strictly for drying washed hands at the clean nursing station sink.',
    correctBin: 'general',
    specimenType: 'paper-packaging',
    hint: 'Uncontaminated dry paper waste.',
    advisory:
      'Clean handwashing paper towels with zero infectious exposure belong in the Black/Green general municipal waste bin.',
    wrongBinHazards: {
      yellow: 'Handwashing paper towels are non-infectious and should not be sent to biomedical incineration.',
      red: 'Paper towels are neither plastic nor infectious.',
      white: 'Soft paper does not belong in White sharps containers.',
      blue: 'Blue is strictly for glassware and metallic implants.',
      general: '',
    },
  },
];
