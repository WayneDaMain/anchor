import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { signup, uploadProfilePhoto } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength++;
    if (password?.length >= 12) strength++;
    if (/[a-z]/?.test(password) && /[A-Z]/?.test(password)) strength++;
    if (/\d/?.test(password)) strength++;
    if (/[^a-zA-Z0-9]/?.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const getPasswordStrengthLabel = (strength) => {
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels?.[strength] || 'Weak';
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ['bg-destructive', 'bg-warning', 'bg-warning', 'bg-success', 'bg-success'];
    return colors?.[strength] || 'bg-destructive';
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (authError) setAuthError('');

    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
      if (formData?.confirmPassword && value !== formData?.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (formData?.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (field === 'confirmPassword') {
      if (value !== formData?.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please select an image file' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Image must be under 5MB' }));
      return;
    }
    setErrors(prev => ({ ...prev, photo: '' }));
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setAuthError('');

    try {
      // Create Firebase account
      const user = await signup(formData.email, formData.password, formData.fullName);

      // Upload profile photo if selected
      if (photoFile) {
        setUploadingPhoto(true);
        await uploadProfilePhoto(photoFile);
        setUploadingPhoto(false);
      }

      navigate('/plan-creation-wizard');
    } catch (err) {
      setUploadingPhoto(false);
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : err.code === 'auth/weak-password'
          ? 'Password is too weak. Please choose a stronger one.'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : 'Failed to create account. Please try again.';
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {authError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <Icon name="AlertCircle" size={16} />
          {authError}
        </div>
      )}

      {/* Profile Photo Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-foreground">
          Profile Photo <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border hover:border-accent transition-gentle flex items-center justify-center overflow-hidden flex-shrink-0 group"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Icon name="Camera" size={22} className="text-muted-foreground group-hover:text-accent transition-gentle" />
            )}
            {photoPreview && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-gentle flex items-center justify-center">
                <Icon name="Pencil" size={16} className="text-white" />
              </div>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground font-medium truncate">
              {photoFile ? photoFile.name : 'Add a profile photo'}
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG or GIF — max 5MB</p>
          </div>
          {photoFile && (
            <button
              type="button"
              onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
              className="text-xs text-destructive hover:underline flex-shrink-0"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        {errors?.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
      </div>

      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={formData?.fullName}
        onChange={(e) => handleInputChange('fullName', e?.target?.value)}
        error={errors?.fullName}
        required
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        value={formData?.email}
        onChange={(e) => handleInputChange('email', e?.target?.value)}
        error={errors?.email}
        description="We'll never share your email with anyone"
        required
      />
      <div className="space-y-2">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            description="Must be at least 8 characters"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-gentle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {formData?.password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="caption text-muted-foreground">Password strength:</span>
              <span className={`caption font-medium ${
                passwordStrength >= 3 ? 'text-success' :
                passwordStrength >= 2 ? 'text-warning': 'text-destructive'
              }`}>
                {getPasswordStrengthLabel(passwordStrength)}
              </span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4]?.map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-gentle ${
                    level <= passwordStrength
                      ? getPasswordStrengthColor(passwordStrength)
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-gentle"
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>
      <div className="space-y-2">
        <Checkbox
          label={
            <span className="text-sm">
              I agree to the{' '}
              <a href="/terms" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </span>
          }
          checked={formData?.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
          error={errors?.agreeToTerms}
          required
        />
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
        className="mt-6"
      >
        {isSubmitting
          ? (uploadingPhoto ? 'Uploading photo...' : 'Creating Account...')
          : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
