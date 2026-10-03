import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Proofs() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          <View className="px-6 pt-4">
            <Text style={{ color: theme.text }} className="text-2xl font-black">
              Proofs
            </Text>
            <Text style={{ color: theme.textSecondary }} className="text-sm mt-1">
              Disclosure packages are verified on this device without asking a Cloak server.
            </Text>
          </View>

          <View className="px-6 mt-6">
            <View style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="rounded-3xl border p-5 items-center">
              <ShieldCheck size={28} color={theme.textMuted} />
              <Text style={{ color: theme.text }} className="text-lg font-black mt-4">
                No proofs yet
              </Text>
              <Text style={{ color: theme.textSecondary }} className="text-base leading-6 text-center mt-2">
                Verified disclosures will appear here after you scan an identity and receive signed trade evidence.
              </Text>
            </View>
          </View>

          <View className="px-6 mt-6">
            <View style={{ backgroundColor: theme.inputBg }} className="rounded-2xl p-4">
              <Text style={{ color: theme.textSecondary }} className="text-sm leading-5">
                Bitcoin or Lightning settlement evidence can support a receipt, but it does not prove delivery or honest behavior by itself.
              </Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
