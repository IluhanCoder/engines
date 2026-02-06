import { useEffect, useRef, useState } from "react";
import buttonStyle, { blueButtonStyle } from "../styles/button-style";
import inputStyle from "../styles/input-style";

interface PromptModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    defaultValue?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    placeholder?: string;
}

const PromptModal = ({ isOpen, title, message, defaultValue = "", onConfirm, onCancel, confirmText = "Підтвердити", cancelText = "Скасувати", placeholder = "" }: PromptModalProps) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, defaultValue]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen, onCancel]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onConfirm(value);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCancel}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-700 mb-4">{message}</p>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className={inputStyle + " w-full mb-6"}
                    />
                    <div className="flex gap-3 justify-end">
                        <button type="button" className={buttonStyle} onClick={onCancel}>
                            {cancelText}
                        </button>
                        <button type="submit" className={blueButtonStyle} disabled={!value.trim()}>
                            {confirmText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromptModal;
