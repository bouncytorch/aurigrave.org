import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function BackButton() {
    return <Link href='.'>
        <button><FontAwesomeIcon icon={faArrowLeft} /></button>
    </Link>;
}
