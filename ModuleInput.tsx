import React, { useCallback } from 'react';

interface ModuleInputProps {
    id: string;
    title: string;
    values: string[];
    setValues: (values: string[]) => void;
    onPaste?: (newValues: string[]) => void;
    onClear?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    readOnly?: boolean;
}

const ModuleInput: React.FC<ModuleInputProps> = ({ 
    id, title, values, setValues, onPaste, onClear, onUndo, onRedo, readOnly = false 
}) => {
    
    const handlePaste = useCallback(async (e?: React.MouseEvent) => {
        if (readOnly) return;
        if (e) e.preventDefault();
        try {
            const text = await navigator.clipboard.readText();
            if (!text) return;
            const lines = text.split(/\r?\n/).map(l => l.trim().replace(/\s/g, '')).filter(l => l.length > 0);
            const newValues = Array(7).fill('');
            const linesToPaste = lines.slice(0, 7);
            for (let i = 0; i < 7; i++) {
                if (i < linesToPaste.length) {
                    newValues[i] = i < 6 ? linesToPaste[i].substring(0, 4) : linesToPaste[i].substring(0, 3);
                } else {
                    newValues[i] = values[i] || '';
                }
            }
            if (onPaste) onPaste(newValues); else setValues(newValues);
        } catch (err) { alert("Permita acesso ao clipboard."); }
    }, [values, setValues, onPaste, readOnly]);

    const handleInputChange = (index: number, val: string) => {
        if (readOnly) return;
        const numericVal = val.replace(/\D/g, '');
        const limit = index === 6 ? 3 : 4;
        const newValues = [...values];
        newValues[index] = numericVal.substring(0, limit);
        setValues(newValues);
    };

    return (
        <div className={`p-4 module-card flex flex-col gap-2 ${readOnly ? 'opacity-60 border-slate-800/40 bg-slate-900/20' : 'border-amber-500/10'}`}>
            <div className="flex items-center justify-between mb-1">
                <h2 className={`text-[9px] font-orbitron font-black uppercase tracking-widest ${readOnly ? 'text-slate-700' : 'text-amber-500/50'}`}>
                    {title}
                </h2>
                {!readOnly && (
                    <button onClick={handlePaste} className="p-1.5 bg-amber-500/5 border border-amber-500/20 rounded-lg text-amber-500/60 hover:text-amber-500 active:scale-90 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                    </button>
                )}
            </div>

            <div className="space-y-1">
                {values.map((val, index) => (
                    <div key={index} className={`flex items-center h-7 border rounded-lg overflow-hidden ${readOnly ? 'border-slate-800/20' : 'border-slate-800/60 focus-within:border-amber-500/40'}`}>
                        <span className="text-[6px] font-black w-6 text-center border-r border-slate-800/60 text-slate-700">
                            {index === 6 ? '7º' : index + 1}
                        </span>
                        <input 
                            type="text" 
                            value={val} 
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            readOnly={readOnly}
                            className={`w-full bg-transparent text-center font-orbitron text-[12px] font-bold outline-none tracking-[0.2em] ${readOnly ? 'text-slate-700' : 'text-slate-100'}`} 
                            placeholder="----"
                            inputMode="numeric"
                        />
                    </div>
                ))}
            </div>

            {!readOnly && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/40">
                    <div className="flex gap-4">
                        <button onClick={onUndo} className="text-slate-600 hover:text-amber-500 transition-all active:scale-75">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <button onClick={onRedo} className="text-slate-600 hover:text-amber-500 transition-all active:scale-75">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                    <button onClick={onClear} className="text-slate-600 hover:text-red-500 transition-all active:scale-75">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ModuleInput;