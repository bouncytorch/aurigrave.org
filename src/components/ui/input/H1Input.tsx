import styles from './H1Input.module.css';
export default function H1Input(
    { name, id, placeholder = 'Title', maxLength = 64, required = false, value, onChange }: {
        name: string,
        id: string,
        placeholder?: string,
        maxLength?: number,
        required?: boolean,
        defaultValue?: string,
        value?: string,
        onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    }
) {
    return <textarea
        onChange={onChange}
        className={styles.h1input}
        name={name}
        id={id}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        required={required}
    />;
}
