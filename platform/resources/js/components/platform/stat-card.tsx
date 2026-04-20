import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
    label: string;
    value: string | number;
    helper?: string;
}

export function StatCard({ label, value, helper }: StatCardProps) {
    return (
        <Card className="border-border/70">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-semibold tracking-tight">{value}</div>
                {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
            </CardContent>
        </Card>
    );
}
