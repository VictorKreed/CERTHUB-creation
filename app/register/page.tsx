"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building2, Mail, Wallet } from "lucide-react"
import Link from "next/link"

export default function RegisterInstitution() {
  const [formData, setFormData] = useState({
    institutionName: "",
    institutionType: "",
    industryOrSector: "",
    legalOrOperatingAddress: "",
    emailAddress: "",
    websiteUrlOrDomainName: "",
    walletAddress1: "",
    walletAddress2: "",
    walletAddress3: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement contract interaction here
      console.log("Registering institution with data:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Institution registered successfully!")
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const institutionTypes = [
    "University",
    "College",
    "Training Center",
    "Certification Body",
    "Professional Association",
    "Corporate Training",
    "Government Agency",
    "Non-Profit Organization",
    "Other",
  ]

  const industries = [
    "Education",
    "Technology",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "Construction",
    "Hospitality",
    "Retail",
    "Transportation",
    "Energy",
    "Agriculture",
    "Legal Services",
    "Consulting",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-blue-100 to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Register Institution</h1>
          <p className="text-slate-600 mt-2">
            Join the CERTHUB network to issue verifiable certificates on the blockchain
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Institution Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-[#1f3aaa]" />
                Institution Information
              </CardTitle>
              <CardDescription>Basic information about your institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange("institutionName", e.target.value)}
                    placeholder="Enter institution name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institutionType">Institution Type *</Label>
                  <Select
                    value={formData.institutionType}
                    onValueChange={(value) => handleInputChange("institutionType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industryOrSector">Industry or Sector *</Label>
                <Select
                  value={formData.industryOrSector}
                  onValueChange={(value) => handleInputChange("industryOrSector", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry or sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#1f3aaa]" />
                Contact Information
              </CardTitle>
              <CardDescription>How to reach your institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="legalOrOperatingAddress">Legal or Operating Address *</Label>
                <Textarea
                  id="legalOrOperatingAddress"
                  value={formData.legalOrOperatingAddress}
                  onChange={(e) => handleInputChange("legalOrOperatingAddress", e.target.value)}
                  placeholder="Enter complete address including city, state, and country"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                    placeholder="contact@institution.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrlOrDomainName">Website URL or Domain Name *</Label>
                  <Input
                    id="websiteUrlOrDomainName"
                    type="url"
                    value={formData.websiteUrlOrDomainName}
                    onChange={(e) => handleInputChange("websiteUrlOrDomainName", e.target.value)}
                    placeholder="https://www.institution.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-[#1f3aaa]" />
                Wallet Addresses
              </CardTitle>
              <CardDescription>Ethereum wallet addresses for your institution (at least one required)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="walletAddress1">Primary Wallet Address *</Label>
                <Input
                  id="walletAddress1"
                  value={formData.walletAddress1}
                  onChange={(e) => handleInputChange("walletAddress1", e.target.value)}
                  placeholder="0x..."
                  pattern="^0x[a-fA-F0-9]{40}$"
                  title="Please enter a valid Ethereum address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="walletAddress2">Secondary Wallet Address (Optional)</Label>
                <Input
                  id="walletAddress2"
                  value={formData.walletAddress2}
                  onChange={(e) => handleInputChange("walletAddress2", e.target.value)}
                  placeholder="0x..."
                  pattern="^0x[a-fA-F0-9]{40}$"
                  title="Please enter a valid Ethereum address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="walletAddress3">Tertiary Wallet Address (Optional)</Label>
                <Input
                  id="walletAddress3"
                  value={formData.walletAddress3}
                  onChange={(e) => handleInputChange("walletAddress3", e.target.value)}
                  placeholder="0x..."
                  pattern="^0x[a-fA-F0-9]{40}$"
                  title="Please enter a valid Ethereum address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white min-w-[120px]"
            >
              {isSubmitting ? "Registering..." : "Register Institution"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
