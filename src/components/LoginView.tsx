import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Fingerprint,
  IdCard,
  Lock,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';
import { HOSPITAL_INSTITUTIONS } from '../data/bmwmData';
import { PractitionerProfile } from './CredentialView';

interface LoginViewProps {
  initialProfile: PractitionerProfile;
  onLoginSuccess: (profile: PractitionerProfile) => void;
}

const ROLES = ['Doctor', 'Nurse', 'Servant'] as const;
const USERS_STORAGE_KEY = 'bmw_registered_users_v2';
const BIOMETRIC_STORAGE_KEY = 'bmw_biometric_profile_v2';

interface StoredUserAccount {
  password: string;
  profile: PractitionerProfile;
}

interface StoredBiometricRecord {
  credentialId: string;
  profile: PractitionerProfile;
}

function normalizeMobileKey(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

function loadUsers(): Record<string, StoredUserAccount> {
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredUserAccount>) : {};
  } catch {
    return {};
  }
}

function saveUserAccount(mobileKey: string, account: StoredUserAccount): void {
  try {
    const existing = loadUsers();
    existing[mobileKey] = account;
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Ignore storage quota errors
  }
}

function loadBiometricRecord(): StoredBiometricRecord | null {
  try {
    const raw = window.localStorage.getItem(BIOMETRIC_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredBiometricRecord) : null;
  } catch {
    return null;
  }
}

