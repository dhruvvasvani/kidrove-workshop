import React, { useState } from 'react';
import { z } from 'zod';
import { Workshop, EnquiryResponse } from '../types';
import { Loader2, ArrowRight, Lock, CheckCircle, Check, X, User, Mail, PhoneCall, Type, Hash } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://kidrove-workshop.onrender.com');

// Reusable Field Component keeping exact original styling
function Field({ id, label, type, name, icon, placeholder, value, error, onChange, disabled }: {
  id: string; label: string; type: string; name: string;
  icon: React.ReactNode; placeholder: string; value: string;
  error?: string; onChange: React.ChangeEventHandler<HTMLInputElement>; disabled: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1.5">{label} *</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">{icon}</span>
        <input
          id={id} type={type} name={name} value={value}
          onChange={onChange} disabled={disabled} placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition bg-gray-50 focus:bg-white ${error ? 'border-red-400 error' : 'border-gray-200 focus:border-violet-400'}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="h-3 w-3" />{error}</p>}
    </div>
  );
}

const getIconForType = (type: string, name: string) => {
  if (type === 'email') return <Mail className="h-4 w-4" />;
  if (name.toLowerCase().includes('phone')) return <PhoneCall className="h-4 w-4" />;
  if (type === 'number') return <Hash className="h-4 w-4" />;
  if (name.toLowerCase().includes('name')) return <User className="h-4 w-4" />;
  return <Type className="h-4 w-4" />;
};

export default function DynamicForm({ workshop }: { workshop: Workshop }) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  // Dynamically generate Zod schema from workshop.schemaFields
  const buildZodSchema = () => {
    const shape: Record<string, z.ZodTypeAny> = {};
    workshop.schemaFields.forEach(field => {
      let fieldSchema: z.ZodTypeAny = z.string();
      
      if (field.type === 'email') {
        fieldSchema = z.string().email(`Invalid email format for ${field.label}`);
      } else if (field.type === 'number') {
        // We parse string to number for validation
        fieldSchema = z.string().refine((val) => !isNaN(Number(val)), {
          message: `${field.label} must be a valid number`,
        });
      }

      if (field.required) {
        if (field.type === 'string') {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
        }
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(''));
      }

      shape[field.name] = fieldSchema;
    });
    return z.object(shape);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrMsg('');
    setErrors({});

    const schema = buildZodSchema();
    const parseResult = schema.safeParse(formData);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    
    // If we are in demo mode (using the fallback workshop), just mock a successful response
    const wId = workshop.id || workshop._id;
    if (wId === 'demo-1') {
      setTimeout(() => {
        setStatus('success');
        setFormData({});
        setSubmitting(false);
      }, 1500);
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopId: wId,
          formData: parseResult.data
        }),
      });
      
      const result: EnquiryResponse = await res.json();
      
      if (res.ok && result.success) {
        setStatus('success');
        setFormData({});
      } else {
        setStatus('error');
        if (result.errors) setErrors(result.errors);
        else setErrMsg(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrMsg('Unable to reach the server. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8 space-y-4 animate-scale-in">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto animate-confetti">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h4 className="text-2xl font-black text-gray-900">You're Registered!</h4>
        <p className="text-gray-500 text-sm leading-relaxed">
          Our team will contact you within <strong>24 hours</strong> to confirm your seat and share login details.
        </p>
        <div className="bg-violet-50 rounded-2xl p-4 text-sm text-violet-700 font-medium space-y-1 text-left">
          {['Seat confirmed', 'Confirmation email on the way', 'WhatsApp group invite soon'].map(item => (
            <div key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-500" />{item}</div>
          ))}
        </div>
        <button onClick={() => setStatus('idle')}
          className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-semibold transition text-sm border border-gray-200">
          Register Another Student
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {workshop.schemaFields.map(field => (
        <Field
          key={field.name}
          id={`${workshop.id || workshop._id}-${field.name}`}
          label={field.label}
          type={field.type === 'number' ? 'text' : field.type === 'email' ? 'email' : 'text'}
          name={field.name}
          icon={getIconForType(field.type, field.name)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          value={formData[field.name] || ''}
          error={errors[field.name]}
          onChange={handleChange}
          disabled={submitting}
        />
      ))}

      {errMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
          <X className="h-4 w-4 flex-shrink-0 mt-0.5" />{errMsg}
        </div>
      )}

      <button type="submit" disabled={submitting}
        className="w-full shimmer-btn disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-extrabold text-base transition-all mt-1 flex items-center justify-center gap-2 shadow-glow-violet hover:scale-[1.02] active:scale-98">
        {submitting
          ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
          : <>Secure My Seat — ₹{workshop.price} <ArrowRight className="h-4 w-4" /></>
        }
      </button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 mt-1">
        <Lock className="h-3 w-3" /> 100% secure · Never shared · Refund available
      </p>
    </form>
  );
}
