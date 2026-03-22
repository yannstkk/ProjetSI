import { Upload, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function FileUpload({
                               title = "Télécharger un fichier",
                               description = "Glissez-déposez vos fichiers ici",
                               acceptedFormats = "",
                               multiple = false,
                               files = [],
                               onFilesChange,
                           }) {
    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">{title}</h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">{description}</p>
                    <p className="text-xs text-gray-500 mt-1">ou cliquez pour parcourir</p>

                    {acceptedFormats && (
                        <p className="text-xs text-gray-500 mt-2">
                            Formats supportés : {acceptedFormats}
                        </p>
                    )}
                </div>

                {files && files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                        <Upload className="w-4 h-4 text-blue-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                    onClick={() => {
                                        const newFiles = files.filter((_, i) => i !== index);
                                        onFilesChange?.(newFiles);
                                    }}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}