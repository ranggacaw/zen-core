import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-background px-6 py-10 text-foreground">
                <div className="mx-auto flex max-w-6xl flex-col gap-10">
                    <header className="flex items-center justify-end gap-3">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                                Open dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="rounded-md border border-border px-4 py-2 text-sm font-medium">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                                    Register
                                </Link>
                            </>
                        )}
                    </header>

                    <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-xs">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Zen Core</p>
                            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                                One internal platform for admissions, classrooms, attendance, communication, and reporting.
                            </h1>
                            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                                Built as a Laravel 12 modular monolith for Indonesian school operations with role-aware navigation, shared infrastructure services,
                                and phased delivery across the MVP domains.
                            </p>
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {[
                                    'Student lifecycle and admissions review',
                                    'Teacher and staff access governance',
                                    'Attendance, announcements, billing, and printable outputs',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-xs">
                            <h2 className="text-lg font-semibold">Foundation highlights</h2>
                            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                                <li>Laravel 12 + Inertia React + Tailwind CSS internal UI shell</li>
                                <li>PostgreSQL, Redis, Meilisearch, S3-compatible storage, Reverb, PostHog, and Midtrans integration points</li>
                                <li>Docker service definitions for app, queue workers, realtime, storage, and search</li>
                                <li>Operational dashboards, exports, and print-ready class reports</li>
                            </ul>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
