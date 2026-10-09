import { useState } from 'react';
import { saveContactMessage, CONTACT_LIMITS } from '../../services/firebase';

type Status = 'idle' | 'sending' | 'success' | 'error';

const emptyForm = { firstName: '', lastName: '', email: '', message: '' };

const ContactForm = () => {
    const [form, setForm] = useState(emptyForm);
    const [status, setStatus] = useState<Status>('idle');
    // Bot tuzağı: gerçek kullanıcılar bu gizli alanı görmez/doldurmaz
    const [honeypot, setHoneypot] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'sending') return;

        setStatus('sending');
        // Bot doldurduysa kaydetmeden başarılı gibi davran
        const ok = honeypot ? true : await saveContactMessage(form);

        if (ok) {
            setStatus('success');
            setForm(emptyForm);
        } else {
            setStatus('error');
        }
        setTimeout(() => setStatus('idle'), 4000);
    };

    const disabled = status === 'sending';

    return (
        <div className="contact-panel">
            <p className="section-label">İletişime Geç</p>
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Ad"
                        autoComplete="given-name"
                        maxLength={CONTACT_LIMITS.name}
                        required
                        disabled={disabled}
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Soyad"
                        autoComplete="family-name"
                        maxLength={CONTACT_LIMITS.name}
                        required
                        disabled={disabled}
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                </div>
                <input
                    type="email"
                    name="email"
                    placeholder="E-posta"
                    autoComplete="email"
                    maxLength={CONTACT_LIMITS.email}
                    required
                    disabled={disabled}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                    name="message"
                    placeholder="Mesajınız"
                    rows={5}
                    maxLength={CONTACT_LIMITS.message}
                    required
                    disabled={disabled}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                />

                <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />

                {status === 'success' && (
                    <p className="form-status form-status-success">✓ Mesajın iletildi, en kısa sürede dönüş yapacağım.</p>
                )}
                {status === 'error' && (
                    <p className="form-status form-status-error">
                        Mesaj gönderilemedi. talh4kaya@gmail.com adresinden ulaşabilirsin.
                    </p>
                )}

                <button type="submit" className="btn btn-primary" disabled={disabled}>
                    {disabled ? 'Gönderiliyor...' : <>Mesaj Gönder <span className="arrow">↗</span></>}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
