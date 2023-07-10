import React, { useState, useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/theme/shadowfox.css';
import 'codemirror/theme/duotone-dark.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';


const Editor = ({socketRef, roomID, onCodeChange}) => {

    const editorRef = useRef(null);
    const [mode, setMode] = useState('javascript');
    const [theme, setTheme] = useState('dracula');
    const theCode = useRef("");
    // const input = useRef("");
    // const output = useRef("");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realTimeEditor'),
            {
                mode: {name: 'javascript', json: true},
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });

            editorRef.current.on('change',(instance, changes)=>{
                console.log('changes', changes);
                const {origin} = changes;
                const code = instance.getValue();
                theCode.current = code;
                onCodeChange(code);
                if(origin!=='setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                        roomID,
                        code,
                    });
                }
                console.log(code);
            });

            

        }
        init();
    },[]);

    useEffect(()=>{
        editorRef.current.setOption('mode', mode);
        editorRef.current.setOption('theme', theme);
    },[mode, theme]);


    
    useEffect(()=>{

        if(socketRef.current){
            socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
                if(code!== null){
                    editorRef.current.setValue(code);
                }
            });
        }

        return ()=>{
            socketRef.current.off(ACTIONS.CODE_CHANGE);  
        }
    },[socketRef.current]);

    // 
    async function runCode(){
        const mapping = {
            'python': '5',
            'clike': '7',
            'javascript': '17'
        }
        const url = 'https://code-compiler.p.rapidapi.com/v2';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '81dba7d716msh2f7043926f27ed4p111ab9jsn500685b4ba6e',
                'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com'
            },
            body: new URLSearchParams({
                LanguageChoice: mapping[mode],
                Program: theCode.current,
                Input: input
            })
        };
        
        try {
            const response = await fetch(url, options);
            const result = await response.text();
            console.log(JSON.parse(result));
            console.log(JSON.parse(result).Result);
            setOutput(JSON.parse(result).Result?JSON.parse(result).Result:JSON.parse(result).Errors);
        } catch (error) {
            console.error(error);
        }   
    }
    // 

    return <div className="middleSide">
    <textarea id="realTimeEditor"></textarea>
    <div className="rightSide">
        <select name="mode" id="mode" value={mode} onChange={(e)=>{ setMode(e.target.value)}}>
            <option value="clike">CPP</option>
            <option value="javascript">Java Script</option>
            <option value="python">Python</option>
        </select>
        <select name="theme" id="theme" value={theme} onChange={(e)=>{setTheme(e.target.value)}}>
            <option value="dracula">Dracula</option>
            <option value="lucario">Lucario</option>
            <option value="duotone-dark">Duotone dark</option>
            <option value="shadowfox">Shadow</option>
        </select>
        <div>
            <button className='RunBtn' onClick={runCode}>Run</button>
        </div>
        <p>Input</p>
        <textarea name="input" value={input} onChange={(e)=>{setInput(e.target.value); document.getElementById("input").value = input;}} id="input" className='ipop' cols="30" rows="10"></textarea>
        <p>Output</p>
        <textarea name="output" value={output} id="output"className='ipop' cols="30" rows="10"></textarea>
    </div>
</div>
}


export default Editor