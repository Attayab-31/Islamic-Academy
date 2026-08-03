export function HeroSceneFallback() {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,75,0.25),transparent_55%)]" />
            <svg className="absolute right-0 top-0 h-full w-1/2 text-gold/20" viewBox="0 0 400 400" aria-hidden>
                <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M80 200 A120 60 0 0 1 320 200" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
        </div>
    );
}
