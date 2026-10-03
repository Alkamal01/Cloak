import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Copy, EyeOff, ScanLine, ShieldCheck } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/contexts/ThemeContext';
import ActionButton from '@/components/ActionButton';
import { fetchIdentity } from '@/lib/api';
import { parseIdentityQrPayload, type CloakIdentity } from '@/lib/prooftrade/fixtures';

export default function People() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<CloakIdentity | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setScannerOpen(true);
  };

  const handleScan = async ({ data }: { data: string }) => {
    const identity = parseIdentityQrPayload(data);
    if (!identity) return;
    setSelected(await fetchIdentity(identity.id).catch(() => identity));
    setScannerOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          <View className="px-6 pt-4">
            <Text style={{ color: theme.text }} className="text-2xl font-black">
              People
            </Text>
            <Text style={{ color: theme.textSecondary }} className="text-base mt-1">
              Scan a Cloak identity QR to begin. No contacts are stored until you add them.
            </Text>
          </View>

          <View className="px-6 mt-6">
            <ActionButton title="Scan QR Identity" icon={ScanLine} onPress={openScanner} />
          </View>

          {selected && <View className="px-6 mt-6">
            <View style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="rounded-3xl border p-5">
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text style={{ color: theme.text }} className="text-2xl font-black">
                    {selected.displayName}
                  </Text>
                  <Text style={{ color: theme.textSecondary }} className="text-base mt-1">
                    Identity established {selected.establishedMonths} month{selected.establishedMonths === 1 ? '' : 's'} ago
                  </Text>
                </View>
                <View style={{ backgroundColor: theme.accentSoft }} className="w-11 h-11 rounded-2xl items-center justify-center">
                  <EyeOff size={20} color={theme.accent} />
                </View>
              </View>

              <View style={{ backgroundColor: theme.inputBg }} className="rounded-2xl px-4 py-3 mt-5">
                <Text style={{ color: theme.textMuted }} className="text-base">
                  Public key hidden
                </Text>
                <Text style={{ color: theme.text }} className="text-base font-mono mt-1" numberOfLines={1}>
                  {selected.npub}
                </Text>
              </View>

              {[
                ['Relationship', selected.relationship],
                ['Your network', selected.networkPath ?? 'No previous relationship'],
                    ['Trade evidence', 'Private until disclosed'],
              ].map(([label, value]) => (
                <View key={label} style={{ borderTopColor: theme.border }} className="flex-row py-3 border-t mt-3">
                  <Text style={{ color: theme.textMuted }} className="text-base flex-1">
                    {label}
                  </Text>
                  <Text style={{ color: theme.text }} className="text-base font-bold flex-1 text-right">
                    {value}
                  </Text>
                </View>
              ))}

            </View>
          </View>}
        </ScrollView>
      </SafeAreaView>
      <Modal visible={scannerOpen} animationType="slide" onRequestClose={() => setScannerOpen(false)}>
        <View className="flex-1 bg-black">
          <CameraView className="flex-1" facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={handleScan} />
          <View className="absolute bottom-0 left-0 right-0 p-6 bg-black/70">
            <Text className="text-white text-center mb-4">Point the camera at a Cloak identity QR</Text>
            <ActionButton title="Close Scanner" icon={ScanLine} variant="secondary" onPress={() => setScannerOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
