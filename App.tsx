import React, {useState} from 'react';
import logoImage from './assets/images/logo.png';
import plutoTv from './assets/images/PlutoTv.png';
import lenovo from './assets/images/lenovo.png';
import comicon from './assets/images/comicon.png';

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

// Type definitions
interface Banner {
  image: number;
  link: string;
}

interface Video {
  videoId: string;
  title: string;
  category: string;
  description: string;
  views: string;
  date: string;
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

// Mock data with proper typing
const mockVideos: Video[] = [
  {
    videoId: '1092159735',
    title:
      'Nintendo Switch 2 Unboxing (+ controller og kamera)',
    category: 'Gaming',
    description:
      'Vi unboxer den nye Nintendo Switch 2 konsol med mere.',
    views: '12.5K',
    date: '10. jun, 2025',
    banner: {
      image:
        plutoTv,
      link: 'https://pluto.tv/dk/',
    },
  },
  {
    videoId: '1092078611',
    title:
      'Switch 2 midnatsåbent',
    category: 'Gaming',
    description:
      'Natten til grundlovsdag d. 5 juni 2025, stod over 200 mennesker i kø ved Nintendopusheren i København til den nye Nintendo konsol: Nintendo Switch 2. Vi besøgte butikken og fik en snak med ejeren og nogle af kunderne der har glædet sig længe til konsollen.',
    views: '8.2K',
    date: '10. jun, 2025',
    banner: {
      image:
        lenovo,
      link: 'https://www.comiccondenmark.com/da/',
    },
  },
  {
    videoId: '1091340260',
    title: 'Mads Mikkelsen i HITMAN',
    category: 'Gaming',
    description:
      'Annonceringstraileren til 007 First Light, co-op i Hitman og Mads Mikkelsen, der vender tilbage som Le Chiffre – og bliver nu et mål i Hitman.',
    views: '15.7K',
    date: '07. iun, 2025',
    banner: {
      image:
        plutoTv,
      link: 'https://pluto.tv/dk/',
    },
  },
    {
      videoId: '1090457583',
      title: 'Film- og Serienyhederne | The Last of Us er CRINGE!',
      category: 'Film og Serier',
      description:
        'Velkommen til ugens Film- og Serienyhederne',
      views: '7.9K',
      date: '04. jun, 2025',
      banner: {
        image:
          lenovo,
        link: 'https://www.comiccondenmark.com/da/',
      },
    },
  {
    videoId: '1085598542',
    title: 'EU der spiller',
    category: 'Film og Serier',
    description:
      'Velkommen til en ny episode af “EU der spiller” – hvor storpolitik, tvivlsomme alliancer og europæisk afmagt smelter sammen i en virkelighed, der til tider minder mere om en tv-serie end diplomati.',
    views: '6.8K',
    date: '19. maj, 2025',
    banner: {
      image:
        plutoTv,
      link: 'https://pluto.tv/dk/',
    },
  },
  {
    videoId: '1080095974',
    title: 'Anmeldelse | OnePlus Watch 3',
    category: 'Tech og Gadgets',
    description:
      'Jeg har haft fornøjelsen af at have OnePlus Watch 3 på håndledet de sidste par måneder, og er meget imponeret over det kraftfulde ur og ikke mindst det stilfulde udseende! Først og fremmest imponerer det med sin elegante byggekvalitet, kraftfulde hardware og ikke mindst en batteritid, der overgår langt de fleste Wear OS-ure. Skærmen er en lysstærk 1,5″ AMOLED med safirglas og op til 2.200 nits – flot og funktionel selv i direkte sol.',
    views: '9.4K',
    date: '30. apr, 2025',
    banner: {
      image:
        plutoTv,
      link: 'https://pluto.tv/dk/',
    },
  },
  {
    videoId: '1091340260',
    title: 'React Native Development Tutorial - Del 1',
    category: 'Programmer',
    description:
      'Lær at bygge mobile apps med React Native fra bunden. Denne serie er perfekt til begyndere og erfarne udviklere der vil udvide deres skillset.',
    views: '11.2K',
    date: '14. maj, 2025',
    banner: {
      image:
        'plutoTv',
      link: 'https://programming.example.com',
    },
  },
  {
    videoId: '1091340260',
    title: 'Nordic Culture Documentary - Traditioner og moderne liv',
    category: 'Nordisk Videos',
    description:
      'Udforsk den rige kulturelle arv i de nordiske lande gennem fantastiske visuelle oplevelser og personlige historier.',
    views: '7.9K',
    date: '12. maj, 2025',
    banner: null,
  },
];

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
          <Text style={styles.metadataText}>{video.date}</Text>
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

  const filteredVideos: Video[] = mockVideos.filter(
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

         <TouchableOpacity
           style={styles.fixedBannerContainer}
           onPress={() => Linking.openURL('https://www.lenovo.com/dk/da/')}
           activeOpacity={0.9}>
           <Image
             source={lenovo}
             style={styles.fixedBannerImage}
             resizeMode="cover"
           />
           <View style={styles.bannerOverlay}>
             <Text style={styles.bannerText}>Sponsored Content</Text>
           </View>
         </TouchableOpacity>
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
  /*feedWithBanner: {
    flex: 1,
    position: 'relative',
  },
  fixedBannerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '80%',
    height: 70,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  fixedBannerInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedBannerImage: {
    width: '105%',
    height: '100%',
    alignSelf: 'center',
  },*/

});

export default App;

