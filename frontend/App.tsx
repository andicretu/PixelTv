import React, {useState, useEffect} from 'react';
import logoImage from './assets/images/logo.png';
import { bannerRules } from './data/banners';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  //Dimensions,
  Image,
  Linking,
  StatusBar,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import {WebView} from 'react-native-webview';

//const {width: screenWidth} = Dimensions.get('window');

const fetchVideos = async (): Promise<Video[]> => {
  const res = await fetch('http://10.0.2.2:3000/api/videos/latest');
  const data = await res.json();

  return data.map((video: any, index: number) => {
    const matchedRule = bannerRules.find(rule => rule.condition(video, index));

    return {
      videoId: video.vimeoId,
      title: video.title,
      category: video.category,
      description: '',     // placeholder
      views: video.views.toString(),
      uploadDate: video.uploadDate,
      banner: matchedRule?.banner || null,
    };
  });
};


// Type definitions
interface Banner {
  image: { uri: string };
  link: string;
}

interface Video {
  videoId: string;
  title: string;
  category: string;
  description: string;
  views: string;
  uploadDate: string;
  banner?: Banner | null;
}

type Category =
  | 'Gaming'
  | 'Film og Serier'
  | 'Tech og Gadgets'
  | 'Programmer'
  | 'Nordisk Videos';

interface HeaderTabsProps {
  selectedCategory: Category;
  onCategorySelect: (category: Category) => void;
}

interface VideoBlockProps {
  video: Video;
  isLiked: boolean;
  onToggleLike: () => void;
}

interface ScrollableVideoFeedProps {
  videos: Video[];
  onRefresh: () => void;
  refreshing: boolean;
  likedVideos: string[];
  toggleLike: (videoId: string) => void;
}

const categories: Category[] = [
  'Gaming',
  'Film og Serier',
  'Tech og Gadgets',
  'Programmer',
  'Nordisk Videos',
];

// Enhanced Header with better styling
const HeaderTabs: React.FC<HeaderTabsProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const renderTabItem: ListRenderItem<Category> = ({item}) => (
    <TouchableOpacity
      style={[styles.tab, selectedCategory === item && styles.activeTab]}
      onPress={() => onCategorySelect(item)}
      activeOpacity={0.8}>
      <Text
        style={[
          styles.tabText,
          selectedCategory === item && styles.activeTabText,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logoImage} resizeMode="contain"/>
      </View>

      {/* Category Tabs */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item: Category) => item}
        contentContainerStyle={styles.tabsContainer}
        renderItem={renderTabItem}
      />
    </View>
  );
};

