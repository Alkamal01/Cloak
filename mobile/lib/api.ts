import type { CloakIdentity, DisclosurePackage } from '@/lib/prooftrade/fixtures';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...init });
  if (!response.ok) throw new Error(`Cloak API ${response.status}`);
  return response.status === 204 ? (undefined as T) : response.json();
}

export function registerIdentity(identity: CloakIdentity) {
  return request<CloakIdentity>('/v1/identities', { method: 'POST', body: JSON.stringify(identity) });
}

export function fetchIdentity(id: string) {
  return request<CloakIdentity>(`/v1/identities/${encodeURIComponent(id)}`);
}

export function fetchDisclosures(recipient: string) {
  return request<DisclosurePackage[]>(`/v1/disclosures/${encodeURIComponent(recipient)}`);
}

export function publishDisclosure(disclosure: DisclosurePackage) {
  return request<void>('/v1/disclosures', { method: 'POST', body: JSON.stringify(disclosure) });
}
