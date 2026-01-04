export function normalizeDomain(domain: string) {
    return domain.replace(/^(https?:\/\/)/, "").replace(/\/$/, "");
}

export function getLandingUrl(subdomain: string) {
    const isDev = process.env.NODE_ENV === "development";
    const rawRootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shipkit.app";
    const baseDomain = normalizeDomain(rawRootDomain);

    if (isDev) {
        return `http://${subdomain}.localhost:3000`;
    }

    return `https://${subdomain}.${baseDomain}`;
}
