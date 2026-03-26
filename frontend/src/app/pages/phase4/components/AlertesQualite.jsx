import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export function AlertesQualite({ alertes }) {
    if (alertes.length === 0) return null;

    return (
        <Card style={{ borderLeft: "4px solid #EF9F27", borderRadius: 0 }}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Alertes qualité ({alertes.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {alertes.slice(0, 5).map((a, i) => (
                        <div key={i} style={{
                            fontSize: 13, padding: "6px 10px",
                            background: "var(--color-background-warning)",
                            borderRadius: "var(--border-radius-md)",
                            color: "var(--color-text-warning)",
                        }}>
                            {a.message}
                        </div>
                    ))}
                    {alertes.length > 5 && (
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                            + {alertes.length - 5} autre{alertes.length - 5 > 1 ? "s" : ""} alerte{alertes.length - 5 > 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}