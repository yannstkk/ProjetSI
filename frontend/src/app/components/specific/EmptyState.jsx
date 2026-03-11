import { Card, CardContent } from "../ui/card";

export function EmptyState({
                               icon: Icon,
                               title = "Aucun élément",
                               description = "",
                               action
                           }) {
    return (
        <Card className="border-dashed">
            <CardContent className="p-12">
                <div className="text-center">

                    {Icon && (
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-8 h-8 text-gray-400" />
                        </div>
                    )}

                    <h3 className="font-medium text-gray-900 mb-2">
                        {title}
                    </h3>

                    {description && (
                        <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                            {description}
                        </p>
                    )}

                    {action && (
                        <button
                            onClick={action.onClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {action.label}
                        </button>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}