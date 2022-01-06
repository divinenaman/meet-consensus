import AsyncStorage from "@react-native-async-storage/async-storage";

const storeDataInArray = async (key, data) => {
  try {
    let res = await AsyncStorage.getItem(key);
    if (res !== null) {
      res = JSON.parse(res);
      res.data.append(data);
      res = JSON.stringify(res);
      await AsyncStorage.setItem(key, res);
    } else {
      res = JSON.stringify({
        data: [data],
      });
      await AsyncStorage.setItem(key, res);
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const readData = async (key) => {
  try {
    let res = await AsyncStorage.getItem(key);
    
    if (res !== null) {
      res = JSON.parse(res);
      return res.data;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default {
    readData,
    storeDataInArray
}