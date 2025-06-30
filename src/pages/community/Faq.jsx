import { useState } from 'react';
import BasicEditor from '../../components/editor/BasicEditor';

const Faq = () =>{
    const [value, setValue] = useState('');

    return (
        <>
            Faq
            <BasicEditor
                value={value}
                onChange={setValue}
                />
        </>
    )
}

export default Faq;