function saveBiometricRecord(record: StoredBiometricRecord): void {
  try {
    window.localStorage.setItem(BIOMETRIC_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage quota errors
  }
}

export const LoginView: React.FC<LoginViewProps> = ({
  initialProfile,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Sign-In Fields (Only User ID [Mobile Number] + Password / OTP + Biometric)
  const [signInUserId, setSignInUserId] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');
  const [showSignInPassword, setShowSignInPassword] = useState<boolean>(false);
  const [signInUseOtp, setSignInUseOtp] = useState<boolean>(false);

  // New User Registration Fields
  const [role, setRole] = useState<string>(
    ROLES.includes(initialProfile.designation as (typeof ROLES)[number])
      ? initialProfile.designation
      : 'Doctor'
  );
  const [institutionChoice, setInstitutionChoice] = useState<string>(HOSPITAL_INSTITUTIONS[0]);
  const [customInstitution, setCustomInstitution] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  // OTP Verification State (shared for Sign-In OTP or New User without Email ID)
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpCooldown, setOtpCooldown] = useState<number>(0);

  // Biometric State
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false);
  const [savedBiometric, setSavedBiometric] = useState<StoredBiometricRecord | null>(null);
  const [enrollBiometricOnRegister, setEnrollBiometricOnRegister] = useState<boolean>(false);
  const [biometricBusy, setBiometricBusy] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  useEffect(() => {
    setSavedBiometric(loadBiometricRecord());
    if (
      typeof window !== 'undefined' &&
      'PublicKeyCredential' in window &&
      typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    ) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setBiometricSupported(available))
        .catch(() => setBiometricSupported(false));
    } else if (typeof window !== 'undefined' && 'PublicKeyCredential' in window) {
      setBiometricSupported(true);
    }
  }, []);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldown]);

  const validateMobile = (val: string) => val.replace(/\D/g, '').length >= 10;

  const resolvedInstitution =
    institutionChoice === '__other__'
      ? customInstitution.trim()
      : institutionChoice;

  const switchMode = (nextMode: 'signin' | 'register') => {
    setMode(nextMode);
    setErrorMsg(null);
    setInfoMsg(null);
    setGeneratedOtp(null);
    setOtpInput('');
    setOtpCooldown(0);
    if (nextMode === 'register' && signInUserId.trim() && !mobileNumber.trim()) {
      setMobileNumber(signInUserId.trim());
    }
  };

  const handleSendOtp = (targetNumber: string) => {
    setErrorMsg(null);
    setInfoMsg(null);

    if (!validateMobile(targetNumber)) {
      setErrorMsg('Please enter a valid 10+ digit Mobile Number to receive an OTP.');
      return;
    }

    if (mode === 'signin') {
      const mobileKey = normalizeMobileKey(targetNumber);
      const users = loadUsers();
      if (!users[mobileKey]) {
        setErrorMsg(
          'No registered account found for this Mobile Number. Switch to New User to create an account.'
        );
        return;
      }
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpInput('');
    setOtpCooldown(30);
    setInfoMsg(
      `6-digit OTP sent to ${targetNumber.trim()} · Verification Code: ${code}`
    );
  };

  const tryEnrollPlatformBiometric = async (profile: PractitionerProfile): Promise<boolean> => {
    if (!window.PublicKeyCredential || !navigator.credentials?.create) {
      return false;
    }
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    const userIdBytes = new TextEncoder().encode(normalizeMobileKey(profile.whatsappNumber) || profile.employeeId);

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'BMW Biomedical Waste Training',
        },
        user: {
          id: userIdBytes,
          name: normalizeMobileKey(profile.whatsappNumber),
          displayName: profile.fullName,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      },
    })) as PublicKeyCredential | null;

    if (credential) {
      const record: StoredBiometricRecord = {
        credentialId: bufferToBase64Url(credential.rawId),
        profile,
      };
      saveBiometricRecord(record);
      setSavedBiometric(record);
      return true;
    }
    return false;
  };

  const handleBiometricSignIn = async () => {
    setErrorMsg(null);
    setInfoMsg(null);

    if (!window.PublicKeyCredential || !navigator.credentials) {
      setErrorMsg(
        'Biometric authentication is not supported in this browser. Please sign in with User ID and Password.'
      );
      return;
    }

    const existingBio = loadBiometricRecord();
    if (!existingBio) {
      setErrorMsg(
        'No biometric passkey is registered on this device yet. Create an account in "New User" and check "Enable Biometric Login" first.'
      );
      return;
    }

    setBiometricBusy(true);
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const allowId = base64UrlToUint8Array(existingBio.credentialId);
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [
            {
              id: allowId.buffer as ArrayBuffer,
              type: 'public-key',
            },
          ],
          userVerification: 'required',
          timeout: 60000,
        },
      });
      if (assertion) {
        onLoginSuccess(existingBio.profile);
      }
    } catch (err) {
      const errName = err instanceof Error ? err.name : '';
      if (errName === 'SecurityError' || errName === 'NotAllowedError') {
        setErrorMsg(
          'Biometric prompt was cancelled or blocked by embedded frame permissions. Open the app in a standalone tab for Fingerprint / Face ID, or sign in with User ID & Password.'
        );
      } else {
        setErrorMsg(
          'Could not verify biometric on this device. Please sign in using User ID and Password.'
        );
      }
    } finally {
      setBiometricBusy(false);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateMobile(signInUserId)) {
      setErrorMsg('Please enter your registered 10+ digit Mobile Number as User ID.');
      return;
    }

    const mobileKey = normalizeMobileKey(signInUserId);
    const users = loadUsers();
    const account = users[mobileKey];

    if (!account) {
      setErrorMsg(
        'No account found for this Mobile Number. Please create your account under "New User".'
      );
      return;
    }

    if (signInUseOtp) {
      if (!generatedOtp) {
        handleSendOtp(signInUserId);
        return;
      }
      if (otpInput.trim() !== generatedOtp) {
        setErrorMsg('Invalid OTP. Please enter the 6-digit verification code.');
        return;
      }
      onLoginSuccess(account.profile);
      return;
    }

    if (!signInPassword.trim()) {
      setErrorMsg('Please enter your Password.');
      return;
    }

    if (account.password !== signInPassword) {
      setErrorMsg('Incorrect Password for this Mobile Number. Try again or use OTP Sign In.');
      return;
    }

    onLoginSuccess(account.profile);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!resolvedInstitution) {
      setErrorMsg('Please select or enter your Hospital / Institution.');
      return;
    }

    if (!employeeId.trim()) {
      setErrorMsg('Employee ID is mandatory. Please enter your Employee ID.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Please enter your Full Name.');
      return;
    }

    if (!validateMobile(mobileNumber)) {
      setErrorMsg('Please enter a valid 10+ digit Mobile Number (User ID for Sign In).');
      return;
    }

    if (email.trim() && !email.includes('@')) {
      setErrorMsg('Please enter a valid Email ID or leave it blank to verify via OTP.');
      return;
    }

    // If no Email ID is provided, verify via OTP on Mobile Number
    if (!email.trim()) {
      if (!generatedOtp) {
        handleSendOtp(mobileNumber);
        return;
      }
      if (otpInput.trim() !== generatedOtp) {
        setErrorMsg('Please enter the 6-digit OTP sent to your Mobile Number to verify without an Email ID.');
        return;
      }
    }

    if (newPassword.trim().length < 4) {
      setErrorMsg('Please create a Password (minimum 4 characters).');
      return;
    }

    const mobileKey = normalizeMobileKey(mobileNumber);
    const profile: PractitionerProfile = {
      fullName: fullName.trim(),
      designation: role,
      institution: resolvedInstitution,
      employeeId: employeeId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      whatsappNumber: mobileNumber.trim(),
    };

    saveUserAccount(mobileKey, {
      password: newPassword,
      profile,
    });

    if (enrollBiometricOnRegister && biometricSupported) {
      try {
        await tryEnrollPlatformBiometric(profile);
      } catch {
        // Proceed cleanly even if biometric prompt is cancelled
      }
    }

    onLoginSuccess(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-10 bg-[radial-gradient(circle_at_18%_18%,#EAE4FF_0%,#EEF2F9_46%,#E2E5F8_100%)]">
      {/* Centered 3D Elevated Split Portal Frame */}
      <div className="w-full max-w-[1180px] rounded-[28px] overflow-hidden border border-white/90 shadow-[0_32px_70px_-16px_rgba(49,27,114,0.3),0_12px_28px_-8px_rgba(15,23,42,0.14)] grid grid-cols-1 lg:grid-cols-12">
        {/* Left 3D Royal Violet & Indigo Showcase Wing */}
        <div className="lg:col-span-6 relative overflow-hidden bg-[#1E1B4B] text-white flex flex-col justify-between p-7 sm:p-10 lg:p-11">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(139,92,246,0.34),transparent_58%),linear-gradient(140deg,#1E1B4B_0%,#312E81_50%,#4C1D95_100%)]"
          />

          {/* Top 3D Embossed BMW Badge & Attribution */}
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-3.5">
              <div className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#A78BFA] via-[#7C3AED] to-[#4C1D95] border border-white/35 border-b-[4px] border-b-[#2E1065] shadow-[0_12px_24px_-6px_rgba(0,0,0,0.55),inset_0_2px_1px_rgba(255,255,255,0.45)]">
                <span className="font-display text-lg font-extrabold tracking-wider text-white drop-shadow-sm">
                  BMW
                </span>
              </div>
              <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[#EDE9FE]">
                Biomedical Waste Management
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm sm:text-base font-semibold text-[#DDD6FE] tracking-wide">
                Indian Biomedical Waste Management
              </p>
              <p className="text-sm sm:text-base font-medium text-[#E0E7FF]">
                Developed by Dr. Akshaya N Shetti
              </p>
            </div>
          </div>

          {/* Center 3D Beveled Display Frame */}
          <div className="relative z-10 my-7">
            <div className="p-2.5 rounded-2xl bg-gradient-to-b from-white/25 to-white/5 border border-white/30 border-b-[3px] border-b-black/45 shadow-[0_24px_48px_-12px_rgba(15,10,46,0.65),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-300 hover:-translate-y-1">
              <div className="rounded-xl overflow-hidden bg-[#17133B] aspect-[16/9] flex items-center justify-center shadow-inner">
                {!imgFailed ? (
                  <img
                    src="/src/assets/images/bmw_3d_bins_showcase_1795056889206.jpg"
                    alt="3D illustration of five color-coded biomedical waste segregation bins: Yellow, Red, Translucent White, Blue, and Black/Green"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <p className="font-display text-2xl font-extrabold text-[#DDD6FE]">BMW</p>
                    <p className="text-sm font-semibold text-white">
                      Five-Stream Biomedical Waste Segregation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom 3D Embossed Workflow Steps */}
          <div className="relative z-10 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="embossed-tile rounded-xl p-3 space-y-0.5">
                <p className="font-mono text-[10px] font-semibold text-[#C4B5FD]">STEP 01</p>
                <p className="text-xs sm:text-sm font-semibold text-white">Sign In</p>
                <p className="text-[11px] text-[#E0E7FF]">User ID / Bio</p>
              </div>
              <div className="embossed-tile rounded-xl p-3 space-y-0.5">
                <p className="font-mono text-[10px] font-semibold text-[#C4B5FD]">STEP 02</p>
                <p className="text-xs sm:text-sm font-semibold text-white">Training</p>
                <p className="text-[11px] text-[#E0E7FF]">5-Bin Protocols</p>
              </div>
              <div className="embossed-tile rounded-xl p-3 space-y-0.5">
                <p className="font-mono text-[10px] font-semibold text-[#C4B5FD]">STEP 03</p>
                <p className="text-xs sm:text-sm font-semibold text-white">Take Exam</p>
                <p className="text-[11px] text-[#E0E7FF]">Minimum 99%</p>
              </div>
              <div className="embossed-tile rounded-xl p-3 space-y-0.5">
                <p className="font-mono text-[10px] font-semibold text-[#C4B5FD]">STEP 04</p>
                <p className="text-xs sm:text-sm font-semibold text-white">E-Certificate</p>
                <p className="text-[11px] text-[#E0E7FF]">Verified Seal</p>
              </div>
            </div>

            <div className="embossed-tile rounded-xl px-3.5 py-2.5">
              <p className="text-xs text-[#EDE9FE] leading-snug">
                <span className="font-mono font-semibold text-[#C4B5FD]">STEP 03:</span>{' '}
                Take Exam (Minimum 99%) score is mandatory for getting the E-certificate.
              </p>
            </div>
          </div>
        </div>

        {/* Right 3D Embossed Sign-In / New User Wing */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#FFFFFF] via-[#FAF9FF] to-[#F3F2FC] shadow-[inset_0_2px_0_#FFFFFF] p-7 sm:p-10 lg:p-10 flex flex-col justify-center">
          <div className="w-full max-w-[450px] mx-auto space-y-5">
            <div className="space-y-1">
              <p className="font-mono text-xs font-semibold text-[#5B21B6] tracking-wide">
                BMW TRAINING & CERTIFICATION
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {mode === 'signin' ? 'Sign In' : 'New User Registration'}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569]">
                {mode === 'signin'
                  ? 'Enter your registered Mobile Number (User ID) and Password, or use Biometric Sign In.'
                  : 'Register your clinical profile. Your Mobile Number will serve as your User ID for Sign In.'}
              </p>
            </div>

            {/* 3D Embossed Mode Toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#E4E1F5]/80 rounded-xl embossed-well">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-[#4C1D95] border-b-2 border-[#DDD6FE] shadow-[0_4px_10px_rgba(76,29,149,0.12),inset_0_1px_0_#fff]'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white text-[#4C1D95] border-b-2 border-[#DDD6FE] shadow-[0_4px_10px_rgba(76,29,149,0.12),inset_0_1px_0_#fff]'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                New User
              </button>
            </div>

            {mode === 'signin' ? (
              /* SIGN IN PAGE: ONLY User ID (Mobile Number), Password / OTP, and Biometric Sign In */
              <div className="space-y-4">
                <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="signin-userid"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      User ID (Mobile Number) <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="signin-userid"
                        type="tel"
                        required
                        value={signInUserId}
                        onChange={(e) => setSignInUserId(e.target.value)}
                        placeholder="Enter registered mobile number"
                        className="w-full pl-10 pr-3.5 py-2.5 font-mono text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                      />
                    </div>
                  </div>

                  {!signInUseOtp ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="signin-password"
                          className="block text-xs font-semibold text-[#0F172A]"
                        >
                          Password <span className="text-[#DC2626]">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setSignInUseOtp(true);
                            setErrorMsg(null);
                            setInfoMsg(null);
                          }}
                          className="text-[11px] font-semibold text-[#5B21B6] hover:text-[#4C1D95] transition-colors"
                        >
                          Sign in with OTP instead
                        </button>
                      </div>
                      <div className="relative">
                        <Lock
                          className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
                          aria-hidden="true"
                        />
                        <input
                          id="signin-password"
                          type={showSignInPassword ? 'text' : 'password'}
                          required
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword((prev) => !prev)}
                          aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                        >
                          {showSignInPassword ? (
                            <EyeOff className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 p-3 rounded-xl bg-[#F5F3FF]/80 border border-[#DDD6FE]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#4C1D95]">
                          OTP Verification
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSignInUseOtp(false);
                              setGeneratedOtp(null);
                              setOtpInput('');
                              setErrorMsg(null);
                              setInfoMsg(null);
                            }}
                            className="text-[11px] font-semibold text-[#475569] hover:text-[#0F172A]"
                          >
                            Use Password
                          </button>
                          <button
                            type="button"
                            disabled={otpCooldown > 0}
                            onClick={() => handleSendOtp(signInUserId)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap"
                          >
                            {generatedOtp
                              ? otpCooldown > 0
                                ? `Resend (${otpCooldown}s)`
                                : 'Resend OTP'
                              : 'Send OTP'}
                          </button>
                        </div>
                      </div>

                      {generatedOtp && (
                        <div>
                          <label
                            htmlFor="signin-otp"
                            className="block text-[11px] font-semibold text-[#0F172A] mb-1"
                          >
                            Enter 6-Digit OTP <span className="text-[#DC2626]">*</span>
                          </label>
                          <input
                            id="signin-otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-3.5 py-2 font-mono text-sm tracking-widest text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {infoMsg && (
                    <p className="text-xs font-medium text-[#4C1D95] bg-[#F5F3FF] border border-[#C4B5FD] rounded-xl px-3.5 py-2.5">
                      {infoMsg}
                    </p>
                  )}

                  {errorMsg && (
                    <div className="text-xs font-medium text-[#BE123C] bg-[#FFF1F2] border border-[#E11D48]/30 rounded-xl px-3.5 py-2.5 space-y-1.5">
                      <p>{errorMsg}</p>
                      {errorMsg.includes('New User') && (
                        <button
                          type="button"
                          onClick={() => switchMode('register')}
                          className="font-semibold underline text-[#5B21B6] hover:text-[#4C1D95]"
                        >
                          Switch to New User Registration
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white rounded-xl embossed-btn transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6D28D9]"
                  >
                    {signInUseOtp
                      ? generatedOtp
                        ? 'Verify OTP & Sign In'
                        : 'Send OTP & Sign In'
                      : 'Sign In'}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>

                {/* Biometric Sign-In Divider & Button */}
                <div className="space-y-3 pt-1">
                  <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-slate-200" />
                    <span className="bg-[#F6F4FD] px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                      or
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={biometricBusy}
                    onClick={handleBiometricSignIn}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 text-sm font-semibold text-[#4C1D95] bg-white hover:bg-[#F5F3FF] border-[1.5px] border-[#C4B5FD] border-b-[3px] border-b-[#A78BFA] rounded-xl shadow-sm transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6D28D9]"
                  >
                    <Fingerprint className="w-5 h-5 text-[#6D28D9]" aria-hidden="true" />
                    {biometricBusy
                      ? 'Verifying Biometric...'
                      : savedBiometric
                      ? `Biometric Sign In (${savedBiometric.profile.whatsappNumber})`
                      : 'Biometric Sign In (Fingerprint / Face ID)'}
                  </button>
                </div>
              </div>
            ) : (
              /* NEW USER REGISTRATION PAGE */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Role & Empty Employee ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-role"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Select Role <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="reg-role"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-9 py-2.5 text-sm font-semibold text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 cursor-pointer"
                      >
                        {ROLES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-empid"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Employee ID <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative">
                      <IdCard
                        className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-empid"
                        type="text"
                        required
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="Enter Employee ID"
                        className="w-full pl-9 pr-3 py-2.5 font-mono text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                      />
                    </div>
                  </div>
                </div>

                {/* Hospital / Institution Dropdown */}
                <div>
                  <label
                    htmlFor="reg-institution"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Hospital / Institution <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="reg-institution"
                      required
                      value={institutionChoice}
                      onChange={(e) => setInstitutionChoice(e.target.value)}
                      className="w-full appearance-none pl-3.5 pr-9 py-2.5 text-sm font-medium text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 cursor-pointer"
                    >
                      {HOSPITAL_INSTITUTIONS.map((hospital) => (
                        <option key={hospital} value={hospital}>
                          {hospital}
                        </option>
                      ))}
                      <option value="__other__">Other Hospital / Institution</option>
                    </select>
                    <ChevronDown
                      className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                  {institutionChoice === '__other__' && (
                    <input
                      type="text"
                      required
                      value={customInstitution}
                      onChange={(e) => setCustomInstitution(e.target.value)}
                      placeholder="Enter Hospital / Institution Name"
                      className="mt-2 w-full px-3.5 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                    />
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="reg-fullname"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Full Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck
                      className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                    />
                  </div>
                </div>

                {/* Mobile Number (User ID) & Optional Email ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-mobile"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Mobile Number (User ID) <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-mobile"
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2.5 font-mono text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                    >
                      Email ID <span className="text-[#64748B] font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail
                        className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Optional (OTP if none)"
                        className="w-full pl-9 pr-3 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                      />
                    </div>
                  </div>
                </div>

                {/* OTP Verification required if no Email ID is provided */}
                {!email.trim() && (
                  <div className="space-y-2 p-3 rounded-xl bg-[#F5F3FF]/80 border border-[#DDD6FE]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#4C1D95]">
                        No Email ID — Verify Mobile Number via OTP
                      </span>
                      <button
                        type="button"
                        disabled={otpCooldown > 0}
                        onClick={() => handleSendOtp(mobileNumber)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {generatedOtp
                          ? otpCooldown > 0
                            ? `Resend (${otpCooldown}s)`
                            : 'Resend OTP'
                          : 'Send OTP'}
                      </button>
                    </div>
                    {generatedOtp && (
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-3.5 py-2 font-mono text-sm tracking-widest text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                      />
                    )}
                  </div>
                )}

                {/* Create Password (No Generate Password Option) */}
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Password <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-password"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create your password (min 4 chars)"
                      className="w-full pl-9 pr-10 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-xl embossed-well outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {biometricSupported && (
                  <label className="flex items-center gap-2 text-xs text-[#475569] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enrollBiometricOnRegister}
                      onChange={(e) => setEnrollBiometricOnRegister(e.target.checked)}
                      className="rounded border-slate-300 text-[#6D28D9] focus:ring-[#6D28D9]"
                    />
                    <span>Enable Biometric (Fingerprint / Face ID) for Sign In</span>
                  </label>
                )}

                {infoMsg && (
                  <p className="text-xs font-medium text-[#4C1D95] bg-[#F5F3FF] border border-[#C4B5FD] rounded-xl px-3.5 py-2.5">
                    {infoMsg}
                  </p>
                )}

                {errorMsg && (
                  <p className="text-xs font-medium text-[#BE123C] bg-[#FFF1F2] border border-[#E11D48]/30 rounded-xl px-3.5 py-2.5">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white rounded-xl embossed-btn transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6D28D9]"
                >
                  {!email.trim() && !generatedOtp
                    ? 'Send OTP & Create Account'
                    : 'Create Account & Sign In'}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
