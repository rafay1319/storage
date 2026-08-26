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
  { id: 'c-101', containerNumber: 'ATX-2001', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Occupied', rentalPrice: 450, purchaseCost: 4800, currentValue: 4200, insuranceValue: 6000, posX: 0, posY: 0, qrCode: 'QR-ATX-2001', barcode: 'BC-ATX-2001', currentCustomerName: 'Sarah Connor', currentCustomerCompany: 'Apex Global Logistics', lastInspectedAt: '2026-07-15', photos: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500'] },
  { id: 'c-102', containerNumber: 'ATX-2002', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '40ft', type: 'Climate Controlled', status: 'Occupied', rentalPrice: 750, purchaseCost: 8200, currentValue: 7500, insuranceValue: 10000, posX: 1, posY: 0, qrCode: 'QR-ATX-2002', barcode: 'BC-ATX-2002', currentCustomerName: 'David Miller', currentCustomerCompany: 'Boulder Construction LLC', lastInspectedAt: '2026-07-20', photos: [] },
  { id: 'c-103', containerNumber: 'ATX-2003', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Available', rentalPrice: 450, purchaseCost: 4800, currentValue: 4400, insuranceValue: 6000, posX: 2, posY: 0, qrCode: 'QR-ATX-2003', barcode: 'BC-ATX-2003', lastInspectedAt: '2026-07-28', photos: [] },
  { id: 'c-104', containerNumber: 'ATX-2004', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '40ft', type: 'Hazardous', status: 'Maintenance', rentalPrice: 850, purchaseCost: 9500, currentValue: 8100, insuranceValue: 12000, posX: 3, posY: 0, qrCode: 'QR-ATX-2004', barcode: 'BC-ATX-2004', lastInspectedAt: '2026-07-10', notes: 'Door gasket seal replacement in progress.', photos: [] },
  { id: 'c-105', containerNumber: 'ATX-2005', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Occupied', rentalPrice: 450, purchaseCost: 4800, currentValue: 4300, insuranceValue: 6000, posX: 4, posY: 0, qrCode: 'QR-ATX-2005', barcode: 'BC-ATX-2005', currentCustomerName: 'Marcus Vance', currentCustomerCompany: 'Vance Tech Sol', lastInspectedAt: '2026-06-30', photos: [] },
  { id: 'c-106', containerNumber: 'ATX-2006', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '45ft', type: 'Refrigerated', status: 'Reserved', rentalPrice: 950, purchaseCost: 11000, currentValue: 9800, insuranceValue: 14000, posX: 5, posY: 0, qrCode: 'QR-ATX-2006', barcode: 'BC-ATX-2006', lastInspectedAt: '2026-07-25', photos: [] },
  { id: 'c-107', containerNumber: 'ATX-2007', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Occupied', rentalPrice: 450, purchaseCost: 4800, currentValue: 4400, insuranceValue: 6000, posX: 6, posY: 0, qrCode: 'QR-ATX-2007', barcode: 'BC-ATX-2007', currentCustomerName: 'Elena Rostova', currentCustomerCompany: 'Gulf Coast Importers', photos: [] },
  { id: 'c-108', containerNumber: 'ATX-2008', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', size: '20ft', type: 'Storage', status: 'Cleaning', rentalPrice: 450, purchaseCost: 4800, currentValue: 4300, insuranceValue: 6000, posX: 7, posY: 0, qrCode: 'QR-ATX-2008', barcode: 'BC-ATX-2008', lastInspectedAt: '2026-07-29', notes: 'Scheduled for pressure washing after lease turnover.', photos: [] }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-001', name: 'Sarah Connor', companyName: 'Apex Global Logistics', email: 'sarah.logistics@apex.com', phone: '+1 (555) 432-1099', govId: 'TX-ID-99214A', address: '450 Commercial Ave, Austin TX', emergencyContact: '+1 (555) 991-0022', outstandingBalance: 0, activeRentalsCount: 4, notes: 'VIP Client. Priority dispatch & forklift service.' },
  { id: 'cust-002', name: 'David Miller', companyName: 'Boulder Construction LLC', email: 'david@boulderconst.com', phone: '+1 (555) 887-3211', govId: 'TX-ID-44102B', address: '120 Construction Pkwy, Round Rock TX', emergencyContact: '+1 (555) 334-1188', outstandingBalance: 350, activeRentalsCount: 3, notes: 'Requires early morning yard gate access permissions.' },
  { id: 'cust-003', name: 'Patricia Bell', companyName: 'Bell Event Planning', email: 'patricia@bellevents.com', phone: '+1 (555) 201-9988', govId: 'TX-ID-77219C', address: '880 Music Lane, Austin TX', emergencyContact: '+1 (555) 441-0055', outstandingBalance: 0, activeRentalsCount: 2 },
  { id: 'cust-004', name: 'Marcus Vance', companyName: 'Vance Tech Solutions', email: 'marcus@vancetech.io', phone: '+1 (555) 772-1100', govId: 'TX-ID-88310D', address: '300 Tech Ridge Pkwy, Austin TX', emergencyContact: '+1 (555) 882-9911', outstandingBalance: 0, activeRentalsCount: 2 }
];

export const INITIAL_TASKS: Task[] = [
  { id: 'tsk-001', taskNumber: 'TSK-10492', title: 'Container ATX-2004 Seal & Door Gasket Repair', description: 'Replace rubber weather seal strip around main swinging doors.', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', containerId: 'c-104', containerNumber: 'ATX-2004', assignedToName: 'Carlos Ramirez', type: 'Repair', priority: 'High', status: 'In Progress', dueDate: '2026-08-02', estimatedHours: 2.5, checklist: [{ label: 'Remove cracked seal', done: true }, { label: 'Apply rust inhibitor coat', done: true }, { label: 'Fit new rubber seal', done: false }] },
  { id: 'tsk-002', taskNumber: 'TSK-10493', title: 'Pressure Washing & Disinfection - ATX-2008', description: 'Deep clean interior floorboards following lease return.', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', containerId: 'c-108', containerNumber: 'ATX-2008', assignedToName: 'Carlos Ramirez', type: 'Cleaning', priority: 'Medium', status: 'Pending', dueDate: '2026-08-01', estimatedHours: 1.5 },
  { id: 'tsk-003', taskNumber: 'TSK-10494', title: 'Annual Structural Inspection - Row 2 Containers', description: 'Check exterior paint coating, corner castings, and floor timber condition.', facilityId: 'fac-001', facilityName: 'Austin Port Terminal Yard', assignedToName: 'Jason Miller', type: 'Inspection', priority: 'Low', status: 'Completed', dueDate: '2026-07-28', estimatedHours: 4.0 }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  { id: 'ai-1', type: 'WARNING', title: 'Occupancy Deficit Alert: Houston Freight Logistics Yard', facilityName: 'Houston Freight Logistics Yard', description: 'Yard fill rate is currently at 44.0% with a net monthly loss of -$1,300.', metric: '44% Fill Rate', impact: 'HIGH', recommendedAction: 'Launch a temporary 15% discount for 40ft units to boost lease rate above 75% threshold.' },
  { id: 'ai-2', type: 'OPPORTUNITY', title: 'Optimal Yield Adjustment: Long Beach Harbor Storage', facilityName: 'Long Beach Harbor Storage', description: 'Yard is operating at 90.0% capacity. Market rate analysis shows strong rate premium elasticity.', metric: '+$85/mo pricing power', impact: 'HIGH', recommendedAction: 'Increase monthly rental rate for new refrigerated container leases by 12%.' },
  { id: 'ai-3', type: 'MAINTENANCE', title: 'Preventative Inspection Cycle Triggered', facilityName: 'Austin Port Terminal Yard', description: '4 containers have exceeded 180 days since last certified structural inspection.', metric: '4 Pending Inspections', impact: 'MEDIUM', recommendedAction: 'Assign Carlos Ramirez to complete field inspection checklist on ATX-2004, ATX-2014, and ATX-2008.' }
];

export const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-001',
    timestamp: '15 mins ago',
    category: 'GATE_MOVE',
    title: 'Automated RFID Gate Entry Check-In',
    description: 'Flatbed haulage tractor unit checked in 40ft High-Cube container #ATX-2024 at Gate 2. Positioned at Stacking Bay 2.',
    caption: 'Fresh container unit checked in at Gate 2! Securely stacked into Bay 2 and ready for Apex Global Logistics cargo loading. 🚛📦 #AustinPort #ContainerLogistics #GateOperations #YardLife',
    facilityId: 'fac-001',
    facilityName: 'Austin Port Terminal Yard',
    containerNumber: 'ATX-2024',
    customerName: 'Apex Global Logistics',
    actorName: 'Jason Miller',
    actorRole: 'Yard Facility Manager',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    severity: 'info',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000',
    likesCount: 24,
    isLiked: false,
    isSaved: false,
    linkedTask: {
      taskNumber: 'TSK-10488',
      taskTitle: 'Gate 2 Inbound Haulage Check-In & Slot Assignment',
      assignedTo: 'Jason Miller',
      priority: 'Medium',
      status: 'Completed',
      reply: {
        authorName: 'Jason Miller',
        authorRole: 'Yard Manager',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        text: 'Unit #ATX-2024 checked in from flatbed tractor, weighed at 18,400 kg, and safely stacked into Bay 2. Manifest cleared.',
        timestamp: '12m ago'
      }
    },
    comments: [
      {
        id: 'c-1',
        authorName: 'Sarah Connor',
        authorRole: 'Apex Global Logistics',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        text: 'Driver confirmed safe delivery. Thanks for the quick gate turnaround! 🚛📦',
        timestamp: '10m ago',
        likes: 3
      },
      {
        id: 'c-2',
        authorName: 'Carlos Ramirez',
        authorRole: 'Field Tech',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Inspected exterior seal. Everything is in pristine shape.',
        timestamp: '5m ago',
        likes: 1
      }
    ],
    actionable: true,
    actionLabel: 'View Gate Ticket',
    metadata: { gateNumber: 'Gate 2', driverName: 'Marcus Vance', grossWeightKg: 18400 }
  },
  {
    id: 'feed-002',
    timestamp: '45 mins ago',
    category: 'INSPECTION',
    title: 'Completed Heavy Seal Repair on Container ATX-2004',
    description: 'Replaced cracked perimeter rubber weather seals and applied marine-grade anti-rust inhibitor. Passed pressure test at 100%.',
    caption: 'Full gasket overhaul completed on #ATX-2004. Replaced cracked rubber with heavy-duty marine EPDM and applied weather seal coating. Ready for immediate deployment! 🔧✨ #FieldTech #YardMaintenance #QualityControl',
    facilityId: 'fac-001',
    facilityName: 'Austin Port Terminal Yard',
    containerNumber: 'ATX-2004',
    actorName: 'Carlos Ramirez',
    actorRole: 'Field Service Tech',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    severity: 'success',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1000',
    likesCount: 42,
    isLiked: true,
    isSaved: true,
    linkedTask: {
      taskNumber: 'TSK-10492',
      taskTitle: 'Container ATX-2004 Weather Seal & Gasket Replacement',
      assignedTo: 'Carlos Ramirez',
      priority: 'High',
      status: 'Completed',
      reply: {
        authorName: 'Carlos Ramirez',
        authorRole: 'Field Tech Lead',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Replaced both door seals with grade-A marine EPDM and completed 100% airtight pressure test. Inspection photos uploaded below.',
        timestamp: '40m ago'
      }
    },
    comments: [
      {
        id: 'c-3',
        authorName: 'Eleanor Vance',
        authorRole: 'Chief Executive',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        text: 'Great work getting this turned around under 2 hours Carlos! 👏',
        timestamp: '30m ago',
        likes: 6
      }
    ],
    actionable: true,
    actionLabel: 'View Field Report',
    metadata: { repairTimeMins: 45, costMaterials: '$85.00', sealGrade: 'EPDM Marine' }
  },
  {
    id: 'feed-003',
    timestamp: '2 hours ago',
    category: 'AI_ALERT',
    title: 'Reefer Unit Temperature Anomaly Detected & Resolved',
    description: 'AI IoT Telemetry flagged temperature variation (+3.8°C above target) for Refrigerated Container #LBH-1002. Backup chiller auto-engaged.',
    caption: 'Reefer #LBH-1002 temperature anomaly intercepted and corrected by automated telemetry AI. Sensor logs confirm full cargo integrity. ❄️🤖 #SmartYard #IoTCargo #ColdChainSecurity #AutomatedStorage',
    facilityId: 'fac-002',
    facilityName: 'Long Beach Harbor Storage',
    containerNumber: 'LBH-1002',
    actorName: 'CY AI Engine',
    actorRole: 'Automated System Sentinel',
    actorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    severity: 'danger',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000',
    likesCount: 18,
    isLiked: false,
    isSaved: false,
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
        timestamp: '1h 50m ago'
      }
    },
    comments: [
      {
        id: 'c-4',
        authorName: 'Sarah Jenkins',
        authorRole: 'Yard Manager',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        text: 'Temperature normalized back to -18.5°C within 12 minutes. Zero cargo loss.',
        timestamp: '1h ago',
        likes: 4
      }
    ],
    actionable: true,
    actionLabel: 'View Sensor Telemetry',
    metadata: { targetTempC: -18, actualTempC: -14.2, compressorPressureBar: 12.4 }
  },
  {
    id: 'feed-004',
    timestamp: '4 hours ago',
    category: 'RENTAL_PAYMENT',
    title: 'New Commercial Lease Signed - 40ft Climate Unit',
    description: 'Boulder Construction LLC executed a 12-month commercial lease for High-Cube container #ATX-2002. First month rent + deposit cleared via ACH.',
    caption: 'Welcoming Boulder Construction LLC to Austin Port Terminal! 12-month lease executed for #ATX-2002 climate storage unit. 🏢📝💰 #NewTenant #CommercialStorage #LeaseSigned #YardGrowth',
    facilityId: 'fac-001',
    facilityName: 'Austin Port Terminal Yard',
    containerNumber: 'ATX-2002',
    customerName: 'Boulder Construction LLC',
    actorName: 'David Miller',
    actorRole: 'Managing Director',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    severity: 'success',
    likesCount: 31,
    isLiked: false,
    isSaved: false,
    linkedTask: {
      taskNumber: 'TSK-10480',
      taskTitle: 'Unit ATX-2002 Customer Handover & Keycard Activation',
      assignedTo: 'Jason Miller',
      priority: 'Medium',
      status: 'Completed',
      reply: {
        authorName: 'David Miller',
        authorRole: 'Boulder Construction LLC',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        text: 'Agreement signed and access keycards received for our equipment crew. Smooth onboarding process!',
        timestamp: '3h 45m ago'
      }
    },
    comments: [],
    actionable: true,
    actionLabel: 'View Lease PDF',
    metadata: { monthlyRent: 750, deposit: 750, term: '12 Months' }
  }
];
