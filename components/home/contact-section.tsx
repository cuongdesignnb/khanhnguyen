'use client';

import { useState, useId } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { siteConfig as staticSiteConfig } from '@/data/home';
import { PublicSiteConfig } from '@/types/public';

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

interface ContactSectionProps {
  siteConfig?: PublicSiteConfig
}

const INPUT_CLASSES =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-[color:var(--muted)] focus:border-[color:var(--gold)] focus:outline-none transition';

const INPUT_ERROR_CLASSES = 'border-[color:var(--danger)]';

function getGoogleMapUrl(value?: string) {
  const configuredValue = value?.trim();
  if (!configuredValue) return '';

  const iframeSource = configuredValue.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1];
  const source = (iframeSource || configuredValue).replace(/&amp;/g, '&');

  try {
    const url = new URL(source);
    const isGoogleMapsHost =
      /(^|\.)google\.[a-z.]+$/i.test(url.hostname) ||
      url.hostname === 'maps.app.goo.gl' ||
      url.hostname === 'goo.gl';

    return ['http:', 'https:'].includes(url.protocol) && isGoogleMapsHost ? url.toString() : '';
  } catch {
    return '';
  }
}

function getGoogleMapSource(value?: string) {
  const source = getGoogleMapUrl(value);
  if (!source) return '';

  const url = new URL(source);
  return /\/maps\/embed(?:\/|$)/i.test(url.pathname) || url.searchParams.get('output') === 'embed'
    ? source
    : '';
}

export function ContactSection({ siteConfig }: ContactSectionProps) {
  const formId = useId();
  const config: PublicSiteConfig = siteConfig || staticSiteConfig
  const googleMapSource =
    getGoogleMapSource(config.googleMapEmbed) || getGoogleMapSource(config.googleMapUrl)
  const googleMapLink = getGoogleMapUrl(config.googleMapUrl) || getGoogleMapUrl(config.googleMapEmbed)
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setSubmitError(null);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            message: formData.message,
            need: 'Tư vấn từ trang chủ',
          }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setSubmitted(true);
        } else {
          setSubmitError(result.error || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
        }
      } catch (err) {
        console.error('Submit contact error:', err);
        setSubmitError('Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối.');
      } finally {
        setLoading(false);
      }
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
                value={config.secondaryHotline ? `${config.hotline} – ${config.secondaryHotline}` : config.hotline}
                isHighlighted
              />
              <ContactInfoItem
                icon={<Mail size={18} />}
                label="EMAIL"
                value={config.email}
              />
              <ContactInfoItem
                icon={<MapPin size={18} />}
                label="SHOWROOM CHÍNH"
                value={config.showroom}
              />
              {config.branch && (
                <ContactInfoItem
                  icon={<MapPin size={18} />}
                  label="CHI NHÁNH"
                  value={config.branch}
                />
              )}
              <ContactInfoItem
                icon={<Clock size={18} />}
                label="THỜI GIAN LÀM VIỆC"
                value={config.workingHours}
              />
            </div>

            {googleMapSource ? (
              <div className="mt-6 h-48 overflow-hidden rounded-xl border border-white/10 bg-[color:var(--surface-2)] lg:h-56">
                <iframe
                  src={googleMapSource}
                  title={`Google Map - ${config.name}`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : googleMapLink ? (
              <div className="mt-6 flex h-48 flex-col items-center justify-center rounded-xl border border-white/10 bg-[color:var(--surface-2)] lg:h-56">
                <MapPin size={32} className="text-[color:var(--gold)]" />
                <p className="mt-2 text-sm font-semibold tracking-wide text-[color:var(--muted)]">
                  VỊ TRÍ TRÊN GOOGLE MAPS
                </p>
                <a
                  href={googleMapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-xs font-semibold text-[color:var(--gold)] hover:underline"
                >
                  Mở Google Maps
                </a>
              </div>
            ) : (
              <div className="mt-6 flex h-48 flex-col items-center justify-center rounded-xl border border-white/10 bg-[color:var(--surface-2)] lg:h-56">
                <MapPin size={32} className="text-[color:var(--gold)]" />
                <p className="mt-2 text-sm font-semibold tracking-wide text-[color:var(--muted)]">
                  KHANH NGUYEN FORKLIFT
                </p>
              </div>
            )}
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
                  Cảm ơn! Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 space-y-4"
              >
                {submitError && (
                  <div className="rounded-lg bg-[color:var(--danger)]/10 border border-[color:var(--danger)]/30 p-4 text-sm text-[color:var(--danger)] font-medium">
                    {submitError}
                  </div>
                )}

                {/* Name + Phone (2-col) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Họ và tên*"
                      disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
                  className="w-full bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

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
