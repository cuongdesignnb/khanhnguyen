'use client';

import { useState, useId } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import clsx from 'clsx';
import { siteConfig } from '@/data/home';

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  message?: string;
}

const INPUT_CLASSES =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-[color:var(--muted)] focus:border-[color:var(--gold)] focus:outline-none transition';

const INPUT_ERROR_CLASSES = 'border-[color:var(--danger)]';

export function ContactSection() {
  const formId = useId();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung yêu cầu';
    }
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }
  }

  const nameErrorId = `${formId}-name-error`;
  const phoneErrorId = `${formId}-phone-error`;
  const messageErrorId = `${formId}-message-error`;

  return (
    <section
      id="lien-he"
      className="py-14 lg:py-20 bg-[color:var(--surface)]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ─── Left Column: Contact Info + Map ─── */}
          <div>
            <h2 className="font-extrabold uppercase text-xl text-white">
              LIÊN HỆ VỚI CHÚNG TÔI
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-[color:var(--gold)]" />

            <div className="mt-8 space-y-5">
              <ContactInfoItem
                icon={<Phone size={18} />}
                label="HOTLINE"
                value={`${siteConfig.hotline} – ${siteConfig.secondaryHotline}`}
                isHighlighted
              />
              <ContactInfoItem
                icon={<Mail size={18} />}
                label="EMAIL"
                value={siteConfig.email}
              />
              <ContactInfoItem
                icon={<MapPin size={18} />}
                label="SHOWROOM CHÍNH"
                value={siteConfig.showroom}
              />
              <ContactInfoItem
                icon={<MapPin size={18} />}
                label="CHI NHÁNH HÀ NỘI"
                value={siteConfig.branch}
              />
              <ContactInfoItem
                icon={<Clock size={18} />}
                label="THỜI GIAN LÀM VIỆC"
                value={siteConfig.workingHours}
              />
            </div>

            {/* Map placeholder */}
            <div className="bg-[color:var(--surface-2)] rounded-xl h-48 lg:h-56 mt-6 flex flex-col items-center justify-center border border-white/10">
              <MapPin size={32} className="text-[color:var(--gold)]" />
              <p className="text-sm text-[color:var(--muted)] mt-2 font-semibold tracking-wide">
                KHANH NGUYEN
              </p>
            </div>
          </div>

          {/* ─── Right Column: Form ─── */}
          <div>
            <h2 className="font-extrabold uppercase text-xl text-white">
              GỬI YÊU CẦU TƯ VẤN
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-[color:var(--gold)]" />

            {submitted ? (
              <div className="mt-8 rounded-lg bg-[color:var(--success)]/10 border border-[color:var(--success)]/30 p-6 text-center">
                <p className="text-[color:var(--success)] font-semibold">
                  Cảm ơn! Chúng tôi sẽ liên hệ sớm nhất.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 space-y-4"
              >
                {/* Name + Phone (2-col) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Họ và tên*"
                      value={formData.name}
                      onChange={handleChange}
                      aria-describedby={errors.name ? nameErrorId : undefined}
                      aria-invalid={!!errors.name}
                      className={clsx(INPUT_CLASSES, errors.name && INPUT_ERROR_CLASSES)}
                    />
                    {errors.name && (
                      <p id={nameErrorId} className="text-xs text-[color:var(--danger)] mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại*"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-describedby={errors.phone ? phoneErrorId : undefined}
                      aria-invalid={!!errors.phone}
                      className={clsx(INPUT_CLASSES, errors.phone && INPUT_ERROR_CLASSES)}
                    />
                    {errors.phone && (
                      <p id={phoneErrorId} className="text-xs text-[color:var(--danger)] mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={INPUT_CLASSES}
                  />
                </div>

                {/* Message textarea */}
                <div>
                  <textarea
                    name="message"
                    placeholder="Nội dung yêu cầu*"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    aria-describedby={errors.message ? messageErrorId : undefined}
                    aria-invalid={!!errors.message}
                    className={clsx(INPUT_CLASSES, 'resize-none', errors.message && INPUT_ERROR_CLASSES)}
                  />
                  {errors.message && (
                    <p id={messageErrorId} className="text-xs text-[color:var(--danger)] mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                >
                  <Send size={16} />
                  GỬI YÊU CẦU
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Info Item ─────────────────────────────────────────────────────── */

interface ContactInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isHighlighted?: boolean;
}

function ContactInfoItem({ icon, label, value, isHighlighted }: ContactInfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[color:var(--gold)] mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="uppercase text-xs text-[color:var(--muted)] font-semibold tracking-wider">
          {label}
        </p>
        <p
          className={clsx(
            'text-sm mt-0.5',
            isHighlighted
              ? 'text-[color:var(--gold)] font-bold'
              : 'text-white'
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
