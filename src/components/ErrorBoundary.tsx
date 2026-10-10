import { Component, type ReactNode, type ErrorInfo } from 'react';

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
};

type State = {
    hasError: boolean;
};

/**
 * Tüm site beyaz ekrana düşmesin diye en üst seviye error boundary.
 * Beklenmedik bir component crash durumunda kullanıcıya minimal bir
 * "Bir şeyler ters gitti" ekranı gösteriyoruz, app çökmüyor.
 */
class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        // Üretimde sadece console'a düşüyor, kullanıcı görmüyor
        console.error('Site error:', error, info);
    }

    handleReload = () => {
        // Soft reset — full reload
        window.location.assign(window.location.pathname);
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        background: '#000',
                        color: '#f2f2f2',
                        fontFamily: '"DM Sans", sans-serif',
                        textAlign: 'center',
                        gap: '16px',
                    }}
                >
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                        Bir şeyler ters gitti
                    </h1>
                    <p style={{ color: '#aaa', maxWidth: 460 }}>
                        Sayfa yüklenirken beklenmedik bir hata oluştu. Yenilemeyi
                        denersen büyük ihtimalle düzelir.
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        style={{
                            padding: '10px 22px',
                            background: '#f2f2f2',
                            color: '#0c0c0c',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Sayfayı Yenile
                    </button>
                    <a
                        href="mailto:talh4kaya@gmail.com"
                        style={{
                            color: '#aaa',
                            fontSize: '0.85rem',
                            textDecoration: 'underline',
                        }}
                    >
                        Sorun devam ederse bana yaz
                    </a>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
