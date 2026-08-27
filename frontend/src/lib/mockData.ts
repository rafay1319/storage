import { Facility, Container, Customer, RentalAgreement, Task, AIInsight, FeedItem } from './types';

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-001',
    code: 'YARD-TEX-01',
    name: 'Austin Port Terminal Yard',
    address: '10400 Container Way, Industrial District',
    gpsLat: 30.2672,
    gpsLng: -97.7431,
    city: 'Austin',
    state: 'Texas',
    country: 'USA',
    managerName: 'Jason Miller',
    contactNumber: '+1 (512) 555-0144',
    operatingHours: '06:00 AM - 10:00 PM',
    totalContainers: 24,
    occupiedContainers: 19,
    occupancyRate: 79,
    monthlyRevenue: 14250,
    monthlyExpenses: 4100,
    netProfit: 10150,
    photos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800'
    ],
    notes: 'Main regional container hub equipped with automated heavy forklift stackers.',
    gridRows: 6,
    gridCols: 8
  },
  {
    id: 'fac-002',
    code: 'YARD-CAL-02',
    name: 'Long Beach Harbor Storage',
    address: '850 Harbor Blvd, Gate 4',
    gpsLat: 33.7701,
    gpsLng: -118.1937,
    city: 'Long Beach',
    state: 'California',
    country: 'USA',
    managerName: 'Sarah Jenkins',
    contactNumber: '+1 (310) 555-0188',
    operatingHours: '24/7 Automated Access',
    totalContainers: 20,
    occupiedContainers: 18,
    occupancyRate: 90,
    monthlyRevenue: 18900,
    monthlyExpenses: 5800,
    netProfit: 13100,
    photos: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800'
    ],
    notes: 'Refrigerated and climate-controlled container yard servicing Pacific import cargo.',
    gridRows: 5,
    gridCols: 8
  },
  {
    id: 'fac-003',
    code: 'YARD-TEX-03',
    name: 'Houston Freight Logistics Yard',
    address: '4200 Interstate Port Pkwy',
    gpsLat: 29.7604,
    gpsLng: -95.3698,
    city: 'Houston',
    state: 'Texas',
    country: 'USA',
    managerName: 'Robert Vance',
    contactNumber: '+1 (713) 555-0122',
    operatingHours: '07:00 AM - 09:00 PM',
    totalContainers: 16,
    occupiedContainers: 7,
    occupancyRate: 44,
    monthlyRevenue: 4900,
    monthlyExpenses: 6200,
    netProfit: -1300,
    photos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'
    ],
    notes: 'Newly commissioned facility. Underperforming occupancy requires pricing intervention.',
    gridRows: 4,
    gridCols: 8
  },
  {
    id: 'fac-004',
    code: 'YARD-FLA-04',
    name: 'Miami Inland Container Depot',
    address: '1900 Airport Freight Rd',
    gpsLat: 25.7617,
    gpsLng: -80.1918,
    city: 'Miami',
    state: 'Florida',
    country: 'USA',
    managerName: 'Elena Rostova',
    contactNumber: '+1 (305) 555-0177',
    operatingHours: '06:00 AM - 08:00 PM',
    totalContainers: 18,
    occupiedContainers: 14,
    occupancyRate: 78,
    monthlyRevenue: 12600,
    monthlyExpenses: 3900,
    netProfit: 8700,
    photos: [
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800'
    ],
    notes: 'Primary South Florida storage yard with hazmat and climate storage certificates.',
    gridRows: 5,
    gridCols: 8
  }
];

