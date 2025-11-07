import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {PlusCircle} from "lucide-react-native";

export type Address = {
  id: string;
  fullName: string;
  tag?: string;
  street: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
};

interface Props {
  selectedAddress: string;
  setSelectedAddress: (id: string) => void;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

export default function RenderAddressStep({
  selectedAddress,
  setSelectedAddress,
  addresses,
  setAddresses,
}: Props) {
  const [showForm, setShowForm] = useState<boolean>(addresses.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [tag, setTag] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");

  // keep form visible when the list becomes empty
  useEffect(() => {
    if (addresses.length === 0) setShowForm(true);
  }, [addresses.length]);

  function openAddForm() {
    setEditingId(null);
    setFullName("");
    setTag("");
    setStreet("");
    setCity("");
    setStateField("");
    setZip("");
    setPhone("");
    setShowForm(true);
  }

  function openEditForm(a: Address) {
    setEditingId(a.id);
    setFullName(a.fullName);
    setTag(a.tag ?? "");
    setStreet(a.street);
    setCity(a.city ?? "");
    setStateField(a.state ?? "");
    setZip(a.zip ?? "");
    setPhone(a.phone ?? "");
    setShowForm(true);
  }

  function saveAddress() {
    // REQUIRED: all fields except tag must be filled
    const missing: string[] = [];
    if (!fullName.trim()) missing.push("Full Name");
    if (!street.trim()) missing.push("Street");
    if (!city.trim()) missing.push("City");
    if (!stateField.trim()) missing.push("State");
    if (!zip.trim()) missing.push("ZIP");
    if (!phone.trim()) missing.push("Phone");

    if (missing.length > 0) {
      Alert.alert(
        "Validation",
        `Please fill the following fields: ${missing.join(", ")}`
      );
      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                fullName: fullName.trim(),
                tag: tag.trim() || undefined,
                street: street.trim(),
                city: city.trim(),
                state: stateField.trim(),
                zip: zip.trim(),
                phone: phone.trim(),
              }
            : p
        )
      );
      setShowForm(false);
      setEditingId(null);
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        fullName: fullName.trim(),
        tag: tag.trim() || undefined,
        street: street.trim(),
        city: city.trim(),
        state: stateField.trim(),
        zip: zip.trim(),
        phone: phone.trim(),
      };
      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddress(newAddress.id);
      setShowForm(false);
    }
  }

  function confirmDelete(id: string) {
    Alert.alert(
      "Delete address",
      "Are you sure you want to delete this address?",
      [
        {text: "Cancel"},
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setAddresses((prev) => {
              const next = prev.filter((p) => p.id !== id);
              if (next.length === 0) {
                setShowForm(true);
                setSelectedAddress("");
              } else if (selectedAddress === id) {
                setSelectedAddress(next[0].id);
              }
              return next;
            });
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{padding: 16}}>
        <Text className="text-xl font-bold mb-4">Addresses</Text>

        {/* List view */}
        {addresses.length > 0 && !showForm && (
          <>
            {addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                onPress={() => setSelectedAddress(address.id)}
                className={`rounded-2xl p-4 mb-4 ${selectedAddress === address.id ? "bg-gray-100" : "bg-white"}`}
              >
                <View className="flex-row items-start">
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 mt-1 ${
                      selectedAddress === address.id
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAddress === address.id && (
                      <View className="w-3 h-3 rounded-full bg-black" />
                    )}
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-base font-semibold mr-2">
                        {address.fullName}
                      </Text>
                      {address.tag ? (
                        <View className="bg-black px-2 py-1 rounded">
                          <Text className="text-white text-xs font-semibold">
                            {address.tag}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text className="text-sm text-gray-600 mb-1">
                      {address.street}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-1">
                      {address.city ?? ""}
                      {address.state ? `, ${address.state}` : ""}{" "}
                      {address.zip ?? ""}
                    </Text>
                    {address.phone ? (
                      <Text className="text-sm text-gray-600">
                        {address.phone}
                      </Text>
                    ) : null}
                  </View>

                  <View className="flex-row ml-2">
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => openEditForm(address)}
                    >
                      <Text className="text-lg">✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => confirmDelete(address.id)}
                    >
                      <Text className="text-lg">✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={openAddForm}
              className="flex-row items-center justify-center py-4 border-t border-dashed border-gray-300 mt-2"
            >
              <View className="w-6 h-6 rounded-full bg-black items-center justify-center mr-2">
                <PlusCircle size={20} color="white" />
              </View>
              <Text className="text-base font-semibold">Add New Address</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Form */}
        {showForm && (
          <View className="bg-white rounded-2xl p-4 mt-2 shadow-sm">
            <Text className="text-lg font-semibold mb-3">
              {editingId ? "Edit Address" : "New Address"}
            </Text>

            {/* Mini title + required star for Full Name */}
            <Text className="text-xs text-gray-500 mb-1">
              Full Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Anna Andersson"
              className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
            />

            {/* Mini title for Tag (optional) */}
            <Text className="text-xs text-gray-500 mb-1">Tag (optional)</Text>
            <TextInput
              value={tag}
              onChangeText={setTag}
              placeholder="optional, e.g. HOME, WORK"
              className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
            />

            {/* Mini title + required star for Street */}
            <Text className="text-xs text-gray-500 mb-1">
              Street <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={street}
              onChangeText={setStreet}
              placeholder="Drottninggatan 123"
              className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
            />

            <View className="flex-row mb-3">
              <View style={{flex: 1}}>
                <Text className="text-xs text-gray-500 mb-1">
                  City <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Stockholm"
                  className="border border-gray-200 rounded-lg px-3 py-2 mr-2"
                />
              </View>

              <View style={{flex: 1, marginLeft: 8}}>
                <Text className="text-xs text-gray-500 mb-1">
                  State <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={stateField}
                  onChangeText={setStateField}
                  placeholder="Järfälla"
                  className="border border-gray-200 rounded-lg px-3 py-2"
                />
              </View>
            </View>

            <View className="flex-row mb-3">
              <View style={{flex: 1}}>
                <Text className="text-xs text-gray-500 mb-1">
                  ZIP <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={zip}
                  onChangeText={setZip}
                  placeholder="175 43"
                  className="border border-gray-200 rounded-lg px-3 py-2"
                />
              </View>

              <View style={{flex: 1, marginLeft: 8}}>
                <Text className="text-xs text-gray-500 mb-1">
                  Phone <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="070-123 11 11"
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => {
                  setShowForm(false);
                  setEditingId(null);
                  if (addresses.length === 0) setShowForm(true);
                }}
                className="px-4 py-2 rounded-lg mr-2 bg-gray-100"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveAddress}
                className="px-4 py-2 rounded-lg bg-black"
              >
                <Text className="text-white">{editingId ? "Save" : "Add"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
