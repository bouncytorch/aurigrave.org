'use client';

import Modal from '@/components/layout/Modal';
import { faRedditAlien, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faAt, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function BlogShareButton({ id }: { id: string }) {
    const [ showModal, setShowModal ] = useState(false);
    const [ copy, setCopy ] = useState<React.ReactNode>('copy');

    // TODO: Fix the hardcoded url here
    const url = `https://aurigrave.org/blog/${id}`;
    return <section>
        { showModal && <Modal onCloseAction={() => setShowModal(false)}>
            <div style={{
                display: 'flex',
                gap: '5px',
                zoom: 1.5,
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexWrap: 'wrap'
            }}>
                link:
                <button
                    onClick={() => {
                        if (navigator?.clipboard?.writeText) {
                            navigator.clipboard.writeText(url);
                        } else {
                            // Legacy fallback — works on older iOS/Android WebViews
                            const textarea = document.createElement('textarea');
                            textarea.value = url;
                            textarea.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
                            document.body.appendChild(textarea);
                            textarea.focus();
                            textarea.select();
                            textarea.setSelectionRange(0, url.length);
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                        }
                        setCopy(<FontAwesomeIcon icon={faCheck} />);
                        setTimeout(() => setCopy('copy'), 2000);
                    }}
                >
                    {copy}
                </button>

                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`mailto:?subject=&body=Check%20out%20this%20link:%20https%3A%2F%2Faurigrave.org%2Fblog%2F${id}`}
                >
                    <button><FontAwesomeIcon icon={faAt}/></button>
                </a>

                <a
                    href={`https://www.reddit.com/submit?url=https%3A%2F%2Faurigrave.org%2Fblog%${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button><FontAwesomeIcon icon={faRedditAlien} /></button>
                </a>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://twitter.com/intent/tweet?url=https%3A%2F%2Faurigrave.org%2Fblog%2F${id}`}
                >
                    <button><FontAwesomeIcon icon={faTwitter}/></button>
                </a>

                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://api.whatsapp.com/send?text=%20https%3A%2F%2Faurigrave.org%2Fblog%2F${id}`}
                >
                    <button><FontAwesomeIcon icon={faWhatsapp}/></button>
                </a>
            </div>
            embed:
            <pre>
                {
                    '<iframe\n' +
                    `   src="${url + '/embed'}"\n` +
                    '   width="100%"\n'+
                    '   style="\n' +
                    '       aspect-ratio: 12/7;\n' +
                    '       height: auto;\n' +
                    '       max-width: 1200px;\n' +
                    '       overflow:hidden;\n' +
                    '   "\n' +
                    '   frameborder="0">\n' +
                    '</iframe>'
                }
            </pre>
        </Modal> }
        <button onClick={() => setShowModal(true)}>share</button>
    </section>;
}
