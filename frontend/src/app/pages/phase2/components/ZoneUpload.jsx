import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export function ZoneUpload({ onFileProcessed }) {
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    function handleFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => onFileProcessed(e.target.result, file.name);
        reader.readAsText(file, "UTF-8");
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    }

    function handleFileChange(e) {
        handleFile(e.target.files[0]);
        e.target.value = "";
    }

    return (
        <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
                dragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".puml,.plantuml,.txt,.iuml"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Importer votre diagramme MFC
            </h3>
            <p className="text-gray-500 text-sm mb-1">
                Glissez-déposez votre fichier PlantUML ici
            </p>
            <p className="text-gray-400 text-xs">
                Formats acceptés : .puml · .plantuml · .iuml · .txt
            </p>
        </div>
    );
}