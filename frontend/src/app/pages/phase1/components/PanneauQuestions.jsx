import { Sparkles, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export function PanneauQuestions({ questions, loading, error, notesTexte, onGenerer, onReset }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Questions suggérées
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <button
                    onClick={onGenerer}
                    disabled={loading || !notesTexte}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors text-sm"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            Génération...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Générer avec l'IA
                        </>
                    )}
                </button>

                {!notesTexte && (
                    <p className="text-xs text-gray-500 text-center">
                        Importez des notes dans la préparation pour activer la génération
                    </p>
                )}

                {error && (
                    <p className="text-xs text-red-600">{error}</p>
                )}

                {questions.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-700">
                                {questions.length} questions générées
                            </p>
                            <button
                                onClick={onReset}
                                className="text-xs text-gray-400 hover:text-gray-600"
                            >
                                <RotateCcw className="w-3 h-3" />
                            </button>
                        </div>

                        {questions.map((q, index) => (
                            <div
                                key={index}
                                className="p-2 bg-purple-50 rounded border border-purple-200"
                            >
                                <p className="text-xs text-gray-400 mb-1">Q{index + 1}</p>
                                <p className="text-sm text-gray-700">{q.question}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}