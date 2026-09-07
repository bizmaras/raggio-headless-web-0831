import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
}

const CATEGORIES = ['All', 'Gourmet Pizza', 'Calzones & Strombolis', 'Appetizers & Wings', 'Salads'];

const FEATURED_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita D.O.P.',
    category: 'Gourmet Pizza',
    price: '$18.99',
    description: 'San Marzano tomatoes, fresh buffalo mozzarella, fragrant fresh basil, and extra virgin olive oil.',
  },
  {
    id: '2',
    name: 'Tartufo & Prosciutto',
    category: 'Gourmet Pizza',
    price: '$22.99',
    description: 'White base with black truffle cream, aged prosciutto di Parma, wild mushrooms, and arugula.',
  },
  {
    id: '3',
    name: 'Classic Meat Calzone',
    category: 'Calzones & Strombolis',
    price: '$16.49',
    description: 'Filled with whole milk ricotta, mozzarella, pepperoni, Italian sausage, and homemade marinara on the side.',
  },
  {
    id: '4',
    name: 'Crispy Garlic Parmesan Wings',
    category: 'Appetizers & Wings',
    price: '$14.99',
    description: 'Jumbo wings tossed in roasted garlic butter, parsley, and freshly grated aged Parmigiano Reggiano.',
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);

  const filteredItems = selectedCategory === 'All'
    ? FEATURED_ITEMS
    : FEATURED_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0E" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.restaurantTitle}>RAGGIO</Text>
          <Text style={styles.restaurantSubtitle}>Gourmet Pizza & Italian Kitchen</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setCartCount(0)}
          activeOpacity={0.8}
        >
          <Text style={styles.cartButtonText}>🛒 {cartCount}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTag}>TRADITIONAL ARTISAN CRAFT</Text>
        <Text style={styles.heroTitle}>Authentic Wood-Fired Taste</Text>
        <Text style={styles.heroDesc}>100% Fresh Mozzarella • 48h Fermented Dough • Newark, DE</Text>
      </View>

      {/* Category Rail */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Menu List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setCartCount((prev) => prev + 1)}
                activeOpacity={0.7}
              >
                <Text style={styles.addButtonText}>+ Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Bottom Sticky Checkout Banner */}
      {cartCount > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarText}>{cartCount} item(s) in your order</Text>
          <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  restaurantTitle: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
  },
  restaurantSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  cartButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  cartButtonText: {
    color: '#D4AF37',
    fontWeight: '700',
    fontSize: 14,
  },
  heroBanner: {
    margin: 20,
    padding: 20,
    backgroundColor: '#16161D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  heroTag: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroDesc: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1A1A22',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  categoryChipActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#0B0B0E',
    fontWeight: '700',
  },
  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#16161D',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  cardPrice: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategory: {
    color: '#6B7280',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#0B0B0E',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#16161D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarText: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: '#0B0B0E',
    fontWeight: '700',
    fontSize: 14,
  },
});
