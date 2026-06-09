import { getDietitianSlots, getDietitianAvailability } from './availabilityStore';
import { getRatingSummary } from './ratingStore';
import { getUsers } from './userStore';

function textIncludes(value, needle) {
  return String(value || '').toLowerCase().includes(needle);
}

function dietitianProfile(user) {
  const availability = getDietitianAvailability(user.id);
  const rating = getRatingSummary(user.id);
  const specialties = user.specialties || user.specializations || [
    'Diabetes nutrition',
    'Hypertension care',
    'Weight management',
    'General clinical nutrition',
  ];
  const slots = getDietitianSlots(user.id, { daysAhead: 14 }).filter(slot => slot.available);

  return {
    id: user.id,
    fullName: user.fullName || user.email,
    email: user.email,
    phone: user.phone || '',
    title: user.professionalTitle || 'Verified Dietitian',
    specialties,
    bio: user.bio || 'Clinical nutrition support for safe, personalized CareCuisin meal planning.',
    location: user.location || user.serviceArea || 'Buea, Fako',
    languages: user.languages || ['English', 'Pidgin'],
    yearsOfExperience: Number(user.yearsOfExperience || user.experienceYears || 3),
    fee: Number(availability.consultationFee || 2500),
    availability,
    nextSlot: slots[0] || null,
    rating: rating.average || 4.8,
    reviewCount: rating.count || 24,
    completedConsultations: user.completedConsultations || 48,
    verified: user.verification_status === 'approved',
  };
}

export function searchApprovedDietitians(filters = {}) {
  const query = String(filters.query || '').trim().toLowerCase();
  const condition = String(filters.condition || '').trim().toLowerCase();
  const maxFee = Number(filters.maxFee || 0);

  return getUsers()
    .filter(user => user.role === 'dietitian' && user.verification_status === 'approved')
    .map(dietitianProfile)
    .filter(item => {
      const haystack = [
        item.fullName,
        item.title,
        item.bio,
        item.location,
        item.languages.join(' '),
        item.specialties.join(' '),
      ].join(' ').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesCondition = !condition || haystack.includes(condition) || item.specialties.some(specialty => textIncludes(specialty, condition));
      const matchesFee = !maxFee || item.fee <= maxFee;
      return matchesQuery && matchesCondition && matchesFee;
    })
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.fee - b.fee;
    });
}

export function getApprovedDietitianProfile(id) {
  const user = getUsers().find(item => item.id === id && item.role === 'dietitian' && item.verification_status === 'approved');
  return user ? dietitianProfile(user) : null;
}

export function searchApprovedChefs(filters = {}) {
  const query = String(filters.query || '').trim().toLowerCase();
  const category = String(filters.category || '').trim().toLowerCase();

  return getUsers()
    .filter(user => user.role === 'chef' && user.verification_status === 'approved')
    .map(user => {
      const rating = getRatingSummary(user.id);
      const specialties = user.specialties || user.specializations || ['Low sodium meals', 'Diabetic meals', 'Balanced local meals'];
      return {
        id: user.id,
        fullName: user.fullName || user.email,
        kitchen: user.kitchenName || user.businessName || 'Verified CareCuisin kitchen',
        location: user.location || user.serviceArea || 'Buea, Fako',
        specialties,
        rating: rating.average || 4.7,
        reviewCount: rating.count || 18,
        priceEstimate: Number(user.baseRate || 3500),
        availability: user.availability || 'Available',
        verified: true,
        bio: user.bio || 'Verified clinical meal preparation partner.',
      };
    })
    .filter(item => {
      const haystack = [item.fullName, item.kitchen, item.location, item.specialties.join(' ')].join(' ').toLowerCase();
      return (!query || haystack.includes(query)) && (!category || haystack.includes(category));
    })
    .sort((a, b) => b.rating - a.rating);
}
