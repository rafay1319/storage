import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('🌱 Seeding Storage Facility Database...');

  const passwordHash = await bcrypt.hash('AdminPass123!', 10);

  // 1. Create Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'owner@containeryard.com' },
    update: {},
    create: {
      id: 'usr-owner-001',
      name: 'Eleanor Vance',
      email: 'owner@containeryard.com',
      passwordHash,
      role: 'OWNER_ADMIN',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status: 'ACTIVE'
    }
  });

  const manager1 = await prisma.user.upsert({
    where: { email: 'jason.m@containeryard.com' },
    update: {},
    create: {
      id: 'usr-mgr-001',
      name: 'Jason Miller',
      email: 'jason.m@containeryard.com',
      passwordHash,
      role: 'FACILITY_MANAGER',
      phone: '+1 (555) 019-9942',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      status: 'ACTIVE'
    }
  });

  const employee1 = await prisma.user.upsert({
    where: { email: 'carlos.r@containeryard.com' },
    update: {},
    create: {
      id: 'usr-emp-001',
      name: 'Carlos Ramirez',
      email: 'carlos.r@containeryard.com',
      passwordHash,
      role: 'EMPLOYEE',
      phone: '+1 (555) 019-7711',
      avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150',
      status: 'ACTIVE'
    }
  });

  // 2. Facilities
  const yard1 = await prisma.facility.upsert({
    where: { code: 'YARD-TEX-01' },
    update: {},
    create: {
      id: 'fac-001',
      code: 'YARD-TEX-01',
      name: 'Austin Port Terminal Yard',
      address: '10400 Container Way, Industrial District',
      city: 'Austin',
      state: 'Texas',
      country: 'USA',
      gpsLat: 30.2672,
      gpsLng: -97.7431,
      managerId: manager1.id,
      contactNumber: '+1 (512) 555-0144',
      operatingHours: '06:00 AM - 10:00 PM',
      gridRows: 8,
      gridCols: 10,
      photos: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800'
      ],
      notes: 'Main regional hub with 24/7 security patrol and heavy crane lifting services.'
    }
  });

  const yard2 = await prisma.facility.upsert({
    where: { code: 'YARD-CAL-02' },
    update: {},
    create: {
      id: 'fac-002',
      code: 'YARD-CAL-02',
      name: 'Long Beach Harbor Storage',
      address: '850 Harbor Blvd, Gate 4',
      city: 'Long Beach',
      state: 'California',
      country: 'USA',
      gpsLat: 33.7701,
      gpsLng: -118.1937,
      managerId: manager1.id,
      contactNumber: '+1 (310) 555-0188',
      operatingHours: '24/7 Automated Access',
      gridRows: 8,
      gridCols: 10,
      photos: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800'
      ],
      notes: 'High demand refrigerated container depot with climate telemetry.'
    }
  });

  // 3. Customers
  const cust1 = await prisma.customer.upsert({
    where: { email: 'sarah.logistics@apex.com' },
    update: {},
    create: {
      id: 'cust-001',
      name: 'Sarah Connor',
      companyName: 'Apex Global Logistics',
      email: 'sarah.logistics@apex.com',
      phone: '+1 (555) 432-1099',
      address: '450 Commercial Ave, Austin TX',
      outstandingBalance: 0.0,
      notes: 'Enterprise account. Monthly automatic bank wire payment.'
    }
  });

  const cust2 = await prisma.customer.upsert({
    where: { email: 'david@boulderconst.com' },
    update: {},
    create: {
      id: 'cust-002',
      name: 'David Miller',
      companyName: 'Boulder Construction LLC',
      email: 'david@boulderconst.com',
      phone: '+1 (555) 887-3211',
      address: '120 Construction Pkwy, Round Rock TX',
      outstandingBalance: 350.0,
      notes: 'Rents multiple 40ft high-cube storage units for building equipment.'
    }
  });

  console.log('✅ Base seed records created successfully.');
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error('Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
