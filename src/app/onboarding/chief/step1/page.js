'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const PROFESSIONAL_TITLES = [
  'Private Chef',
  'Catering Chef',
  'Hotel Chef',
  'Home Chef',
  'Culinary Specialist',
  'Other',
];

const KITCHEN_TYPES = ['Home Kitchen', 'Commercial Kitchen', 'Restaurant Kitchen', 'Other'];

const SPECIAL_DIETS = [
  'Diabetes Meals',
  'Low Sodium',
  'Renal Meals',
  'Weight Loss Plans',
  'Allergy‑sensitive meals',
];

const HANDLING_PRACTICES = [
  'Refrigeration available',
  'Ingredient labeling',
  'Separate allergy‑safe preparation',
  'Clean water access',
  'Gloves / Hairnets used',
];

const SERVICE_AREAS = [
  'Molyko',
  'Mile 17',
  'Checkpoint',
  'Buea Town',
  'Bokwango',
  'Bonduma',
  'Great Soppo',
  'Other',
];

/* ────────────────────────────────────────────────────────────
   VALIDATION
─────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.fullName?.trim()) errors.fullName = 'Full name is required.';
  if (!data.phone?.trim() || !/^6[0-9]{8}$/.test(data.phone.trim().replace(/\s+/g, '')))
    errors.phone = 'Enter a valid 9‑digit number starting with 6.';
  if (!data.serviceArea) errors.serviceArea = 'Please select your service area.';
  if (!data.experienceYears || isNaN(Number(data.experienceYears)))
    errors.experienceYears = 'Years of experience is required.';
  if (!data.kitchenType) errors.kitchenType = 'Select your kitchen type.';

  return errors;
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function ChefStep1() {
  const router = useRouter();

  // ---------- state ----------
  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('Private Chef');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [otherServiceArea, setOtherServiceArea] = useState('');

  const [experienceYears, setExperienceYears] = useState('');
  const [currentWorkplace, setCurrentWorkplace] = useState('Freelance');
  const [culinarySchool, setCulinarySchool] = useState('');
  const [certifications, setCertifications] = useState('');

  const [foodHygieneTraining, setFoodHygieneTraining] = useState(false);
  const [specialDiets, setSpecialDiets] = useState([]);
  const [kitchenType, setKitchenType] = useState('Home Kitchen');
  const [foodHandlingPractices, setFoodHandlingPractices] = useState([]);

  // file names for UI feedback
  const [nationalIdFile, setNationalIdFile] = useState(null);
  const [foodSafetyFile, setFoodSafetyFile] = useState(null);
  const [culinaryCertFile, setCulinaryCertFile] = useState(null);
  const [kitchenPhotosFile, setKitchenPhotosFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- restore saved data ----------
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cc_onboarding_chef_step1') || '{}');
      if (saved.fullName) setFullName(saved.fullName);
      if (saved.professionalTitle) setProfessionalTitle(saved.professionalTitle);
      if (saved.gender) setGender(saved.gender);
      if (saved.dateOfBirth) setDateOfBirth(saved.dateOfBirth);
      if (saved.phone) setPhone(saved.phone);
      if (saved.whatsapp) setWhatsapp(saved.whatsapp);
      if (saved.email) setEmail(saved.email);
      if (saved.serviceArea) setServiceArea(saved.serviceArea);
      if (saved.otherServiceArea) setOtherServiceArea(saved.otherServiceArea);
      if (saved.experienceYears) setExperienceYears(saved.experienceYears);
      if (saved.currentWorkplace) setCurrentWorkplace(saved.currentWorkplace);
      if (saved.culinarySchool) setCulinarySchool(saved.culinarySchool);
      if (saved.certifications) setCertifications(saved.certifications);
      if (saved.foodHygieneTraining !== undefined) setFoodHygieneTraining(saved.foodHygieneTraining);
      if (saved.specialDiets) setSpecialDiets(saved.specialDiets);
      if (saved.kitchenType) setKitchenType(saved.kitchenType);
      if (saved.foodHandlingPractices) setFoodHandlingPractices(saved.foodHandlingPractices);
      // file names only stored, not the actual files
    } catch (_) {}
  }, []);

  // ---------- helpers ----------
  const toggleMulti = (list, setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  // ---------- submit ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const data = {
      fullName,
      professionalTitle,
      gender,
      dateOfBirth,
      phone,
      whatsapp,
      email,
      serviceArea,
      otherServiceArea: serviceArea === 'Other' ? otherServiceArea : '',
      experienceYears,
      currentWorkplace,
      culinarySchool,
      certifications,
      foodHygieneTraining,
      specialDiets,
      kitchenType,
      foodHandlingPractices,
    };

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = document.querySelector('[data-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    // Save file names for later reference
    const savedData = {
      ...data,
      nationalIdFileName: nationalIdFile?.name || '',
      foodSafetyFileName: foodSafetyFile?.name || '',
      culinaryCertFileName: culinaryCertFile?.name || '',
      kitchenPhotosFileName: kitchenPhotosFile?.name || '',
      portfolioFileName: portfolioFile?.name || '',
      cvFileName: cvFile?.name || '',
    };

    localStorage.setItem('cc_onboarding_chef_step1', JSON.stringify(savedData));
    console.log('Chef step 1 saved:', savedData);

    setTimeout(() => router.push('/onboarding/chief/step2'), 800);
  };

  // ---------- render ----------
  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-primary-600 mb-2">
          <span>Step 1 of 3</span>
          <span>Chef Identity & Trust</span>
        </div>
        <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: '33%' }} />
        </div>
      </div>

      <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">

        <h2 className="text-2xl font-bold text-surface-900 mb-1">Your culinary profile</h2>
        <p className="text-sm text-surface-500 mb-7">
          This information will be verified by the platform admin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* ----- Personal Info ----- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2" data-error={errors.fullName ? true : undefined}>
              <label htmlFor="fullName" className="form-label">Full Name (as on ID)</label>
              <input
                id="fullName"
                type="text"
                required
                className={`input-medical ${errors.fullName ? 'border-red-400' : ''}`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && <p className="form-error">⚠ {errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="professionalTitle" className="form-label">Professional Title</label>
              <select
                id="professionalTitle"
                className="input-medical"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
              >
                {PROFESSIONAL_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                id="gender"
                className="input-medical"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                className="input-medical"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div data-error={errors.phone ? true : undefined}>
              <label htmlFor="phone" className="form-label">Phone (MTN/Orange)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-sm text-surface-500 border-r border-surface-200 pointer-events-none">
                  +237
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  className={`input-medical !pl-15 ${errors.phone ? 'border-red-400' : ''}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="677 123 456"
                />
              </div>
              {errors.phone
                ? <p className="form-error">⚠ {errors.phone}</p>
                : <p className="mt-1 text-xs text-surface-400">For verification calls.</p>}
            </div>

            <div>
              <label htmlFor="whatsapp" className="form-label">WhatsApp Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-sm text-surface-500 border-r border-surface-200 pointer-events-none">
                  +237
                </span>
                <input
                  id="whatsapp"
                  type="tel"
                  className="input-medical !pl-15"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`input-medical ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder="you@example.com"
                  readOnly={!!email}
                />
                {errors.email && <p className="form-error">⚠ {errors.email}</p>}
              </div>  
              {/* <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required

                className="input-medical"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!!email}
              />
            </div>*/}

            <div data-error={errors.serviceArea ? true : undefined}>
              <label htmlFor="serviceArea" className="form-label">Service Area (Buea)</label>
              <select
                id="serviceArea"
                className={`input-medical ${errors.serviceArea ? 'border-red-400' : ''}`}
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
              >
                <option value="" disabled>Select area</option>
                {SERVICE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
              {errors.serviceArea && <p className="form-error">⚠ {errors.serviceArea}</p>}
              {serviceArea === 'Other' && (
                <input
                  type="text"
                  className="input-medical mt-2"
                  placeholder="Specify neighbourhood"
                  value={otherServiceArea}
                  onChange={(e) => setOtherServiceArea(e.target.value)}
                />
              )}
            </div>
          </div>

          <hr className="border-surface-100" />

          {/* ----- Professional Background ----- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div data-error={errors.experienceYears ? true : undefined}>
              <label htmlFor="experienceYears" className="form-label">Years of Experience</label>
              <input
                id="experienceYears"
                type="number"
                required
                min="0"
                className={`input-medical ${errors.experienceYears ? 'border-red-400' : ''}`}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
              {errors.experienceYears && <p className="form-error">⚠ {errors.experienceYears}</p>}
            </div>

            <div>
              <label htmlFor="currentWorkplace" className="form-label">Current Workplace</label>
              <select
                id="currentWorkplace"
                className="input-medical"
                value={currentWorkplace}
                onChange={(e) => setCurrentWorkplace(e.target.value)}
              >
                <option value="Freelance">Freelance</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Hotel">Hotel</option>
                <option value="Catering Company">Catering Company</option>
                <option value="Home‑based">Home‑based</option>
              </select>
            </div>

            <div>
              <label htmlFor="culinarySchool" className="form-label">Culinary School (optional)</label>
              <input
                id="culinarySchool"
                type="text"
                className="input-medical"
                value={culinarySchool}
                onChange={(e) => setCulinarySchool(e.target.value)}
                placeholder="e.g., UB Culinary Institute"
              />
            </div>

            <div>
              <label htmlFor="certifications" className="form-label">Certifications (optional)</label>
              <input
                id="certifications"
                type="text"
                className="input-medical"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="e.g., Food Safety, HACCP"
              />
            </div>
          </div>

          <hr className="border-surface-100" />

          {/* ----- Kitchen & Food Safety ----- */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-surface-700">Kitchen & Food Safety</h3>

            {/* Food Hygiene Training */}
            <div className="flex items-center justify-between">
              <label className="form-label mb-0">Do you have food hygiene training?</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setFoodHygieneTraining(true)} className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${foodHygieneTraining ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'}`}>Yes</button>
                <button type="button" onClick={() => setFoodHygieneTraining(false)} className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${!foodHygieneTraining ? 'border-red-200 bg-red-50 text-red-600' : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'}`}>No</button>
              </div>
            </div>

            {/* Special Diets */}
            <div>
              <label className="form-label">Experience with special diets</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SPECIAL_DIETS.map(diet => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleMulti(specialDiets, setSpecialDiets, diet)}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${specialDiets.includes(diet) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'}`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Handling Practices */}
            <div>
              <label className="form-label">Food Handling Practices</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {HANDLING_PRACTICES.map(practice => (
                  <button
                    key={practice}
                    type="button"
                    onClick={() => toggleMulti(foodHandlingPractices, setFoodHandlingPractices, practice)}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${foodHandlingPractices.includes(practice) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300'}`}
                  >
                    {practice}
                  </button>
                ))}
              </div>
            </div>

            {/* Kitchen Type */}
            <div data-error={errors.kitchenType ? true : undefined}>
              <label htmlFor="kitchenType" className="form-label">Kitchen Type</label>
              <select
                id="kitchenType"
                className={`input-medical ${errors.kitchenType ? 'border-red-400' : ''}`}
                value={kitchenType}
                onChange={(e) => setKitchenType(e.target.value)}
              >
                {KITCHEN_TYPES.map(kt => <option key={kt} value={kt}>{kt}</option>)}
              </select>
              {errors.kitchenType && <p className="form-error">⚠ {errors.kitchenType}</p>}
            </div>
          </div>

          {/* ----- Document Uploads ----- */}
          <div>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Verification Documents</h3>
            <p className="text-xs text-surface-400 mb-4">Upload clear scans or photos. Admin will review these.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'National ID', key: 'nationalId', file: nationalIdFile, setter: setNationalIdFile },
                { label: 'Food Safety Certificate', key: 'foodSafety', file: foodSafetyFile, setter: setFoodSafetyFile },
                { label: 'Culinary Certificate', key: 'culinaryCert', file: culinaryCertFile, setter: setCulinaryCertFile },
                { label: 'Kitchen Photos', key: 'kitchenPhotos', file: kitchenPhotosFile, setter: setKitchenPhotosFile },
                { label: 'Portfolio Photos', key: 'portfolio', file: portfolioFile, setter: setPortfolioFile },
                { label: 'CV / Resume', key: 'cv', file: cvFile, setter: setCvFile },
              ].map(({ label, key, file, setter }) => (
                <div key={key} className="relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, setter)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${file ? 'border-primary-500 bg-primary-50/30' : 'border-surface-200 bg-white hover:border-primary-300'}`}>
                    <span className="text-xs font-medium text-surface-600 block mb-1">{label}</span>
                    {file ? (
                      <span className="text-xs text-primary-600 font-semibold">{file.name}</span>
                    ) : (
                      <span className="text-xs text-surface-400">Click to upload</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 shadow-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              ) : (
                'Next: Cooking Expertise →'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}