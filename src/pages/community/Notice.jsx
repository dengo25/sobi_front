import { useState } from 'react';
import BasicEditor from '../../components/editor/BasicEditor';

const Notice = () =>{
    const [value, setValue] = useState('');
    
    return (
        <>
            Notice
            <BasicEditor
                value={value}
                onChange={setValue}
                />
        </>
    )
}

export default Notice;