import { View, Text } from '@tarojs/components';
import { 
  GitHubIcon, DiscordIcon, SlackIcon, GoogleIcon, FacebookIcon, TwitterIcon,
  BasketballIcon, DinnerIcon, StudyIcon, GameIcon, TravelIcon, MusicIcon 
} from './icons';
import './IconDemo.less';

const IconDemo = () => {
  return (
    <View className="icon-demo">
      <Text className="icon-demo-title">社交媒体图标</Text>
      <View className="icon-row">
        <View className="icon-item">
          <GitHubIcon />
          <Text className="icon-name">GitHub</Text>
        </View>
        <View className="icon-item">
          <DiscordIcon />
          <Text className="icon-name">Discord</Text>
        </View>
        <View className="icon-item">
          <SlackIcon />
          <Text className="icon-name">Slack</Text>
        </View>
      </View>
      <View className="icon-row">
        <View className="icon-item">
          <GoogleIcon />
          <Text className="icon-name">Google</Text>
        </View>
        <View className="icon-item">
          <FacebookIcon />
          <Text className="icon-name">Facebook</Text>
        </View>
        <View className="icon-item">
          <TwitterIcon />
          <Text className="icon-name">Twitter</Text>
        </View>
      </View>
      
      <Text className="icon-demo-title">活动类型图标</Text>
      <View className="icon-row">
        <View className="icon-item">
          <BasketballIcon />
          <Text className="icon-name">篮球</Text>
        </View>
        <View className="icon-item">
          <DinnerIcon />
          <Text className="icon-name">聚餐</Text>
        </View>
        <View className="icon-item">
          <StudyIcon />
          <Text className="icon-name">学习</Text>
        </View>
      </View>
      <View className="icon-row">
        <View className="icon-item">
          <GameIcon />
          <Text className="icon-name">游戏</Text>
        </View>
        <View className="icon-item">
          <TravelIcon />
          <Text className="icon-name">旅行</Text>
        </View>
        <View className="icon-item">
          <MusicIcon />
          <Text className="icon-name">音乐</Text>
        </View>
      </View>
    </View>
  );
};

export default IconDemo;