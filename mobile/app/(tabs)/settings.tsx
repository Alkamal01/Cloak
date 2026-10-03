import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound, Moon, Shield, Sun } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/contexts/ThemeContext';
import Logo from '@/components/Logo';
import { identityQrPayload } from '@/lib/prooftrade/fixtures';
import { useWallet } from '@/contexts/WalletContext';

function Row({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ borderTopColor: theme.border }} className="py-4 border-t first:border-t-0">
      <Text style={{ color: theme.textMuted }} className="text-base">
        {label}
      </Text>
      <Text style={{ color: theme.text }} className="text-base font-semibold mt-1" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default function Profile() {
  const { theme, mode, setMode, isDark } = useTheme();
  const { wallet } = useWallet();
  if (!wallet) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          <View className="px-6 pt-4">
            <Text style={{ color: theme.text }} className="text-2xl font-black">
              Profile
            </Text>
          </View>

          <View className="px-6 mt-6 items-center">
            <Logo size={48} />
            <Text style={{ color: theme.text }} className="text-xl font-black mt-4">
              {wallet.displayName}
            </Text>
            <Text style={{ color: theme.textMuted }} className="text-base mt-1">
              Cloak v0.1 MVP
            </Text>
          </View>

          <View className="px-6 mt-8">
            <View style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="rounded-3xl border p-5 items-center">
              <View style={{ backgroundColor: theme.inputBg }} className="w-44 h-44 rounded-2xl items-center justify-center">
                <QRCode value={identityQrPayload(wallet)} size={144} color={theme.text} backgroundColor={theme.inputBg} />
              </View>
              <Text style={{ color: theme.text }} className="font-black mt-4">
                Check my trade evidence
              </Text>
              <Text style={{ color: theme.textMuted }} className="text-base font-mono mt-2 text-center" numberOfLines={1}>
                Scan to import this identity
              </Text>
            </View>
          </View>

          <View className="px-6 mt-8">
            <Text style={{ color: theme.textSecondary }} className="text-base font-semibold uppercase mb-2">
              Identity
            </Text>
            <View style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="rounded-2xl border px-4">
              <Row label="Nostr public identity" value={wallet.npub} />
              <Row label="Private key storage" value="Platform secure storage required" />
              <Row label="Receipts" value="Stored locally, private by default" />
            </View>
          </View>

          <View className="px-6 mt-8">
            <Text style={{ color: theme.textSecondary }} className="text-base font-semibold uppercase mb-2">
              Security model
            </Text>
            <View style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="rounded-2xl border px-4">
              <View className="flex-row items-center gap-3 py-4">
                <Shield size={16} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary }} className="text-base flex-1">
                  No universal trust score
                </Text>
              </View>
              <View style={{ borderTopColor: theme.border }} className="flex-row items-center gap-3 py-4 border-t">
                <KeyRound size={16} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary }} className="text-base flex-1">
                  Verification happens locally
                </Text>
              </View>
            </View>
          </View>

          <View className="px-6 mt-8">
            <Text style={{ color: theme.textSecondary }} className="text-base font-semibold uppercase mb-2">
              Appearance
            </Text>
            <View style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="rounded-2xl border px-4 flex-row items-center py-4">
              {isDark ? <Moon size={16} color={theme.textMuted} /> : <Sun size={16} color={theme.textMuted} />}
              <Text style={{ color: theme.textSecondary }} className="text-base flex-1 ml-3">
                Dark mode
              </Text>
              <Switch
                value={mode === 'dark'}
                onValueChange={(v) => setMode(v ? 'dark' : 'light')}
                trackColor={{ false: theme.border, true: theme.successSoft }}
                thumbColor={mode === 'dark' ? theme.success : theme.textMuted}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
