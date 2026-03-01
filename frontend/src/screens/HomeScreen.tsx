import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TextInput, TouchableOpacity, SafeAreaView, ScrollView, ImageBackground, Image
} from 'react-native';
import { theme } from '../theme';
import { WineCard } from '../components/WineCard';
import { winesApi } from '../api/wines';
import { Wine } from '../types';
import { articles } from '../data/articles';

const WINE_TYPES = [
  { label: 'Все', value: '' },
  { label: '🍷 Красное', value: 'RED' },
  { label: '🥂 Белое', value: 'WHITE' },
  { label: '🌸 Розовое', value: 'ROSE' },
  { label: '🍾 Игристое', value: 'SPARKLING' },
  { label: '🍯 Десертное', value: 'DESSERT' },
  { label: '🥃 Крепленое', value: 'FORTIFIED' },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [trending, setTrending] = useState<Wine[]>([]);
  const [searchResults, setSearchResults] = useState<Wine[]>([]);
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Load trending on mount
  useEffect(() => {
    winesApi.trending()
      .then(r => setTrending(r.wines))
      .finally(() => setLoading(false));
  }, []);

  // Debounce query input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  // Run search whenever debouncedQuery or selectedType changes
  useEffect(() => {
    if (!debouncedQuery && !selectedType) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    winesApi.search({ q: debouncedQuery || undefined, type: (selectedType as any) || undefined })
      .then(r => setSearchResults(r.wines))
      .finally(() => setSearching(false));
  }, [debouncedQuery, selectedType]);

  const handleQueryChange = (text: string) => setQuery(text);

  const isFiltering = !!(query || selectedType);
  const displayWines = isFiltering ? searchResults : trending;

  const renderHeader = () => (
    <>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск вин..."
          placeholderTextColor={theme.colors.textLight}
          value={query}
          onChangeText={handleQueryChange}
          onSubmitEditing={() => setDebouncedQuery(query)}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => setDebouncedQuery(query)}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {WINE_TYPES.map(t => (
            <TouchableOpacity
              key={t.value}
              style={[styles.filterChip, selectedType === t.value && styles.filterChipActive]}
              onPress={() => setSelectedType(t.value)}
            >
              <Text style={[styles.filterChipText, selectedType === t.value && styles.filterChipTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {!isFiltering && (
        <View style={styles.horizontalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Популярное 🔥</Text>
            <TouchableOpacity onPress={() => {}}>
               <Text style={styles.sectionLink}>›</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollList}>
            {trending.map(wine => (
              <View style={{ marginRight: 12 }} key={wine.id}>
                 <WineCard 
                   wine={wine} 
                   horizontal={true}
                   onPress={() => navigation.navigate('WineDetail', { wineId: wine.id })} 
                 />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {!isFiltering && (
        <View style={styles.articlesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Про вино</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
              <Text style={styles.sectionLink}>›</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.articlesScroll}>
            {articles.map(article => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ArticleDetail', { article })}
              >
                <ImageBackground 
                  source={{ uri: article.imageUrl }} 
                  style={styles.articleImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <View style={styles.articleOverlay}>
                    <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                    <Text style={styles.articleSubtitle} numberOfLines={1}>{article.author} • {article.date}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      {isFiltering && (
        <Text style={[styles.sectionTitle, { marginLeft: theme.spacing.md, marginVertical: theme.spacing.md }]}>
          Результаты ({searchResults.length})
        </Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading || searching ? (
        <View>
          {renderHeader()}
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
        </View>
      ) : (
        <FlatList
          data={isFiltering ? searchResults : []}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            // In search results, display as traditional vertical list
            <WineCard wine={item} onPress={() => navigation.navigate('WineDetail', { wineId: item.id })} />
          )}
          ListEmptyComponent={isFiltering ? <Text style={styles.empty}>Вина не найдены</Text> : null}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  searchRow: { flexDirection: 'row', margin: theme.spacing.md, gap: theme.spacing.sm },
  searchInput: {
    flex: 1, backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md, color: theme.colors.text,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  searchBtn: {
    backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.full,
    width: 44, height: 44, justifyContent: 'center', alignItems: 'center',
  },
  searchBtnText: { fontSize: 20 },
  filtersRow: { height: 56, marginBottom: 4 },
  filtersContent: { paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm, alignItems: 'center', paddingVertical: 8 },
  filterChip: {
    paddingHorizontal: theme.spacing.md, paddingVertical: 6,
    borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.white,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  filterChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterChipText: { fontSize: theme.fontSize.sm, color: theme.colors.text },
  filterChipTextActive: { color: theme.colors.white, fontWeight: theme.fontWeight.semibold },
  horizontalSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  horizontalScrollList: {
    paddingHorizontal: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#000', 
  },
  sectionLink: {
    fontSize: 24,
    color: '#000',
    fontWeight: '500',
  },
  articlesSection: {
    marginBottom: 24,
  },
  articlesScroll: {
    paddingHorizontal: theme.spacing.md,
    gap: 12,
  },
  articleCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  articleOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 12,
  },
  articleTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  articleSubtitle: {
    color: '#ddd',
    fontSize: 12,
  },
  empty: { textAlign: 'center', color: theme.colors.textLight, marginTop: 40, fontSize: theme.fontSize.md },
});
