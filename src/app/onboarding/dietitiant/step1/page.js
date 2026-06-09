'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ────────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const PROFESSIONAL_TITLES = [
  'Registered Dietitian',
  'Clinical Nutritionist',
  'Nutrition Consultant',
  'Other',
];

const QUALIFICATIONS = [
  'BSc Nutrition',
  'MSc Nutrition',
  'Dietetics Certification',
  'PhD',
  'Other',
];

const BUEA_SERVICE_AREAS = [
  'Buea Town',
  'Molyko',
  'Mile 17',
  'Checkpoint',
  'Bonduma',
  'Bokwango',
  'Great Soppo',
  'Other',
];

/* ────────────────────────────────────────────────────────────
   VALIDATION
─────────────────────────────────────────────────────────── */
function validate(data) {
  const errors = {};

  if (!data.fullName?.trim()) errors.fullName = 'Full name is required.';
  if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
  if (!data.gender) errors.gender = 'Please select a gender.';

  const cleanPhone = data.phone?.trim().replace(/\s+/g, '') || '';
  if (!/^6[0-9]{8}$/.test(cleanPhone))
    errors.phone = 'Enter a valid 9‑digit MTN/Orange number starting with 6.';

  if (!data.serviceArea) errors.serviceArea = 'Please select your service area.';

  if (!data.institution?.trim()) errors.institution = 'Institution is required.';

  const gradYear = parseInt(data.graduationYear, 10);
  if (!data.graduationYear || isNaN(gradYear)) {
    errors.graduationYear = 'Graduation year is required.';
  } else {
    const currentYear = new Date().getFullYear();
    if (gradYear < 1950 || gradYear > currentYear)
      errors.graduationYear = `Enter a year between 1950 and ${currentYear}.`;
  }

  if (!data.licenseNumber?.trim()) errors.licenseNumber = 'License/registration number is required.';

  if (!data.yearsOfExperience?.trim())
    errors.yearsOfExperience = 'Years of experience is required.';
  else if (isNaN(parseInt(data.yearsOfExperience, 10)))
    errors.yearsOfExperience = 'Must be a number.';

  // Document uploads are optional, but we could warn if none are provided – leaving them optional for now.

  return errors;
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
─────────────────────────────────────────────────────────── */
export default function DietitianStep1() {
  const router = useRouter();

  // ---------- form state ----------
  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('Registered Dietitian');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [otherServiceArea, setOtherServiceArea] = useState('');
  const [nationalId, setNationalId] = useState('');

  const [qualification, setQualification] = useState('BSc Nutrition');
  const [otherQualification, setOtherQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issuingBody, setIssuingBody] = useState('Ministry of Public Health');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  // file names only (for display feedback)
  const [degreeFile, setDegreeFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Pre‑fill from signup or restored step1 data
  useEffect(() => {
    queueMicrotask(() => {
    try {
      const signup = JSON.parse(localStorage.getItem('cc_signup') || '{}');
      if (signup.fullName) setFullName(signup.fullName);
      if (signup.phone) setPhone(signup.phone);
      if (signup.email) setEmail(signup.email);
    } catch (_) {}

    try {
      const saved = JSON.parse(localStorage.getItem('cc_onboarding_dietitian_step1') || '{}');
      if (saved.fullName) setFullName(saved.fullName);
      if (saved.professionalTitle) setProfessionalTitle(saved.professionalTitle);
      if (saved.gender) setGender(saved.gender);
      if (saved.dateOfBirth) setDateOfBirth(saved.dateOfBirth);
      if (saved.phone) setPhone(saved.phone);
      if (saved.whatsapp) setWhatsapp(saved.whatsapp);
      if (saved.email) setEmail(saved.email);
      if (saved.serviceArea) setServiceArea(saved.serviceArea);
      if (saved.otherServiceArea) setOtherServiceArea(saved.otherServiceArea);
      if (saved.nationalId) setNationalId(saved.nationalId);
      if (saved.qualification) setQualification(saved.qualification);
      if (saved.otherQualification) setOtherQualification(saved.otherQualification);
      if (saved.institution) setInstitution(saved.institution);
      if (saved.graduationYear) setGraduationYear(saved.graduationYear);
      if (saved.licenseNumber) setLicenseNumber(saved.licenseNumber);
      if (saved.issuingBody) setIssuingBody(saved.issuingBody);
      if (saved.yearsOfExperience) setYearsOfExperience(saved.yearsOfExperience);
      if (saved.degreeFileName) setDegreeFile({ name: saved.degreeFileName });
      if (saved.idFileName) setIdFile({ name: saved.idFileName });
      if (saved.licenseFileName) setLicenseFile({ name: saved.licenseFileName });
      if (saved.cvFileName) setCvFile({ name: saved.cvFileName });
    } catch (_) {}
    });
  }, []);

  // ---------- file change handler ----------
  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  // ---------- submit ----------
  async function handleSubmit(e) {
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
      serviceArea: serviceArea === 'Other' ? otherServiceArea : serviceArea,
      otherServiceArea: serviceArea === 'Other' ? otherServiceArea : '',
      nationalId,
      qualification,
      otherQualification: qualification === 'Other' ? otherQualification : '',
      institution,
      graduationYear,
      licenseNumber,
      issuingBody,
      yearsOfExperience,
    };

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = document.querySelector('[data-error]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    // Save file names for later use (actual upload will happen in production)
    const savedData = {
      ...data,
      degreeFileName: degreeFile?.name || '',
      idFileName: idFile?.name || '',
      licenseFileName: licenseFile?.name || '',
      cvFileName: cvFile?.name || '',
    };

    localStorage.setItem('cc_onboarding_dietitian_step1', JSON.stringify(savedData));
    console.log('Dietitian step 1 saved:', savedData);

    setTimeout(() => router.push('/onboarding/dietitiant/step2'), 500);
  }

  // ---------- render ----------
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-primary-600 mb-2">
          <span>Step 1 of 3</span>
          <span>Professional Identity</span>
        </div>
        <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: '33%' }}
          />
        </div>
      </div>

      <div className="bg-white border border-surface-100 rounded-2xl shadow-sm p-7 sm:p-9">

        <h2 className="text-2xl font-bold text-surface-900 mb-1">Your credentials</h2>
        <p className="text-sm text-surface-500 mb-7">
          This information will be reviewed by the platform administrator.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* ----- Basic Identity ----- */}
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

            <div data-error={errors.gender ? true : undefined}>
              <label className="form-label">Gender</label>
              <select
                className={`input-medical ${errors.gender ? 'border-red-400' : ''}`}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="form-error">⚠ {errors.gender}</p>}
            </div>

            <div data-error={errors.dateOfBirth ? true : undefined}>
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                className={`input-medical ${errors.dateOfBirth ? 'border-red-400' : ''}`}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              {errors.dateOfBirth && <p className="form-error">⚠ {errors.dateOfBirth}</p>}
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
                  className={`input-medical pl-16 text-center ${errors.phone ? 'border-red-400' : ''}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="677 123 456"
                />
              </div>
              {errors.phone ? <p className="form-error">⚠ {errors.phone}</p>
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
                  className="input-medical !pl-19"
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
                  readOnly={!!email} // pe‑filled from signup, but still editable
                />
                {errors.email && <p className="form-error">⚠ {errors.email}</p>}
      
              
            </div>

            <div data-error={errors.serviceArea ? true : undefined}>
              <label htmlFor="serviceArea" className="form-label">Service Area (Buea)</label>
              <select
                id="serviceArea"
                required
                className={`input-medical ${errors.serviceArea ? 'border-red-400' : ''}`}
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
              >
                <option value="" disabled>Select area</option>
                {BUEA_SERVICE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
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

            <div>
              <label htmlFor="nationalId" className="form-label">National ID / Passport</label>
              <input
                id="nationalId"
                type="text"
                className="input-medical"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="e.g., 11234567"
              />
            </div>
          </div>

          <hr className="border-surface-100" />

          {/* ----- Academic & Licensing ----- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="qualification" className="form-label">Highest Qualification</label>
              <select
                id="qualification"
                className="input-medical"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
              >
                {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
              {qualification === 'Other' && (
                <input
                  type="text"
                  className="input-medical mt-2"
                  placeholder="Enter qualification"
                  value={otherQualification}
                  onChange={(e) => setOtherQualification(e.target.value)}
                />
              )}
            </div>

            <div data-error={errors.institution ? true : undefined}>
              <label htmlFor="institution" className="form-label">Institution Attended</label>
              <input
                id="institution"
                type="text"
                required
                className={`input-medical ${errors.institution ? 'border-red-400' : ''}`}
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g., University of Buea"
              />
              {errors.institution && <p className="form-error">⚠ {errors.institution}</p>}
            </div>

            <div data-error={errors.graduationYear ? true : undefined}>
              <label htmlFor="graduationYear" className="form-label">Graduation Year</label>
              <input
                id="graduationYear"
                type="number"
                required
                min="1950"
                max={new Date().getFullYear()}
                className={`input-medical ${errors.graduationYear ? 'border-red-400' : ''}`}
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
              />
              {errors.graduationYear && <p className="form-error">⚠ {errors.graduationYear}</p>}
            </div>

            <div data-error={errors.licenseNumber ? true : undefined}>
              <label htmlFor="licenseNumber" className="form-label">License/Registration No.</label>
              <input
                id="licenseNumber"
                type="text"
                required
                className={`input-medical ${errors.licenseNumber ? 'border-red-400' : ''}`}
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g., CNDA-2021-0456"
              />
              {errors.licenseNumber && <p className="form-error">⚠ {errors.licenseNumber}</p>}
            </div>

            <div>
              <label htmlFor="issuingBody" className="form-label">Issuing Body</label>
              <input
                id="issuingBody"
                type="text"
                className="input-medical"
                value={issuingBody}
                onChange={(e) => setIssuingBody(e.target.value)}
              />
            </div>

            <div data-error={errors.yearsOfExperience ? true : undefined}>
              <label htmlFor="yearsOfExperience" className="form-label">Years of Experience</label>
              <input
                id="yearsOfExperience"
                type="number"
                required
                min="0"
                className={`input-medical ${errors.yearsOfExperience ? 'border-red-400' : ''}`}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
              />
              {errors.yearsOfExperience && <p className="form-error">⚠ {errors.yearsOfExperience}</p>}
            </div>
          </div>

          {/* ----- Document Uploads ----- */}
          <div>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Verification Documents</h3>
            <p className="text-xs text-surface-400 mb-4">Upload clear scans or photos. Admin will review these.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Degree Certificate', key: 'degree', file: degreeFile, setter: setDegreeFile },
                { label: 'National ID (Front/Back)', key: 'id', file: idFile, setter: setIdFile },
                { label: 'Professional License', key: 'license', file: licenseFile, setter: setLicenseFile },
                { label: 'CV / Resume', key: 'cv', file: cvFile, setter: setCvFile },
              ].map(({ label, key, file, setter }) => (
                <div key={key} className="relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, setter)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                    file ? 'border-primary-500 bg-primary-50/30' : 'border-surface-200 bg-white hover:border-primary-300'
                  }`}>
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
                'Next: Clinical Expertise →'
              )}
            </button>
            
          </div>

        </form>
      </div>
    </div>
  );
}
