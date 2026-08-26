export type Role = 'OWNER_ADMIN' | 'FACILITY_MANAGER' | 'EMPLOYEE' | 'CUSTOMER';

export type ContainerSize = '20ft' | '40ft' | '45ft' | 'Custom';
export type ContainerType = 'Storage' | 'Climate Controlled' | 'Hazardous' | 'Open Top' | 'Refrigerated';
export type ContainerStatus = 'Available' | 'Occupied' | 'Reserved' | 'Maintenance' | 'Cleaning' | 'Out of Service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  facilityId?: string;
}

export interface Facility {
  id: string;
  code: string;
  name: string;
  address: string;
  gpsLat: number;
  gpsLng: number;
  city: string;
  state: string;
  country: string;
  managerName: string;
  contactNumber: string;
  operatingHours: string;
  totalContainers: number;
  occupiedContainers: number;
  occupancyRate: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  photos: string[];
  notes?: string;
  gridRows: number;
  gridCols: number;
}

export interface Container {
  id: string;
  containerNumber: string;
  facilityId: string;
  facilityName: string;
  size: ContainerSize;
  type: ContainerType;
  status: ContainerStatus;
  rentalPrice: number;
  purchaseCost: number;
  currentValue: number;
  insuranceValue: number;
  posX: number;
  posY: number;
  qrCode: string;
  barcode: string;
  lastInspectedAt?: string;
  nextInspectionAt?: string;
  currentCustomerName?: string;
  currentCustomerCompany?: string;
  photos: string[];
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  govId: string;
  address: string;
  emergencyContact: string;
  outstandingBalance: number;
  activeRentalsCount: number;
  notes?: string;
}

export interface RentalAgreement {
  id: string;
  rentalNumber: string;
  customerId: string;
  customerName: string;
  containerId: string;
  containerNumber: string;
  facilityId: string;
  facilityName: string;
  startDate: string;
  endDate?: string;
  billingCycle: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  rentRate: number;
  depositAmount: number;
  lateFeeRate: number;
  autoRenew: boolean;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'TERMINATED';
  digitalSignatureUrl?: string;
}

export interface Task {
  id: string;
  taskNumber: string;
  title: string;
  description?: string;
  facilityId: string;
  facilityName: string;
  containerId?: string;
  containerNumber?: string;
  assignedToName: string;
  type: 'Inspection' | 'Cleaning' | 'Painting' | 'Repair' | 'Move Container' | 'Customer Visit';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Pending' | 'In Progress' | 'Review' | 'Completed';
  dueDate: string;
  estimatedHours: number;
  checklist?: { label: string; done: boolean }[];
}

export interface TaskReport {
  id: string;
  taskId: string;
  taskTitle: string;
  submittedByName: string;
  notes: string;
  completionTimeMinutes: number;
  beforePhotos: string[];
  duringPhotos: string[];
  afterPhotos: string[];
  gpsLat?: number;
  gpsLng?: number;
  digitalSignatureUrl?: string;
  extraCosts: number;
  submittedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'WARNING' | 'OPPORTUNITY' | 'MAINTENANCE' | 'FORECAST';
  title: string;
  facilityId?: string;
  facilityName?: string;
  description: string;
  metric: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
}

export type FeedCategory = 'GATE_MOVE' | 'RENTAL_PAYMENT' | 'INSPECTION' | 'AI_ALERT' | 'MAINTENANCE' | 'GENERAL';
export type FeedSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface FeedComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface LinkedTaskInfo {
  taskNumber: string;
  taskTitle: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Pending' | 'In Progress' | 'Completed';
  reply: {
    authorName: string;
    authorRole: string;
    authorAvatar?: string;
    text: string;
    timestamp: string;
  };
}

export interface FeedItem {
  id: string;
  timestamp: string;
  category: FeedCategory;
  title: string;
  description: string;
  caption?: string;
  facilityId?: string;
  facilityName?: string;
  containerNumber?: string;
  customerName?: string;
  actorName: string;
  actorRole: string;
  actorAvatar?: string;
  severity: FeedSeverity;
  image?: string;
  likesCount: number;
  isLiked: boolean;
  comments: FeedComment[];
  isSaved?: boolean;
  linkedTask?: LinkedTaskInfo;
  actionable?: boolean;
  actionLabel?: string;
  metadata?: Record<string, string | number | boolean>;
}
