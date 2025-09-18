import { View } from '@tarojs/components';
import {
  GitHubIcon, DiscordIcon, SlackIcon, GoogleIcon, FacebookIcon, TwitterIcon,
  BasketballIcon, DinnerIcon, StudyIcon, GameIcon, TravelIcon, MusicIcon
} from './index';

/**
 * 通用图标组件，根据名称显示对应图标
 * @param {string} name - 图标名称
 * @param {string} color - 图标颜色
 * @param {number} size - 图标大小
 * @param {string} className - 自定义类名
 */
const Icon = ({ name, color = 'currentColor', size = 24, className = '' }) => {
  // 图标映射表
  const iconMap = {
    // 社交媒体图标
    github: GitHubIcon,
    discord: DiscordIcon,
    slack: SlackIcon,
    google: GoogleIcon,
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    
    // 活动类型图标
    basketball: BasketballIcon,
    dinner: DinnerIcon,
    study: StudyIcon,
    game: GameIcon,
    travel: TravelIcon,
    music: MusicIcon
  };

  // 获取对应的图标组件
  const IconComponent = iconMap[name.toLowerCase()];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  // 设置图标样式
  const iconStyle = {
    color,
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-block'
  };

  return (
    <View className={`icon ${className}`} style={iconStyle}>
      <IconComponent />
    </View>
  );
};

export default Icon;