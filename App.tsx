import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  NativeBaseProvider,
  Text,
  Button,
  Icon,
} from 'native-base';
import { DraggableGrid } from 'react-native-draggable-grid';
import {
  Animated,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

interface MyTestProps {}

interface MyTestState {
  data: { key: string; name: string; image: any }[];
  deleteMode: boolean;
}

export default class MyTest extends React.Component<MyTestProps, MyTestState> {
  constructor(props: MyTestProps) {
    super(props);
    this.state = {
      data: [],
      deleteMode: false,
    };
    this.render_item = this.render_item.bind(this);
  }

  // get image from assets/images to state
  componentDidMount() {
    // loop file in assets/images
    const requireImages = require.context('./assets/images', true, /\.png$/);
    let key = 0;
    let data = requireImages.keys().map((image: any) => {
      key++;
      return {
        name: key.toString(),
        key: key.toString(),
        image: requireImages(image),
      };
    });
    this.setState({ data: data });
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      console.log('result.uri', result.assets[0].uri);
      // upload image with mediaLibrary
      const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri);
      console.log('asset', asset);
    } else {
      console.log('image not picked');
    }
  };

  editImage = async () => {
    console.log(this.state.deleteMode);
  };

  deleteImage = async (key: string) => {
    console.log(key);
    let newData = this.state.data.filter((item) => item.key !== key);
    this.setState({ data: newData });
  };

  changeImage = async (key: string) => {
    console.log(key);
  };

  public render_item(item: {
    image: ImageSourcePropType | undefined;
    name: string;
    key: string;
  }) {
    return (
      <Box key={item.key}>
        {this.state.deleteMode ? (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1,
            }}
            onPress={() => {
              this.deleteImage(item.key);
            }}
            key={item.key}
          >
            <Image
              source={require('./assets/close.png')}
              style={{
                width: 20,
                height: 20,
              }}
              alt="close"
            />
          </TouchableOpacity>
        ) : null}
        <Image source={item.image} alt="image base" style={styles.image} />
      </Box>
    );
  }

  render() {
    return (
      <NativeBaseProvider>
        {!this.state.deleteMode ? (
          <TouchableOpacity
            onPress={() => (
              this.setState({ deleteMode: !this.state.deleteMode }),
              this.editImage()
            )}
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginRight: 20,
              marginTop: 20,
            }}
            disabled={this.state.deleteMode}
          >
            <Text fontSize="md" color="blue.500" fontWeight="bold">
              Edit
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              this.setState({ deleteMode: !this.state.deleteMode })
            }
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginRight: 20,
              marginTop: 20,
            }}
          >
            <Text fontSize="md" color="blue.500" fontWeight="bold">
              Done
            </Text>
          </TouchableOpacity>
        )}
        <Box style={styles.wrapper}>
          <DraggableGrid
            numColumns={4}
            itemHeight={150}
            renderItem={this.render_item}
            data={this.state.data}
            onDragRelease={(data) => {
              this.setState({ data }); // need reset the props data sort after drag release
              data.forEach((item) => {
                console.log(item);
              });
              console.log('--------------------------------');
            }}
            onItemPress={(item) => {
              this.changeImage(item.key);
            }}
          />
        </Box>
        <Button
          onPress={this.pickImage}
          position={'absolute'}
          bottom={0}
          width={'100%'}
          height={50}
          backgroundColor={'green.500'}
          _text={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Upload Image
        </Button>
      </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 100,
    backgroundColor: 'blue',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  item: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  item_text: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  image: {
    width: 100,
    height: 100,
  },
});
