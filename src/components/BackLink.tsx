import { Link } from 'react-router-dom';

type BackLinkProps = {
    to?: string;
    label?: string;
};

/* Alt sayfalarda ekranın sol ortasında sabit duran geri oku */
const BackLink = ({ to = '/', label = 'Ana sayfaya dön' }: BackLinkProps) => (
    <Link to={to} className="page-back" aria-label={label} title={label}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </Link>
);

export default BackLink;
