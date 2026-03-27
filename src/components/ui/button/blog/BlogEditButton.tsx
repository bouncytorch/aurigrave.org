import { requireAdmin } from '@/lib/auth';
import style from './BlogEditButton.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default async function BlogEditButton({ id }: { id?: string }) {
    try { await requireAdmin(); }
    catch { return; }
    return <Link className={style.blog_admin_button} href={id ? `${id}/edit`: 'blog/edit'}>
        <button><FontAwesomeIcon icon={faEdit} /></button>
    </Link>;
}
