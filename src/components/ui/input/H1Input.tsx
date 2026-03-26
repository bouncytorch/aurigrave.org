import styles from './H1Input.module.css';
export default function H1Input(
    { name, id, placeholder = 'Title', maxLength = 64, required = false }: {
        name: string,
        id: string,
        placeholder?: string,
        maxLength?: number,
        required: boolean
    }
) {
    return <textarea className={styles.h1input} name={name} id={id} placeholder={placeholder} maxLength={maxLength} required={required}/>;
}
