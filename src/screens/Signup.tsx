/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { signup } from '../api/auth-api';
import { AuthContext } from '../contexts/AuthContext';
import React from 'react';
import LOGO_PNG from '../../assets/static_assets/LOGO_PNG_PREVIEW.png';

export default function SignupScreen({ navigation }: any) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');

  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loading, setLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
    } else if (!value.includes('@')) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const validateMobile = (value: string) => {
    if (!value.trim()) {
      setMobileError('Mobile number is required');
    } else if (!/^\d{10}$/.test(value)) {
      setMobileError('Mobile number must be 10 digits');
    } else {
      setMobileError('');
    }
  };

  const validateFirstName = (value: string) => {
    if (!value.trim()) {
      setFirstNameError('First name is required');
    } else {
      setFirstNameError('');
    }
  };


  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
    } else if (value.length < 5) {
      setPasswordError('Password must be at least 5 characters');
    } else {
      setPasswordError('');
    }
  };

  const validateAddress = (value: string) => {
    if (!value.trim()) {
      setAddressError('Address is required');
    } else {
      setAddressError('');
    }
  };

  const handleSignup = async () => {
    validateEmail(email);
    validateFirstName(firstName);
    validatePassword(password);
    validateMobile(mobile);

    if (emailError || firstNameError || passwordError || mobileError || addressError) {
      return;
    }

    try {
      setLoading(true);
      setSignupError('');
      const res = await signup({ email, firstName, password, mobile, address });
      login(res.data.access_token);
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 409) {
          setSignupError('Email already registered. Please use a different email.');
        } else if (err.response.status >= 500) {
          setSignupError('Server error. Please try again later.');
        } else if (err.response.data && err.response.data.message) {
          setSignupError(err.response.data.message);
        } else {
          setSignupError('Signup failed. Please check your connection and try again.');
        }
      } else if (err.request) {
        // Request was made but no response received
        setSignupError('Network error. Please check your connection.');
      } else {
        // Something else happened
        setSignupError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={LOGO_PNG}
        style={styles.logo}
        fadeDuration={0}
        resizeMethod="resize"
      />

      <Text style={styles.title}>Create Your Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          validateEmail(value);
        }}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        placeholder="Name"
        value={firstName}
        onChangeText={(value) => {
          setFirstName(value);
          validateFirstName(value);
        }}
        style={styles.input}
      />
      {firstNameError ? (
        <Text style={styles.errorText}>{firstNameError}</Text>
      ) : null}

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(value) => {
          setPassword(value);
          validatePassword(value);
        }}
        style={styles.input}
      />

      <TextInput
        placeholder="Mobile"
        value={mobile}
        onChangeText={(value) => {
          setMobile(value);
          validateMobile(value);
        }}
        style={styles.input}
        keyboardType="phone-pad"
      />
      {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}

      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={(value) => {
          setAddress(value);
          validateAddress(value);
        }}
        style={styles.input}
      />
      {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {signupError ? (
        <Text style={styles.signupError}>{signupError}</Text>
      ) : null}

      <View style={styles.consentRow}>
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: consentChecked }}
          onPress={() => setConsentChecked((v) => !v)}
          style={[styles.checkbox, consentChecked && styles.checkboxChecked]}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {consentChecked ? <Text style={styles.checkmark}>✓</Text> : null}
        </TouchableOpacity>
        <Text style={styles.consentText}>I agree to the </Text>
        <Pressable onPress={() => navigation.navigate('TermsWebView')} hitSlop={6}>
          <Text style={styles.consentLink}>Terms & Conditions</Text>
        </Pressable>
        <Text style={styles.consentText}> and </Text>
        <Pressable onPress={() => navigation.navigate('PrivacyWebView')} hitSlop={6}>
          <Text style={styles.consentLink}>Privacy Policy</Text>
        </Pressable>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (loading || !consentChecked) && styles.buttonDisabled,
        ]}
        onPress={handleSignup}
        disabled={loading || !consentChecked}
      >
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafe',
  },
  logo: {
    width: 200,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  signupError: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: '#1e90ff',
    backgroundColor: '#e6f2ff',
  },
  checkmark: {
    color: '#1e90ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  consentText: {
    color: '#444',
    fontSize: 13,
  },
  consentLink: {
    color: '#1e90ff',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: '#1e90ff',
    textAlign: 'center',
  },
});