export const INITIAL_CONTAINERS: Container[] = [
  // Austin Port Terminal Yard (fac-001)
  { id: 'c-101', containerNumber: 'ATX-2001', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Occupied', rentalPrice: 450, purchaseCost: 4800, currentValue: 4200, insuranceValue: 6000, posX: 0, posY: 0, qrCode: 'QR-ATX-2001', barcode: 'BC-ATX-2001', currentCustomerName: 'Sarah Connor', currentCustomerCompany: 'Apex Global Logistics', lastInspectedAt: '2026-07-15', photos: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500'] },
  { id: 'c-102', containerNumber: 'ATX-2002', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '40ft', type: 'Climate Controlled', status: 'Occupied', rentalPrice: 750, purchaseCost: 8200, currentValue: 7500, insuranceValue: 10000, posX: 1, posY: 0, qrCode: 'QR-ATX-2002', barcode: 'BC-ATX-2002', currentCustomerName: 'David Miller', currentCustomerCompany: 'Boulder Construction LLC', lastInspectedAt: '2026-07-20', photos: [] },
  { id: 'c-103', containerNumber: 'ATX-2003', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Available', rentalPrice: 450, purchaseCost: 4800, currentValue: 4400, insuranceValue: 6000, posX: 2, posY: 0, qrCode: 'QR-ATX-2003', barcode: 'BC-ATX-2003', lastInspectedAt: '2026-07-28', photos: [] },
  { id: 'c-104', containerNumber: 'ATX-2004', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '40ft', type: 'Hazardous', status: 'Maintenance', rentalPrice: 850, purchaseCost: 9500, currentValue: 8100, insuranceValue: 12000, posX: 3, posY: 0, qrCode: 'QR-ATX-2004', barcode: 'BC-ATX-2004', lastInspectedAt: '2026-07-10', notes: 'Door gasket seal replacement in progress.', photos: [] },
  { id: 'c-105', containerNumber: 'ATX-2005', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Occupied', rentalPrice: 450, purchaseCost: 4800, currentValue: 4300, insuranceValue: 6000, posX: 4, posY: 0, qrCode: 'QR-ATX-2005', barcode: 'BC-ATX-2005', currentCustomerName: 'Marcus Vance', currentCustomerCompany: 'Vance Tech Sol', lastInspectedAt: '2026-06-30', photos: [] },
  { id: 'c-106', containerNumber: 'ATX-2006', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '45ft', type: 'Refrigerated', status: 'Reserved', rentalPrice: 950, purchaseCost: 11000, currentValue: 9800, insuranceValue: 14000, posX: 5, posY: 0, qrCode: 'QR-ATX-2006', barcode: 'BC-ATX-2006', lastInspectedAt: '2026-07-25', photos: [] },
  { id: 'c-107', containerNumber: 'ATX-2007', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Occupied', rentalPrice: 450, purchaseCost: 4800, currentValue: 4400, insuranceValue: 6000, posX: 6, posY: 0, qrCode: 'QR-ATX-2007', barcode: 'BC-ATX-2007', currentCustomerName: 'Elena Rostova', currentCustomerCompany: 'Gulf Coast Importers', photos: [] },
  { id: 'c-108', containerNumber: 'ATX-2008', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Cleaning', rentalPrice: 450, purchaseCost: 4800, currentValue: 4300, insuranceValue: 6000, posX: 7, posY: 0, qrCode: 'QR-ATX-2008', barcode: 'BC-ATX-2008', lastInspectedAt: '2026-07-29', notes: 'Scheduled for pressure washing after lease turnover.', photos: [] },

  // Long Beach Harbor Storage (fac-002)
  { id: 'c-201', containerNumber: 'LBH-1001', facilityId: 'fac-002', facilityName: 'Long Beach Harbor Storage', size: '40ft', type: 'Refrigerated', status: 'Occupied', rentalPrice: 950, purchaseCost: 11500, currentValue: 10200, insuranceValue: 15000, posX: 0, posY: 0, qrCode: 'QR-LBH-1001', barcode: 'BC-LBH-1001', currentCustomerName: 'Sarah Jenkins', currentCustomerCompany: 'Pacific Ocean Freight Corp', lastInspectedAt: '2026-08-01', photos: [] },
  { id: 'c-202', containerNumber: 'LBH-1002', facilityId: 'fac-002', facilityName: 'Long Beach Harbor Storage', size: '45ft', type: 'Refrigerated', status: 'Occupied', rentalPrice: 1100, purchaseCost: 12800, currentValue: 11500, insuranceValue: 16000, posX: 1, posY: 0, qrCode: 'QR-LBH-1002', barcode: 'BC-LBH-1002', currentCustomerName: 'David Chen', currentCustomerCompany: 'Golden Gate Cold Chain', lastInspectedAt: '2026-08-02', photos: [] },
  { id: 'c-203', containerNumber: 'LBH-1003', facilityId: 'fac-002', facilityName: 'Long Beach Harbor Storage', size: '20ft', type: 'Storage', status: 'Available', rentalPrice: 480, purchaseCost: 5000, currentValue: 4600, insuranceValue: 6500, posX: 2, posY: 0, qrCode: 'QR-LBH-1003', barcode: 'BC-LBH-1003', lastInspectedAt: '2026-07-29', photos: [] },
  { id: 'c-204', containerNumber: 'LBH-1004', facilityId: 'fac-002', facilityName: 'Long Beach Harbor Storage', size: '40ft', type: 'Storage', status: 'Occupied', rentalPrice: 800, purchaseCost: 8500, currentValue: 7800, insuranceValue: 11000, posX: 0, posY: 1, qrCode: 'QR-LBH-1004', barcode: 'BC-LBH-1004', currentCustomerName: 'Elena Rostova', currentCustomerCompany: 'Trans-Pacific Cargo', lastInspectedAt: '2026-07-22', photos: [] },
  { id: 'c-205', containerNumber: 'LBH-1005', facilityId: 'fac-002', facilityName: 'Long Beach Harbor Storage', size: '20ft', type: 'Climate Controlled', status: 'Reserved', rentalPrice: 600, purchaseCost: 6500, currentValue: 6000, insuranceValue: 8500, posX: 1, posY: 1, qrCode: 'QR-LBH-1005', barcode: 'BC-LBH-1005', lastInspectedAt: '2026-07-30', photos: [] },

  // Houston Freight Logistics Yard (fac-003)
  { id: 'c-301', containerNumber: 'HOU-3011', facilityId: 'fac-003', facilityName: 'Houston Freight Logistics Yard', size: '40ft', type: 'Storage', status: 'Maintenance', rentalPrice: 700, purchaseCost: 8000, currentValue: 7100, insuranceValue: 10000, posX: 0, posY: 0, qrCode: 'QR-HOU-3011', barcode: 'BC-HOU-3011', lastInspectedAt: '2026-07-18', notes: 'Scheduled for rust remediation and recoating.', photos: [] },
  { id: 'c-302', containerNumber: 'HOU-3012', facilityId: 'fac-003', facilityName: 'Houston Freight Logistics Yard', size: '20ft', type: 'Storage', status: 'Available', rentalPrice: 420, purchaseCost: 4500, currentValue: 4100, insuranceValue: 5500, posX: 1, posY: 0, qrCode: 'QR-HOU-3012', barcode: 'BC-HOU-3012', lastInspectedAt: '2026-07-24', photos: [] },
  { id: 'c-303', containerNumber: 'HOU-3013', facilityId: 'fac-003', facilityName: 'Houston Freight Logistics Yard', size: '40ft', type: 'Hazardous', status: 'Occupied', rentalPrice: 850, purchaseCost: 9200, currentValue: 8300, insuranceValue: 12000, posX: 2, posY: 0, qrCode: 'QR-HOU-3013', barcode: 'BC-HOU-3013', currentCustomerName: 'Robert Vance', currentCustomerCompany: 'Gulf Coast Petrochem', lastInspectedAt: '2026-07-15', photos: [] },

  // Miami Inland Container Depot (fac-004)
  { id: 'c-401', containerNumber: 'MIA-4001', facilityId: 'fac-004', facilityName: 'Miami Inland Container Depot', size: '40ft', type: 'Climate Controlled', status: 'Occupied', rentalPrice: 780, purchaseCost: 8600, currentValue: 7900, insuranceValue: 11000, posX: 0, posY: 0, qrCode: 'QR-MIA-4001', barcode: 'BC-MIA-4001', currentCustomerName: 'Patricia Bell', currentCustomerCompany: 'Caribbean Distribution LLC', lastInspectedAt: '2026-07-27', photos: [] },
  { id: 'c-402', containerNumber: 'MIA-4002', facilityId: 'fac-004', facilityName: 'Miami Inland Container Depot', size: '20ft', type: 'Storage', status: 'Occupied', rentalPrice: 460, purchaseCost: 4900, currentValue: 4400, insuranceValue: 6000, posX: 1, posY: 0, qrCode: 'QR-MIA-4002', barcode: 'BC-MIA-4002', currentCustomerName: 'Marcus Vance', currentCustomerCompany: 'Vance Import & Export', lastInspectedAt: '2026-07-20', photos: [] },
  { id: 'c-403', containerNumber: 'MIA-4003', facilityId: 'fac-004', facilityName: 'Miami Inland Container Depot', size: '45ft', type: 'Refrigerated', status: 'Available', rentalPrice: 1050, purchaseCost: 12000, currentValue: 10800, insuranceValue: 15000, posX: 2, posY: 0, qrCode: 'QR-MIA-4003', barcode: 'BC-MIA-4003', lastInspectedAt: '2026-07-26', photos: [] }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-001', name: 'Sarah Connor', companyName: 'Apex Global Logistics', email: 'sarah.logistics@apex.com', phone: '+1 (555) 432-1099', govId: 'TX-ID-99214A', address: '450 Commercial Ave, Austin TX', emergencyContact: '+1 (555) 991-0022', outstandingBalance: 0, activeRentalsCount: 4, notes: 'VIP Client. Priority dispatch & forklift service.' },
  { id: 'cust-002', name: 'David Miller', companyName: 'Boulder Construction LLC', email: 'david@boulderconst.com', phone: '+1 (555) 887-3211', govId: 'TX-ID-44102B', address: '120 Construction Pkwy, Round Rock TX', emergencyContact: '+1 (555) 334-1188', outstandingBalance: 350, activeRentalsCount: 3, notes: 'Requires early morning yard gate access permissions.' },
  { id: 'cust-003', name: 'Patricia Bell', companyName: 'Bell Event Planning', email: 'patricia@bellevents.com', phone: '+1 (555) 201-9988', govId: 'TX-ID-77219C', address: '880 Music Lane, Austin TX', emergencyContact: '+1 (555) 441-0055', outstandingBalance: 0, activeRentalsCount: 2 },
  { id: 'cust-004', name: 'Marcus Vance', companyName: 'Vance Tech Solutions', email: 'marcus@vancetech.io', phone: '+1 (555) 772-1100', govId: 'TX-ID-88310D', address: '300 Tech Ridge Pkwy, Austin TX', emergencyContact: '+1 (555) 882-9911', outstandingBalance: 0, activeRentalsCount: 2 }
];

export const INITIAL_TASKS: Task[] = [
  { 
    id: 'tsk-001', 
    taskNumber: 'TSK-10492', 
    title: 'Container ATX-2004 Seal & Door Gasket Repair', 
    description: 'Replace rubber weather seal strip around main swinging doors and inspect locking rod cams.', 
    facilityId: 'fac-001', 
    facilityName: 'Austin Port Terminal Yard', 
    containerId: 'c-104', 
    containerNumber: 'ATX-2004', 
    assignedToName: 'Carlos Ramirez', 
    type: 'Repair', 
    priority: 'High', 
    status: 'Completed', 
    dueDate: '2026-08-02', 
    estimatedHours: 2.5, 
    checklist: [
      { label: 'Remove cracked perimeter seal', done: true }, 
      { label: 'Apply rust inhibitor coat', done: true }, 
      { label: 'Fit new marine-grade EPDM rubber seal', done: true },
      { label: 'Perform 100% airtight smoke test', done: true }
    ] 
  },
  { 
    id: 'tsk-002', 
    taskNumber: 'TSK-10493', 
    title: 'Pressure Washing & Interior Sanitization - ATX-2008', 
    description: 'Deep clean marine plywood floorboards and remove grease stains following commercial lease turnover.', 
    facilityId: 'fac-001', 
    facilityName: 'Austin Port Terminal Yard', 
    containerId: 'c-108', 
    containerNumber: 'ATX-2008', 
    assignedToName: 'Carlos Ramirez', 
    type: 'Cleaning', 
    priority: 'Medium', 
    status: 'Pending', 
    dueDate: '2026-08-01', 
    estimatedHours: 1.5,
    checklist: [
      { label: 'Degrease interior floorboards', done: false }, 
      { label: 'High pressure wash sidewalls & ceiling', done: false }, 
      { label: 'Apply antimicrobial fogging spray', done: false }
    ]
  },
  { 
    id: 'tsk-003', 
    taskNumber: 'TSK-10494', 
    title: 'Annual Structural Inspection - Row 2 Containers', 
    description: 'Check exterior paint coating, corner castings, twist-lock anchor pockets, and door alignment.', 
    facilityId: 'fac-001', 
    facilityName: 'Austin Port Terminal Yard', 
    assignedToName: 'Jason Miller', 
    type: 'Inspection', 
    priority: 'Low', 
    status: 'Completed', 
    dueDate: '2026-07-28', 
    estimatedHours: 4.0,
    checklist: [
      { label: 'Inspect ISO corner castings', done: true },
      { label: 'Verify floor timber deflection', done: true },
      { label: 'Check exterior paint micrometer thickness', done: true }
    ]
  },
  { 
    id: 'tsk-004', 
    taskNumber: 'TSK-10495', 
    title: 'Reefer Unit #LBH-1002 Condenser & Chiller Coil Audit', 
    description: 'Inspect electrical contactors, 480V 3-phase harness, refrigerant pressures, and defrost sensors.', 
    facilityId: 'fac-002', 
    facilityName: 'Long Beach Harbor Storage', 
    containerId: 'c-202', 
    containerNumber: 'LBH-1002', 
    assignedToName: 'Sarah Jenkins', 
    type: 'Repair', 
    priority: 'High', 
    status: 'Pending', 
    dueDate: '2026-08-03', 
    estimatedHours: 2.0,
    checklist: [
      { label: 'Check 480V 3-phase cable integrity', done: false }, 
      { label: 'Verify R404A pressure gauges', done: false }, 
      { label: 'Clean evaporator and condenser fins', done: false }
    ]
  },
  { 
    id: 'tsk-005', 
    taskNumber: 'TSK-10496', 
    title: 'Rust Remediation & Epoxy Undercoating - HOU-3011', 
    description: 'Grind down superficial surface oxidation on corner posts and apply marine-grade zinc primer.', 
    facilityId: 'fac-003', 
    facilityName: 'Houston Freight Logistics Yard', 
    containerNumber: 'HOU-3011', 
    assignedToName: 'David Chen', 
    type: 'Painting', 
    priority: 'Medium', 
    status: 'Pending', 
    dueDate: '2026-08-04', 
    estimatedHours: 3.5,
    checklist: [
      { label: 'Wire brush oxidation on corner posts', done: false }, 
      { label: 'Apply zinc phosphate primer coat', done: false }, 
      { label: 'Topcoat heavy polyurethane enamel', done: false }
    ]
  }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  { id: 'ai-1', type: 'WARNING', title: 'Occupancy Deficit Alert: Houston Freight Logistics Yard', facilityName: 'Houston Freight Logistics Yard', description: 'Yard fill rate is currently at 44.0% with a net monthly loss of -$1,300.', metric: '44% Fill Rate', impact: 'HIGH', recommendedAction: 'Launch a temporary 15% discount for 40ft units to boost lease rate above 75% threshold.' },
  { id: 'ai-2', type: 'OPPORTUNITY', title: 'Optimal Yield Adjustment: Long Beach Harbor Storage', facilityName: 'Long Beach Harbor Storage', description: 'Yard is operating at 90.0% capacity. Market rate analysis shows strong rate premium elasticity.', metric: '+$85/mo pricing power', impact: 'HIGH', recommendedAction: 'Increase monthly rental rate for new refrigerated container leases by 12%.' },
  { id: 'ai-3', type: 'MAINTENANCE', title: 'Preventative Inspection Cycle Triggered', facilityName: 'Austin Port Terminal Yard', description: '4 containers have exceeded 180 days since last certified structural inspection.', metric: '4 Pending Inspections', impact: 'MEDIUM', recommendedAction: 'Assign Carlos Ramirez to complete field inspection checklist on ATX-2004, ATX-2014, and ATX-2008.' }
];

export const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-002',
    timestamp: '25 mins ago',
    category: 'INSPECTION',
    title: 'Door Gasket Overhaul & Pressure Seal Test Completed',
    description: 'Replaced cracked perimeter rubber weather seals on container ATX-2004 in response to TSK-10492. Applied zinc rust inhibitor and performed smoke pressure test. Zero air leaks detected.',
    caption: 'Full gasket overhaul completed on #ATX-2004 in response to TSK-10492. Stripped dry-rotted rubber, treated hinge welds with anti-corrosion barrier, and seated new heavy-duty marine EPDM seal. Container is sealed airtight and cleared for hazardous/chemical storage use.',
    facilityId: 'fac-001',
    facilityName: 'Austin Port Terminal Yard',
    containerNumber: 'ATX-2004',
    actorName: 'Carlos Ramirez',
    actorRole: 'Field Tech Lead',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    severity: 'success',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000',
    beforePhoto: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
    afterPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    photos: [
      { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000', label: 'After: New Marine EPDM Seal' },
      { url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000', label: 'Before: Cracked Weather Strip' },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000', label: 'Hinge Lubrication & Rust Barrier' }
    ],
    likesCount: 28,
    isLiked: true,
    isSaved: true,
    approvalStatus: 'APPROVED',
    approvedBy: 'Jason Miller (Yard Manager)',
    timeSpentMins: 45,
    costMaterials: '$85.00',
    gpsLocation: 'Bay B-04 (30.2672° N, 97.7431° W)',
    checklistResults: [
      { label: 'Removed cracked perimeter seal', done: true },
      { label: 'Applied rust inhibitor coat', done: true },
      { label: 'Fitted new marine-grade EPDM rubber seal', done: true },
      { label: 'Completed 100% airtight smoke test', done: true }
    ],
    linkedTask: {
      taskNumber: 'TSK-10492',
      taskTitle: 'Container ATX-2004 Seal & Door Gasket Repair',
      assignedTo: 'Carlos Ramirez',
      priority: 'High',
      status: 'Completed',
      reply: {
        authorName: 'Carlos Ramirez',
        authorRole: 'Field Tech Lead',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Replaced both door seals with grade-A marine EPDM and completed 100% airtight pressure test. Inspection photos attached.',
        timestamp: '25m ago'
      }
    },
    comments: [
      {
        id: 'c-1',
        authorName: 'Jason Miller',
        authorRole: 'Yard Facility Manager',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        text: 'Excellent work Carlos! Signed off and updated ATX-2004 status back to Available on the yard map.',
        timestamp: '15m ago',
        likes: 4
      },
      {
        id: 'c-2',
        authorName: 'Eleanor Vance',
        authorRole: 'Chief Executive',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        text: 'Great turnaround under 1 hour. Clear photo documentation helps with compliance audits.',
        timestamp: '10m ago',
        likes: 2
      }
    ],
    actionable: true,
    actionLabel: 'View Task Ticket',
    metadata: { repairTimeMins: 45, costMaterials: '$85.00', sealGrade: 'EPDM Marine' }
  },
  {
    id: 'feed-001',
    timestamp: '1 hour ago',
    category: 'MAINTENANCE',
    title: 'Structural Corner Casting & Weld Integrity Audit Completed',
    description: 'Completed annual structural assessment across Row 2 containers in response to TSK-10494. Verified floor deflection, ISO corner twistlocks, and structural roof integrity.',
    caption: 'Annual certified structural audit completed for Row 2 container bays. Ultrasonic thickness measurement confirms sound steel gauge with zero delamination. Stacking ratings verified up to 8-high standard.',
    facilityId: 'fac-001',
    facilityName: 'Austin Port Terminal Yard',
    containerNumber: 'ATX-2001 to ATX-2008',
    actorName: 'Jason Miller',
    actorRole: 'Yard Facility Manager',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    severity: 'info',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1000',
    photos: [
      { url: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1000', label: 'Row 2 Stacking Alignment Check' },
      { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000', label: 'Corner Casting ISO Anchor Point' }
    ],
    likesCount: 19,
    isLiked: false,
    isSaved: false,
    approvalStatus: 'APPROVED',
    approvedBy: 'Eleanor Vance (Executive)',
    timeSpentMins: 120,
    costMaterials: '$0.00',
    gpsLocation: 'Row 2 East Sector (Austin Terminal)',
    checklistResults: [
      { label: 'Inspect ISO corner castings', done: true },
      { label: 'Verify floor timber deflection', done: true },
      { label: 'Check exterior paint micrometer thickness', done: true }
    ],
    linkedTask: {
      taskNumber: 'TSK-10494',
      taskTitle: 'Annual Structural Inspection - Row 2 Containers',
      assignedTo: 'Jason Miller',
      priority: 'Low',
      status: 'Completed',
      reply: {
        authorName: 'Jason Miller',
        authorRole: 'Yard Manager',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        text: 'All 8 containers in Row 2 certified compliant with ISO 1496-1 cargo container standards.',
        timestamp: '1h ago'
      }
    },
    comments: [
      {
        id: 'c-3',
        authorName: 'Carlos Ramirez',
        authorRole: 'Field Tech Lead',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Copy that Jason. Will inspect Row 3 next Tuesday.',
        timestamp: '40m ago',
        likes: 1
      }
    ],
    actionable: true,
    actionLabel: 'View Audit Certificate',
    metadata: { inspectedUnits: 8, standard: 'ISO 1496-1', nextDue: '2027-07-28' }
  },
  {
    id: 'feed-003',
    timestamp: '3 hours ago',
    category: 'AI_ALERT',
    title: 'Emergency Chiller Defrost Cycle Diagnostic Report',
    description: 'Field inspection and diagnostics performed on Refrigerated Container #LBH-1002 in response to TSK-AI-902 after IoT temperature trigger. Chiller compressor cycled and temperature locked at -18.5°C.',
    caption: 'Field response report for Reefer #LBH-1002. Replaced faulty defrost thermostat probe, cleaned evaporator coils, and verified 480V 3-phase power supply. Cargo temperature restored to optimal -18.5°C.',
    facilityId: 'fac-002',
    facilityName: 'Long Beach Harbor Storage',
    containerNumber: 'LBH-1002',
    actorName: 'Sarah Jenkins',
    actorRole: 'Yard Facility Manager',
    actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    severity: 'danger',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000',
    photos: [
      { url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000', label: 'Reefer Unit Digital Telemetry Display' },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000', label: 'Compressor Circuit & Gauge Reading' }
    ],
    likesCount: 35,
    isLiked: true,
    isSaved: false,
    approvalStatus: 'APPROVED',
    approvedBy: 'Sarah Jenkins (Yard Manager)',
    timeSpentMins: 55,
    costMaterials: '$120.00',
    gpsLocation: 'Reefer Power Bank 1 (Long Beach)',
    checklistResults: [
      { label: 'Check 480V 3-phase cable integrity', done: true },
      { label: 'Verify R404A pressure gauges', done: true },
      { label: 'Clean evaporator and condenser fins', done: true }
    ],
    linkedTask: {
      taskNumber: 'TSK-AI-902',
      taskTitle: 'Refrigeration Chiller Telemetry Anomaly Investigation',
      assignedTo: 'Sarah Jenkins',
      priority: 'Emergency',
      status: 'Completed',
      reply: {
        authorName: 'Sarah Jenkins',
        authorRole: 'Yard Manager',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        text: 'Secondary refrigeration loop activated autonomously. Container temp normalized back to -18.5°C with zero cargo disruption.',
        timestamp: '2h 50m ago'
      }
    },
    comments: [
      {
        id: 'c-4',
        authorName: 'David Chen',
        authorRole: 'Maintenance Specialist',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        text: 'Glad the telemetry triggered in time before cargo threshold was reached.',
        timestamp: '2h ago',
        likes: 3
      }
    ],
    actionable: true,
    actionLabel: 'View Sensor Logs',
    metadata: { targetTempC: -18.5, actualTempC: -18.5, compressorPressureBar: 12.4 }
  }
];
