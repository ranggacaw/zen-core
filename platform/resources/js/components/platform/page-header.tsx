interface PageHeaderProps {
    title: string;
    description: string;
    actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
            </div>
            {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>
    );
}
