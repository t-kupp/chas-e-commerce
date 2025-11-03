import {Text, View} from "react-native";
import "./global.css";

export default function HomePage() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [productY, setProductY] = useState(0);

  const scrollToProducts = () => {
    scrollViewRef.current?.scrollTo({ y: productY, animated: true });
  };

  return (
    <View className="flex-1">
      <Header />
      <ScrollView ref={scrollViewRef} className="flex-1">
        <Hero onShopNowPress={scrollToProducts} />
        <Filter />
        <View onLayout={(event) => setProductY(event.nativeEvent.layout.y)}>
          <ProductCard />
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
