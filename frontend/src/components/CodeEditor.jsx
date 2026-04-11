import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    // Initial mount
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Custom theme to match our aesthetic
        monaco.editor.defineTheme('collabTheme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#0d0f12',
                'editor.lineHighlightBackground': '#1f2228',
            }
        });
        monaco.editor.setTheme('collabTheme');

        // Listen for local changes
        editor.onDidChangeModelContent((event) => {
            const { isFlush } = event;
            const code = editor.getValue();
            onCodeChange(code);
            
            // Only emit to server if the change wasn't triggered by a remote sync (isFlush)
            // Or better yet, we can check if it's a typing event vs setValue.
            // When we receive code via socket, we will use a flag to disable emitting back
            if (!event.isFlush && socketRef.current && window.__isLocalChange !== false) {
                socketRef.current.emit('code_change', {
                    roomId,
                    code,
                });
            }
            window.__isLocalChange = true; // reset
        });
    };

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('code_change', ({ code }) => {
                if (code !== null && editorRef.current) {
                    const currentCode = editorRef.current.getValue();
                    if (code !== currentCode) {
                        window.__isLocalChange = false; // Flag to prevent infinite loop
                        // Prevent the editor cursor from jumping
                        const position = editorRef.current.getPosition();
                        editorRef.current.setValue(code);
                        editorRef.current.setPosition(position);
                    }
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off('code_change');
            }
        };
    }, [socketRef.current]);

    return (
        <div className="monaco-wrapper">
            <Editor
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                defaultValue="// Welcome to CollabCode - Start typing here!"
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    wordWrap: 'on',
                    padding: { top: 20 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;
