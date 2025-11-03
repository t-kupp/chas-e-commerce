// import "./global.css";
// import {useEffect, useState} from "react";
// import {Text, View, Image, ScrollView} from "react-native";

// export default function Index() {
//   const [pokemons, setPokemons] = useState<any[]>([]);

//   async function loadPokemons() {
//     try {
//       const res = await fetch(
//         "http://localhost:1337/api/pokemons?populate=image"
//       );
//       const d = await res.json();
//       setPokemons(d.data || []);
//     } catch (err) {
//       console.error("Failed to load pokemons", err);
//       setPokemons([]);
//     }
//   }

//   useEffect(() => {
//     loadPokemons();
//   }, []);

//   const getImageUrl = (p: any) => {
//     const img =
//       p.image ?? p.attributes?.image?.data?.attributes ?? p.attributes?.image;
//     const url =
//       img?.url ?? img?.data?.attributes?.url ?? img?.formats?.small?.url;
//     if (!url) return null;
//     return url.startsWith("http") ? url : `http://localhost:1337${url}`;
//   };

//   return (
//     <ScrollView contentContainerStyle={{padding: 16}}>
//       {pokemons.map((p: any) => {
//         const name = p.name ?? p.attributes?.name ?? "No name";
//         const imgUrl = getImageUrl(p);
//         return (
//           <View key={p.id} style={{marginBottom: 16}}>
//             <Text>{name}</Text>
//             <Text style={{color: "#666", fontSize: 12}}>
//               {imgUrl ?? "Ingen bild"}
//             </Text>
//             {imgUrl && (
//               <Image
//                 source={{uri: imgUrl}}
//                 style={{width: 120, height: 160, marginTop: 8}}
//               />
//             )}
//           </View>
//         );
//       })}
//     </ScrollView>
//   );
// }
