'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value
    setFormData((prev) => ({ ...prev, [name]: fieldValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Run form validation first
    if (!validateForm()) return

    setIsLoading(true)
    const supabase = createClient()

    // 2. Destructure email and password from formData
    const { email, password } = formData

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    setIsLoading(false)

    if (error) {
      alert(`Login failed: ${error.message}`)
    } else {
      alert('Logged in successfully!')
      // Optional: Redirect the business user to their dashboard here
      // router.push('/dashboard')
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto pt-16 px-4 sm:pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Aura-AI
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500 bg-gray-50'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500 bg-gray-50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-2 border-gray-200 cursor-pointer accent-blue-600"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <Link href="#" className="text-blue-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Don&apos;t have an account?</span>
            </div>
          </div>

          {/* Signup Link */}
          <Link
            href="/signup"
            className="block w-full text-center px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-sm mt-6">
          By signing in, you agree to our{' '}
          <Link href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  )
}
