import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme';
import { Wine } from '../types';
import { getWineImageUri } from '../utils/wineImage';

const WINE_TYPE_LABEL: Record<string, string> = {
  RED: '🍷 Красное', WHITE: '🥂 Белое', ROSE: '🌸 Розовое',
  SPARKLING: '🍾 Игристое', DESSERT: '🍯 Десертное', FORTIFIED: '🥃 Крепленое',
};

interface Props {
  wine: Wine;
  onPress: () => void;
  compact?: boolean;
  horizontal?: boolean; // New prop for horizontal card style
}

const { width } = Dimensions.get('window');

export const WineCard: React.FC<Props> = ({ wine, onPress, compact, horizontal }) => {
  const stars = '★'.repeat(Math.round(wine.avgRating)) + '☆'.repeat(5 - Math.round(wine.avgRating));

  // A mock price just like in the Tailwind example if none exists
  const lowestPrice = wine.prices && wine.prices.length > 0 
    ? Math.min(...wine.prices.map(p => p.price))
    : 1200;

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.horizontalImageContainer}>
          <Image
            source={{ uri: getWineImageUri(wine.type, wine.name, wine.imageUrl, 'card') }}
            style={styles.horizontalImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.horizontalInfo}>
          {wine.winery && <Text style={styles.wineryH} numberOfLines={1}>{wine.winery.name}</Text>}
          <Text style={styles.nameH} numberOfLines={2}>{wine.name}</Text>
          
          <View style={styles.ratingRowH}>
             <Text style={styles.starsH}>★ {wine.avgRating.toFixed(1)}</Text>
             <Text style={styles.reviewCountH}>({wine.reviewCount})</Text>
          </View>
          
          <Text style={styles.priceH}>{lowestPrice.toLocaleString('ru-RU')} ₽</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, compact && styles.compact]} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: getWineImageUri(wine.type, wine.name, wine.imageUrl, 'card') }}
        style={compact ? styles.imageCompact : styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{wine.name}</Text>
        {wine.winery && <Text style={styles.winery} numberOfLines={1}>{wine.winery.name}</Text>}
        <Text style={styles.meta}>
          {WINE_TYPE_LABEL[wine.type]}{wine.vintage ? ` · ${wine.vintage}` : ''}
          {wine.region ? ` · ${wine.region.country}` : ''}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>{stars}</Text>
          <Text style={styles.ratingText}>{wine.avgRating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({wine.reviewCount} отзывов)</Text>
        </View>
        <Text style={styles.price}>
          от {lowestPrice.toLocaleString('ru-RU')} ₽
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md, marginVertical: theme.spacing.sm,
    padding: theme.spacing.md,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  compact: { marginHorizontal: 0 },
  image: { width: 80, height: 110, borderRadius: theme.borderRadius.sm, backgroundColor: theme.colors.surfaceAlt },
  imageCompact: { width: 60, height: 80, borderRadius: theme.borderRadius.sm, backgroundColor: theme.colors.surfaceAlt },
  info: { flex: 1, marginLeft: theme.spacing.md, justifyContent: 'center' },
  name: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 2 },
  winery: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginBottom: 4 },
  meta: { fontSize: theme.fontSize.xs, color: theme.colors.textLight, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stars: { color: theme.colors.starFilled, fontSize: theme.fontSize.sm },
  ratingText: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.primary },
  reviewCount: { fontSize: theme.fontSize.xs, color: theme.colors.textLight },
  price: { marginTop: 6, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.primary },
  
  // Horizontal styling for the new Tailwind-like UI
  horizontalCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  horizontalImageContainer: {
    backgroundColor: '#f8f4f2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  horizontalImage: {
    width: 60,
    height: 180,
  },
  horizontalInfo: {
    padding: 12,
  },
  wineryH: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  nameH: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 18,
    height: 38, // Fix height for 2 lines
    marginBottom: 6,
  },
  ratingRowH: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  starsH: {
     color: '#E8A838',
     fontSize: 13,
     fontWeight: '700',
  },
  reviewCountH: {
    fontSize: 12,
    color: '#aaa',
  },
  priceH: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  }
});
