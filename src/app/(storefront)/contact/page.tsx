"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "General Inquiry",
    orderNumber: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
          Concierge Services
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950">
          Connect with Our Atelier
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 font-light">
          Whether you need bespoke design dimensions, sample swatches, or order tracking assistance, our team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-8 bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-medium text-zinc-950">
              Atelier Directory
            </h3>

            <div className="space-y-4 text-xs text-zinc-600">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900">Email Concierge</p>
                  <p className="text-zinc-500">concierge@auraliving.com</p>
                  <p className="text-[11px] text-zinc-400">Response within 4 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900">Telephone Consultation</p>
                  <p className="text-zinc-500">+1 (800) 492-AURA</p>
                  <p className="text-[11px] text-zinc-400">Mon–Fri: 9:00 AM – 6:00 PM PST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900">Design Studio &amp; Showroom</p>
                  <p className="text-zinc-500">742 Evergreen Studio, 4th Floor</p>
                  <p className="text-zinc-500">San Francisco, CA 94107</p>
                  <p className="text-[11px] text-zinc-400">Private viewings by appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="p-12 text-center bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-2xl font-light text-zinc-950">
                Message Received with Care
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto">
                Thank you for contacting AURA. A dedicated client advisor will review your inquiry and reply within 4 business hours.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="rounded-full text-xs"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sophia@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Subject / Department
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    <option>General Inquiry</option>
                    <option>Order Status &amp; Tracking</option>
                    <option>Design Consultation &amp; Swatches</option>
                    <option>Trade &amp; Hospitality Program</option>
                    <option>Press &amp; Editorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AURA-2026-1001"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  How can we assist you?
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share details regarding your space, questions on finishes, or custom dimensions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider gap-2 shadow"
              >
                Send Message to Concierge <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
