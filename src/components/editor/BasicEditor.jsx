import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BasicEditor = ({value, onChange, theme="snow", customModels={}, customFormats=[]}) => {
    const defaultModules = {
        toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
        ],
    };

    const defaultFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];
    
    return (
        <>
            <div data-gramm="false">
                <ReactQuill 
                    value={value} 
                    onChange={onChange} 
                    theme={theme}
                    modules={defaultModules}
                    formats={defaultFormats}
                    />
            </div>        
        </>
    )
}

export default BasicEditor;