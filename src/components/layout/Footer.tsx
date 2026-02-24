'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const YEAR = new Date().getFullYear();

export default function Footer() {
    return <footer style={{ textAlign: 'center' }}>
        made with ♡ by bouncytorch<br/>
        aurigrave (c) 2023 - {YEAR}<br/>
        <a href="http://github.com/bouncytorch/aurigrave.org">source on <FontAwesomeIcon icon={faGithub} /> github</a>
    </footer>;
}
