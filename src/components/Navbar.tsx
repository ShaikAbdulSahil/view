import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { AuthContext } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import {
  useNavigation,
  NavigationProp,
  DrawerActions,
} from '@react-navigation/native';
import { navigateToScreen } from '../utils/navigationHelpers';
// Removed react-native-paper Menu due to inconsistent anchor behavior; implementing a lightweight dropdown
import LOGO_PNG_PREVIEW from '../../assets/static_assets/LOGO_PNG_PREVIEW.png';

export default function Navbar() {
  const { user } = useUser();
  const navigation = useNavigation<NavigationProp<any>>();
  const { logout } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const { itemsCount } = useCart();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const openMenu = () => setShowProfileMenu(true);
  const closeMenu = () => setShowProfileMenu(false);

  const handleProfile = () => {
    closeMenu();
    navigateToScreen(navigation, 'EditProfile');
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <View style={styles.navbarWrapper}>
      {/* Status bar is controlled globally for non-auth in AppNavigation */}
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.firstName}</Text>
          <TouchableOpacity onPress={() => navigateToScreen(navigation, 'ClinicMap')}>
            <Text style={styles.location}>Add location ▼</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.icons, styles.menuWrapper]}>
          <Ionicons
            name="heart-outline"
            size={22}
            color="#333"
            style={styles.icon}
            onPress={() => navigateToScreen(navigation, 'FavProductScreen')}
          />
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#333"
            style={styles.icon}
          />
          <TouchableOpacity
            onPress={() => setShowProfileMenu((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="person-circle-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {showProfileMenu && (
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={closeMenu}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
              <Text style={styles.menuItemText}>My Profile</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Filter and Cart Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color="#00BCD4"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { position: 'relative' }]}
          onPress={() => navigateToScreen(navigation, 'CartScreen')}
        >
          <Ionicons name="cart-outline" size={22} color="#FD343E" />
          {itemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText} numberOfLines={1}>
                {itemsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Banner Image */}
      <View style={styles.imageContainer}>
        <Image
          source={LOGO_PNG_PREVIEW}
          style={styles.logoImage}
          resizeMode="cover"
          fadeDuration={0}
          resizeMethod="resize"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    backgroundColor: '#E9F9FA',
    zIndex: 1000,
    elevation: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
  },
  location: {
    fontSize: 11,
    color: '#1e90ff',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuWrapper: {
    zIndex: 1,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    paddingVertical: 6,
    minWidth: 160,
    borderWidth: 1,
    borderColor: '#eee',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuItemText: {
    fontSize: 14,
    color: '#222',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  icon: {
    marginHorizontal: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  iconButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 6,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#FD343E',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  imageContainer: {
    position: 'absolute',
    top: 30,
    width: '100%',
    alignItems: 'center',
    zIndex: -1,
    pointerEvents: 'none',
  },

  logoImage: {
    width: 180,
    height: undefined,
    aspectRatio: 1080 / 289,
    borderRadius: 10,
    opacity: 0.95, // optional
    pointerEvents: 'none',
  },
});
