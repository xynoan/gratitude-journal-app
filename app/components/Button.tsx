import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator 
} from 'react-native';
import themeUtils from '../utils/theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const theme = themeUtils.useTheme();
  
  // Calculate button styles based on variant
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};
    
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: theme.colors.primary,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: theme.colors.secondary,
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
        break;
    }
    
    return buttonStyle;
  };
  
  // Calculate text color based on variant
  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
        return theme.colors.primary;
      default:
        return theme.colors.text;
    }
  };
  
  // Calculate padding based on size
  const getPadding = (): number => {
    switch (size) {
      case 'small':
        return theme.spacing.s;
      case 'medium':
        return theme.spacing.m;
      case 'large':
        return theme.spacing.l;
      default:
        return theme.spacing.m;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        { padding: getPadding(), opacity: disabled ? 0.6 : 1 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              { 
                color: getTextColor(),
                fontSize: theme.fonts.body,
                marginLeft: icon ? theme.spacing.s : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

export default Button; 