// Enhanced Video Block with better metadata display
const VideoBlock: React.FC<VideoBlockProps> = ({video, isLiked, onToggleLike}) => {
  const vimeoUrl: string = `https://player.vimeo.com/video/${video.videoId}?autoplay=0&muted=1&controls=1&playsinline=1&title=0&byline=0&portrait=0`;

  const handleBannerPress = async (): Promise<void> => {
    if (video.banner?.link) {
      try {
        await Linking.openURL(video.banner.link);
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
    }
  };

  const renderLoadingComponent = (): JSX.Element => (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingSpinner} />
      <Text style={styles.loadingText}>Loading video...</Text>
    </View>
  );

  return (
    <View style={styles.videoBlock}>
      {/* Vimeo Player */}
      <View style={styles.playerContainer}>
        <WebView
          source={{uri: vimeoUrl}}
          style={styles.webView}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={renderLoadingComponent}
        />
      </View>

      {/* Video Information */}
      <View style={styles.contentContainer}>
        {/* Title and Category */}
        <View style={styles.titleContainer}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{video.category}</Text>
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.metadataContainer}>
          <Text style={styles.metadataText}>{video.views} visninger</Text>
          <Text style={styles.metadataDot}>•</Text>
          <Text style={styles.metadataText}>
            {new Date(video.uploadDate).toLocaleDateString()}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.videoDescription} numberOfLines={3}>
          {video.description}
        </Text>

        {/* Like Button */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={onToggleLike}
          activeOpacity={0.7}
        >
          <Text style={[styles.likeButtonText, isLiked && styles.liked]}>
            {isLiked ? '♥ Liked' : '♡ Like'}
          </Text>
        </TouchableOpacity>

        {/* Optional Banner */}
        {video.banner && (
          <TouchableOpacity
            style={styles.bannerContainer}
            onPress={handleBannerPress}
            activeOpacity={0.9}>
            <Image
              source={video.banner.image}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerText}>Sponsored Content</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Enhanced Video Feed with pull-to-refresh
const ScrollableVideoFeed: React.FC<ScrollableVideoFeedProps> = ({
  videos,
  onRefresh,
  refreshing,
  likedVideos,
  toggleLike,
}) => {
  const renderEmptyState = (): JSX.Element => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Ingen videoer fundet</Text>
      <Text style={styles.emptyDescription}>
        Prøv at vælge en anden kategori eller kom tilbage senere
      </Text>
    </View>
  );

  const renderVideoItem: ListRenderItem<Video> = ({item}) => (
    <VideoBlock
    video={item}
    isLiked={likedVideos.includes(item.videoId)}
    onToggleLike={() => toggleLike(item.videoId)}
    />
  );

  return (
    <FlatList<Video>
      data={videos}
      keyExtractor={(item: Video) => item.videoId}
      renderItem={renderVideoItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.feedContainer,
        videos.length === 0 && styles.emptyFeedContainer,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4CAF50"
          colors={['#4CAF50']}
        />
      }
      ListEmptyComponent={renderEmptyState}
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
  );
};

// Main App Component with enhanced state management
const App: React.FC = () => {

  const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
      fetchVideos()
        .then(setVideos)
        .catch((error) => console.error('Failed to fetch videos:', error));
    }, []);


  const [likedVideos, setLikedVideos] = useState<string[]>([]);

  const toggleLike = (videoId: string): void => {
      setLikedVideos(prev =>
          prev.includes(videoId)
              ? prev.filter(id => id !== videoId)
              : [...prev, videoId]
      );
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>('Gaming');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const filteredVideos: Video[] = videos.filter(
    (video: Video) => video.category === selectedCategory,
  );

  const handleRefresh = (): void => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleCategorySelect = (category: Category): void => {
    setSelectedCategory(category);
  };

   return (
      <SafeAreaView style={styles.container}>
       <HeaderTabs
         selectedCategory={selectedCategory}
         onCategorySelect={handleCategorySelect}
       />

       <View style={styles.feedWithBanner}>
         <ScrollableVideoFeed
           videos={filteredVideos}
           onRefresh={handleRefresh}
           refreshing={refreshing}
           likedVideos={likedVideos}
           toggleLike={toggleLike}
         />

       </View>
     </SafeAreaView>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logoImage: {
      width: 180,
      height: 50,
      marginBottom: 10,
  },
  tabsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444444',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  tabText: {
    color: '#cccccc',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  feedContainer: {
    paddingBottom: 120,
  },
  emptyFeedContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
  },
  videoBlock: {
    marginVertical: 15,
    marginHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playerContainer: {
    height: 209,
    backgroundColor: '#000000',
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#333333',
    borderTopColor: '#4CAF50',
    marginBottom: 10,
  },
  loadingText: {
    color: '#888888',
    fontSize: 14,
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  videoTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 24,
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metadataText: {
    color: '#888888',
    fontSize: 13,
  },
  metadataDot: {
    color: '#888888',
    fontSize: 13,
    marginHorizontal: 8,
  },
  videoDescription: {
    fontSize: 15,
    color: '#cccccc',
    lineHeight: 22,
    marginBottom: 15,
  },
  bannerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    width: '90%',
    height: 100,

    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '110%',
    height: 100,
    backgroundColor: '#583978',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '600',
  },
  likeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // ← this ensures the default text and symbol are white
  },
  liked: {
    color: '#ff4444',
  },

});

export default App;

