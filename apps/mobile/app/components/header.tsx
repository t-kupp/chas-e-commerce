// import React, {useState} from "react";
// import {View, Text, TouchableOpacity, Modal} from "react-native";
// import {Menu, X} from "lucide-react-native";

// export default function Header() {
//   const [menuVisible, setMenuVisible] = useState(false);

//   return (
//     <View className="bg-white border-b border-gray-200 ">
//       {/* Huvudheader med titel och menu */}
//       <View className="flex-row items-center justify-between px-4 py-3">
//         <Text className="text-xl font-bold text-gray-900 ">Pokemon Shop</Text>
//         <TouchableOpacity onPress={() => setMenuVisible(true)}>
//           <Menu size={24} color="#111827" />
//         </TouchableOpacity>
//       </View>

//       {/* Sliding Menu Modal */}
//       <Modal
//         visible={menuVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setMenuVisible(false)}
//       >
//         <View className="flex-1 flex-row">
//           {/* Menu Panel */}
//           <View className="w-3/4 bg-white h-full shadow-lg pt-12">
//             <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
//               <Text className="text-lg font-bold">Menu</Text>
//               <TouchableOpacity onPress={() => setMenuVisible(false)}>
//                 <X size={24} color="#111827" />
//               </TouchableOpacity>
//             </View>

//             {/* Menu Items */}
//             <View className="px-4 pt-4">
//               <TouchableOpacity
//                 className="bg-blue-500 px-4 py-3 rounded-lg mb-3"
//                 onPress={() => {
//                   console.log("Home pressed");
//                   setMenuVisible(false);
//                 }}
//               >
//                 <Text className="text-white font-medium">Home</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 className="bg-gray-500 px-4 py-3 rounded-lg"
//                 onPress={() => {
//                   console.log("Cart pressed");
//                   setMenuVisible(false);
//                 }}
//               >
//                 <Text className="text-white font-medium">Cart</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Overlay - klicka på skuggan för att stänga  */}
//           <TouchableOpacity
//             className="flex-1 bg-black/50"
//             onPress={() => setMenuVisible(false)}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// }
